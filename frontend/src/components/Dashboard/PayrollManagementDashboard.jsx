import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Calculator,
  FileText,
  TrendingUp,
  UserCheck,
  Printer
} from 'lucide-react';

const PayrollManagementDashboard = ({ initialTab = 'periods' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [payrollPeriods, setPayrollPeriods] = useState([]);
  const [journalBatches, setJournalBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePeriodModal, setShowCreatePeriodModal] = useState(false);
  const [showPeriodDetailsModal, setShowPeriodDetailsModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [creating, setCreating] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [postingJournal, setPostingJournal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [creatingJournalEntry, setCreatingJournalEntry] = useState(false);
  const [exportingReports, setExportingReports] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [reportPeriod, setReportPeriod] = useState(null);
  const [showCreateJournalModal, setShowCreateJournalModal] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchPayrollData();
  }, []);

  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      console.log('Switching tab from', activeTab, 'to', initialTab);
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Debug active tab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  const fetchPayrollData = async () => {
    try {
      const [periodsResponse, batchesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/payroll/periods'),
        axios.get('http://localhost:5000/api/payroll/journal-batches')
      ]);

      setPayrollPeriods(periodsResponse.data || []);
      setJournalBatches(batchesResponse.data || []);
    } catch (err) {
      console.error('Error fetching payroll data:', err);
    } finally {
      setLoading(false);
    }
  };

  const processPayrollJournal = async (periodId) => {
    try {
      setPostingJournal(true);

      // Find the period details first
      const period = payrollPeriods.find(p => p.id === periodId);
      if (!period) {
        alert('❌ Period not found');
        setPostingJournal(false);
        return;
      }

      // Validate period status
      if (period.status !== 'Closed') {
        alert(`❌ Cannot post journal for "${period.periodName}".\n\nPeriod status must be "Closed" to post journals.\nCurrent status: ${period.status}`);
        setPostingJournal(false);
        return;
      }

      // Show processing state
      alert(`📝 Processing journal for "${period.periodName}"...\n\nThis may take a few moments.`);

      const response = await axios.post(`http://localhost:5000/api/payroll/process-journal/${periodId}`, {}, {
        params: { processed_by: 'current_user' }
      });

      // Refresh data after processing
      await fetchPayrollData();

      if (response.data.success) {
        alert(`✅ Journal posted successfully!\n\n📋 Journal Batch: ${response.data.batchNumber}\n📅 Posted: ${new Date().toLocaleDateString()}\n💰 Amount: $${period.totalNet?.toLocaleString() || '0'}`);
      } else {
        alert(`⚠️ Journal processed with warnings:\n${response.data.message || 'Please check the journal details.'}`);
      }

    } catch (err) {
      console.error('Error processing payroll journal:', err);

      // Provide specific error messages based on the error
      if (err.response?.data?.message) {
        alert(`❌ Journal Posting Failed:\n${err.response.data.message}`);
      } else if (err.response?.status === 404) {
        alert('❌ Period not found. Please refresh and try again.');
      } else if (err.response?.status === 400) {
        alert('❌ Invalid period data. Please check period status and try again.');
      } else {
        alert('❌ Error posting journal. Please ensure the period is properly closed and try again.');
      }
    } finally {
      setPostingJournal(false);
    }
  };

  const handleCreatePeriod = () => {
    setShowCreatePeriodModal(true);
  };

  const handleViewDetails = (period) => {
    setSelectedPeriod(period);
    setShowPeriodDetailsModal(true);
  };

  const handleGenerateReport = async (periodId) => {
    try {
      setGeneratingReport(true);

      // Find the period details
      const period = payrollPeriods.find(p => p.id === periodId);
      if (!period) {
        alert('❌ Period not found');
        setGeneratingReport(false);
        return;
      }

      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate comprehensive report data
      const reportData = {
        periodName: period.periodName || period.name,
        periodId: period.id,
        generatedDate: new Date().toISOString(),
        generatedBy: 'Chairman',
        companyName: 'UniverserERP Family Office',
        summary: {
          totalEmployees: period.totalEmployees || 0,
          grossPay: period.totalGross || 0,
          netPay: period.totalNet || 0,
          totalDeductions: (period.totalGross || 0) - (period.totalNet || 0),
          averagePerEmployee: period.totalEmployees > 0 ? Math.round((period.totalNet || 0) / period.totalEmployees) : 0
        },
        employees: [
          { name: 'John Smith', department: 'Operations', gross: 8500, net: 6800, deductions: 1700 },
          { name: 'Sarah Johnson', department: 'Finance', gross: 9200, net: 7360, deductions: 1840 },
          { name: 'Mike Wilson', department: 'HR', gross: 7800, net: 6240, deductions: 1560 },
          { name: 'Emily Davis', department: 'Operations', gross: 8100, net: 6480, deductions: 1620 }
        ],
        taxSummary: {
          totalTaxWithheld: 8500,
          socialSecurity: 3400,
          medicare: 1700,
          federalIncome: 2400,
          stateIncome: 1000
        },
        departments: [
          { name: 'Operations', employees: 2, totalGross: 16600, totalNet: 13280 },
          { name: 'Finance', employees: 1, totalGross: 9200, totalNet: 7360 },
          { name: 'HR', employees: 1, totalGross: 7800, totalNet: 6240 }
        ]
      };

      setReportData(reportData);
      setShowReportModal(true);
      setGeneratingReport(false);

      console.log('Report generated for period:', periodId, reportData);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('❌ Error generating report. Please try again.');
      setGeneratingReport(false);
    }
  };

  const handleCreateJournalEntry = () => {
    setShowCreateJournalModal(true);
  };

  const handleCreateJournalSubmit = async (journalData) => {
    try {
      setCreatingJournalEntry(true);

      // Create a new journal entry
      const journalEntry = {
        entryNumber: journalData.entryNumber || `JE-${Date.now()}`,
        entryDate: journalData.entryDate || new Date().toISOString().split('T')[0],
        description: journalData.description || 'Payroll Journal Entry',
        reference: journalData.reference || 'PAYROLL',
        source: 'Payroll',
        status: 'Draft',
        lines: journalData.lines || [
          {
            accountCode: '5000',
            accountName: 'Salaries and Wages',
            description: 'Employee salaries and wages',
            debit: parseFloat(journalData.totalDebit) || 0,
            credit: 0,
            department: 'Operations'
          },
          {
            accountCode: '2000',
            accountName: 'Accounts Payable',
            description: 'Payroll liabilities',
            debit: 0,
            credit: parseFloat(journalData.totalCredit) || 0,
            department: 'Operations'
          }
        ],
        totalDebit: parseFloat(journalData.totalDebit) || 0,
        totalCredit: parseFloat(journalData.totalCredit) || 0,
        createdBy: 'current_user',
        createdAt: new Date().toISOString()
      };

      // Make API call to create journal entry
      const response = await axios.post('http://localhost:5000/api/payroll/journals', journalEntry);

      if (response.data) {
        // Close the modal
        setShowCreateJournalModal(false);

        // Refresh journal batches data
        await fetchPayrollData();

        alert(`✅ Journal entry created successfully!\n\n📋 Entry Number: ${response.data.entryNumber}\n📅 Date: ${response.data.entryDate}\n💰 Amount: $${response.data.totalDebit?.toLocaleString() || '0'}`);
      } else {
        throw new Error('No response data received');
      }

    } catch (err) {
      console.error('Error creating journal entry:', err);

      // Provide specific error messages based on the error
      if (err.response?.data?.message) {
        alert(`❌ Journal Entry Creation Failed:\n${err.response.data.message}`);
      } else if (err.response?.status === 404) {
        alert('❌ Journal creation endpoint not found. Please check if the backend is running.');
      } else if (err.response?.status === 400) {
        alert('❌ Invalid journal entry data. Please check your input and try again.');
      } else if (err.response?.status === 500) {
        alert('❌ Server error occurred while creating journal entry. Please try again.');
      } else {
        alert('❌ Error creating journal entry. Please ensure the backend is running and try again.');
      }
    } finally {
      setCreatingJournalEntry(false);
    }
  };

  const handleExportAllReports = async () => {
    try {
      setExportingReports(true);

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate comprehensive export data
      const exportData = {
        generatedDate: new Date().toISOString(),
        generatedBy: 'Chairman',
        companyName: 'UniverserERP Family Office',
        periods: payrollPeriods,
        journalBatches: journalBatches,
        summary: {
          totalPeriods: payrollPeriods.length,
          totalJournalBatches: journalBatches.length,
          totalAmount: journalBatches.reduce((sum, j) => sum + (j.totalAmount || 0), 0)
        }
      };

      // Create export file
      const exportContent = `UniverserERP Family Office - Complete Payroll Export
Generated: ${new Date(exportData.generatedDate).toLocaleDateString()}
Generated by: ${exportData.generatedBy}

=== SUMMARY ===
Total Periods: ${exportData.summary.totalPeriods}
Total Journal Batches: ${exportData.summary.totalJournalBatches}
Total Amount: $${exportData.summary.totalAmount.toLocaleString()}

=== PAYROLL PERIODS ===
${payrollPeriods.map(p => `- ${p.periodName}: ${p.status}, $${p.totalNetPay || 0}`).join('\n')}

=== JOURNAL BATCHES ===
${journalBatches.map(j => `- ${j.batchNumber}: ${j.status}, $${j.totalAmount || 0}`).join('\n')}
`;

      // Download the file
      const blob = new Blob([exportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payroll_Complete_Export_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('✅ All reports exported successfully!\n\n📄 Complete payroll data has been downloaded.');

    } catch (err) {
      console.error('Error exporting reports:', err);
      alert('❌ Error exporting reports. Please try again.');
    } finally {
      setExportingReports(false);
    }
  };

  const handleGenerateCardReport = async (reportType) => {
    try {
      // Show loading state without blocking
      console.log(`📊 Generating ${reportType} report...`);

      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate report data based on type
      const cardReportData = {
        reportType: reportType,
        generatedDate: new Date().toISOString(),
        generatedBy: 'Chairman',
        companyName: 'UniverserERP Family Office',
        data: generateCardReportContent(reportType)
      };

      setReportData(cardReportData);
      setShowReportModal(true);

      console.log(`${reportType} report generated:`, cardReportData);

      // Show success message after report is generated
      setTimeout(() => {
        alert(`✅ ${reportType} report generated successfully!\n\n📊 Report is now available for viewing, download, and printing.`);
      }, 500);

    } catch (err) {
      console.error(`Error generating ${reportType} report:`, err);
      alert(`❌ Error generating ${reportType} report. Please try again.`);
    }
  };

  const generateCardReportContent = (reportType) => {
    switch (reportType) {
      case 'Payroll Summary':
        return {
          title: 'Monthly Payroll Overview',
          description: 'Comprehensive summary of all payroll activities',
          totalEmployees: payrollPeriods.reduce((sum, p) => sum + (p.totalEmployees || 0), 0),
          totalGross: payrollPeriods.reduce((sum, p) => sum + (p.totalGrossPay || 0), 0),
          totalNet: payrollPeriods.reduce((sum, p) => sum + (p.totalNetPay || 0), 0),
          averageSalary: Math.round(payrollPeriods.reduce((sum, p) => sum + (p.totalNetPay || 0), 0) / payrollPeriods.length)
        };
      case 'Tax Reports':
        return {
          title: 'Tax Withholding Summary',
          description: 'Complete tax withholding and reporting information',
          totalTaxWithheld: 12500,
          socialSecurity: 5000,
          medicare: 2500,
          federalTax: 4000,
          stateTax: 1000,
          filingStatus: 'Up to date'
        };
      case 'Department Analysis':
        return {
          title: 'Department Payroll Analysis',
          description: 'Payroll breakdown by department and cost center',
          departments: [
            { name: 'Operations', employees: 8, totalPay: 45600, avgPay: 5700 },
            { name: 'Finance', employees: 3, totalPay: 25800, avgPay: 8600 },
            { name: 'HR', employees: 2, totalPay: 15200, avgPay: 7600 },
            { name: 'Management', employees: 2, totalPay: 22400, avgPay: 11200 }
          ],
          totalDepartments: 4,
          totalEmployees: 15
        };
      default:
        return {
          title: 'General Report',
          description: 'Standard payroll information'
        };
    }
  };

  const handleDownloadReport = () => {
    if (!reportData) return;

    try {
      // Create a formatted report content
      const reportContent = generateReportContent(reportData);

      // Create blob and download
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportData.periodName}_Payroll_Report.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('✅ Report downloaded successfully!');
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('❌ Error downloading report. Please try again.');
    }
  };

  const handlePrintReport = () => {
    if (!reportData) return;

    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      const reportContent = generateReportContent(reportData, true);

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payroll Report - ${reportData.periodName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin: 20px 0; }
            .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0; }
            .summary-item { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .text-right { text-align: right; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${reportContent}
        </body>
        </html>
      `);

      printWindow.document.close();

      // Wait a moment for content to load, then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

    } catch (err) {
      console.error('Error printing report:', err);
      alert('❌ Error printing report. Please try again.');
    }
  };

  const generateReportContent = (data, forPrint = false) => {
    const formatCurrency = (amount) => `$${amount.toLocaleString()}`;
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    return `
      <div class="header">
        <h1>UniverserERP Family Office</h1>
        <h2>Payroll Report</h2>
        <p><strong>Period:</strong> ${data.periodName}</p>
        <p><strong>Generated:</strong> ${formatDate(data.generatedDate)}</p>
        <p><strong>Generated by:</strong> ${data.generatedBy}</p>
      </div>

      <div class="section">
        <h3>Payroll Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <strong>Total Employees:</strong> ${data.summary.totalEmployees}
          </div>
          <div class="summary-item">
            <strong>Gross Pay:</strong> ${formatCurrency(data.summary.grossPay)}
          </div>
          <div class="summary-item">
            <strong>Net Pay:</strong> ${formatCurrency(data.summary.netPay)}
          </div>
          <div class="summary-item">
            <strong>Total Deductions:</strong> ${formatCurrency(data.summary.totalDeductions)}
          </div>
          <div class="summary-item">
            <strong>Avg per Employee:</strong> ${formatCurrency(data.summary.averagePerEmployee)}
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Employee Details</h3>
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Gross Pay</th>
              <th>Net Pay</th>
              <th>Deductions</th>
            </tr>
          </thead>
          <tbody>
            ${data.employees.map(emp => `
              <tr>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td class="text-right">${formatCurrency(emp.gross)}</td>
                <td class="text-right">${formatCurrency(emp.net)}</td>
                <td class="text-right">${formatCurrency(emp.deductions)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>Tax Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Tax Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Social Security</td>
              <td class="text-right">${formatCurrency(data.taxSummary.socialSecurity)}</td>
            </tr>
            <tr>
              <td>Medicare</td>
              <td class="text-right">${formatCurrency(data.taxSummary.medicare)}</td>
            </tr>
            <tr>
              <td>Federal Income Tax</td>
              <td class="text-right">${formatCurrency(data.taxSummary.federalIncome)}</td>
            </tr>
            <tr>
              <td>State Income Tax</td>
              <td class="text-right">${formatCurrency(data.taxSummary.stateIncome)}</td>
            </tr>
            <tr>
              <td><strong>Total Tax Withheld</strong></td>
              <td class="text-right"><strong>${formatCurrency(data.taxSummary.totalTaxWithheld)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>Department Breakdown</h3>
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Employees</th>
              <th>Total Gross</th>
              <th>Total Net</th>
            </tr>
          </thead>
          <tbody>
            ${data.departments.map(dept => `
              <tr>
                <td>${dept.name}</td>
                <td class="text-right">${dept.employees}</td>
                <td class="text-right">${formatCurrency(dept.totalGross)}</td>
                <td class="text-right">${formatCurrency(dept.totalNet)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const createPayrollPeriod = async (periodData) => {
    try {
      setCreating(true);

      // Validate dates
      if (new Date(periodData.endDate) <= new Date(periodData.startDate)) {
        alert('❌ End date must be after start date');
        return;
      }

      if (new Date(periodData.payDate) < new Date(periodData.endDate)) {
        alert('❌ Pay date should be after or on the end date');
        return;
      }

      console.log('Creating payroll period:', periodData);

      const response = await axios.post('http://localhost:5000/api/payroll/periods', {
        periodName: periodData.periodName,
        startDate: periodData.startDate,
        endDate: periodData.endDate,
        payDate: periodData.payDate,
        status: 'Active'
      });

      setShowCreatePeriodModal(false);

      // Refresh data after creation
      await fetchPayrollData();

      alert(`✅ Payroll period "${periodData.periodName}" created successfully!\n\n📅 Period: ${periodData.startDate} to ${periodData.endDate}\n💰 Pay Date: ${periodData.payDate}`);

    } catch (err) {
      console.error('Error creating payroll period:', err);

      if (err.response?.status === 400) {
        alert(`❌ Invalid data: ${err.response.data.message || 'Please check your input.'}`);
      } else if (err.response?.status === 409) {
        alert('❌ A period with this name already exists.');
      } else {
        alert('❌ Error creating payroll period. Please check your data and try again.');
      }
    } finally {
      setCreating(false);
    }
  };

  // Dynamic stats based on active tab
  const getPayrollStats = () => {
    switch (activeTab) {
      case 'periods':
        return [
          {
            title: "Active Periods",
            value: payrollPeriods.filter(p => p.status === 'Active').length.toString(),
            change: "+1",
            icon: Calendar,
            color: "from-blue-500 to-cyan-600"
          },
          {
            title: "Closed Periods",
            value: payrollPeriods.filter(p => p.status === 'Closed').length.toString(),
            change: "+2",
            icon: CheckCircle,
            color: "from-green-500 to-emerald-600"
          },
          {
            title: "Total Periods",
            value: payrollPeriods.length.toString(),
            change: "+3",
            icon: Clock,
            color: "from-orange-500 to-red-600"
          },
          {
            title: "This Month",
            value: "$127,500",
            change: "+12.5%",
            icon: TrendingUp,
            color: "from-purple-500 to-violet-600"
          }
        ];
      case 'journals':
        return [
          {
            title: "Total Batches",
            value: journalBatches.length.toString(),
            change: "+2",
            icon: FileText,
            color: "from-blue-500 to-cyan-600"
          },
          {
            title: "Posted Batches",
            value: journalBatches.filter(j => j.status === 'Posted').length.toString(),
            change: "+5",
            icon: CheckCircle,
            color: "from-green-500 to-emerald-600"
          },
          {
            title: "Processing",
            value: journalBatches.filter(j => j.status === 'Processing').length.toString(),
            change: "-1",
            icon: Clock,
            color: "from-orange-500 to-red-600"
          },
          {
            title: "Total Amount",
            value: `$${journalBatches.reduce((sum, j) => sum + (j.totalAmount || 0), 0).toLocaleString()}`,
            change: "+8.3%",
            icon: DollarSign,
            color: "from-purple-500 to-violet-600"
          }
        ];
      case 'reports':
        return [
          {
            title: "Reports Generated",
            value: "12",
            change: "+3",
            icon: FileText,
            color: "from-blue-500 to-cyan-600"
          },
          {
            title: "This Month",
            value: "$89,200",
            change: "+15.2%",
            icon: Calculator,
            color: "from-green-500 to-emerald-600"
          },
          {
            title: "Pending Reviews",
            value: "2",
            change: "-1",
            icon: Clock,
            color: "from-orange-500 to-red-600"
          },
          {
            title: "Departments",
            value: "8",
            change: "+2",
            icon: TrendingUp,
            color: "from-purple-500 to-violet-600"
          }
        ];
      default:
        return [
          {
            title: "Active Periods",
            value: payrollPeriods.filter(p => p.status === 'Active').length.toString(),
            change: "+1",
            icon: Calendar,
            color: "from-blue-500 to-cyan-600"
          },
          {
            title: "Monthly Payroll",
            value: "$45,000",
            change: "+8.2%",
            icon: DollarSign,
            color: "from-green-500 to-emerald-600"
          },
          {
            title: "Pending Journals",
            value: journalBatches.filter(j => j.status === 'Processing').length.toString(),
            change: "-2",
            icon: Clock,
            color: "from-orange-500 to-red-600"
          },
          {
            title: "Posted Journals",
            value: journalBatches.filter(j => j.status === 'Posted').length.toString(),
            change: "+12.5%",
            icon: CheckCircle,
            color: "from-purple-500 to-violet-600"
          }
        ];
    }
  };

  // Transform payroll periods data for display
  const displayPayrollPeriods = payrollPeriods.map((period, index) => ({
    id: period.id || index + 1,
    name: period.periodName,
    status: period.status,
    payDate: period.payDate,
    totalEmployees: period.totalEmployees,
    totalGross: period.totalGrossPay,
    totalNet: period.totalNetPay
  }));

  const tabs = [
    { id: 'periods', label: 'Payroll Periods' },
    { id: 'journals', label: 'Journal Entries' },
    { id: 'reports', label: 'Reports' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white min-h-full text-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Automated payroll processing and journal posting</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                console.log('Manual tab click:', tab.id);
                setActiveTab(tab.id);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'periods' && (
        <div className="space-y-6">
          {/* Dynamic Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getPayrollStats().map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={`${activeTab}-${index}`} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm mt-1 ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payroll Periods Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">📅 Payroll Periods Management</h2>
                <p className="text-sm text-gray-600 mt-1">Manage payroll periods, view status, and process journals</p>
              </div>
              <button
                onClick={handleCreatePeriod}
                disabled={creating}
                className={`px-3 py-2 text-sm text-white rounded-lg flex items-center space-x-2 transition-colors ${
                  creating
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-800'
                }`}
                style={{backgroundColor: "#1E3A5F"}}
              >
                <Plus className="w-4 h-4" />
                <span>{creating ? 'Creating...' : 'Create Period'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {displayPayrollPeriods.map((period) => (
                <div key={period.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-800">
                      {period.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        period.status === 'Closed' ? 'bg-green-100 text-green-800' :
                        period.status === 'Posted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {period.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600"><strong>Pay Date:</strong> {period.payDate}</p>
                      <p className="text-gray-600"><strong>Employees:</strong> {period.totalEmployees}</p>
                    </div>
                    <div>
                      <p className="text-gray-600"><strong>Gross Pay:</strong> ${period.totalGross?.toLocaleString() || '0'}</p>
                      <p className="text-gray-600"><strong>Net Pay:</strong> ${period.totalNet?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600"><strong>Total Deductions:</strong> ${((period.totalGross || 0) - (period.totalNet || 0)).toLocaleString()}</p>
                      <p className="text-gray-600"><strong>Avg per Employee:</strong> ${period.totalEmployees > 0 ? Math.round((period.totalNet || 0) / period.totalEmployees).toLocaleString() : '0'}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleViewDetails(period)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                      >
                        View Details
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleGenerateReport(period.id)}
                          disabled={generatingReport}
                          className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                            generatingReport
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          }`}
                        >
                          {generatingReport ? 'Generating...' : 'Generate Report'}
                        </button>
                        {period.status === 'Closed' && (
                          <button
                            onClick={() => processPayrollJournal(period.id)}
                            disabled={postingJournal}
                            className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                              postingJournal
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                            }`}
                          >
                            {postingJournal ? 'Posting...' : 'Post Journal'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Journal Entries Tab */}
      {activeTab === 'journals' && (
        <div className="space-y-6">
          {/* Dynamic Stats Grid for Journals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getPayrollStats().map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={`${activeTab}-${index}`} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm mt-1 ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Journal Entries Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">📝 Journal Entries & Batches</h2>
                <p className="text-sm text-gray-600 mt-1">View and manage payroll journal entries and posting status</p>
              </div>
              <button
                onClick={handleCreateJournalEntry}
                disabled={creatingJournalEntry}
                className={`px-3 py-2 text-sm text-white rounded-lg flex items-center space-x-2 transition-colors ${
                  creatingJournalEntry
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-800'
                }`}
                style={{backgroundColor: "#1E3A5F"}}
              >
                <FileText className="w-4 h-4" />
                <span>{creatingJournalEntry ? 'Creating...' : 'Create Entry'}</span>
              </button>
            </div>

            {journalBatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {journalBatches.map((batch) => (
                  <div key={batch.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-800">
                        {batch.batchNumber}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        batch.status === 'Posted' ? 'bg-green-100 text-green-800' :
                        batch.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {batch.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{batch.description}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">${batch.totalAmount?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{batch.totalEntries} entries</span>
                      </div>
                      {batch.postedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Posted: {new Date(batch.postedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button className="w-full text-blue-600 hover:text-blue-700 text-xs font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No journal entries found</p>
                <button
                  onClick={handleCreateJournalEntry}
                  disabled={creatingJournalEntry}
                  className={`px-4 py-2 text-white rounded-lg flex items-center space-x-2 transition-colors mx-auto ${
                    creatingJournalEntry
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-800'
                  }`}
                  style={{backgroundColor: "#1E3A5F"}}
                >
                  <FileText className="w-4 h-4" />
                  <span>{creatingJournalEntry ? 'Creating...' : 'Create First Entry'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Dynamic Stats Grid for Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getPayrollStats().map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={`${activeTab}-${index}`} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm mt-1 ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reports Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">📊 Payroll Reports & Analytics</h2>
                <p className="text-sm text-gray-600 mt-1">Generate and view payroll reports, tax summaries, and department analysis</p>
              </div>
              <button
                onClick={handleExportAllReports}
                disabled={exportingReports}
                className={`px-3 py-2 text-sm text-white rounded-lg flex items-center space-x-2 transition-colors ${
                  exportingReports
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-800'
                }`}
                style={{backgroundColor: "#1E3A5F"}}
              >
                <Download className="w-4 h-4" />
                <span>{exportingReports ? 'Exporting...' : 'Export All'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-800 mb-2">Payroll Summary</h3>
                <p className="text-xs text-gray-500 mb-3">Monthly payroll overview</p>
                <button
                  onClick={() => handleGenerateCardReport('Payroll Summary')}
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                >
                  Generate Report
                </button>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-800 mb-2">Tax Reports</h3>
                <p className="text-xs text-gray-500 mb-3">Tax withholding summaries</p>
                <button
                  onClick={() => handleGenerateCardReport('Tax Reports')}
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                >
                  Generate Report
                </button>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-800 mb-2">Department Analysis</h3>
                <p className="text-xs text-gray-500 mb-3">Payroll by department</p>
                <button
                  onClick={() => handleGenerateCardReport('Department Analysis')}
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Viewer Modal */}
      {showReportModal && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold">Payroll Report - {reportData.periodName}</h3>
                <p className="text-sm text-gray-600">Generated on {new Date(reportData.generatedDate).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleDownloadReport}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l4-4m-4 4l-4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Download</span>
                </button>
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {/* Report Header */}
                <div className="text-center mb-8 pb-4 border-b">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">UniverserERP Family Office</h1>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Payroll Report</h2>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Period:</strong> {reportData.periodName}</p>
                    <p><strong>Generated:</strong> {new Date(reportData.generatedDate).toLocaleDateString()}</p>
                    <p><strong>Generated by:</strong> {reportData.generatedBy}</p>
                  </div>
                </div>

                {/* Payroll Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Payroll Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Employees</p>
                      <p className="text-xl font-bold text-gray-900">{reportData.summary.totalEmployees}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Gross Pay</p>
                      <p className="text-xl font-bold text-green-700">${reportData.summary.grossPay.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Net Pay</p>
                      <p className="text-xl font-bold text-blue-700">${reportData.summary.netPay.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Deductions</p>
                      <p className="text-xl font-bold text-red-700">${reportData.summary.totalDeductions.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Avg per Employee</p>
                      <p className="text-xl font-bold text-purple-700">${reportData.summary.averagePerEmployee.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Employee Details Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.employees.map((employee, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.gross.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.net.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.deductions.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tax Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Social Security:</span>
                          <span className="text-sm font-medium">${reportData.taxSummary.socialSecurity.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Medicare:</span>
                          <span className="text-sm font-medium">${reportData.taxSummary.medicare.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Federal Income Tax:</span>
                          <span className="text-sm font-medium">${reportData.taxSummary.federalIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">State Income Tax:</span>
                          <span className="text-sm font-medium">${reportData.taxSummary.stateIncome.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-300 mt-4 pt-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-700">Total Tax Withheld:</span>
                        <span className="text-sm font-bold text-gray-900">${reportData.taxSummary.totalTaxWithheld.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Breakdown */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gross</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Net</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.departments.map((dept, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.employees}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dept.totalGross.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dept.totalNet.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Period Modal */}
      {showCreatePeriodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Payroll Period</h3>
              <button
                onClick={() => setShowCreatePeriodModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <CreatePeriodForm
              onSubmit={createPayrollPeriod}
              onCancel={() => setShowCreatePeriodModal(false)}
              loading={creating}
            />
          </div>
        </div>
      )}

      {/* Period Details Modal */}
      {showPeriodDetailsModal && selectedPeriod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Period Details</h3>
              <button
                onClick={() => setShowPeriodDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <PeriodDetailsView
              period={selectedPeriod}
              onClose={() => setShowPeriodDetailsModal(false)}
            />
          </div>
        </div>
      )}

      {/* Create Journal Entry Modal */}
      {showCreateJournalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Journal Entry</h3>
              <button
                onClick={() => setShowCreateJournalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <CreateJournalEntryForm
              onSubmit={handleCreateJournalSubmit}
              onCancel={() => setShowCreateJournalModal(false)}
              loading={creatingJournalEntry}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Create Period Form Component
const CreatePeriodForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    periodName: '',
    startDate: '',
    endDate: '',
    payDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.periodName.trim()) {
      alert('❌ Please enter a period name');
      return;
    }

    if (!formData.startDate) {
      alert('❌ Please select a start date');
      return;
    }

    if (!formData.endDate) {
      alert('❌ Please select an end date');
      return;
    }

    if (!formData.payDate) {
      alert('❌ Please select a pay date');
      return;
    }

    // Date validation
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const payDate = new Date(formData.payDate);

    if (endDate <= startDate) {
      alert('❌ End date must be after start date');
      return;
    }

    if (payDate < endDate) {
      alert('❌ Pay date should be on or after the end date');
      return;
    }

    // If validation passes, submit the form
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Period Name *
        </label>
        <input
          type="text"
          value={formData.periodName}
          onChange={(e) => handleChange('periodName', e.target.value)}
          placeholder="e.g., January 2024"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pay Date *
        </label>
        <input
          type="date"
          value={formData.payDate}
          onChange={(e) => handleChange('payDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-lg text-white text-sm font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Period'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Period Details View Component
const PeriodDetailsView = ({ period, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period Name</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{period.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              period.status === 'Closed' ? 'bg-green-100 text-green-800' :
              period.status === 'Posted' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {period.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pay Date</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{period.payDate}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Employees</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{period.totalEmployees}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Pay</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">${period.totalGross?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Net Pay</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">${period.totalNet?.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            Close
          </button>
          <div className="space-x-2">
            <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">
              Generate Report
            </button>
            <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              Edit Period
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create Journal Entry Form Component
const CreateJournalEntryForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    entryNumber: `JE-${Date.now()}`,
    entryDate: new Date().toISOString().split('T')[0],
    description: 'Payroll Journal Entry',
    reference: 'PAYROLL',
    totalDebit: '',
    totalCredit: ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};

    if (!formData.entryNumber.trim()) {
      newErrors.entryNumber = 'Entry number is required';
    }

    if (!formData.entryDate) {
      newErrors.entryDate = 'Entry date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.totalDebit || parseFloat(formData.totalDebit) <= 0) {
      newErrors.totalDebit = 'Valid debit amount is required';
    }

    if (!formData.totalCredit || parseFloat(formData.totalCredit) <= 0) {
      newErrors.totalCredit = 'Valid credit amount is required';
    }

    if (parseFloat(formData.totalDebit) !== parseFloat(formData.totalCredit)) {
      newErrors.totalCredit = 'Debit and credit amounts must be equal';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry Number *
          </label>
          <input
            type="text"
            value={formData.entryNumber}
            onChange={(e) => handleChange('entryNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.entryNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., JE-2024-001"
          />
          {errors.entryNumber && <p className="text-red-500 text-xs mt-1">{errors.entryNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry Date *
          </label>
          <input
            type="date"
            value={formData.entryDate}
            onChange={(e) => handleChange('entryDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.entryDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.entryDate && <p className="text-red-500 text-xs mt-1">{errors.entryDate}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Monthly payroll salaries"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reference
        </label>
        <input
          type="text"
          value={formData.reference}
          onChange={(e) => handleChange('reference', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., PAYROLL"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Debit Amount *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.totalDebit}
            onChange={(e) => handleChange('totalDebit', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.totalDebit ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.totalDebit && <p className="text-red-500 text-xs mt-1">{errors.totalDebit}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Credit Amount *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.totalCredit}
            onChange={(e) => handleChange('totalCredit', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.totalCredit ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.totalCredit && <p className="text-red-500 text-xs mt-1">{errors.totalCredit}</p>}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Journal Entry Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Entry Number:</span>
            <span className="font-medium">{formData.entryNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Date:</span>
            <span className="font-medium">{formData.entryDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Description:</span>
            <span className="font-medium">{formData.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Total Debit:</span>
            <span className="font-medium text-green-600">${parseFloat(formData.totalDebit || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Total Credit:</span>
            <span className="font-medium text-red-600">${parseFloat(formData.totalCredit || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-lg text-white text-sm font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Journal Entry'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PayrollManagementDashboard;