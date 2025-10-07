from database import db
from models.payroll import JournalEntry, JournalLine, PayrollEntry, PayrollJournalBatch
from datetime import datetime, date
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class AutomatedPayrollJournalService:
    """Service for automated payroll journal posting"""

    def __init__(self):
        self.payroll_collection = db.payroll_entries
        self.journal_collection = db.journal_entries
        self.batch_collection = db.payroll_journal_batches
        self.chart_of_accounts = self._get_chart_of_accounts()

    def _get_chart_of_accounts(self) -> Dict[str, Dict]:
        """Get chart of accounts mapping for payroll"""
        return {
            "salary_expense": {"code": "5100", "name": "Salary Expense"},
            "wage_expense": {"code": "5110", "name": "Wage Expense"},
            "overtime_expense": {"code": "5120", "name": "Overtime Expense"},
            "bonus_expense": {"code": "5130", "name": "Bonus Expense"},
            "payroll_taxes": {"code": "5200", "name": "Payroll Taxes Expense"},
            "social_security": {"code": "5210", "name": "Social Security Tax"},
            "medicare": {"code": "5220", "name": "Medicare Tax"},
            "unemployment_tax": {"code": "5230", "name": "Unemployment Tax"},
            "workers_comp": {"code": "5240", "name": "Workers Compensation"},
            "health_insurance": {"code": "5300", "name": "Health Insurance Expense"},
            "retirement_401k": {"code": "5310", "name": "401k Expense"},
            "accrued_payroll": {"code": "2100", "name": "Accrued Payroll"},
            "cash": {"code": "1000", "name": "Cash"},
            "payroll_payable": {"code": "2000", "name": "Payroll Payable"},
            "taxes_payable": {"code": "2200", "name": "Taxes Payable"},
            "withholding_payable": {"code": "2300", "name": "Withholding Payable"}
        }

    async def generate_payroll_journal_entries(self, payroll_period_id: str, created_by: str) -> PayrollJournalBatch:
        """Generate journal entries for a payroll period"""

        # Get all payroll entries for the period
        payroll_entries = await self.payroll_collection.find(
            {"payrollPeriodId": payroll_period_id}
        ).to_list(None)

        if not payroll_entries:
            raise ValueError(f"No payroll entries found for period {payroll_period_id}")

        # Create batch record
        batch = PayrollJournalBatch(
            batchNumber=f"PAY-{date.today().strftime('%Y%m%d')}-{payroll_period_id[:8]}",
            payrollPeriodId=payroll_period_id,
            description=f"Automated payroll journal for period {payroll_period_id}",
            totalEntries=len(payroll_entries),
            status="Processing",
            createdBy=created_by,
            createdAt=datetime.utcnow()
        )

        batch_dict = batch.dict(exclude_unset=True)
        result = await self.batch_collection.insert_one(batch_dict)
        batch.id = str(result.inserted_id)

        journal_entries = []
        total_amount = 0.0

        try:
            for entry in payroll_entries:
                journal_entry = await self._create_single_journal_entry(entry, created_by)
                if journal_entry:
                    journal_entries.append(journal_entry)
                    total_amount += abs(journal_entry.totalDebit - journal_entry.totalCredit)

            # Update batch with results
            batch.totalAmount = total_amount
            batch.journalEntries = [entry.id for entry in journal_entries if entry.id]
            batch.status = "Posted"

            await self.batch_collection.replace_one(
                {"_id": result.inserted_id},
                batch.dict(exclude_unset=True)
            )

            logger.info(f"Successfully generated {len(journal_entries)} journal entries for payroll period {payroll_period_id}")

        except Exception as e:
            # Mark batch as error
            batch.status = "Error"
            batch.errorLog = [str(e)]
            await self.batch_collection.replace_one(
                {"_id": result.inserted_id},
                batch.dict(exclude_unset=True)
            )
            logger.error(f"Error generating payroll journal entries: {str(e)}")
            raise

        return batch

    async def _create_single_journal_entry(self, payroll_entry: Dict, created_by: str) -> Optional[JournalEntry]:
        """Create a single journal entry from payroll entry"""

        # Calculate totals
        gross_pay = payroll_entry.get("grossPay", 0)
        total_deductions = payroll_entry.get("totalDeductions", 0)
        net_pay = payroll_entry.get("netPay", 0)

        if gross_pay == 0:
            return None

        # Create journal lines
        lines = []

        # Debit: Salary/Wage expense
        expense_account = self._get_expense_account(payroll_entry)
        lines.append(JournalLine(
            accountCode=expense_account["code"],
            accountName=expense_account["name"],
            description=f"Salary expense for {payroll_entry.get('employeeName', 'Employee')}",
            debit=gross_pay,
            credit=0.0
        ))

        # Credit: Various payables and deductions
        if net_pay > 0:
            lines.append(JournalLine(
                accountCode=self.chart_of_accounts["accrued_payroll"]["code"],
                accountName=self.chart_of_accounts["accrued_payroll"]["name"],
                description=f"Net pay payable for {payroll_entry.get('employeeName', 'Employee')}",
                debit=0.0,
                credit=net_pay
            ))

        # Handle tax withholdings
        tax_lines = self._create_tax_journal_lines(payroll_entry)
        lines.extend(tax_lines)

        # Handle benefit deductions
        benefit_lines = self._create_benefit_journal_lines(payroll_entry)
        lines.extend(benefit_lines)

        # Calculate totals
        total_debit = sum(line.debit for line in lines)
        total_credit = sum(line.credit for line in lines)

        # Create journal entry
        journal_entry = JournalEntry(
            entryNumber=f"JE-{date.today().strftime('%Y%m%d')}-{payroll_entry.get('employeeId', '000')}",
            entryDate=date.today().isoformat(),
            description=f"Automated payroll entry for {payroll_entry.get('employeeName', 'Employee')} - {payroll_entry.get('payPeriod', 'N/A')}",
            reference=f"Payroll-{payroll_entry.get('payrollPeriodId', 'N/A')}",
            source="Payroll",
            status="Draft",
            lines=lines,
            totalDebit=total_debit,
            totalCredit=total_credit,
            createdBy=created_by,
            createdAt=datetime.utcnow()
        )

        # Save to database
        entry_dict = journal_entry.dict(exclude_unset=True)
        journal_result = await self.journal_collection.insert_one(entry_dict)
        journal_entry.id = str(journal_result.inserted_id)

        return journal_entry

    def _get_expense_account(self, payroll_entry: Dict) -> Dict:
        """Determine the appropriate expense account based on payroll entry"""
        if payroll_entry.get("overtimeHours", 0) > 0:
            return self.chart_of_accounts["overtime_expense"]
        elif payroll_entry.get("bonus", 0) > 0:
            return self.chart_of_accounts["bonus_expense"]
        else:
            return self.chart_of_accounts["salary_expense"]

    def _create_tax_journal_lines(self, payroll_entry: Dict) -> List[JournalLine]:
        """Create journal lines for tax-related transactions"""
        lines = []
        taxes = [
            ("federalTax", self.chart_of_accounts["payroll_taxes"], "Federal tax withholding"),
            ("stateTax", self.chart_of_accounts["payroll_taxes"], "State tax withholding"),
            ("socialSecurity", self.chart_of_accounts["social_security"], "Social Security withholding"),
            ("medicare", self.chart_of_accounts["medicare"], "Medicare withholding")
        ]

        for tax_field, account, description in taxes:
            amount = payroll_entry.get(tax_field, 0)
            if amount > 0:
                lines.append(JournalLine(
                    accountCode=account["code"],
                    accountName=account["name"],
                    description=f"{description} for {payroll_entry.get('employeeName', 'Employee')}",
                    debit=amount,
                    credit=0.0
                ))

        return lines

    def _create_benefit_journal_lines(self, payroll_entry: Dict) -> List[JournalLine]:
        """Create journal lines for benefit deductions"""
        lines = []
        benefits = [
            ("healthInsurance", self.chart_of_accounts["health_insurance"], "Health insurance deduction"),
            ("dentalInsurance", self.chart_of_accounts["health_insurance"], "Dental insurance deduction"),
            ("retirement401k", self.chart_of_accounts["retirement_401k"], "401k contribution")
        ]

        for benefit_field, account, description in benefits:
            amount = payroll_entry.get(benefit_field, 0)
            if amount > 0:
                lines.append(JournalLine(
                    accountCode=account["code"],
                    accountName=account["name"],
                    description=f"{description} for {payroll_entry.get('employeeName', 'Employee')}",
                    debit=amount,
                    credit=0.0
                ))

        return lines

    async def post_payroll_journal_batch(self, batch_id: str, approved_by: str) -> bool:
        """Post/approve a payroll journal batch"""
        batch = await self.batch_collection.find_one({"_id": ObjectId(batch_id)})
        if not batch:
            raise ValueError(f"Batch {batch_id} not found")

        if batch["status"] != "Posted":
            raise ValueError("Can only post batches with 'Posted' status")

        # Update all journal entries in the batch
        if "journalEntries" in batch and batch["journalEntries"]:
            for entry_id in batch["journalEntries"]:
                await self.journal_collection.update_one(
                    {"_id": ObjectId(entry_id)},
                    {
                        "$set": {
                            "status": "Approved",
                            "approvedBy": approved_by,
                            "approvedAt": datetime.utcnow(),
                            "postedAt": datetime.utcnow()
                        }
                    }
                )

        # Update batch status
        await self.batch_collection.update_one(
            {"_id": ObjectId(batch_id)},
            {
                "$set": {
                    "status": "Posted",
                    "postedAt": datetime.utcnow()
                }
            }
        )

        logger.info(f"Successfully posted payroll journal batch {batch_id}")
        return True

    async def get_payroll_journal_batches(self, status: Optional[str] = None) -> List[PayrollJournalBatch]:
        """Get all payroll journal batches with optional status filter"""
        query = {}
        if status:
            query["status"] = status

        batches = []
        async for batch in self.batch_collection.find(query).sort("createdAt", -1):
            batch["_id"] = str(batch["_id"])
            batch["id"] = batch["_id"]
            batches.append(PayrollJournalBatch(**batch))

        return batches

# Global service instance
payroll_journal_service = AutomatedPayrollJournalService()