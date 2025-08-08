import React from 'react';

const MotionTools = () => {
  const tools = [
    {
      id: 1,
      name: 'Motion Capture Calibrator',
      description: 'Calibrate motion capture equipment and sensors',
      icon: '🎯',
      status: 'Available',
      lastUsed: '2 hours ago'
    },
    {
      id: 2,
      name: 'Gait Analysis Engine',
      description: 'Advanced biomechanical gait analysis tools',
      icon: '👣',
      status: 'Running',
      lastUsed: 'Currently active'
    },
    {
      id: 3,
      name: 'Motion Data Processor',
      description: 'Process and clean raw motion capture data',
      icon: '⚙️',
      status: 'Available',
      lastUsed: '1 day ago'
    },
    {
      id: 4,
      name: 'Real-time Tracker',
      description: 'Live motion tracking and visualization',
      icon: '📡',
      status: 'Available',
      lastUsed: '3 hours ago'
    },
    {
      id: 5,
      name: 'Motion Synthesizer',
      description: 'Generate synthetic motion data for training',
      icon: '🔄',
      status: 'Updating',
      lastUsed: '5 days ago'
    },
    {
      id: 6,
      name: 'Performance Analyzer',
      description: 'Analyze and optimize motion performance',
      icon: '📈',
      status: 'Available',
      lastUsed: '6 hours ago'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'status-available';
      case 'Running': return 'status-running';
      case 'Updating': return 'status-updating';
      default: return 'status-default';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Motion Tools</h1>
        <p>Advanced tools for motion capture, analysis, and processing</p>
      </div>

      <div className="tools-grid">
        {tools.map(tool => (
          <div key={tool.id} className="tool-card">
            <div className="tool-header">
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-status">
                <span className={`status-indicator ${getStatusColor(tool.status)}`}>
                  {tool.status}
                </span>
              </div>
            </div>
            
            <div className="tool-content">
              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-description">{tool.description}</p>
              <span className="tool-last-used">Last used: {tool.lastUsed}</span>
            </div>
            
            <div className="tool-actions">
              <button className={`tool-btn ${tool.status === 'Running' ? 'btn-stop' : 'btn-launch'}`}>
                {tool.status === 'Running' ? 'Stop' : 'Launch'}
              </button>
              <button className="tool-btn btn-config">Configure</button>
            </div>
          </div>
        ))}
      </div>

      {/* System Resources */}
      <div className="card system-resources">
        <div className="card-header">
          <h3>System Resources</h3>
        </div>
        <div className="card-content">
          <div className="resource-grid">
            <div className="resource-item">
              <div className="resource-label">CPU Usage</div>
              <div className="resource-bar">
                <div className="resource-fill cpu" style={{width: '68%'}}></div>
              </div>
              <div className="resource-value">68%</div>
            </div>
            <div className="resource-item">
              <div className="resource-label">GPU Usage</div>
              <div className="resource-bar">
                <div className="resource-fill gpu" style={{width: '45%'}}></div>
              </div>
              <div className="resource-value">45%</div>
            </div>
            <div className="resource-item">
              <div className="resource-label">Memory</div>
              <div className="resource-bar">
                <div className="resource-fill memory" style={{width: '82%'}}></div>
              </div>
              <div className="resource-value">82%</div>
            </div>
            <div className="resource-item">
              <div className="resource-label">Storage</div>
              <div className="resource-bar">
                <div className="resource-fill storage" style={{width: '34%'}}></div>
              </div>
              <div className="resource-value">34%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionTools;