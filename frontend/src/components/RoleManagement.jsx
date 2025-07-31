import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Crown,
  Settings,
  Eye,
  Lock,
  Unlock,
  Zap,
  Star,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [],
    color: '#4ECDC4'
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockData = {
      roles: [
        {
          id: 'admin_role',
          name: 'Team Owner',
          description: 'Full access to team workspace',
          permissions: [
            'manage_team_members', 'manage_team_settings', 'create_roles', 'manage_workflows',
            'view_all_content', 'approve_content', 'publish_content', 'manage_brand_assets',
            'view_analytics', 'manage_integrations'
          ],
          color: '#FF6B6B',
          member_count: 1,
          is_system_role: true,
          created_at: new Date('2024-01-15')
        },
        {
          id: 'creator_role',
          name: 'Content Creator',
          description: 'Create and manage content',
          permissions: [
            'create_content', 'edit_own_content', 'view_team_content',
            'comment_on_content', 'submit_for_approval', 'view_brand_center'
          ],
          color: '#4ECDC4',
          member_count: 8,
          is_system_role: false,
          created_at: new Date('2024-01-20')
        },
        {
          id: 'reviewer_role',
          name: 'Content Reviewer',
          description: 'Review and approve content',
          permissions: [
            'view_team_content', 'comment_on_content', 'approve_content',
            'reject_content', 'edit_all_content', 'enforce_brand_guidelines'
          ],
          color: '#45B7D1',
          member_count: 3,
          is_system_role: false,
          created_at: new Date('2024-02-01')
        },
        {
          id: 'viewer_role',
          name: 'Viewer',
          description: 'View-only access to team content',
          permissions: [
            'view_team_content', 'view_team_members', 'comment_on_content'
          ],
          color: '#95A5A6',
          member_count: 2,
          is_system_role: false,
          created_at: new Date('2024-02-10')
        }
      ],
      permissions: {
        // Team Management
        'manage_team_members': { name: 'Manage Team Members', category: 'team', description: 'Add, remove, and modify team members' },
        'manage_team_settings': { name: 'Manage Team Settings', category: 'team', description: 'Modify team configuration and settings' },
        'view_team_dashboard': { name: 'View Team Dashboard', category: 'team', description: 'Access team dashboard and overview' },
        'view_team_activity': { name: 'View Team Activity', category: 'team', description: 'View team activity feed and logs' },
        'view_team_members': { name: 'View Team Members', category: 'team', description: 'See list of team members' },
        
        // Role Management
        'create_roles': { name: 'Create Roles', category: 'roles', description: 'Create new custom roles' },
        'edit_roles': { name: 'Edit Roles', category: 'roles', description: 'Modify existing roles and permissions' },
        'delete_roles': { name: 'Delete Roles', category: 'roles', description: 'Remove custom roles' },
        'assign_roles': { name: 'Assign Roles', category: 'roles', description: 'Assign roles to team members' },
        
        // Content Management
        'create_content': { name: 'Create Content', category: 'content', description: 'Create new content pieces' },
        'edit_own_content': { name: 'Edit Own Content', category: 'content', description: 'Edit content created by the user' },
        'edit_all_content': { name: 'Edit All Content', category: 'content', description: 'Edit any team content' },
        'delete_own_content': { name: 'Delete Own Content', category: 'content', description: 'Delete own content' },
        'delete_all_content': { name: 'Delete All Content', category: 'content', description: 'Delete any team content' },
        'view_team_content': { name: 'View Team Content', category: 'content', description: 'View all team content' },
        'publish_content': { name: 'Publish Content', category: 'content', description: 'Publish content to social platforms' },
        
        // Workflow Management
        'manage_workflows': { name: 'Manage Workflows', category: 'workflow', description: 'Create and configure approval workflows' },
        'approve_content': { name: 'Approve Content', category: 'workflow', description: 'Approve content in workflows' },
        'reject_content': { name: 'Reject Content', category: 'workflow', description: 'Reject content in workflows' },
        'submit_for_approval': { name: 'Submit for Approval', category: 'workflow', description: 'Submit content for approval' },
        'bypass_approval': { name: 'Bypass Approval', category: 'workflow', description: 'Skip approval process' },
        
        // Collaboration
        'comment_on_content': { name: 'Comment on Content', category: 'collaboration', description: 'Add comments to content' },
        'mention_team_members': { name: 'Mention Team Members', category: 'collaboration', description: 'Mention other team members' },
        'create_discussions': { name: 'Create Discussions', category: 'collaboration', description: 'Start team discussions' },
        
        // Brand Management  
        'manage_brand_assets': { name: 'Manage Brand Assets', category: 'brand', description: 'Upload and manage brand assets' },
        'enforce_brand_guidelines': { name: 'Enforce Brand Guidelines', category: 'brand', description: 'Set and enforce brand compliance' },
        'view_brand_center': { name: 'View Brand Center', category: 'brand', description: 'Access brand guidelines and assets' },
        
        // Analytics & Insights
        'view_analytics': { name: 'View Analytics', category: 'analytics', description: 'Access performance analytics' },
        'view_team_insights': { name: 'View Team Insights', category: 'analytics', description: 'See team performance insights' },
        'export_data': { name: 'Export Data', category: 'analytics', description: 'Export analytics and content data' },
        
        // Integrations
        'manage_integrations': { name: 'Manage Integrations', category: 'integrations', description: 'Configure third-party integrations' },
        'view_integrations': { name: 'View Integrations', category: 'integrations', description: 'See connected integrations' }
      }
    };

    setTimeout(() => {
      setRoles(mockData.roles);
      setPermissions(mockData.permissions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    
    const newRole = {
      id: `role_${Date.now()}`,
      name: roleForm.name,
      description: roleForm.description,
      permissions: roleForm.permissions,
      color: roleForm.color,
      member_count: 0,
      is_system_role: false,
      created_at: new Date()
    };
    
    setRoles(prev => [...prev, newRole]);
    setRoleForm({ name: '', description: '', permissions: [], color: '#4ECDC4' });
    setShowCreateDialog(false);
  };

  const handleEditRole = async (e) => {
    e.preventDefault();
    
    setRoles(prev => prev.map(role => 
      role.id === selectedRole.id 
        ? { ...role, ...roleForm, updated_at: new Date() }
        : role
    ));
    
    setShowEditDialog(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      setRoles(prev => prev.filter(role => role.id !== roleId));
    }
  };

  const openEditDialog = (role) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      color: role.color
    });
    setShowEditDialog(true);
  };

  const togglePermission = (permissionKey) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  const getPermissionsByCategory = () => {
    const categorized = {};
    Object.entries(permissions).forEach(([key, permission]) => {
      if (!categorized[permission.category]) {
        categorized[permission.category] = [];
      }
      categorized[permission.category].push({ key, ...permission });
    });
    return categorized;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'team': return <Users className="h-4 w-4" />;
      case 'roles': return <Shield className="h-4 w-4" />;
      case 'content': return <Edit className="h-4 w-4" />;
      case 'workflow': return <Zap className="h-4 w-4" />;
      case 'collaboration': return <Users className="h-4 w-4" />;
      case 'brand': return <Star className="h-4 w-4" />;
      case 'analytics': return <Eye className="h-4 w-4" />;
      case 'integrations': return <Settings className="h-4 w-4" />;
      default: return <Lock className="h-4 w-4" />;
    }
  };

  const getRoleIcon = (role) => {
    if (role.is_system_role) return <Crown className="h-4 w-4" />;
    if (role.permissions.includes('approve_content')) return <Shield className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading role management...</p>
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
            Role Management
          </h1>
          <p className="text-gray-600">Define roles and permissions for your team members</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a custom role with specific permissions for your team
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRole} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input
                    id="role-name"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Content Manager"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role-color">Role Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="role-color"
                      type="color"
                      value={roleForm.color}
                      onChange={(e) => setRoleForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <div 
                      className="flex-1 h-10 rounded border flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: roleForm.color }}
                    >
                      Preview
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this role's responsibilities"
                  rows={3}
                />
              </div>
              
              <div>
                <Label className="text-base font-semibold">Permissions</Label>
                <p className="text-sm text-gray-600 mb-4">Select the permissions this role should have</p>
                
                <div className="space-y-6">
                  {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                    <Card key={category}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base capitalize">
                          {getCategoryIcon(category)}
                          {category} Permissions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.key} className="flex items-start space-x-2">
                              <Checkbox
                                id={permission.key}
                                checked={roleForm.permissions.includes(permission.key)}
                                onCheckedChange={() => togglePermission(permission.key)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label 
                                  htmlFor={permission.key}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {permission.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={!roleForm.name || roleForm.permissions.length === 0}>
                  Create Role
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: role.color }}
                  />
                  <span className="flex items-center gap-1">
                    {getRoleIcon(role)}
                    {role.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {role.is_system_role && (
                    <Badge variant="outline" className="text-xs">
                      System
                    </Badge>
                  )}
                  {!role.is_system_role && (
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditDialog(role)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteRole(role.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        disabled={role.member_count > 0}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Members</span>
                  <span className="font-medium">{role.member_count}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Permissions</span>
                    <span className="font-medium">{role.permissions.length}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permissions[permission]?.name?.split(' ')[0] || permission}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Created {role.created_at.toLocaleDateString()}
                </div>
                
                {role.member_count > 0 && !role.is_system_role && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    Cannot delete - has members
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Modify the role's permissions and settings
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRole} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-role-name">Role Name</Label>
                <Input
                  id="edit-role-name"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-role-color">Role Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-role-color"
                    type="color"
                    value={roleForm.color}
                    onChange={(e) => setRoleForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <div 
                    className="flex-1 h-10 rounded border flex items-center justify-center text-white font-medium text-sm"
                    style={{ backgroundColor: roleForm.color }}
                  >
                    Preview
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-role-description">Description</Label>
              <Textarea
                id="edit-role-description"
                value={roleForm.description}
                onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <Label className="text-base font-semibold">Permissions</Label>
              <p className="text-sm text-gray-600 mb-4">Update the permissions for this role</p>
              
              <div className="space-y-6">
                {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base capitalize">
                        {getCategoryIcon(category)}
                        {category} Permissions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.key} className="flex items-start space-x-2">
                            <Checkbox
                              id={`edit-${permission.key}`}
                              checked={roleForm.permissions.includes(permission.key)}
                              onCheckedChange={() => togglePermission(permission.key)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label 
                                htmlFor={`edit-${permission.key}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {permission.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={!roleForm.name || roleForm.permissions.length === 0}>
                Update Role
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;