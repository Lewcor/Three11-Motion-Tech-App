import React, { useState } from 'react';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const projects = [
    {
      id: 1,
      name: 'Action Sequence Alpha',
      type: 'Motion Capture',
      status: 'Active',
      progress: 75,
      lastModified: '2 hours ago',
      thumbnail: '🎬',
      description: 'High-intensity action sequences for film production'
    },
    {
      id: 2,
      name: 'Athletic Motion Study',
      type: 'Biomechanics',
      status: 'In Review',
      progress: 100,
      lastModified: '1 day ago',
      thumbnail: '🏃',
      description: 'Comprehensive gait analysis for sports performance'
    },
    {
      id: 3,
      name: 'Dance Choreography',
      type: 'Performance',
      status: 'Active',
      progress: 45,
      lastModified: '3 days ago',
      thumbnail: '💃',
      description: 'Contemporary dance movement capture and analysis'
    },
    {
      id: 4,
      name: 'Rehabilitation Protocol',
      type: 'Medical',
      status: 'Completed',
      progress: 100,
      lastModified: '1 week ago',
      thumbnail: '🏥',
      description: 'Physical therapy motion tracking and progress monitoring'
    },
    {
      id: 5,
      name: 'Virtual Reality Experience',
      type: 'Gaming',
      status: 'Planning',
      progress: 15,
      lastModified: '2 weeks ago',
      thumbnail: '🎮',
      description: 'Immersive VR motion controls and interactions'
    },
    {
      id: 6,
      name: 'Martial Arts Form Analysis',
      type: 'Sports Science',
      status: 'Active',
      progress: 60,
      lastModified: '4 days ago',
      thumbnail: '🥋',
      description: 'Traditional martial arts technique breakdown'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'status-active';
      case 'Completed': return 'status-completed';
      case 'In Review': return 'status-review';
      case 'Planning': return 'status-planning';
      default: return 'status-default';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Projects</h1>
        <p>Manage your motion capture and analysis projects</p>
      </div>

      {/* Controls */}
      <div className="page-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="Motion Capture">Motion Capture</option>
            <option value="Biomechanics">Biomechanics</option>
            <option value="Performance">Performance</option>
            <option value="Medical">Medical</option>
            <option value="Gaming">Gaming</option>
            <option value="Sports Science">Sports Science</option>
          </select>
        </div>
        <button className="btn-primary">
          <span>+</span> New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <div className="project-thumbnail">{project.thumbnail}</div>
              <div className="project-status">
                <span className={`status-badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <div className="project-content">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-type">{project.type}</p>
              <p className="project-description">{project.description}</p>
              
              <div className="project-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{project.progress}%</span>
              </div>
            </div>
            
            <div className="project-footer">
              <span className="last-modified">Modified {project.lastModified}</span>
              <div className="project-actions">
                <button className="action-btn">Edit</button>
                <button className="action-btn">View</button>
                <button className="action-btn">Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No projects found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Projects;