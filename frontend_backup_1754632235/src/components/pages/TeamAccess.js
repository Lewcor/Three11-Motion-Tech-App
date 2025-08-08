import React, { useState } from 'react';

const TeamAccess = () => {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'CEO', email: 'ceo@three11motiontech.com', role: 'Chief Executive Officer', status: 'active', accessCode: 'THREE11-CEO-2025', unlimited: true },
    { id: 2, name: 'CO-CEO', email: 'coceo@three11motiontech.com', role: 'Co-Chief Executive Officer', status: 'active', accessCode: 'THREE11-COCEO-2025', unlimited: true },
    { id: 3, name: 'Team Member 1', email: 'team1@three11motiontech.com', role: 'Content Manager', status: 'active', accessCode: 'THREE11-TEAM1-2025', unlimited: true },
    { id: 4, name: 'Team Member 2', email: 'team2@three11motiontech.com', role: 'Marketing Director', status: 'active', accessCode: 'THREE11-TEAM2-2025', unlimited: true },
    { id: 5, name: 'Team Member 3', email: 'team3@three11motiontech.com', role: 'Creative Designer', status: 'pending', accessCode: 'THREE11-TEAM3-2025', unlimited: true },
    { id: 6, name: 'Team Member 4', email: 'team4@three11motiontech.com', role: 'Social Media Strategist', status: 'pending', accessCode: 'THREE11-TEAM4-2025', unlimited: true },
    { id: 7, name: 'Team Member 5', email: 'team5@three11motiontech.com', role: 'Analytics Specialist', status: 'pending', accessCode: 'THREE11-TEAM5-2025', unlimited: true },
    { id: 8, name: 'Team Member 6', email: 'team6@three11motiontech.com', role: 'Content Creator', status: 'pending', accessCode: 'THREE11-TEAM6-2025', unlimited: true },
    { id: 9, name: 'Team Member 7', email: 'team7@three11motiontech.com', role: 'Video Producer', status: 'pending', accessCode: 'THREE11-TEAM7-2025', unlimited: true },
    { id: 10, name: 'Team Member 8', email: 'team8@three11motiontech.com', role: 'Growth Hacker', status: 'pending', accessCode: 'THREE11-TEAM8-2025', unlimited: true },
    { id: 11, name: 'Team Member 9', email: 'team9@three11motiontech.com', role: 'Data Analyst', status: 'pending', accessCode: 'THREE11-TEAM9-2025', unlimited: true },
    { id: 12, name: 'Team Member 10', email: 'team10@three11motiontech.com', role: 'Brand Manager', status: 'pending', accessCode: 'THREE11-TEAM10-2025', unlimited: true }
  ]);

  const [showAddMember, setShowAddMember] = useState(false);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyAccessCode = (accessCode) => {
    navigator.clipboard.writeText(accessCode);
    // Show success message (could add toast here)
  };

  const generateAllCodes = () => {
    const codes = teamMembers.map(member => `${member.name}: ${member.accessCode}`).join('\n');
    navigator.clipboard.writeText(codes);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">👑 Team Access Management</h1>
          <p className="text-xl text-gray-600">Manage unlimited access codes for your leadership team</p>
        </div>

        {/* Executive Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">13</div>
            <div className="text-gray-600">Total Access Codes</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">9</div>
            <div className="text-gray-600">Pending Invites</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
            <div className="text-gray-600">Usage Limit</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <button
              onClick={generateAllCodes}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              📋 Copy All Access Codes
            </button>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              + Add Team Member
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">Value:</span> $377/month in premium access codes
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600">
            <h3 className="text-xl font-bold text-white">Executive Team Access Codes</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(member.status)}`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {member.accessCode}
                        </code>
                        <button
                          onClick={() => copyAccessCode(member.accessCode)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Copy access code"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-green-600 hover:text-green-900">Resend</button>
                        <button className="text-red-600 hover:text-red-900">Revoke</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Access Code Instructions */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">🔑 How to Use Access Codes</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-4">For Team Members:</h4>
              <ol className="space-y-2 text-blue-100">
                <li>1. Visit app.gentag.ai</li>
                <li>2. Click "Enter Access Code"</li>
                <li>3. Paste your unique access code</li>
                <li>4. Enjoy unlimited access to all features</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Features Included:</h4>
              <ul className="space-y-2 text-blue-100">
                <li>✅ All 30+ premium features</li>
                <li>✅ Unlimited caption generation</li>
                <li>✅ Voice Studio access</li>
                <li>✅ Real-time trends analysis</li>
                <li>✅ Team collaboration tools</li>
                <li>✅ Priority AI processing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-bold text-gray-900 mb-4">📊 Usage This Month</h4>
            <div className="text-2xl font-bold text-blue-600 mb-2">2,847</div>
            <div className="text-gray-600">Captions Generated</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-bold text-gray-900 mb-4">🎤 Voice Studio</h4>
            <div className="text-2xl font-bold text-purple-600 mb-2">156</div>
            <div className="text-gray-600">Voice Generations</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-bold text-gray-900 mb-4">📈 Trends Analyzed</h4>
            <div className="text-2xl font-bold text-green-600 mb-2">4,239</div>
            <div className="text-gray-600">Trend Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAccess;