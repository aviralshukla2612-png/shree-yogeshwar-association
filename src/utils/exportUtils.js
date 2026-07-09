import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Helpers ────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().split('T')[0];

const addPdfHeader = (doc, title) => {
  doc.setFillColor(26, 42, 58);
  doc.rect(0, 0, 210, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Shree Yogeshwar Association', 14, 10);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Residential Welfare Association', 14, 16);
  doc.setFontSize(10);
  doc.text(title, 210 - 14, 10, { align: 'right' });
  doc.text(`Generated: ${today()}`, 210 - 14, 16, { align: 'right' });
  doc.setTextColor(0, 0, 0);
};

// ─── EXCEL ───────────────────────────────────────────────────────────────────

export const exportToExcel = (data, columns, fileName) => {
  try {
    const exportData = data.map(item => {
      const row = {};
      columns.forEach(col => {
        row[col.header] = item[col.key] !== undefined ? item[col.key] : '';
      });
      return row;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Auto column widths
    const colWidths = columns.map(col => ({
      wch: Math.max(col.header.length, ...exportData.map(r => String(r[col.header] || '').length)) + 2
    }));
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `${fileName}_${today()}.xlsx`);
  } catch (err) {
    console.error('Excel export error:', err);
    alert('Excel export failed. Please try again.');
  }
};

// ─── MAINTENANCE ─────────────────────────────────────────────────────────────

export const exportMaintenancePDF = (data) => {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Maintenance Collection');

  const paid = data.filter(d => d.status === 'paid').length;
  const overdue = data.filter(d => d.status === 'overdue').length;
  const totalAmount = data.filter(d => d.status === 'paid').reduce((s, d) => s + Number(d.amount), 0);

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Total Records: ${data.length}   Paid: ${paid}   Overdue: ${overdue}   Total Collected: ₹${totalAmount.toLocaleString()}`, 14, 28);

  autoTable(doc, {
    startY: 32,
    head: [['Resident Name', 'Flat No', 'Amount (₹)', 'Due Date', 'Status', 'Payment Mode']],
    body: data.map(d => [
      d.name,
      d.flatNo,
      `₹${Number(d.amount).toLocaleString()}`,
      d.dueDate,
      d.status.toUpperCase(),
      d.paymentMode || 'Cash'
    ]),
    headStyles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 250, 245] },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const val = data.cell.raw;
        if (val === 'OVERDUE') data.cell.styles.textColor = [231, 76, 60];
        else if (val === 'PAID') data.cell.styles.textColor = [39, 174, 96];
        else data.cell.styles.textColor = [243, 156, 18];
      }
    }
  });

  doc.save(`maintenance_${today()}.pdf`);
};

export const exportMaintenanceExcel = (data) => {
  exportToExcel(
    data.map(d => ({
      name: d.name,
      flatNo: d.flatNo,
      amount: d.amount,
      dueDate: d.dueDate,
      status: d.status.toUpperCase(),
      paymentMode: d.paymentMode || 'Cash'
    })),
    [
      { header: 'Resident Name', key: 'name' },
      { header: 'Flat No', key: 'flatNo' },
      { header: 'Amount (₹)', key: 'amount' },
      { header: 'Due Date', key: 'dueDate' },
      { header: 'Status', key: 'status' },
      { header: 'Payment Mode', key: 'paymentMode' }
    ],
    'maintenance_records'
  );
};

// ─── EXPENSES ────────────────────────────────────────────────────────────────

export const exportExpensePDF = (data) => {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Expense Management');

  const total = data.reduce((s, d) => s + Number(d.amount), 0);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Total Records: ${data.length}   Total Amount: ₹${total.toLocaleString()}`, 14, 28);

  autoTable(doc, {
    startY: 32,
    head: [['Category', 'Amount (₹)', 'Date', 'Description']],
    body: data.map(d => [
      d.category,
      `₹${Number(d.amount).toLocaleString()}`,
      d.date,
      d.description || 'N/A'
    ]),
    headStyles: { fillColor: [231, 76, 60], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [253, 245, 245] },
    foot: [['TOTAL', `₹${total.toLocaleString()}`, '', '']],
    footStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: 'bold', fontSize: 8 }
  });

  doc.save(`expenses_${today()}.pdf`);
};

export const exportExpenseExcel = (data) => {
  exportToExcel(
    data.map(d => ({
      category: d.category,
      amount: d.amount,
      date: d.date,
      description: d.description || 'N/A'
    })),
    [
      { header: 'Category', key: 'category' },
      { header: 'Amount (₹)', key: 'amount' },
      { header: 'Date', key: 'date' },
      { header: 'Description', key: 'description' }
    ],
    'expense_records'
  );
};

// ─── STAFF ───────────────────────────────────────────────────────────────────

