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
    return `${sign}\u20b9${Math.abs(value).toLocaleString()}`;
  };

  // Ensure data exists and has all required fields
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
      subtitle: 'Maintenance Paid' 
    },
    { 
      title: 'Pending', 
      value: data?.pending || 0, 
      icon: <FaClock />, 
      color: '#F39C12',
      bgColor: '#FEF9E7',
      subtitle: 'Awaiting Payment' 
    },
    { 
      title: 'Income', 
      value: formatCurrency(data?.income), 
      icon: <FaChartLine />, 
      color: '#2ECC71',
      bgColor: '#EAFAF1',
      subtitle: 'Total Collection' 
    },
    { 
      title: 'Expense', 
      value: formatCurrency(data?.expense), 
      icon: <FaChartBar />, 
      color: '#E74C3C',
      bgColor: '#FDEDEC',
      subtitle: 'Total Spending' 
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

  // Loading state
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
            background: card.bgColor
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
