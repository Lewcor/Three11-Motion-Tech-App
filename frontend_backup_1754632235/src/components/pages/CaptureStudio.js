import React, { useState } from 'react';

const CaptureStudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const handleStartStop = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Capture Studio</h1>
        <p>Professional motion capture studio environment</p>
      </div>

      <div className="studio-layout">
        {/* Main Recording Panel */}
        <div className="card recording-panel">
          <div className="card-header">
            <h3>Recording Controls</h3>
            <div className={`recording-status ${isRecording ? 'recording' : 'standby'}`}>
              <div className="status-dot"></div>
              {isRecording ? 'RECORDING' : 'STANDBY'}
            </div>
          </div>
          <div className="card-content">
            <div className="recording-controls">
              <button 
                className={`record-btn ${isRecording ? 'stop' : 'start'}`}
                onClick={handleStartStop}
              >
                <span className="record-icon">{isRecording ? '⏹️' : '⏺️'}</span>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              
              <div className="recording-info">
                <div className="recording-time">
                  {isRecording ? `Recording: 00:${recordingTime.toString().padStart(2, '0')}:00` : 'Ready to Record'}
                </div>
                <div className="recording-settings">
                  <span>📹 30 FPS • 🎭 Full Body • 📊 High Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Views */}
        <div className="card camera-views">
          <div className="card-header">
            <h3>Camera Views</h3>
            <div className="view-controls">
              <button className="view-btn active">Grid</button>
              <button className="view-btn">Single</button>
              <button className="view-btn">Overhead</button>
            </div>
          </div>
          <div className="card-content">
            <div className="camera-grid">
              <div className="camera-view">
                <div className="camera-feed">
                  <div className="camera-placeholder">
                    <span className="camera-icon">📷</span>
                    <span className="camera-label">Camera 1 - Front</span>
                    <div className="camera-status active">ACTIVE</div>
                  </div>
                </div>
              </div>
              <div className="camera-view">
                <div className="camera-feed">
                  <div className="camera-placeholder">
                    <span className="camera-icon">📷</span>
                    <span className="camera-label">Camera 2 - Side</span>
                    <div className="camera-status active">ACTIVE</div>
                  </div>
                </div>
              </div>
              <div className="camera-view">
                <div className="camera-feed">
                  <div className="camera-placeholder">
                    <span className="camera-icon">📷</span>
                    <span className="camera-label">Camera 3 - Back</span>
                    <div className="camera-status active">ACTIVE</div>
                  </div>
                </div>
              </div>
              <div className="camera-view">
                <div className="camera-feed">
                  <div className="camera-placeholder">
                    <span className="camera-icon">📷</span>
                    <span className="camera-label">Camera 4 - Overhead</span>
                    <div className="camera-status standby">STANDBY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motion Tracking */}
        <div className="card motion-tracking">
          <div className="card-header">
            <h3>Motion Tracking</h3>
          </div>
          <div className="card-content">
            <div className="tracking-visualization">
              <div className="skeleton-view">
                <div className="skeleton-placeholder">
                  <span className="skeleton-icon">🦴</span>
                  <p>3D Skeleton Tracking</p>
                  <div className="tracking-points">
                    <span>32 tracking points detected</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tracking-controls">
              <button className="tracking-btn">Calibrate</button>
              <button className="tracking-btn">Reset Pose</button>
              <button className="tracking-btn">Export Data</button>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="card session-settings">
          <div className="card-header">
            <h3>Session Settings</h3>
          </div>
          <div className="card-content">
            <div className="settings-grid">
              <div className="setting-item">
                <label>Project Name</label>
                <input type="text" placeholder="New Motion Capture Session" />
              </div>
              <div className="setting-item">
                <label>Frame Rate</label>
                <select>
                  <option>30 FPS</option>
                  <option>60 FPS</option>
                  <option>120 FPS</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Quality</label>
                <select>
                  <option>High Quality</option>
                  <option>Medium Quality</option>
                  <option>Low Quality</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Output Format</label>
                <select>
                  <option>BVH</option>
                  <option>FBX</option>
                  <option>CSV</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Captures */}
        <div className="card recent-captures">
          <div className="card-header">
            <h3>Recent Captures</h3>
          </div>
          <div className="card-content">
            <div className="capture-list">
              <div className="capture-item">
                <div className="capture-thumb">🎬</div>
                <div className="capture-info">
                  <h4>Action Sequence Take 5</h4>
                  <span>2.3 MB • 45 seconds</span>
                </div>
                <button className="capture-action">View</button>
              </div>
              <div className="capture-item">
                <div className="capture-thumb">💃</div>
                <div className="capture-info">
                  <h4>Dance Routine Practice</h4>
                  <span>1.8 MB • 32 seconds</span>
                </div>
                <button className="capture-action">View</button>
              </div>
              <div className="capture-item">
                <div className="capture-thumb">🏃</div>
                <div className="capture-info">
                  <h4>Running Gait Analysis</h4>
                  <span>3.1 MB • 60 seconds</span>
                </div>
                <button className="capture-action">View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptureStudio;