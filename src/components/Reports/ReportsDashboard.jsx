import React, { useEffect, useState, useMemo } from 'react';
import {
  FaFilePdf, FaFileExcel, FaPrint, FaEnvelope, FaCalendarAlt,
  FaArrowUp, FaArrowDown, FaLightbulb, FaChartLine, FaChartBar,
  FaCreditCard, FaExclamationTriangle, FaMoneyBillWave
} from 'react-icons/fa';
import {
  Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import { exportToExcel } from '../../utils/exportUtils';
import './ReportsDashboard.css';

const CATEGORY_COLORS = {
  Plumbing: '#3498db', Electrical: '#f39c12', Security: '#e74c3c',
  Noise: '#2ecc71', Maintenance: '#9b59b6', Hygiene: '#1abc9c', General: '#95a5a6'
};

const getComplaintCategory = (issue) => {
  const map = {
    'Water leakage': 'Plumbing', 'Power outage': 'Electrical',
    'Noise complaint': 'Noise', 'Lift issue': 'Maintenance',
    'Pest control': 'Hygiene', 'Parking issue': 'Security'
  };
  return map[issue] || 'General';
};

const STAFF_PERFORMANCE = [
  { name: 'Rajesh', jobs: 12, rating: 4.8 },
  { name: 'Suresh', jobs: 10, rating: 4.5 },
  { name: 'Mahesh', jobs: 8, rating: 4.2 },
  { name: 'Kiran', jobs: 7, rating: 4.0 },
  { name: 'Gopal', jobs: 5, rating: 3.8 }
];

const ReportsDashboard = ({ maintenanceData = [], expenseData = [], complaintData = [], showDialog }) => {
  // Complaint status breakdown from real data
  const complaintStatusData = useMemo(() => [
    { name: 'Resolved', value: complaintData.filter(c => c.status === 'Resolved').length, color: '#27ae60' },
    { name: 'In Progress', value: complaintData.filter(c => c.status === 'In Progress').length, color: '#f39c12' },
    { name: 'Pending', value: complaintData.filter(c => c.status === 'Pending').length, color: '#e74c3c' },
  ].filter(d => d.value > 0), [complaintData]);

  // Complaint categories from real data
  const complaintCategories = useMemo(() => {
    const counts = {};
    complaintData.forEach(c => {
      const cat = getComplaintCategory(c.issue);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name, value, color: CATEGORY_COLORS[name] || '#95a5a6'
    }));
  }, [complaintData]);
  const [isCompactChart, setIsCompactChart] = useState(() => window.innerWidth <= 520);

  useEffect(() => {
    const handleResize = () => setIsCompactChart(window.innerWidth <= 520);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // All KPIs from real data
  const kpis = useMemo(() => {
    const totalIncome = maintenanceData
      .filter(m => m.status === 'paid')
      .reduce((sum, m) => sum + Number(m.amount), 0);

    const totalExpenses = expenseData.reduce((sum, e) => sum + Number(e.amount), 0);

    const totalDue = maintenanceData.reduce((sum, m) => sum + Number(m.amount), 0);
    const collectionRate = totalDue > 0 ? Math.round((totalIncome / totalDue) * 100) : 0;

    const pendingDues = maintenanceData
      .filter(m => m.status === 'pending' || m.status === 'overdue')
      .reduce((sum, m) => sum + Number(m.amount), 0);

    const overdueCount = maintenanceData.filter(m => m.status === 'overdue').length;
    const paidCount = maintenanceData.filter(m => m.status === 'paid').length;
    const pendingCount = maintenanceData.filter(m => m.status === 'pending').length;
    const totalCount = maintenanceData.length;

    // Income trend: compare paid vs total (as a proxy for collection progress)
    // If collection rate > 50% it's trending up, else down
    const incomeTrendVal = collectionRate - 50;

    // Expense trend: compare staff salary portion vs total expenses
    const staffExpense = expenseData.find(e => e.category === 'Staff Salary');
    const staffRatio = staffExpense && totalExpenses > 0
      ? ((Number(staffExpense.amount) / totalExpenses) * 100 - 50)
      : 0;

    return {
      totalIncome,
      totalExpenses,
      collectionRate,
      pendingDues,
      overdueCount,
      paidCount,
      pendingCount,
      totalCount,
      profit: totalIncome - totalExpenses,
      incomeTrend: incomeTrendVal.toFixed(1),
      expenseTrend: staffRatio.toFixed(1)
    };
  }, [maintenanceData, expenseData]);

  // Build monthly chart data from real maintenance + expense data
  const monthlyChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      const income = maintenanceData
        .filter(m => {
          const md = new Date(m.dueDate);
          return m.status === 'paid' && md.getMonth() === d.getMonth() && md.getFullYear() === year;
        })
        .reduce((sum, m) => sum + Number(m.amount), 0);
      const expense = expenseData
        .filter(e => {
          const ed = new Date(e.date);
          return ed.getMonth() === d.getMonth() && ed.getFullYear() === year;
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
      const complaints = complaintData.filter(c => {
          const cd = new Date(c.createdAt || Date.now());
          return cd.getMonth() === d.getMonth() && cd.getFullYear() === year;
        }).length;
      const resolved = complaintData.filter(c => {
          const cd = new Date(c.createdAt || Date.now());
          return c.status === 'Resolved' && cd.getMonth() === d.getMonth() && cd.getFullYear() === year;
        }).length;
      result.push({ month: monthName, income, expense, complaints, resolved });
    }
    return result;
  }, [maintenanceData, expenseData, complaintData]);

  // Collection trend from real data
  const collectionTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthName = months[d.getMonth()];
      const target = maintenanceData.length * (maintenanceData[0]?.amount || 5000);
      const collected = maintenanceData
        .filter(m => {
          const md = new Date(m.dueDate);
          return m.status === 'paid' && md.getMonth() === d.getMonth() && md.getFullYear() === d.getFullYear();
        })
        .reduce((sum, m) => sum + Number(m.amount), 0);
      return { month: monthName, collected, target };
    });
  }, [maintenanceData]);

  // Payment status from real data
  const paymentStatus = useMemo(() => [
    { name: 'Paid', value: kpis.paidCount },
    { name: 'Pending/Overdue', value: kpis.pendingCount + kpis.overdueCount }
  ], [kpis]);

  const handleExport = (type) => {
    if (type === 'Excel') {
      exportToExcel(
        monthlyChartData,
        [
          { header: 'Month', key: 'month' },
          { header: 'Income', key: 'income' },
          { header: 'Expense', key: 'expense' },
          { header: 'Complaints', key: 'complaints' }
        ],
        'society_report'
      );
      return;
    }
    if (type === 'Email') {
      showDialog('Email sharing is not connected yet. Please export the report and send it manually.', 'alert', 'Email Export');
      return;
    }
    window.print();
  };

  // Insights — all from real data
  const insights = useMemo(() => [
    {
      text: `₹${kpis.totalIncome.toLocaleString()} collected from ${kpis.paidCount} of ${kpis.totalCount} residents.`,
      type: kpis.collectionRate >= 50 ? 'positive' : 'negative'
    },
    {
      text: `Total expenses: ₹${kpis.totalExpenses.toLocaleString()}. Net balance: ₹${kpis.profit.toLocaleString()}.`,
      type: kpis.profit >= 0 ? 'positive' : 'negative'
    },
    {
      text: `Collection rate is ${kpis.collectionRate}% (${kpis.paidCount} paid, ${kpis.pendingCount} pending).`,
      type: kpis.collectionRate > 80 ? 'positive' : kpis.collectionRate > 50 ? 'warning' : 'negative'
    },
    {
      text: `${kpis.overdueCount} overdue payment${kpis.overdueCount !== 1 ? 's' : ''} — ₹${kpis.pendingDues.toLocaleString()} pending dues.`,
      type: kpis.overdueCount === 0 ? 'positive' : 'warning'
    }
  ], [kpis]);

  return (
    <div className="reports-dashboard">
      {/* Header */}
      <div className="reports-header">
        <div className="reports-title">
          <h2><FaChartLine /> Reports & Analytics</h2>
          <span className="reports-subtitle">Real-time insights for your society</span>
        </div>
        <div className="reports-actions">
          <button className="export-btn pdf" onClick={() => handleExport('PDF')}><FaFilePdf /> PDF</button>
          <button className="export-btn excel" onClick={() => handleExport('Excel')}><FaFileExcel /> Excel</button>
          <button className="export-btn print" onClick={() => window.print()}><FaPrint /> Print</button>
          <button className="export-btn email" onClick={() => handleExport('Email')}><FaEnvelope /> Email</button>
        </div>
      </div>

      {/* Insights Banner */}
      <div className="insights-banner">
        <FaLightbulb className="insights-icon" />
        <div className="insights-list">
          {insights.map((insight, index) => (
            <span key={index} className={`insight-tag ${insight.type}`}>
              {insight.text}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label"><FaMoneyBillWave /> Revenue</div>
          <div className="kpi-value">₹{kpis.totalIncome.toLocaleString()}</div>
          <div className={`kpi-trend ${kpis.collectionRate >= 50 ? 'up' : 'down'}`}>
            {kpis.collectionRate >= 50 ? <FaArrowUp /> : <FaArrowDown />}
            {kpis.collectionRate}% collection rate
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><FaChartBar /> Expenses</div>
          <div className="kpi-value">₹{kpis.totalExpenses.toLocaleString()}</div>
          <div className={`kpi-trend ${kpis.profit >= 0 ? 'up' : 'down'}`}>
            {kpis.profit >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            Net: ₹{kpis.profit.toLocaleString()}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><FaCreditCard /> Collection Rate</div>
          <div className="kpi-value">{kpis.collectionRate}%</div>
          <div className="kpi-progress">
            <div className="kpi-progress-bar" style={{ width: `${kpis.collectionRate}%` }} />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><FaExclamationTriangle /> Pending Dues</div>
          <div className="kpi-value">₹{kpis.pendingDues.toLocaleString()}</div>
          <div className="kpi-subtitle">{kpis.overdueCount} overdue payment{kpis.overdueCount !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Income vs Expense — real data */}
        <div className="chart-card large">
          <div className="chart-header">
            <h3>Income vs Expense</h3>
            <span className="chart-period">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" fill="#2ecc71" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#e74c3c" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="income" stroke="#27ae60" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Collection Trend — real data */}
        <div className="chart-card">
          <div className="chart-header"><h3>Collection Trend</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={collectionTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="collected" stroke="#3498db" fill="#3498db" fillOpacity={0.3} />
              <Area type="monotone" dataKey="target" stroke="#e74c3c" fill="#e74c3c" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status — real data */}
        <div className="chart-card">
          <div className="chart-header"><h3>Payment Status</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart margin={{ top: 12, right: 24, bottom: 8, left: 24 }}>
              <Pie
                data={paymentStatus}
                cx="50%" cy="50%"
                innerRadius={isCompactChart ? 42 : 60}
                outerRadius={isCompactChart ? 62 : 80}
                paddingAngle={5}
                dataKey="value"
                label={!isCompactChart ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                labelLine={!isCompactChart}
              >
                {paymentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#27ae60' : '#f39c12'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} residents`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Complaints — real data */}
        <div className="chart-card">
          <div className="chart-header"><h3>Monthly Complaints</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#27ae60" radius={[0, 0, 0, 0]} />
              <Bar dataKey="complaints" name="Total" stackId="b" fill="#e74c3c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint Status — updates when status changes */}
        <div className="chart-card">
          <div className="chart-header"><h3>Complaint Status</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            {complaintStatusData.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250, color: '#95a5a6' }}>No complaints yet</div>
            ) : (
              <PieChart margin={{ top: 12, right: 24, bottom: 8, left: 24 }}>
                <Pie
                  data={complaintStatusData}
                  cx="50%" cy="50%"
                  innerRadius={isCompactChart ? 38 : 50}
                  outerRadius={isCompactChart ? 62 : 80}
                  paddingAngle={5}
                  dataKey="value"
                  label={!isCompactChart ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                  labelLine={!isCompactChart}
                >
                  {complaintStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} complaint${value !== 1 ? 's' : ''}`} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Complaint Categories */}
        <div className="chart-card">
          <div className="chart-header"><h3>Complaint Categories</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            {complaintCategories.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250, color: '#95a5a6' }}>No complaints yet</div>
            ) : (
              <PieChart margin={{ top: 12, right: 24, bottom: 8, left: 24 }}>
                <Pie
                  data={complaintCategories}
                  cx="50%" cy="50%"
                  innerRadius={isCompactChart ? 38 : 50}
                  outerRadius={isCompactChart ? 62 : 80}
                  paddingAngle={5}
                  dataKey="value"
                  label={!isCompactChart ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                  labelLine={!isCompactChart}
                >
                  {complaintCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} complaint${value !== 1 ? 's' : ''}`} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Staff Performance */}
        <div className="chart-card">
          <div className="chart-header"><h3>Staff Performance</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={STAFF_PERFORMANCE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="jobs" fill="#3498db" radius={[0, 4, 4, 0]}>
                {STAFF_PERFORMANCE.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.jobs > 10 ? '#2ecc71' : '#3498db'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Collection Rate Radial — real data */}
        <div className="chart-card">
          <div className="chart-header"><h3>Collection Rate</h3></div>
          <div className="radial-chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="60%" outerRadius="85%"
                data={[{ name: 'Collection Rate', value: kpis.collectionRate, fill: '#2ecc71' }]}
                startAngle={180} endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  background={{ fill: '#ecf0f1', radius: 10 }}
                  clockWise={true}
                  dataKey="value"
                  label={{
                    position: 'center',
                    content: ({ value }) => (
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#2c3e50" fontSize="28" fontWeight="700">
                        {value}%
                      </text>
                    )
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="radial-chart-label">Collection Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
