import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/' },
    { id: 'core', label: 'Core', icon: '⭐', path: '/core', active: true },
    { id: 'premium', label: 'Premium', icon: '⚙️', path: '/premium' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '📊', path: '/leaderboard' },
    { id: 'activity', label: 'Activity', icon: '📈', path: '/activity' }
  ];

  return (
    <></>
  );
};

export default BottomNavigation;