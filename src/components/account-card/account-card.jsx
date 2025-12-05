import React from 'react';
import './profile-card.css';

const ProfileCard = ({ userName, accountNumber, accountType, balance, avatarUrl }) => {
  // Function to mask account number, showing only last 4 digits
  const maskAccountNumber = (number) => {
    if (!number) return '';
    const lastFour = number.slice(-4);
    return `****${lastFour}`;
  };

  // Mock data for recent transactions
  const recentTransactions = [
    { id: 1, label: 'Supermarket', date: '2023-10-15', amount: -85.50 },
    { id: 2, label: 'Salary', date: '2023-10-14', amount: 2500.00 },
    { id: 3, label: 'Online Purchase', date: '2023-10-13', amount: -120.75 },
    { id: 4, label: 'ATM Withdrawal', date: '2023-10-12', amount: -50.00 },
    { id: 5, label: 'Transfer In', date: '2023-10-11', amount: 300.00 },
  ];

  // Mock data for monthly summary
  const monthlySummary = {
    spending: 1250.00,
    income: 3200.00,
  };

  return (
    <div className="profile-card">
      <div className="card-header">
        <div className="user-info">
          {avatarUrl && <img src={avatarUrl} alt="Profile Avatar" className="profile-avatar" />}
          <h2 className="user-name">{userName || 'User Name'}</h2>
        </div>
        <div className="balance-section">
          <p className="balance-label">Current Balance</p>
          <p className="balance-amount">${balance ? balance.toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="account-details">
        <div className="detail-item">
          <span className="detail-label">Account Number</span>
          <span className="detail-value">{maskAccountNumber(accountNumber)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Account Type</span>
          <span className="detail-value">{accountType || 'Checking'}</span>
        </div>
      </div>

      <div className="recent-transactions">
        <h3 className="section-title">Recent Transactions</h3>
        <div className="transactions-list">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-label">{transaction.label}</span>
                <span className="transaction-date">{transaction.date}</span>
              </div>
              <span className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="monthly-summary">
        <h3 className="section-title">Monthly Summary</h3>
        <div className="summary-chart">
          <div className="chart-bar">
            <div className="bar spending" style={{ height: `${(monthlySummary.spending / monthlySummary.income) * 100}%` }}>
              <span className="bar-label">Spending</span>
              <span className="bar-value">${monthlySummary.spending.toFixed(2)}</span>
            </div>
            <div className="bar income" style={{ height: '100%' }}>
              <span className="bar-label">Income</span>
              <span className="bar-value">${monthlySummary.income.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="action-btn transfer" onClick={() => alert('Transfer functionality not implemented yet')}>
          Transfer
        </button>
        <button className="action-btn statements" onClick={() => alert('Statements functionality not implemented yet')}>
          Statements
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
