import React from 'react';
import './profile-page.css';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const handleChangePassword = () => {
    // Handle change password logic
    console.log('Change Password clicked');
  };

  const handleManage2FA = () => {
    // Handle manage 2FA logic
    console.log('Manage 2FA clicked');
  };

  const handleEditProfile = () => {
    // Handle edit profile logic
    console.log('Edit Profile clicked');
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout clicked');
  };

  return (
    <div className="profile-page">
      <h1>User Profile</h1>

      <div className="profile-section">
        <h2>Personal Information</h2>
        <div className="info-item">
          <label>Name:</label>
          <span>{user.displayName || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Username:</label>
          <span>{user.displayName || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Email:</label>
          <span>{user.email || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Phone:</label>
          <span>N/A</span>
        </div>
        <div className="info-item">
          <label>Address:</label>
          <span>N/A</span>
        </div>
      </div>

      <div className="profile-section">
        <h2>Account Details</h2>
        <div className="info-item">
          <label>Account Number:</label>
          <span>{user.accountNumber || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Account Type:</label>
          <span>{user.accountType || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Balance:</label>
          <span>${user.balance || '0.00'}</span>
        </div>
      </div>

      <div className="profile-section">
        <h2>Security & Settings</h2>
        <button className="action-button" onClick={handleChangePassword}>
          Change Password
        </button>
        <button className="action-button" onClick={handleManage2FA}>
          Manage 2FA
        </button>
      </div>

      <div className="profile-section">
        <h2>Preferences</h2>
        <div className="info-item">
          <label>Language:</label>
          <span>{user.language || 'English'}</span>
        </div>
        <div className="info-item">
          <label>Notifications:</label>
          <span>{user.notifications ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>

      <div className="profile-section">
        <h2>Actions</h2>
        <button className="action-button" onClick={handleEditProfile}>
          Edit Profile
        </button>
        <button className="action-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
