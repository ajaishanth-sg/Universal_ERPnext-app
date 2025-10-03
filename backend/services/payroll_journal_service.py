import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging
from models.payroll import PayrollEntry, JournalEntry, JournalLine, PayrollJournalBatch, Employee
from email_service import send_payroll_journal_notification

logger = logging.getLogger(__name__)

class PayrollJournalService:
    def __init__(self):
        # Standard chart of accounts for payroll
        self.chart_of_accounts = {
            'salary_expense': '5001',
            'overtime_expense': '5002',
            'bonus_expense': '5003',
            'payroll_taxes': '2001',
            'social_security_payable': '2002',
            'medicare_payable': '2003',
            'federal_tax_payable': '2004',
            'state_tax_payable': '2005',
            'health_insurance_payable': '2006',
            'retirement_payable': '2007',
            'cash': '1001',
            'accrued_payroll': '2101'
        }

    async def process_payroll_journal(self, payroll_period_id: str, approved_by: str) -> PayrollJournalBatch:
        """Process payroll entries and create journal entries for a payroll period"""
        try:
            # Get all approved payroll entries for the period
            from database import db
            payroll_entries = []
            async for entry in db.payroll_entries.find({
                "payrollPeriodId": payroll_period_id,
                "status": "Approved"
            }):
                entry["_id"] = str(entry["_id"])
                entry["id"] = entry["_id"]
                payroll_entries.append(PayrollEntry(**entry))

            if not payroll_entries:
                raise ValueError(f"No approved payroll entries found for period {payroll_period_id}")

            # Create journal batch
            batch = PayrollJournalBatch(
                batchNumber=f"PJ-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
                payrollPeriodId=payroll_period_id,
                description=f"Automated Payroll Journal - {payroll_period_id}",
                totalEntries=len(payroll_entries),
                status="Processing",
                createdBy=approved_by
            )

            # Save batch
            batch_dict = batch.dict(exclude_unset=True)
            result = await db.payroll_journal_batches.insert_one(batch_dict)
            batch.id = str(result.inserted_id)

            # Process each payroll entry
            journal_entries = []
            total_amount = 0.0

            for entry in payroll_entries:
                journal_entry = await self._create_journal_entry(entry)
                if journal_entry:
                    journal_entries.append(journal_entry)
                    total_amount += entry.netPay

                    # Save journal entry
                    entry_dict = journal_entry.dict(exclude_unset=True)
                    entry_result = await db.journal_entries.insert_one(entry_dict)
                    journal_entry.id = str(entry_result.inserted_id)
                    batch.journalEntries.append(journal_entry.id)

            # Update batch totals
            batch.totalAmount = total_amount
            batch.totalEntries = len(journal_entries)

            if journal_entries:
                batch.status = "Posted"
                batch.postedAt = datetime.now()
            else:
                batch.status = "Error"
                batch.errorLog.append("No journal entries were created")

            # Update batch in database
            await db.payroll_journal_batches.replace_one(
                {"_id": result.inserted_id},
                batch.dict(exclude_unset=True)
            )

            # Send notification
            await self._send_journal_notification(batch, journal_entries)

            return batch

        except Exception as e:
            logger.error(f"Error processing payroll journal: {str(e)}")
            # Update batch with error status
            if 'batch' in locals():
                batch.status = "Error"
                batch.errorLog.append(str(e))
                await db.payroll_journal_batches.replace_one(
                    {"_id": batch.id} if hasattr(batch, 'id') else {},
                    batch.dict(exclude_unset=True)
                )
            raise

    async def _create_journal_entry(self, payroll_entry: PayrollEntry) -> Optional[JournalEntry]:
        """Create a journal entry from a payroll entry"""
        try:
            # Get employee information
            from database import db
            employee_data = await db.employees.find_one({"_id": payroll_entry.employeeId})
            if not employee_data:
                logger.error(f"Employee not found: {payroll_entry.employeeId}")
                return None

            employee = Employee(**employee_data)
            employee.id = str(employee_data["_id"])

            # Create journal lines
            lines = []

            # Debit: Salary Expense (or specific expense accounts)
            if payroll_entry.regularHours > 0:
                lines.append(JournalLine(
                    accountCode=self.chart_of_accounts['salary_expense'],
                    accountName='Salary Expense',
                    description=f"Salary - {employee.firstName} {employee.lastName}",
                    debit=payroll_entry.regularHours * (payroll_entry.grossPay / max(payroll_entry.regularHours, 1)),
                    department=employee.department
                ))

            if payroll_entry.overtimeHours > 0:
                lines.append(JournalLine(
                    accountCode=self.chart_of_accounts['overtime_expense'],
                    accountName='Overtime Expense',
                    description=f"Overtime - {employee.firstName} {employee.lastName}",
                    debit=payroll_entry.overtimeHours * (payroll_entry.grossPay / max(payroll_entry.regularHours + payroll_entry.overtimeHours, 1)),
                    department=employee.department
                ))

            if payroll_entry.bonus > 0:
                lines.append(JournalLine(
                    accountCode=self.chart_of_accounts['bonus_expense'],
                    accountName='Bonus Expense',
                    description=f"Bonus - {employee.firstName} {employee.lastName}",
                    debit=payroll_entry.bonus,
                    department=employee.department
                ))

            # Credit: Various payable accounts
            if payroll_entry.federalTax > 0:
                lines.append(JournalLine(
                    accountCode=self.chart_of_accounts['federal_tax_payable'],
                    accountName='Federal Tax Payable',
                    description=f"Federal Tax - {employee.firstName} {employee.lastName}",
                    credit=payroll_entry.federalTax
                ))

            if payroll_entry.socialSecurity > 0:
                lines.append(JournalLine(
                    accountCode=self.chart_of_accounts['social_security_payable'],
                    accountName='Social Security Payable',
                    description=f"Social Security - {employee.firstName} {employee.lastName}",
                    credit=payroll_entry.socialSecurity
                ))

            if payroll_entry.medicare > 0:
                lines.append(JournalLine(
                    accountCode=self.chart_of_accounts['medicare_payable'],
                    accountName='Medicare Payable',
                    description=f"Medicare - {employee.firstName} {employee.lastName}",
                    credit=payroll_entry.medicare
                ))

            if payroll_entry.healthInsurance > 0:
                lines.append(JournalLine(
                    accountCode=self.chart_of_accounts['health_insurance_payable'],
                    accountName='Health Insurance Payable',
                    description=f"Health Insurance - {employee.firstName} {employee.lastName}",
                    credit=payroll_entry.healthInsurance
                ))

            if payroll_entry.retirement401k > 0:
                lines.append(JournalLine(
                    accountCode=self.chart_of_accounts['retirement_payable'],
                    accountName='Retirement Payable',
                    description=f"401k - {employee.firstName} {employee.lastName}",
                    credit=payroll_entry.retirement401k
                ))

            # Net Pay - Cash or Accrued Payroll
            if payroll_entry.netPay > 0:
                lines.append(JournalLine(
                    accountCode=self.chart_of_accounts['cash'],
                    accountName='Cash',
                    description=f"Net Pay - {employee.firstName} {employee.lastName}",
                    credit=payroll_entry.netPay
                ))

            # Calculate totals
            total_debit = sum(line.debit for line in lines)
            total_credit = sum(line.credit for line in lines)

            # Create journal entry
            journal_entry = JournalEntry(
                entryNumber=f"JE-{datetime.now().strftime('%Y%m%d-%H%M%S')}-{payroll_entry.employeeId}",
                entryDate=datetime.now().strftime('%Y-%m-%d'),
                description=f"Payroll Entry - {employee.firstName} {employee.lastName} - {payroll_entry.payPeriod}",
                reference=payroll_entry.id,
                source="Payroll",
                status="Posted",
                lines=lines,
                totalDebit=total_debit,
                totalCredit=total_credit,
                postedAt=datetime.now(),
                createdBy="system"
            )

            return journal_entry

        except Exception as e:
            logger.error(f"Error creating journal entry for payroll {payroll_entry.id}: {str(e)}")
            return None

    async def calculate_payroll_taxes(self, gross_pay: float, tax_info: dict) -> Dict[str, float]:
        """Calculate payroll taxes based on gross pay and tax information"""
        taxes = {
            'federal_tax': 0.0,
            'social_security': 0.0,
            'medicare': 0.0,
            'state_tax': 0.0
        }

        try:
            # Social Security (6.2% - 2024 rate)
            taxes['social_security'] = gross_pay * 0.062

            # Medicare (1.45% - 2024 rate)
            taxes['medicare'] = gross_pay * 0.0145

            # Federal Income Tax (simplified calculation)
            # This is a simplified calculation - in reality, this would be much more complex
            if gross_pay <= 12000:  # Annual equivalent for monthly pay
                taxes['federal_tax'] = 0.0
            elif gross_pay <= 40000:
                taxes['federal_tax'] = gross_pay * 0.12
            elif gross_pay <= 80000:
                taxes['federal_tax'] = gross_pay * 0.22
            else:
                taxes['federal_tax'] = gross_pay * 0.24

            # State Tax (simplified - would vary by state)
            taxes['state_tax'] = gross_pay * 0.05  # 5% flat rate assumption

        except Exception as e:
            logger.error(f"Error calculating payroll taxes: {str(e)}")

        return taxes

    async def generate_payroll_report(self, payroll_period_id: str) -> Dict:
        """Generate a comprehensive payroll report"""
        try:
            from database import db

            # Get payroll period
            period = await db.payroll_periods.find_one({"_id": payroll_period_id})
            if not period:
                raise ValueError(f"Payroll period not found: {payroll_period_id}")

            # Get all entries for the period
            entries = []
            async for entry in db.payroll_entries.find({"payrollPeriodId": payroll_period_id}):
                entry["_id"] = str(entry["_id"])
                entry["id"] = entry["_id"]
                entries.append(PayrollEntry(**entry))

            # Calculate totals
            total_gross = sum(entry.grossPay for entry in entries)
            total_deductions = sum(entry.totalDeductions for entry in entries)
            total_net = sum(entry.netPay for entry in entries)
            total_taxes = sum(
                entry.federalTax + entry.stateTax + entry.socialSecurity + entry.medicare
                for entry in entries
            )

            # Group by department
            department_totals = {}
            for entry in entries:
                dept = entry.employeeId  # Would need to join with employee data
                if dept not in department_totals:
                    department_totals[dept] = {"gross": 0, "net": 0, "count": 0}
                department_totals[dept]["gross"] += entry.grossPay
                department_totals[dept]["net"] += entry.netPay
                department_totals[dept]["count"] += 1

            return {
                "period": period,
                "summary": {
                    "total_employees": len(entries),
                    "total_gross_pay": total_gross,
                    "total_deductions": total_deductions,
                    "total_taxes": total_taxes,
                    "total_net_pay": total_net
                },
                "department_breakdown": department_totals,
                "entries": entries
            }

        except Exception as e:
            logger.error(f"Error generating payroll report: {str(e)}")
            raise

    async def _send_journal_notification(self, batch: PayrollJournalBatch, journal_entries: List[JournalEntry]):
        """Send notification about payroll journal posting"""
        try:
            recipients = ["accounting@univerererp.com", "hr@univerererp.com"]

            for recipient in recipients:
                await send_payroll_journal_notification(
                    recipient_email=recipient,
                    batch=batch,
                    journal_entries=journal_entries
                )
        except Exception as e:
            logger.error(f"Error sending journal notification: {str(e)}")

    async def validate_journal_entry(self, journal_entry: JournalEntry) -> bool:
        """Validate that journal entry debits equal credits"""
        total_debit = sum(line.debit for line in journal_entry.lines)
        total_credit = sum(line.credit for line in journal_entry.lines)

        return abs(total_debit - total_credit) < 0.01  # Allow for rounding differences

    async def get_accounting_impact(self, payroll_period_id: str) -> Dict[str, float]:
        """Get the accounting impact of a payroll period"""
        try:
            from database import db

            # Get all journal entries for the period
            entries = []
            async for entry in db.journal_entries.find({"reference": payroll_period_id}):
                entry["_id"] = str(entry["_id"])
                entry["id"] = entry["_id"]
                entries.append(JournalEntry(**entry))

            # Calculate impact by account
            account_impact = {}
            for entry in entries:
                for line in entry.lines:
                    account = line.accountCode
                    if account not in account_impact:
                        account_impact[account] = {"debit": 0.0, "credit": 0.0}
                    account_impact[account]["debit"] += line.debit
                    account_impact[account]["credit"] += line.credit

            return account_impact

        except Exception as e:
            logger.error(f"Error calculating accounting impact: {str(e)}")
            return {}

# Global service instance
payroll_journal_service = PayrollJournalService()