from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
from models import *
from ai_service import AIService

router = APIRouter()

class RolePermissionService:
    def __init__(self):
        self.ai_service = AIService()
        
        # Define all available permissions in the system
        self.available_permissions = {
            # Team Management
            "manage_team_members": {"name": "Manage Team Members", "category": "team", "description": "Add, remove, and modify team members"},
            "manage_team_settings": {"name": "Manage Team Settings", "category": "team", "description": "Modify team configuration and settings"},
            "view_team_dashboard": {"name": "View Team Dashboard", "category": "team", "description": "Access team dashboard and overview"},
            "view_team_activity": {"name": "View Team Activity", "category": "team", "description": "View team activity feed and logs"},
            "view_team_members": {"name": "View Team Members", "category": "team", "description": "See list of team members"},
            
            # Role Management
            "create_roles": {"name": "Create Roles", "category": "roles", "description": "Create new custom roles"},
            "edit_roles": {"name": "Edit Roles", "category": "roles", "description": "Modify existing roles and permissions"},
            "delete_roles": {"name": "Delete Roles", "category": "roles", "description": "Remove custom roles"},
            "assign_roles": {"name": "Assign Roles", "category": "roles", "description": "Assign roles to team members"},
            
            # Content Management
            "create_content": {"name": "Create Content", "category": "content", "description": "Create new content pieces"},
            "edit_own_content": {"name": "Edit Own Content", "category": "content", "description": "Edit content created by the user"},
            "edit_all_content": {"name": "Edit All Content", "category": "content", "description": "Edit any team content"},
            "delete_own_content": {"name": "Delete Own Content", "category": "content", "description": "Delete own content"},
            "delete_all_content": {"name": "Delete All Content", "category": "content", "description": "Delete any team content"},
            "view_team_content": {"name": "View Team Content", "category": "content", "description": "View all team content"},
            "publish_content": {"name": "Publish Content", "category": "content", "description": "Publish content to social platforms"},
            
            # Workflow Management
            "manage_workflows": {"name": "Manage Workflows", "category": "workflow", "description": "Create and configure approval workflows"},
            "approve_content": {"name": "Approve Content", "category": "workflow", "description": "Approve content in workflows"},
            "reject_content": {"name": "Reject Content", "category": "workflow", "description": "Reject content in workflows"},
            "submit_for_approval": {"name": "Submit for Approval", "category": "workflow", "description": "Submit content for approval"},
            "bypass_approval": {"name": "Bypass Approval", "category": "workflow", "description": "Skip approval process"},
            
            # Collaboration
            "comment_on_content": {"name": "Comment on Content", "category": "collaboration", "description": "Add comments to content"},
            "mention_team_members": {"name": "Mention Team Members", "category": "collaboration", "description": "Mention other team members"},
            "create_discussions": {"name": "Create Discussions", "category": "collaboration", "description": "Start team discussions"},
            
            # Brand Management  
            "manage_brand_assets": {"name": "Manage Brand Assets", "category": "brand", "description": "Upload and manage brand assets"},
            "enforce_brand_guidelines": {"name": "Enforce Brand Guidelines", "category": "brand", "description": "Set and enforce brand compliance"},
            "view_brand_center": {"name": "View Brand Center", "category": "brand", "description": "Access brand guidelines and assets"},
            
            # Analytics & Insights
            "view_analytics": {"name": "View Analytics", "category": "analytics", "description": "Access performance analytics"},
            "view_team_insights": {"name": "View Team Insights", "category": "analytics", "description": "See team performance insights"},
            "export_data": {"name": "Export Data", "category": "analytics", "description": "Export analytics and content data"},
            
            # Integrations
            "manage_integrations": {"name": "Manage Integrations", "category": "integrations", "description": "Configure third-party integrations"},
            "view_integrations": {"name": "View Integrations", "category": "integrations", "description": "See connected integrations"}
        }
    
    async def create_custom_role(self, request: CreateRoleRequest) -> TeamRole:
        """Create a custom role with specific permissions"""
        try:
            # Validate permissions
            invalid_permissions = [p for p in request.permissions if p not in self.available_permissions]
            if invalid_permissions:
                raise HTTPException(status_code=400, detail=f"Invalid permissions: {invalid_permissions}")
            
            # Check if user has permission to create roles
            if not await self._has_permission(request.created_by, request.team_id, "create_roles"):
                raise HTTPException(status_code=403, detail="Insufficient permissions to create roles")
            
            # Create role
            role = TeamRole(
                id=str(uuid.uuid4()),
                team_id=request.team_id,
                name=request.name,
                description=request.description,
                permissions=request.permissions,
                color=request.color,
                is_default=request.is_default,
                is_system_role=False,
                created_by=request.created_by
            )
            
            # If this is set as default, update other roles
            if request.is_default:
                await self._update_default_role(request.team_id, role.id)
            
            # In a real app, save to database
            # await database[f"team_{request.team_id}"].roles.insert_one(role.dict())
            
            return role
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating role: {str(e)}")
    
    async def update_role(self, role_id: str, request: UpdateRoleRequest) -> TeamRole:
        """Update an existing role"""
        try:
            # Check if user has permission to edit roles
            if not await self._has_permission(request.updated_by, request.team_id, "edit_roles"):
                raise HTTPException(status_code=403, detail="Insufficient permissions to edit roles")
            
            # Validate permissions
            if request.permissions:
                invalid_permissions = [p for p in request.permissions if p not in self.available_permissions]
                if invalid_permissions:
                    raise HTTPException(status_code=400, detail=f"Invalid permissions: {invalid_permissions}")
            
            # Get existing role (mock)
            existing_role = TeamRole(
                id=role_id,
                team_id=request.team_id,
                name="Existing Role",
                description="Existing description",
                permissions=["create_content", "view_team_content"],
                color="#4ECDC4",
                is_default=False,
                is_system_role=False
            )
            
            # Prevent editing system roles
            if existing_role.is_system_role:
                raise HTTPException(status_code=400, detail="Cannot edit system roles")
            
            # Update role fields
            if request.name:
                existing_role.name = request.name
            if request.description:
                existing_role.description = request.description
            if request.permissions:
                existing_role.permissions = request.permissions
            if request.color:
                existing_role.color = request.color
            if request.is_default is not None:
                existing_role.is_default = request.is_default
                if request.is_default:
                    await self._update_default_role(request.team_id, role_id)
            
            existing_role.updated_at = datetime.utcnow()
            existing_role.updated_by = request.updated_by
            
            # In a real app, update in database
            # await database[f"team_{request.team_id}"].roles.update_one(
            #     {"id": role_id}, {"$set": existing_role.dict()}
            # )
            
            return existing_role
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating role: {str(e)}")
    
    async def delete_role(self, role_id: str, team_id: str, deleted_by: str) -> Dict[str, Any]:
        """Delete a custom role"""
        try:
            # Check if user has permission to delete roles
            if not await self._has_permission(deleted_by, team_id, "delete_roles"):
                raise HTTPException(status_code=403, detail="Insufficient permissions to delete roles")
            
            # Get role to check if it's a system role
            role = await self._get_role(role_id, team_id)
            if role.is_system_role:
                raise HTTPException(status_code=400, detail="Cannot delete system roles")
            
            # Check if role is assigned to any members
            members_with_role = await self._get_members_with_role(role_id, team_id)
            if members_with_role:
                raise HTTPException(status_code=400, detail=f"Cannot delete role. {len(members_with_role)} members are assigned this role")
            
            # Delete role
            deleted_at = datetime.utcnow()
            
            # In a real app, delete from database
            # await database[f"team_{team_id}"].roles.delete_one({"id": role_id})
            
            return {
                "success": True,
                "message": "Role deleted successfully",
                "deleted_at": deleted_at
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting role: {str(e)}")
    
    async def get_team_roles(self, team_id: str, user_id: str) -> List[TeamRole]:
        """Get all roles for a team"""
        try:
            # Check if user has permission to view roles
            if not await self._has_permission(user_id, team_id, "view_team_members"):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            # Mock team roles
            roles = [
                TeamRole(
                    id="admin_role",
                    team_id=team_id,
                    name="Admin",
                    description="Full access to team workspace",
                    permissions=self._get_admin_permissions(),
                    color="#FF6B6B",
                    is_default=False,
                    is_system_role=True,
                    created_at=datetime.utcnow() - timedelta(days=30)
                ),
                TeamRole(
                    id="content_creator_role",
                    team_id=team_id,
                    name="Content Creator",
                    description="Create and manage content",
                    permissions=[
                        "create_content", "edit_own_content", "view_team_content",
                        "comment_on_content", "submit_for_approval"
                    ],
                    color="#4ECDC4",
                    is_default=True,
                    is_system_role=False,
                    created_at=datetime.utcnow() - timedelta(days=25)
                ),
                TeamRole(
                    id="reviewer_role",
                    team_id=team_id,
                    name="Content Reviewer",
                    description="Review and approve content",
                    permissions=[
                        "view_team_content", "comment_on_content", "approve_content",
                        "reject_content", "create_content", "edit_own_content"
                    ],
                    color="#45B7D1",
                    is_default=False,
                    is_system_role=False,
                    created_at=datetime.utcnow() - timedelta(days=20)
                ),
                TeamRole(
                    id="viewer_role",
                    team_id=team_id,
                    name="Viewer",
                    description="View-only access to team content",
                    permissions=[
                        "view_team_content", "view_team_members", "comment_on_content"
                    ],
                    color="#95A5A6",
                    is_default=False,
                    is_system_role=False,
                    created_at=datetime.utcnow() - timedelta(days=15)
                )
            ]
            
            return roles
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting team roles: {str(e)}")
    
    async def get_available_permissions(self) -> Dict[str, Dict[str, Any]]:
        """Get all available permissions in the system"""
        return self.available_permissions
    
    async def get_permission_suggestions(self, role_type: str, content_focus: str) -> List[str]:
        """Get AI-powered permission suggestions for role creation"""
        try:
            suggestions_prompt = f"""
            Suggest appropriate permissions for a team role with these characteristics:
            Role Type: {role_type}
            Content Focus: {content_focus}
            
            Available permissions: {list(self.available_permissions.keys())}
            
            Provide a list of recommended permissions that make sense for this role.
            """
            
            # Get AI suggestions (simplified)
            if role_type.lower() == "content_creator":
                return [
                    "create_content", "edit_own_content", "view_team_content",
                    "comment_on_content", "submit_for_approval", "view_brand_center"
                ]
            elif role_type.lower() == "reviewer":
                return [
                    "view_team_content", "comment_on_content", "approve_content",
                    "reject_content", "edit_all_content", "enforce_brand_guidelines"
                ]
            elif role_type.lower() == "manager":
                return [
                    "view_team_content", "edit_all_content", "approve_content",
                    "manage_workflows", "view_analytics", "assign_roles", "manage_brand_assets"
                ]
            else:
                return [
                    "create_content", "edit_own_content", "view_team_content", "comment_on_content"
                ]
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting permission suggestions: {str(e)}")
    
    async def check_user_permissions(self, user_id: str, team_id: str, permissions: List[str]) -> Dict[str, bool]:
        """Check if user has specific permissions"""
        try:
            # Get user's role and permissions
            user_permissions = await self._get_user_permissions(user_id, team_id)
            
            # Check each permission
            permission_results = {}
            for permission in permissions:
                permission_results[permission] = permission in user_permissions
            
            return permission_results
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error checking permissions: {str(e)}")
    
    async def get_role_analytics(self, team_id: str, user_id: str) -> RoleAnalytics:
        """Get analytics about role usage and effectiveness"""
        try:
            # Check if user has permission to view analytics
            if not await self._has_permission(user_id, team_id, "view_team_insights"):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            # Mock role analytics
            analytics = RoleAnalytics(
                team_id=team_id,
                total_roles=4,
                custom_roles=2,
                role_distribution={
                    "Content Creator": 8,
                    "Content Reviewer": 3,
                    "Admin": 2,
                    "Viewer": 1
                },
                permission_usage={
                    "create_content": 90.5,
                    "view_team_content": 100.0,
                    "approve_content": 35.7,
                    "manage_team_members": 14.3,
                    "edit_all_content": 21.4
                },
                role_effectiveness={
                    "Content Creator": {
                        "productivity_score": 87.2,
                        "collaboration_score": 92.1,
                        "compliance_score": 94.8
                    },
                    "Content Reviewer": {
                        "productivity_score": 78.5,
                        "collaboration_score": 88.9,
                        "compliance_score": 97.2
                    }
                },
                recommendations=[
                    "Consider creating a 'Senior Creator' role for experienced team members",
                    "Review 'edit_all_content' permission usage - may be underutilized",
                    "Brand compliance is excellent across all roles",
                    "Content Creator role shows high productivity and collaboration"
                ]
            )
            
            return analytics
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting role analytics: {str(e)}")
    
    # Helper methods
    def _get_admin_permissions(self) -> List[str]:
        """Get all admin permissions"""
        return list(self.available_permissions.keys())
    
    async def _has_permission(self, user_id: str, team_id: str, permission: str) -> bool:
        """Check if user has specific permission"""
        # Mock implementation - in real app, check user's role permissions
        return True
    
    async def _get_role(self, role_id: str, team_id: str) -> TeamRole:
        """Get role by ID"""
        # Mock role
        return TeamRole(
            id=role_id,
            team_id=team_id,
            name="Mock Role",
            description="Mock role for testing",
            permissions=["create_content"],
            is_system_role=False
        )
    
    async def _get_members_with_role(self, role_id: str, team_id: str) -> List[str]:
        """Get members assigned to a specific role"""
        # Mock - return empty list for testing
        return []
    
    async def _update_default_role(self, team_id: str, new_default_role_id: str):
        """Update default role for team"""
        # In real app, update all other roles to not be default
        pass
    
    async def _get_user_permissions(self, user_id: str, team_id: str) -> List[str]:
        """Get all permissions for a user based on their role"""
        # Mock - return admin permissions for testing
        return self._get_admin_permissions()

# Create service instance
role_permission_service = RolePermissionService()

# API Endpoints
@router.post("/roles/create", response_model=TeamRole)
async def create_role_endpoint(request: CreateRoleRequest):
    """Create a new custom role"""
    return await role_permission_service.create_custom_role(request)

@router.put("/roles/{role_id}", response_model=TeamRole)
async def update_role_endpoint(role_id: str, request: UpdateRoleRequest):
    """Update an existing role"""
    return await role_permission_service.update_role(role_id, request)

@router.delete("/roles/{role_id}")
async def delete_role_endpoint(role_id: str, team_id: str, deleted_by: str):
    """Delete a custom role"""
    return await role_permission_service.delete_role(role_id, team_id, deleted_by)

@router.get("/roles/{team_id}")
async def get_team_roles_endpoint(team_id: str, user_id: str):
    """Get all roles for a team"""
    return await role_permission_service.get_team_roles(team_id, user_id)

@router.get("/permissions")
async def get_available_permissions_endpoint():
    """Get all available permissions"""
    return await role_permission_service.get_available_permissions()

@router.get("/permissions/suggestions")
async def get_permission_suggestions_endpoint(role_type: str, content_focus: str = "general"):
    """Get AI-powered permission suggestions"""
    return await role_permission_service.get_permission_suggestions(role_type, content_focus)

@router.post("/permissions/check")
async def check_user_permissions_endpoint(user_id: str, team_id: str, permissions: List[str]):
    """Check if user has specific permissions"""
    return await role_permission_service.check_user_permissions(user_id, team_id, permissions)

@router.get("/analytics/{team_id}")
async def get_role_analytics_endpoint(team_id: str, user_id: str):
    """Get role analytics and insights"""
    return await role_permission_service.get_role_analytics(team_id, user_id)