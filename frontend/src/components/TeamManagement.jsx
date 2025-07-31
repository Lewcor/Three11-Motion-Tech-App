import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Shield, 
  Crown,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Copy,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamRoles, setTeamRoles] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: '',
    message: ''
  });
  const [createTeamForm, setCreateTeamForm] = useState({
    name: '',
    description: '',
    plan: 'starter'
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockData = {
      members: [
        {
          id: 'member_1',
          user_details: {
            id: 'user_1',
            email: 'sarah.johnson@example.com',
            full_name: 'Sarah Johnson',
            avatar_url: null,
            last_active: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          },
          role_details: {
            id: 'admin_role',
            name: 'Team Owner',
            color: '#FF6B6B'
          },
          status: 'active',
          joined_at: new Date('2024-01-15')
        },
        {
          id: 'member_2',
          user_details: {
            id: 'user_2',
            email: 'emma.wilson@example.com',
            full_name: 'Emma Wilson',
            avatar_url: null,
            last_active: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
          },
          role_details: {
            id: 'creator_role',
            name: 'Content Creator',
            color: '#4ECDC4'
          },
          status: 'active',
          joined_at: new Date('2024-02-01')
        },
        {
          id: 'member_3',
          user_details: {
            id: 'user_3',
            email: 'mike.chen@example.com',
            full_name: 'Mike Chen',
            avatar_url: null,
            last_active: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
          },
          role_details: {
            id: 'reviewer_role',
            name: 'Content Reviewer',
            color: '#45B7D1'
          },
          status: 'active',
          joined_at: new Date('2024-02-10')
        }
      ],
      roles: [
        {
          id: 'admin_role',
          name: 'Team Owner',
          description: 'Full access to team workspace',
          color: '#FF6B6B',
          permissions: ['manage_team', 'create_content', 'approve_content', 'manage_roles'],
          member_count: 1,
          is_system_role: true
        },
        {
          id: 'creator_role',
          name: 'Content Creator',
          description: 'Create and manage content',
          color: '#4ECDC4',
          permissions: ['create_content', 'edit_own_content', 'view_team_content'],
          member_count: 5,
          is_system_role: false
        },
        {
          id: 'reviewer_role',
          name: 'Content Reviewer',
          description: 'Review and approve content',
          color: '#45B7D1',
          permissions: ['view_team_content', 'approve_content', 'comment_on_content'],
          member_count: 3,
          is_system_role: false
        }
      ],
      invitations: [
        {
          id: 'inv_1',
          email: 'alex.kim@example.com',
          role_name: 'Content Creator',
          invited_by: 'Sarah Johnson',
          created_at: new Date('2024-06-01'),
          expires_at: new Date('2024-06-08'),
          status: 'pending'
        },
        {
          id: 'inv_2',
          email: 'lisa.rodriguez@example.com',
          role_name: 'Content Reviewer',
          invited_by: 'Sarah Johnson',
          created_at: new Date('2024-06-02'),
          expires_at: new Date('2024-06-09'),
          status: 'pending'
        }
      ]
    };

    setTimeout(() => {
      setTeamMembers(mockData.members);
      setTeamRoles(mockData.roles);
      setPendingInvitations(mockData.invitations);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInviteMember = async (e) => {
    e.preventDefault();
    // In real app, this would call the API
    console.log('Inviting member:', inviteForm);
    
    // Mock success
    const newInvitation = {
      id: `inv_${Date.now()}`,
      email: inviteForm.email,
      role_name: teamRoles.find(r => r.id === inviteForm.role)?.name || 'Member',
      invited_by: 'Current User',
      created_at: new Date(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending'
    };
    
    setPendingInvitations(prev => [...prev, newInvitation]);
    setInviteForm({ email: '', role: '', message: '' });
    setShowInviteDialog(false);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    // In real app, this would call the API
    console.log('Creating team:', createTeamForm);
    setShowCreateTeamDialog(false);
  };

  const getLastActiveText = (lastActive) => {
    const now = new Date();
    const diff = now - lastActive;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getRoleIcon = (roleName) => {
    if (roleName.toLowerCase().includes('owner') || roleName.toLowerCase().includes('admin')) {
      return <Crown className="h-4 w-4" />;
    }
    if (roleName.toLowerCase().includes('reviewer')) {
      return <Shield className="h-4 w-4" />;
    }
    return <Users className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="text-gray-600">Manage your team members, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Set up a new team workspace for collaboration
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    value={createTeamForm.name}
                    onChange={(e) => setCreateTeamForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Fashion Content Team"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="team-description">Description</Label>
                  <Textarea
                    id="team-description"
                    value={createTeamForm.description}
                    onChange={(e) => setCreateTeamForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your team's purpose"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="team-plan">Plan</Label>
                  <Select value={createTeamForm.plan} onValueChange={(value) => setCreateTeamForm(prev => ({ ...prev, plan: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter (Free)</SelectItem>
                      <SelectItem value="professional">Professional ($29/month)</SelectItem>
                      <SelectItem value="enterprise">Enterprise ($99/month)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">Create Team</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateTeamDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your team workspace
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInviteMember} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="colleague@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteForm.role} onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamRoles.filter(role => !role.is_system_role).map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: role.color }}
                            />
                            {role.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Join our team to collaborate on amazing content!"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={!inviteForm.email || !inviteForm.role}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members ({teamMembers.length})
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles ({teamRoles.length})
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Invitations ({pendingInvitations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <div className="grid gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.user_details.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{member.user_details.full_name}</h3>
                          <Badge 
                            className="text-white text-xs"
                            style={{ backgroundColor: member.role_details.color }}
                          >
                            <div className="flex items-center gap-1">
                              {getRoleIcon(member.role_details.name)}
                              {member.role_details.name}
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{member.user_details.email}</p>
                        <p className="text-xs text-gray-500">
                          Joined {member.joined_at.toLocaleDateString()} • 
                          Last active {getLastActiveText(member.user_details.last_active)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {member.status === 'active' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm capitalize">{member.status}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: role.color }}
                    />
                    {role.name}
                    {role.is_system_role && (
                      <Badge variant="outline" className="text-xs">System</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Members</span>
                      <span className="font-medium">{role.member_count}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!role.is_system_role && (
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-6">
          <div className="grid gap-4">
            {pendingInvitations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending invitations</h3>
                  <p className="text-gray-600 mb-4">All team invitations have been accepted or expired.</p>
                  <Button onClick={() => setShowInviteDialog(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite New Member
                  </Button>
                </CardContent>
              </Card>
            ) : (
              pendingInvitations.map((invitation) => (
                <Card key={invitation.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{invitation.email}</h3>
                          <p className="text-sm text-gray-600">
                            Invited as <span className="font-medium">{invitation.role_name}</span> by {invitation.invited_by}
                          </p>
                          <p className="text-xs text-gray-500">
                            Sent {invitation.created_at.toLocaleDateString()} • 
                            Expires {invitation.expires_at.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-amber-600 border-amber-600">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;