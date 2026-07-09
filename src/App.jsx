import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  FaChartBar, 
  FaClipboardList, 
  FaMoneyBillWave, 
  FaUsers, 
  FaHome, 
  FaExclamationTriangle, 
  FaFileAlt,
  FaCog,
  FaUserCircle
} from 'react-icons/fa';
import Header from './components/Header/Header';
import DashboardCards from './components/Dashboard/DashboardCards';
import RecentMaintenance from './components/Dashboard/RecentMaintenance';
import RecentExpenses from './components/Dashboard/RecentExpenses';
import MaintenanceTable from './components/Maintenance/MaintenanceTable';
import ExpenseTable from './components/Expenses/ExpenseTable';
import StaffTable from './components/Staff/StaffTable';
import ResidentTable from './components/Residents/ResidentTable';
import ComplaintTable from './components/Complaints/ComplaintTable';
import ReportsDashboard from './components/Reports/ReportsDashboard';
import SettingsPage from './components/Settings/SettingsPage';
import MyProfilePage from './components/Profile/MyProfilePage';
import Toast from './components/Common/Toast';
import { expensesData } from "./data/expenses";
import { maintenanceData } from "./data/maintenance";
import { residentsData } from "./data/residents";
import { staffData } from "./data/staff";

function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 992);
  const toastTimerRef = useRef(null);
  const loadingTimerRef = useRef(null);
  
  const [maintenance, setMaintenance] = useState(maintenanceData);
  const [expenses, setExpenses] = useState(expensesData);
  const [residents] = useState(residentsData);
  const [staff, setStaff] = useState(staffData);
  const [complaints, setComplaints] = useState([
    { id: 1, resident: 'John Doe', issue: 'Water leakage', priority: 'High', status: 'In Progress' },
    { id: 2, resident: 'Jane Smith', issue: 'Power outage', priority: 'High', status: 'Resolved' },
    { id: 3, resident: 'Mike Johnson', issue: 'Noise complaint', priority: 'Medium', status: 'Pending' },
  ]);

  // ============================================
  // HANDLE WINDOW RESIZE
  // ============================================
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimerRef.current);
      window.clearTimeout(loadingTimerRef.current);
    };
  }, []);

  // ============================================
  // TOAST NOTIFICATION
  // ============================================
  
  const showToast = (message, type = 'success') => {
    window.clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3500);
  };

  // ============================================
  // LOADING SIMULATION
  // ============================================
  
  const simulateLoading = (callback) => {
    window.clearTimeout(loadingTimerRef.current);
    setLoading(true);
    loadingTimerRef.current = window.setTimeout(() => {
      callback();
      setLoading(false);
    }, 800);
  };

  // ============================================
  // DASHBOARD CALCULATIONS - FIXED
  // ============================================
  
  const dashboardData = useMemo(() => {
    // Calculate total flats from residents
    const totalFlats = residents.length;
    
    // Calculate paid maintenance count
    const paid = maintenance.filter(item => item.status === 'paid').length;
    
    // Calculate pending maintenance count (pending + overdue)
    const pending = maintenance.filter(item => 
      item.status === 'pending' || item.status === 'overdue'
    ).length;
    
    // Calculate total income from PAID maintenance only
    const income = maintenance
      .filter(item => item.status === 'paid')
      .reduce((sum, item) => sum + Number(item.amount), 0);
    
    // Calculate total expenses
    const expense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    
    // Calculate balance (income - expense)
    const balance = income - expense;

    return {
      totalFlats,
      paid,
      pending,
      income,
      expense,
      balance,
      totalStaff: staff.length,
      totalResidents: residents.length
    };
  }, [maintenance, expenses, residents, staff]);

  // ============================================
  // AUTO-UPDATE OVERDUE STATUS
  // ============================================
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let hasChanges = false;
    const updatedMaintenance = maintenance.map(item => {
      if (item.status === 'pending') {
        const dueDate = new Date(item.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          hasChanges = true;
          return { ...item, status: 'overdue' };
        }
      }
      return item;
    });
    
    if (hasChanges) {
      setMaintenance(updatedMaintenance);
    }
  }, [maintenance]);

  // ============================================
  // MAINTENANCE CRUD OPERATIONS
  // ============================================
  
  const addMaintenance = (newItem) => {
    simulateLoading(() => {
      const newRecord = {
        id: Date.now(),
        name: newItem.name,
        flatNo: newItem.flatNo,
        amount: Number(newItem.amount),
        dueDate: newItem.dueDate,
        status: newItem.status || 'pending',
        paymentMode: newItem.paymentMode || 'cash'
      };
      setMaintenance(prev => [...prev, newRecord]);
      showToast(`Maintenance record added for ${newItem.name}!`, 'success');
    });
  };

  const updateMaintenance = (id, updatedItem) => {
    simulateLoading(() => {
      setMaintenance(prev => 
        prev.map(item => {
          if (item.id === id) {
            return {
              ...item,
              ...updatedItem,
              amount: updatedItem.amount ? Number(updatedItem.amount) : item.amount
            };
          }
          return item;
        })
      );
      showToast('Maintenance record updated!', 'success');
    });
  };

  const deleteMaintenance = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      simulateLoading(() => {
        setMaintenance(prev => prev.filter(item => item.id !== id));
        showToast('Maintenance record deleted.', 'warning');
      });
    }
  };

  // ============================================
  // EXPENSES CRUD OPERATIONS
  // ============================================
  
  const addExpense = (newExpense) => {
    simulateLoading(() => {
      const newRecord = {
        id: Date.now(),
        category: newExpense.category,
        amount: Number(newExpense.amount),
        date: newExpense.date,
        description: newExpense.description || ''
      };
      setExpenses(prev => [...prev, newRecord]);
      showToast(`${newExpense.category} expense added!`, 'success');
    });
  };

  const updateExpense = (id, updatedExpense) => {
    simulateLoading(() => {
      setExpenses(prev =>
        prev.map(item => {
          if (item.id === id) {
            return {
              ...item,
              ...updatedExpense,
              amount: updatedExpense.amount ? Number(updatedExpense.amount) : item.amount
            };
          }
          return item;
        })
      );
      showToast('Expense updated!', 'success');
    });
  };

  const deleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      simulateLoading(() => {
        setExpenses(prev => prev.filter(item => item.id !== id));
        showToast('Expense deleted.', 'warning');
      });
    }
  };

  // ============================================
  // STAFF CRUD OPERATIONS
  // ============================================
  
  const addStaff = (newStaff) => {
    simulateLoading(() => {
      const newRecord = {
        id: Date.now(),
        name: newStaff.name,
        role: newStaff.role,
        salary: Number(newStaff.salary),
        phone: newStaff.phone || '',
        paymentMode: newStaff.paymentMode || 'cash'
      };
      setStaff(prev => [...prev, newRecord]);
      showToast(`${newStaff.name} added as ${newStaff.role}!`, 'success');
    });
  };

  const updateStaff = (id, updatedStaff) => {
    simulateLoading(() => {
      setStaff(prev =>
        prev.map(item => {
          if (item.id === id) {
            return {
              ...item,
              ...updatedStaff,
              salary: updatedStaff.salary ? Number(updatedStaff.salary) : item.salary
            };
          }
          return item;
        })
      );
      showToast('Staff details updated!', 'success');
    });
  };

  const deleteStaff = (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      simulateLoading(() => {
        setStaff(prev => prev.filter(item => item.id !== id));
        showToast('Staff member removed.', 'warning');
      });
    }
  };

  // ============================================
  // COMPLAINTS CRUD OPERATIONS
  // ============================================
  
  const updateComplaint = (id, status) => {
    simulateLoading(() => {
      setComplaints(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status } : item
        )
      );
      showToast(`Complaint status updated to ${status}!`, 'success');
    });
  };

  // ============================================
  // NAVIGATION ITEMS
  // ============================================
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'maintenance', label: 'Maintenance', icon: <FaClipboardList /> },
    { id: 'expenses', label: 'Expenses', icon: <FaMoneyBillWave /> },
    { id: 'staff', label: 'Staff', icon: <FaUsers /> },
    { id: 'residents', label: 'Residents', icon: <FaHome /> },
    { id: 'complaints', label: 'Complaints', icon: <FaExclamationTriangle /> },
    { id: 'reports', label: 'Reports', icon: <FaFileAlt /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
    { id: 'profile', label: 'My Profile', icon: <FaUserCircle /> },
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="app">
      <Header 
        activeTab={activeTab} 
        onNavigate={setActiveTab}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
      />
      
      <div className="container">
        {/* Toast Notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)}
          />
        )}

        {/* ============================================
            NAVIGATION TABS - Only show on desktop
            ============================================ */}
        {!isMobile && (
          <div className="nav-tabs">
            {navItems.map((item) => (
              <button 
                key={item.id}
                className={activeTab === item.id ? 'active' : ''}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ============================================
            DASHBOARD CONTENT
            ============================================ */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <DashboardCards data={dashboardData} loading={loading} />
            
            <div className="dashboard-grid">
              <div className="grid-item">
                <div className="grid-header">
                  <h3>Recent Maintenance</h3>
                </div>
                <RecentMaintenance 
                  data={maintenance.slice(0, 5)} 
                  loading={loading}
                />
              </div>
              <div className="grid-item">
                <div className="grid-header">
                  <h3>Recent Expenses</h3>
                </div>
                <RecentExpenses 
                  data={expenses.slice(0, 5)} 
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            MAINTENANCE CONTENT - FULL TABLE
            ============================================ */}
        {activeTab === 'maintenance' && (
          <MaintenanceTable 
            data={maintenance} 
            onAdd={addMaintenance}
            onUpdate={updateMaintenance}
            onDelete={deleteMaintenance}
            loading={loading}
          />
        )}

        {/* ============================================
            EXPENSES CONTENT - FULL TABLE
            ============================================ */}
        {activeTab === 'expenses' && (
          <ExpenseTable 
            data={expenses} 
            onAdd={addExpense}
            onUpdate={updateExpense}
            onDelete={deleteExpense}
            loading={loading}
          />
        )}

        {/* ============================================
            STAFF CONTENT
            ============================================ */}
        {activeTab === 'staff' && (
          <StaffTable 
            data={staff} 
            onAdd={addStaff}
            onUpdate={updateStaff}
            onDelete={deleteStaff}
            loading={loading}
          />
        )}

        {/* ============================================
            RESIDENTS CONTENT
            ============================================ */}
        {activeTab === 'residents' && (
          <ResidentTable data={residents} loading={loading} />
        )}

        {/* ============================================
            COMPLAINTS CONTENT
            ============================================ */}
        {activeTab === 'complaints' && (
          <ComplaintTable 
            data={complaints}
            onUpdate={updateComplaint}
            loading={loading}
          />
        )}

        {/* ============================================
            REPORTS CONTENT
            ============================================ */}
        {activeTab === 'reports' && (
          <ReportsDashboard 
            maintenanceData={maintenance}
            expenseData={expenses}
            complaintData={complaints}
          />
        )}

        {/* ============================================
            SETTINGS CONTENT
            ============================================ */}
        {activeTab === 'settings' && (
          <SettingsPage isDark={isDark} onToggleDark={toggleDarkMode} />
        )}

        {/* ============================================
            MY PROFILE CONTENT
            ============================================ */}
        {activeTab === 'profile' && (
          <MyProfilePage />
        )}
      </div>
    </div>
  );
}

export default App;
