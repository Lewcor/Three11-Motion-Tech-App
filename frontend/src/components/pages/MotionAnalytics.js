import React from 'react';

const MotionAnalytics = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Motion Analytics</h1>
        <p>Comprehensive motion data analysis and insights</p>
      </div>

      <div className="analytics-dashboard">
        {/* Performance Metrics */}
        <div className="card metrics-card">
          <div className="card-header">
            <h3>Performance Metrics</h3>
          </div>
          <div className="card-content">
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-value">2,847</div>
                <div className="metric-label">Total Captures</div>
                <div className="metric-change positive">+12.3%</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">156ms</div>
                <div className="metric-label">Avg Processing Time</div>
                <div className="metric-change negative">-5.2%</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">99.2%</div>
                <div className="metric-label">Accuracy Rate</div>
                <div className="metric-change positive">+0.8%</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">847GB</div>
                <div className="metric-label">Data Processed</div>
                <div className="metric-change positive">+23.1%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Motion Data Overview */}
        <div className="card data-overview">
          <div className="card-header">
            <h3>Motion Data Overview</h3>
            <div className="header-controls">
              <select className="time-filter">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
          <div className="card-content">
            <div className="chart-placeholder">
              <div className="chart-icon">📈</div>
              <p>Motion tracking data visualization would appear here</p>
              <p className="chart-subtitle">Real-time motion analysis charts and graphs</p>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="card active-sessions">
          <div className="card-header">
            <h3>Active Sessions</h3>
          </div>
          <div className="card-content">
            <div className="session-list">
              <div className="session-item">
                <div className="session-status active"></div>
                <div className="session-info">
                  <h4>Motion Capture Studio A</h4>
                  <p>Recording: Athletic Performance Analysis</p>
                  <span className="session-duration">Duration: 00:45:23</span>
                </div>
              </div>
              <div className="session-item">
                <div className="session-status processing"></div>
                <div className="session-info">
                  <h4>Analysis Engine</h4>
                  <p>Processing: Dance Sequence #127</p>
                  <span className="session-duration">Progress: 78%</span>
                </div>
              </div>
              <div className="session-item">
                <div className="session-status standby"></div>
                <div className="session-info">
                  <h4>Motion Capture Studio B</h4>
                  <p>Status: Ready for new session</p>
                  <span className="session-duration">Standby mode</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analysis */}
        <div className="card recent-analysis">
          <div className="card-header">
            <h3>Recent Analysis</h3>
          </div>
          <div className="card-content">
            <div className="analysis-list">
              <div className="analysis-item">
                <div className="analysis-type">🏃 Gait Analysis</div>
                <div className="analysis-details">
                  <h4>Runner Biomechanics Study</h4>
                  <p>Completed 2 hours ago</p>
                </div>
                <div className="analysis-score">92%</div>
              </div>
              <div className="analysis-item">
                <div className="analysis-type">🎭 Gesture Recognition</div>
                <div className="analysis-details">
                  <h4>Performance Art Capture</h4>
                  <p>Completed 5 hours ago</p>
                </div>
                <div className="analysis-score">88%</div>
              </div>
              <div className="analysis-item">
                <div className="analysis-type">⚡ Motion Prediction</div>
                <div className="analysis-details">
                  <h4>Athletic Performance Forecast</h4>
                  <p>Completed 1 day ago</p>
                </div>
                <div className="analysis-score">95%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionAnalytics;