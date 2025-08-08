import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await axios.get(`${API}/`);
        setSystemStatus(response.data.message);
      } catch (error) {
        console.error('Error fetching system status:', error);
        setSystemStatus('System Offline');
      }
    };

    fetchSystemStatus();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>THREE11 Motion Tech Dashboard</h1>
        <p>Welcome to your motion technology control center</p>
      </div>

      <div className="dashboard-grid">
        {/* System Status Card */}
        <div className="card system-status">
          <div className="card-header">
            <h3>System Status</h3>
            <div className={`status-badge ${systemStatus === 'Hello World' ? 'online' : 'offline'}`}>
              {systemStatus === 'Hello World' ? 'Online' : 'Offline'}
            </div>
          </div>
          <div className="card-content">
            <div className="status-info">
              <p>Backend API: {systemStatus || 'Checking...'}</p>
              <p>Last Updated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Motion Analytics Preview */}
        <div className="card analytics-preview">
          <div className="card-header">
            <h3>Motion Analytics</h3>
          </div>
          <div className="card-content">
            <div className="analytics-stats">
              <div className="stat-item">
                <span className="stat-value">24</span>
                <span className="stat-label">Active Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">156</span>
                <span className="stat-label">Motion Captures</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">98.5%</span>
                <span className="stat-label">System Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card recent-projects">
          <div className="card-header">
            <h3>Recent Projects</h3>
          </div>
          <div className="card-content">
            <div className="project-list">
              <div className="project-item">
                <div className="project-icon">🎬</div>
                <div className="project-info">
                  <h4>Action Sequence Alpha</h4>
                  <p>Last modified 2 hours ago</p>
                </div>
              </div>
              <div className="project-item">
                <div className="project-icon">🏃</div>
                <div className="project-info">
                  <h4>Athletic Motion Study</h4>
                  <p>Last modified 1 day ago</p>
                </div>
              </div>
              <div className="project-item">
                <div className="project-icon">🕺</div>
                <div className="project-info">
                  <h4>Dance Choreography</h4>
                  <p>Last modified 3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="action-buttons">
              <button className="action-btn primary">
                <span>🎥</span>
                New Capture Session
              </button>
              <button className="action-btn secondary">
                <span>📊</span>
                View Analytics
              </button>
              <button className="action-btn secondary">
                <span>🛠️</span>
                Motion Tools
              </button>
              <button className="action-btn secondary">
                <span>📁</span>
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;