import React from 'react';

const Notification = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`notification ${notification.type}`}>
      <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
      <span>{notification.message}</span>
    </div>
  );
};

export default Notification;