export const exportStaffPDF = (data) => {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Staff Management');

  const totalSalary = data.reduce((s, d) => s + Number(d.salary), 0);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Total Staff: ${data.length}   Total Salary: ₹${totalSalary.toLocaleString()}`, 14, 28);

  autoTable(doc, {
    startY: 32,
    head: [['Staff Name', 'Role', 'Salary (₹)', 'Phone', 'Payment Mode']],
    body: data.map(d => [
      d.name,
      d.role,
      `₹${Number(d.salary).toLocaleString()}`,
      d.phone || 'N/A',
      d.paymentMode || 'Cash'
    ]),
    headStyles: { fillColor: [52, 152, 219], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [240, 248, 255] },
    foot: [['TOTAL', '', `₹${totalSalary.toLocaleString()}`, '', '']],
    footStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: 'bold', fontSize: 8 }
  });

  doc.save(`staff_${today()}.pdf`);
};

export const exportStaffExcel = (data) => {
  exportToExcel(
    data.map(d => ({
      name: d.name,
      role: d.role,
      salary: d.salary,
      phone: d.phone || 'N/A',
      paymentMode: d.paymentMode || 'Cash'
    })),
    [
      { header: 'Staff Name', key: 'name' },
      { header: 'Role', key: 'role' },
      { header: 'Salary (₹)', key: 'salary' },
      { header: 'Phone', key: 'phone' },
      { header: 'Payment Mode', key: 'paymentMode' }
    ],
    'staff_records'
  );
};

// ─── RESIDENTS ───────────────────────────────────────────────────────────────

export const exportResidentPDF = (data) => {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Residents Directory');

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Total Residents: ${data.length}`, 14, 28);

  autoTable(doc, {
    startY: 32,
    head: [['Resident Name', 'Flat No', 'Phone', 'Maintenance Status']],
    body: data.map(d => [
      d.name,
      d.flat,
      d.phone || 'N/A',
      d.maintenanceStatus.toUpperCase()
    ]),
    headStyles: { fillColor: [155, 89, 182], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 245, 255] },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const val = data.cell.raw;
        if (val === 'PAID') data.cell.styles.textColor = [39, 174, 96];
        else if (val === 'OVERDUE') data.cell.styles.textColor = [231, 76, 60];
        else data.cell.styles.textColor = [243, 156, 18];
      }
    }
  });

  doc.save(`residents_${today()}.pdf`);
};

export const exportResidentExcel = (data) => {
  exportToExcel(
    data.map(d => ({
      name: d.name,
      flat: d.flat,
      phone: d.phone || 'N/A',
      maintenanceStatus: d.maintenanceStatus.toUpperCase()
    })),
    [
      { header: 'Resident Name', key: 'name' },
      { header: 'Flat No', key: 'flat' },
      { header: 'Phone', key: 'phone' },
      { header: 'Maintenance Status', key: 'maintenanceStatus' }
    ],
    'resident_records'
  );
};

// ─── COMPLAINTS ──────────────────────────────────────────────────────────────

