import React, { useEffect, useState, useMemo } from 'react';
import { 
  FaFilePdf, 
  FaFileExcel, 
  FaPrint, 
  FaEnvelope,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaLightbulb,
  FaChartLine,
  FaChartBar,
  FaCreditCard,
  FaExclamationTriangle,
  FaMoneyBillWave
} from 'react-icons/fa';
import {
  Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import { exportToExcel } from '../../utils/exportUtils';
import './ReportsDashboard.css';

const MONTHLY_DATA = [
    { month: 'Jan', income: 42000, expense: 24000, maintenance: 38, complaints: 8 },
    { month: 'Feb', income: 45000, expense: 26000, maintenance: 42, complaints: 10 },
    { month: 'Mar', income: 43000, expense: 23000, maintenance: 36, complaints: 7 },
    { month: 'Apr', income: 48000, expense: 28000, maintenance: 45, complaints: 12 },
    { month: 'May', income: 50000, expense: 30000, maintenance: 47, complaints: 6 },
    { month: 'Jun', income: 60000, expense: 40000, maintenance: 52, complaints: 9 }
];

const COMPLAINT_CATEGORIES = [
    { name: 'Plumbing', value: 40, color: '#3498db' },
    { name: 'Electrical', value: 20, color: '#f39c12' },
    { name: 'Security', value: 15, color: '#e74c3c' },
    { name: 'Noise', value: 25, color: '#2ecc71' }
];

const STAFF_PERFORMANCE = [
    { name: 'Rajesh', jobs: 12, rating: 4.8 },
    { name: 'Suresh', jobs: 10, rating: 4.5 },
    { name: 'Mahesh', jobs: 8, rating: 4.2 },
    { name: 'Kiran', jobs: 7, rating: 4.0 },
    { name: 'Gopal', jobs: 5, rating: 3.8 }
];

const PAYMENT_STATUS = [
    { name: 'Paid', value: 89 },
    { name: 'Pending', value: 11 }
];

const COLLECTION_DATA = [
    { month: 'Jan', collected: 38000, target: 42000 },
    { month: 'Feb', collected: 41000, target: 45000 },
    { month: 'Mar', collected: 39000, target: 43000 },
    { month: 'Apr', collected: 44000, target: 48000 },
    { month: 'May', collected: 47000, target: 50000 },
    { month: 'Jun', collected: 55000, target: 60000 }
];

const ReportsDashboard = ({ maintenanceData = [] }) => {
  const [dateRange, setDateRange] = useState('last-6-months');
  const [isCompactChart, setIsCompactChart] = useState(() => window.innerWidth <= 520);

  useEffect(() => {
    const handleResize = () => setIsCompactChart(window.innerWidth <= 520);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter data based on date range
  const getFilteredData = useMemo(() => {
    const rangeMap = {
      'this-month': 1,
      'last-month': 1,
      'last-3-months': 3,
      'last-6-months': 6,
      'this-year': 12
    };
    const count = rangeMap[dateRange] || 6;
    
    if (dateRange === 'this-month' || dateRange === 'last-month') {
      return [MONTHLY_DATA[MONTHLY_DATA.length - 1]];
    }
    return MONTHLY_DATA.slice(-count);
  }, [dateRange]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalIncome = MONTHLY_DATA.reduce((sum, d) => sum + d.income, 0);
    const totalExpenses = MONTHLY_DATA.reduce((sum, d) => sum + d.expense, 0);
    const targetCollection = 50000 * 6;
    const collectionRate = Math.round((totalIncome / targetCollection) * 100);
    const pendingDues = Math.max(0, targetCollection - totalIncome);
    
    const lastMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
    const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
    const incomeTrend = ((lastMonth.income - prevMonth.income) / prevMonth.income) * 100;
    const expenseTrend = ((lastMonth.expense - prevMonth.expense) / prevMonth.expense) * 100;
    
    return {
      totalIncome,
      totalExpenses,
      collectionRate,
      pendingDues,
      incomeTrend: incomeTrend.toFixed(1),
      expenseTrend: expenseTrend.toFixed(1),
      totalMaintenance: MONTHLY_DATA.reduce((sum, d) => sum + d.maintenance, 0),
      profit: totalIncome - totalExpenses
    };
  }, []);

  // Export functions
  const handleExport = (type) => {
    if (type === 'Excel') {
      exportToExcel(
        getFilteredData,
        [
          { header: 'Month', key: 'month' },
          { header: 'Income', key: 'income' },
          { header: 'Expense', key: 'expense' },
          { header: 'Maintenance Records', key: 'maintenance' },
          { header: 'Complaints', key: 'complaints' }
        ],
        'society_report'
      );
      return;
    }

    if (type === 'Email') {
      alert('Email sharing is not connected yet. Please export the report and send it manually.');
      return;
    }

    window.print();
  };

  // Insights
  const insights = [
    { 
      text: `Income increased by ${kpis.incomeTrend}% compared to last month.`,
      type: kpis.incomeTrend > 0 ? 'positive' : 'negative'
    },
    { 
      text: `Expenses ${kpis.expenseTrend > 0 ? 'increased' : 'decreased'} by ${Math.abs(kpis.expenseTrend)}%.`,
      type: kpis.expenseTrend < 0 ? 'positive' : 'negative'
    },
    { 
      text: `Collection rate reached ${kpis.collectionRate}%.`,
      type: kpis.collectionRate > 80 ? 'positive' : 'warning'
    },
    { 
      text: `${maintenanceData.filter(m => m?.status === 'overdue').length || 0} overdue maintenance payments.`,
      type: 'warning'
    }
  ];

  return (
    <div className="reports-dashboard">
      {/* Header */}
      <div className="reports-header">
        <div className="reports-title">
          <h2><FaChartLine /> Reports & Analytics</h2>
          <span className="reports-subtitle">Real-time insights for your society</span>
        </div>
        <div className="reports-actions">
          <div className="date-filter">
            <FaCalendarAlt />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="date-select"
            >
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="this-year">This Year</option>
            </select>
          </div>
          <button className="export-btn pdf" onClick={() => handleExport('PDF')}>
            <FaFilePdf /> PDF
          </button>
          <button className="export-btn excel" onClick={() => handleExport('Excel')}>
            <FaFileExcel /> Excel
          </button>
          <button className="export-btn print" onClick={() => window.print()}>
            <FaPrint /> Print
          </button>
          <button className="export-btn email" onClick={() => handleExport('Email')}>
            <FaEnvelope /> Email
          </button>
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
          <div className={`kpi-trend ${kpis.incomeTrend > 0 ? 'up' : 'down'}`}>
            {kpis.incomeTrend > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(kpis.incomeTrend)}% from last month
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><FaChartBar /> Expenses</div>
          <div className="kpi-value">₹{kpis.totalExpenses.toLocaleString()}</div>
          <div className={`kpi-trend ${kpis.expenseTrend < 0 ? 'up' : 'down'}`}>
            {kpis.expenseTrend < 0 ? <FaArrowDown /> : <FaArrowUp />}
            {Math.abs(kpis.expenseTrend)}% from last month
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
          <div className="kpi-subtitle">{maintenanceData.filter(m => m?.status === 'overdue').length || 0} overdue payments</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="charts-grid">
        {/* Income vs Expense - Large */}
        <div className="chart-card large">
          <div className="chart-header">
            <h3>Income vs Expense</h3>
            <span className="chart-period">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={getFilteredData}>
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

        {/* Collection Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Collection Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={COLLECTION_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="collected" stroke="#3498db" fill="#3498db" fillOpacity={0.3} />
              <Area type="monotone" dataKey="target" stroke="#e74c3c" fill="#e74c3c" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status - Doughnut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Payment Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart margin={{ top: 12, right: 24, bottom: 8, left: 24 }}>
              <Pie
                data={PAYMENT_STATUS}
                cx="50%"
                cy="50%"
                innerRadius={isCompactChart ? 42 : 60}
                outerRadius={isCompactChart ? 62 : 80}
                paddingAngle={5}
                dataKey="value"
                label={!isCompactChart ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                labelLine={!isCompactChart}
              >
                {PAYMENT_STATUS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Paid' ? '#27ae60' : '#f39c12'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Complaints */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Monthly Complaints</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getFilteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" fill="#e74c3c" radius={[4, 4, 0, 0]}>
                {getFilteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.complaints > 8 ? '#e74c3c' : '#f39c12'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint Categories */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Complaint Categories</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart margin={{ top: 12, right: 24, bottom: 8, left: 24 }}>
              <Pie
                data={COMPLAINT_CATEGORIES}
                cx="50%"
                cy="50%"
                innerRadius={isCompactChart ? 38 : 50}
                outerRadius={isCompactChart ? 62 : 80}
                paddingAngle={5}
                dataKey="value"
                label={!isCompactChart ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                labelLine={!isCompactChart}
              >
                {COMPLAINT_CATEGORIES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Staff Performance */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Staff Performance</h3>
          </div>
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

        {/* Collection Rate - Radial Chart with Percentage */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Collection Rate</h3>
          </div>
          <div className="radial-chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="85%" 
                data={[{ name: 'Collection Rate', value: kpis.collectionRate, fill: '#2ecc71' }]}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  background={{
                    fill: '#ecf0f1',
                    radius: 10
                  }}
                  clockWise={true}
                  dataKey="value"
                  label={{
                    position: 'center',
                    content: ({ value }) => {
                      return (
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#2c3e50"
                          fontSize="28"
                          fontWeight="700"
                        >
                          {value}%
                        </text>
                      );
                    }
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
