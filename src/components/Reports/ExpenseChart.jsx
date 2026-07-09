import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Reports.css';

const ExpenseChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return months.map((month, index) => {
      const monthIndex = index + 1;
      const monthData = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === monthIndex - 1;
      });
      
      const amount = monthData.reduce((sum, item) => sum + Number(item.amount), 0);
      return { month, expense: amount };
    });
  }, [data]);

  // If no data, show realistic sample
  const displayData = chartData.every(d => d.expense === 0)
    ? [
        { month: 'Jan', expense: 24000 },
        { month: 'Feb', expense: 26000 },
        { month: 'Mar', expense: 23000 },
        { month: 'Apr', expense: 28000 },
        { month: 'May', expense: 30000 },
        { month: 'Jun', expense: 40000 }
      ]
    : chartData;

  return (
    <div className="chart-container">
      <h3>Monthly Expense</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="expense" fill="#e74c3c" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;