export const exportComplaintPDF = (data) => {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Complaint Management');

  const resolved = data.filter(d => d.status === 'Resolved').length;
  const pending = data.filter(d => d.status === 'Pending').length;
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Total: ${data.length}   Resolved: ${resolved}   Pending: ${pending}`, 14, 28);

  autoTable(doc, {
    startY: 32,
    head: [['ID', 'Resident', 'Issue', 'Priority', 'Status']],
    body: data.map((d, i) => [
      `CMP-${String(d.id).padStart(3, '0')}`,
      d.resident,
      d.issue,
      d.priority,
      d.status
    ]),
    headStyles: { fillColor: [243, 156, 18], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [255, 250, 240] },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const val = data.cell.raw;
        if (val === 'High') data.cell.styles.textColor = [231, 76, 60];
        else if (val === 'Medium') data.cell.styles.textColor = [243, 156, 18];
        else data.cell.styles.textColor = [39, 174, 96];
      }
      if (data.section === 'body' && data.column.index === 4) {
        const val = data.cell.raw;
        if (val === 'Resolved') data.cell.styles.textColor = [39, 174, 96];
        else if (val === 'Pending') data.cell.styles.textColor = [231, 76, 60];
        else data.cell.styles.textColor = [243, 156, 18];
      }
    }
  });

  doc.save(`complaints_${today()}.pdf`);
};

export const exportComplaintExcel = (data) => {
  exportToExcel(
    data.map(d => ({
      id: `CMP-${String(d.id).padStart(3, '0')}`,
      resident: d.resident,
      issue: d.issue,
      priority: d.priority,
      status: d.status
    })),
    [
      { header: 'Complaint ID', key: 'id' },
      { header: 'Resident', key: 'resident' },
      { header: 'Issue', key: 'issue' },
      { header: 'Priority', key: 'priority' },
      { header: 'Status', key: 'status' }
    ],
    'complaint_records'
  );
};

// ─── REPORTS DASHBOARD ───────────────────────────────────────────────────────

export const exportReportsPDF = (monthlyData, kpis) => {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Society Reports & Analytics');

  // KPI summary
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('Key Performance Indicators', 14, 30);

  autoTable(doc, {
    startY: 34,
    head: [['Metric', 'Value']],
    body: [
      ['Total Revenue', `₹${kpis.totalIncome.toLocaleString()}`],
      ['Total Expenses', `₹${kpis.totalExpenses.toLocaleString()}`],
      ['Net Profit', `₹${kpis.profit.toLocaleString()}`],
      ['Collection Rate', `${kpis.collectionRate}%`],
      ['Pending Dues', `₹${kpis.pendingDues.toLocaleString()}`],
    ],
    headStyles: { fillColor: [26, 42, 58], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 248, 250] },
    tableWidth: 80
  });

  // Monthly breakdown
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Monthly Breakdown', 14, doc.lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 14,
    head: [['Month', 'Income (₹)', 'Expense (₹)', 'Net (₹)', 'Maintenance', 'Complaints']],
    body: monthlyData.map(d => [
      d.month,
      `₹${d.income.toLocaleString()}`,
      `₹${d.expense.toLocaleString()}`,
      `₹${(d.income - d.expense).toLocaleString()}`,
      d.maintenance,
      d.complaints
    ]),
    headStyles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 250, 245] }
  });

  doc.save(`society_report_${today()}.pdf`);
};

export const exportReportsExcel = (monthlyData, kpis) => {
  const workbook = XLSX.utils.book_new();

  // KPI sheet
  const kpiSheet = XLSX.utils.json_to_sheet([
    { Metric: 'Total Revenue', Value: `₹${kpis.totalIncome.toLocaleString()}` },
    { Metric: 'Total Expenses', Value: `₹${kpis.totalExpenses.toLocaleString()}` },
    { Metric: 'Net Profit', Value: `₹${kpis.profit.toLocaleString()}` },
    { Metric: 'Collection Rate', Value: `${kpis.collectionRate}%` },
    { Metric: 'Pending Dues', Value: `₹${kpis.pendingDues.toLocaleString()}` },
  ]);
  XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');

  // Monthly sheet
  const monthlySheet = XLSX.utils.json_to_sheet(
    monthlyData.map(d => ({
      Month: d.month,
      'Income (₹)': d.income,
      'Expense (₹)': d.expense,
      'Net (₹)': d.income - d.expense,
      'Maintenance Records': d.maintenance,
      Complaints: d.complaints
    }))
  );
  XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Data');

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `society_report_${today()}.xlsx`);
};

// ─── Legacy exports (kept for backward compat) ───────────────────────────────
export const exportMaintenanceData = (data) => ({
  data: data.map(d => ({ name: d.name, flatNo: d.flatNo, amount: d.amount, dueDate: d.dueDate, status: d.status.toUpperCase(), paymentMode: d.paymentMode || 'Cash' })),
  columns: [{ header: 'Resident Name', key: 'name' }, { header: 'Flat No', key: 'flatNo' }, { header: 'Amount (₹)', key: 'amount' }, { header: 'Due Date', key: 'dueDate' }, { header: 'Status', key: 'status' }, { header: 'Payment Mode', key: 'paymentMode' }],
  fileName: 'maintenance_records'
});

export const exportExpenseData = (data) => ({
  data: data.map(d => ({ category: d.category, amount: d.amount, date: d.date, description: d.description || 'N/A' })),
  columns: [{ header: 'Category', key: 'category' }, { header: 'Amount (₹)', key: 'amount' }, { header: 'Date', key: 'date' }, { header: 'Description', key: 'description' }],
  fileName: 'expense_records'
});

export const exportStaffData = (data) => ({
  data: data.map(d => ({ name: d.name, role: d.role, salary: d.salary, phone: d.phone || 'N/A', paymentMode: d.paymentMode || 'Cash' })),
  columns: [{ header: 'Staff Name', key: 'name' }, { header: 'Role', key: 'role' }, { header: 'Salary (₹)', key: 'salary' }, { header: 'Phone', key: 'phone' }, { header: 'Payment Mode', key: 'paymentMode' }],
  fileName: 'staff_records'
});

export const exportResidentData = (data) => ({
  data: data.map(d => ({ name: d.name, flat: d.flat, phone: d.phone || 'N/A', maintenanceStatus: d.maintenanceStatus.toUpperCase() })),
  columns: [{ header: 'Resident Name', key: 'name' }, { header: 'Flat No', key: 'flat' }, { header: 'Phone', key: 'phone' }, { header: 'Maintenance Status', key: 'maintenanceStatus' }],
  fileName: 'resident_records'
});

export const exportComplaintData = (data) => ({
  data: data.map(d => ({ resident: d.resident, issue: d.issue, priority: d.priority, status: d.status })),
  columns: [{ header: 'Resident', key: 'resident' }, { header: 'Issue', key: 'issue' }, { header: 'Priority', key: 'priority' }, { header: 'Status', key: 'status' }],
  fileName: 'complaint_records'
});
