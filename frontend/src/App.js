import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Import page components
import Dashboard from "./components/pages/Dashboard";
import MotionAnalytics from "./components/pages/MotionAnalytics";
import Projects from "./components/pages/Projects";
import MotionTools from "./components/pages/MotionTools";
import CaptureStudio from "./components/pages/CaptureStudio";

// Placeholder components for remaining pages
const AssetLibrary = () => (
  <div className="page-container">
    <div className="page-header">
      <h1>Asset Library</h1>
      <p>Motion capture assets and animation library</p>
    </div>
    <div className="coming-soon">
      <div className="coming-soon-icon">📚</div>
      <h3>Asset Library Coming Soon</h3>
      <p>Manage your motion capture assets, animations, and resources</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="page-container">
    <div className="page-header">
      <h1>Settings</h1>
      <p>Application settings and configuration</p>
    </div>
    <div className="settings-sections">
      <div className="card">
        <div className="card-header">
          <h3>System Preferences</h3>
        </div>
        <div className="card-content">
          <div className="setting-row">
            <label>Theme</label>
            <select>
              <option>Dark Mode</option>
              <option>Light Mode</option>
              <option>Auto</option>
            </select>
          </div>
          <div className="setting-row">
            <label>Language</label>
            <select>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Motion Capture Settings</h3>
        </div>
        <div className="card-content">
          <div className="setting-row">
            <label>Default Frame Rate</label>
            <select>
              <option>30 FPS</option>
              <option>60 FPS</option>
              <option>120 FPS</option>
            </select>
          </div>
          <div className="setting-row">
            <label>Auto-Save</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => (
  <div className="page-container">
    <div className="page-header">
      <h1>User Profile</h1>
      <p>Manage your account and preferences</p>
    </div>
    <div className="profile-sections">
      <div className="card">
        <div className="card-header">
          <h3>Profile Information</h3>
        </div>
        <div className="card-content">
          <div className="profile-avatar">
            <div className="avatar-placeholder">👤</div>
            <button className="avatar-upload">Change Photo</button>
          </div>
          <div className="profile-form">
            <div className="form-row">
              <label>Full Name</label>
              <input type="text" defaultValue="Motion Tech User" />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input type="email" defaultValue="user@three11motiontech.com" />
            </div>
            <div className="form-row">
              <label>Role</label>
              <select defaultValue="analyst">
                <option value="analyst">Motion Analyst</option>
                <option value="technician">Capture Technician</option>
                <option value="researcher">Researcher</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/motion-analytics" element={<MotionAnalytics />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/motion-tools" element={<MotionTools />} />
            <Route path="/capture" element={<CaptureStudio />} />
            <Route path="/library" element={<AssetLibrary />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;