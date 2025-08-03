import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const navigationItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Dashboard',
      description: 'Main overview'
    },
    {
      path: '/motion-analytics',
      icon: '📊',
      label: 'Motion Analytics',
      description: 'Track motion data'
    },
    {
      path: '/projects',
      icon: '📁',
      label: 'Projects',
      description: 'Manage projects'
    },
    {
      path: '/motion-tools',
      icon: '🛠️',
      label: 'Motion Tools',
      description: 'Development tools'
    },
    {
      path: '/capture',
      icon: '🎥',
      label: 'Capture Studio',
      description: 'Motion capture'
    },
    {
      path: '/library',
      icon: '📚',
      label: 'Asset Library',
      description: 'Motion assets'
    },
    {
      path: '/settings',
      icon: '⚙️',
      label: 'Settings',
      description: 'App settings'
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Profile',
      description: 'User profile'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">
            <span className="logo-text">3</span>
            <span className="logo-number">11</span>
          </div>
          {!isCollapsed && (
            <div className="brand-text">
              <h2>THREE11</h2>
              <span className="subtitle">MOTION TECH</span>
            </div>
          )}
        </div>
        <button 
          className="toggle-btn"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className={`hamburger ${isCollapsed ? 'collapsed' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navigationItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path}
                className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && (
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="footer-content">
            <div className="status-indicator">
              <div className="status-dot active"></div>
              <span>System Online</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;