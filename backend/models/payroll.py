from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Employee(BaseModel):
    id: Optional[str] = None
    employeeId: str
    firstName: str
    lastName: str
    email: str
    department: str
    position: str
    hireDate: str
    baseSalary: float
    hourlyRate: Optional[float] = None
    employmentType: str = "Full-time"  # Full-time, Part-time, Contract
    status: str = "Active"  # Active, Inactive, Terminated
    bankAccount: Optional[str] = None
    taxId: Optional[str] = None
    socialSecurityNumber: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    emergencyContact: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class PayrollPeriod(BaseModel):
    id: Optional[str] = None
    periodName: str  # e.g., "January 2024", "Q1 2024"
    startDate: str
    endDate: str
    payDate: str
    status: str = "Open"  # Open, Processing, Closed, Posted
    totalEmployees: int = 0
    totalGrossPay: float = 0.0
    totalNetPay: float = 0.0
    totalDeductions: float = 0.0
    totalTaxes: float = 0.0
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class PayrollEntry(BaseModel):
    id: Optional[str] = None
    employeeId: str
    employeeName: str
    payrollPeriodId: str
    payPeriod: str

    # Earnings
    regularHours: float = 0.0
    overtimeHours: float = 0.0
    holidayHours: float = 0.0
    sickHours: float = 0.0
    vacationHours: float = 0.0
    bonus: float = 0.0
    commission: float = 0.0
    otherEarnings: float = 0.0

    # Deductions
    federalTax: float = 0.0
    stateTax: float = 0.0
    socialSecurity: float = 0.0
    medicare: float = 0.0
    healthInsurance: float = 0.0
    dentalInsurance: float = 0.0
    retirement401k: float = 0.0
    otherDeductions: float = 0.0

    # Calculated totals
    grossPay: float = 0.0
    totalDeductions: float = 0.0
    netPay: float = 0.0

    # Status
    status: str = "Draft"  # Draft, Approved, Paid, Cancelled
    approvedBy: Optional[str] = None
    approvedAt: Optional[datetime] = None
    paidAt: Optional[datetime] = None
    notes: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class JournalEntry(BaseModel):
    id: Optional[str] = None
    entryNumber: str
    entryDate: str
    description: str
    reference: Optional[str] = None
    source: str = "Payroll"  # Payroll, Invoice, Payment, etc.
    status: str = "Draft"  # Draft, Approved, Posted, Cancelled

    # Journal lines
    lines: List['JournalLine'] = []

    # Totals
    totalDebit: float = 0.0
    totalCredit: float = 0.0

    # Approval
    approvedBy: Optional[str] = None
    approvedAt: Optional[datetime] = None
    postedAt: Optional[datetime] = None

    # Audit
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class JournalLine(BaseModel):
    id: Optional[str] = None
    accountCode: str
    accountName: str
    description: str
    debit: float = 0.0
    credit: float = 0.0
    department: Optional[str] = None
    costCenter: Optional[str] = None

class PayrollJournalBatch(BaseModel):
    id: Optional[str] = None
    batchNumber: str
    payrollPeriodId: str
    description: str
    totalEntries: int = 0
    totalAmount: float = 0.0
    status: str = "Draft"  # Draft, Processing, Posted, Error
    journalEntries: List[str] = []  # List of JournalEntry IDs
    errorLog: List[str] = []
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    postedAt: Optional[datetime] = None

class PayrollTaxInfo(BaseModel):
    id: Optional[str] = None
    employeeId: str
    taxYear: str
    filingStatus: str  # Single, Married, Head of Household
    allowances: int = 0
    additionalWithholding: float = 0.0
    stateTaxInfo: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class PayrollDeduction(BaseModel):
    id: Optional[str] = None
    employeeId: str
    deductionType: str  # Health Insurance, Dental Insurance, 401k, etc.
    description: str
    amount: float
    percentage: Optional[float] = None  # For percentage-based deductions
    isActive: bool = True
    startDate: str
    endDate: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None