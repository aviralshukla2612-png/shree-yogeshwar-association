import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './Reports.css';

const PaymentChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const paid = data.filter(item => item.status === 'paid').length;
    const pending = data.filter(item => item.status === 'pending' || item.status === 'overdue').length;
    
    return [
      { name: 'Paid', value: paid || 89 },
      { name: 'Pending', value: pending || 11 }
    ];
  }, [data]);

  const COLORS = ['#27ae60', '#f39c12'];

  return (
    <div className="chart-container">
      <h3>Payment Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentChart;