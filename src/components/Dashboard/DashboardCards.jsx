import React from 'react';
import { 
  FaHome, 
  FaCheckCircle, 
  FaClock, 
  FaChartLine, 
  FaChartBar, 
  FaBalanceScale 
} from 'react-icons/fa';
import './DashboardCards.css';

const DashboardCards = ({ data, loading }) => {
  const formatCurrency = (amount = 0) => {
    const value = Number(amount) || 0;
    const sign = value < 0 ? '-' : '';
    return `${sign}₹${Math.abs(value).toLocaleString()}`;
  };

  const incomeTrend = data?.incomeTrend ?? 0;
  const expenseTrend = data?.expenseTrend ?? 0;
  const collectionRate = data?.collectionRate ?? 0;
  const overdueCount = data?.overdueCount ?? 0;

  const cards = [
    { 
      title: 'Residents', 
      value: data?.totalResidents || data?.totalFlats || 0, 
      icon: <FaHome />, 
      color: '#4A90D9',
      bgColor: '#E8F0FE',
      subtitle: 'Total Flats' 
    },
    { 
      title: 'Paid', 
      value: data?.paid || 0, 
      icon: <FaCheckCircle />, 
      color: '#27AE60',
      bgColor: '#E8F8F0',
      subtitle: `Collection rate ${collectionRate}%` 
    },
    { 
      title: 'Pending', 
      value: data?.pending || 0, 
      icon: <FaClock />, 
      color: '#F39C12',
      bgColor: '#FEF9E7',
      subtitle: overdueCount > 0 ? `${overdueCount} overdue maintenance payments` : 'Awaiting Payment'
    },
    { 
      title: 'Income', 
      value: formatCurrency(data?.income), 
      icon: <FaChartLine />, 
      color: '#2ECC71',
      bgColor: '#EAFAF1',
      subtitle: incomeTrend > 0
        ? `↑ ${incomeTrend}% compared to last month`
        : incomeTrend < 0
        ? `↓ ${Math.abs(incomeTrend)}% compared to last month`
        : 'Total Collection'
    },
    { 
      title: 'Expense', 
      value: formatCurrency(data?.expense), 
      icon: <FaChartBar />, 
      color: '#E74C3C',
      bgColor: '#FDEDEC',
      subtitle: expenseTrend > 0
        ? `↑ ${expenseTrend}% compared to last month`
        : expenseTrend < 0
        ? `↓ ${Math.abs(expenseTrend)}% compared to last month`
        : 'Total Spending'
    },
    { 
      title: 'Balance', 
      value: formatCurrency(data?.balance), 
      icon: <FaBalanceScale />, 
      color: (data?.balance || 0) >= 0 ? '#27AE60' : '#E74C3C',
      bgColor: (data?.balance || 0) >= 0 ? '#EAFAF1' : '#FDEDEC',
      subtitle: (data?.balance || 0) >= 0 ? 'Positive Balance' : 'Negative Balance' 
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-cards">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card skeleton">
            <div className="card-icon skeleton-icon" />
            <div className="card-content">
              <div className="skeleton-text skeleton-title" />
              <div className="skeleton-text skeleton-value" />
              <div className="skeleton-text skeleton-subtitle" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="card" 
          style={{ 
            borderBottom: `4px solid ${card.color}`,
            '--card-bg': card.bgColor,
            '--card-color': card.color
          }}
        >
          <div className="card-icon" style={{ color: card.color, background: `${card.color}15` }}>
            {card.icon}
          </div>
          <div className="card-content">
            <h3>{card.title}</h3>
            <p className="card-value" style={{ color: card.color }}>{card.value}</p>
            <p className="card-subtitle">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
