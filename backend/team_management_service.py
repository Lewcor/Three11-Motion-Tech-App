from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid
import secrets
from models import *
from ai_service import AIService
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter()

class TeamManagementService:
    def __init__(self):
        self.ai_service = AIService()
    
    async def create_team(self, request: CreateTeamRequest) -> Team:
        """Create a new team workspace"""
        try:
            # Generate unique team ID and workspace slug
            team_id = str(uuid.uuid4())
            workspace_slug = self._generate_workspace_slug(request.team_name)
            
            # Create team
            team = Team(
                id=team_id,
                name=request.team_name,
                description=request.description,
                workspace_slug=workspace_slug,
                owner_id=request.owner_id,
                plan_type=request.plan_type,
                settings=TeamSettings(
                    allow_external_sharing=request.settings.get("allow_external_sharing", False),
                    require_approval_for_publishing=request.settings.get("require_approval_for_publishing", True),
                    enable_brand_compliance=request.settings.get("enable_brand_compliance", True),
                    default_content_visibility=request.settings.get("default_content_visibility", "team"),
                    max_team_members=request.settings.get("max_team_members", 10)
                )
            )
            
            # Create default admin role for team owner
            admin_role = TeamRole(
                id=str(uuid.uuid4()),
                team_id=team_id,
                name="Admin",
                description="Full access to team workspace",
                permissions=self._get_admin_permissions(),
                is_default=False,
                is_system_role=True
            )
            
            # Create default member role
            member_role = TeamRole(
                id=str(uuid.uuid4()),
                team_id=team_id,
                name="Member",
                description="Standard team member access",
                permissions=self._get_member_permissions(),
                is_default=True,
                is_system_role=True
            )
            
            # Add owner as first team member with admin role
            owner_member = TeamMember(
                id=str(uuid.uuid4()),
                team_id=team_id,
                user_id=request.owner_id,
                role_id=admin_role.id,
                status="active",
                joined_at=datetime.utcnow(),
                invited_by=request.owner_id
            )
            
            # In a real app, save to database with multi-tenant collections
            # await database[f"team_{team_id}"].teams.insert_one(team.dict())
            # await database[f"team_{team_id}"].roles.insert_many([admin_role.dict(), member_role.dict()])
            # await database[f"team_{team_id}"].members.insert_one(owner_member.dict())
            
            return team
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating team: {str(e)}")
    
    async def invite_team_member(self, request: InviteTeamMemberRequest) -> TeamInvitation:
        """Invite a new member to the team"""
        try:
            # Generate invitation token and expiry
            invitation_token = secrets.token_urlsafe(32)
            expires_at = datetime.utcnow() + timedelta(days=7)
            
            # Create invitation
            invitation = TeamInvitation(
                id=str(uuid.uuid4()),
                team_id=request.team_id,
                email=request.email,
                role_id=request.role_id,
                invited_by=request.invited_by,
                invitation_token=invitation_token,
                expires_at=expires_at,
                message=request.message
            )
            
            # Send invitation email (mock implementation)
            await self._send_invitation_email(invitation, request.team_name)
            
            # In a real app, save to database
            # await database[f"team_{request.team_id}"].invitations.insert_one(invitation.dict())
            
            return invitation
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error sending invitation: {str(e)}")
    
    async def accept_invitation(self, token: str, user_id: str) -> TeamMember:
        """Accept a team invitation"""
        try:
            # In a real app, find invitation by token
            # invitation = await database.invitations.find_one({"invitation_token": token, "status": "pending"})
            
            # Mock invitation lookup
            invitation = TeamInvitation(
                id=str(uuid.uuid4()),
                team_id="team_123",
                email="user@example.com",
                role_id="role_456",
                invited_by="admin_user",
                invitation_token=token,
                expires_at=datetime.utcnow() + timedelta(hours=1),
                status="pending"
            )
            
            if not invitation or invitation.expires_at < datetime.utcnow():
                raise HTTPException(status_code=400, detail="Invalid or expired invitation")
            
            # Create team member
            member = TeamMember(
                id=str(uuid.uuid4()),
                team_id=invitation.team_id,
                user_id=user_id,
                role_id=invitation.role_id,
                status="active",
                joined_at=datetime.utcnow(),
                invited_by=invitation.invited_by
            )
            
            # Update invitation status
            invitation.status = "accepted"
            invitation.accepted_at = datetime.utcnow()
            
            # In a real app, save to database
            # await database[f"team_{invitation.team_id}"].members.insert_one(member.dict())
            # await database[f"team_{invitation.team_id}"].invitations.update_one(
            #     {"id": invitation.id}, {"$set": invitation.dict()}
            # )
            
            return member
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error accepting invitation: {str(e)}")
    
    async def get_team_members(self, team_id: str, user_id: str) -> List[TeamMemberWithUser]:
        """Get all team members with user details"""
        try:
            # Check if user has permission to view team members
            if not await self._has_permission(user_id, team_id, "view_team_members"):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            # Mock team members data
            members = [
                TeamMemberWithUser(
                    id=str(uuid.uuid4()),
                    team_id=team_id,
                    user_id="user_1",
                    role_id="admin_role",
                    status="active",
                    joined_at=datetime.utcnow() - timedelta(days=30),
                    user_details=UserDetails(
                        id="user_1",
                        email="admin@example.com",
                        full_name="Team Admin",
                        avatar_url=None,
                        last_active=datetime.utcnow() - timedelta(hours=2)
                    ),
                    role_details=RoleDetails(
                        id="admin_role",
                        name="Admin",
                        color="#FF6B6B"
                    )
                ),
                TeamMemberWithUser(
                    id=str(uuid.uuid4()),
                    team_id=team_id,
                    user_id="user_2",
                    role_id="member_role",
                    status="active",
                    joined_at=datetime.utcnow() - timedelta(days=15),
                    user_details=UserDetails(
                        id="user_2",
                        email="member@example.com",
                        full_name="Team Member",
                        avatar_url=None,
                        last_active=datetime.utcnow() - timedelta(hours=1)
                    ),
                    role_details=RoleDetails(
                        id="member_role",
                        name="Content Creator",
                        color="#4ECDC4"
                    )
                )
            ]
            
            return members
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting team members: {str(e)}")
    
    async def update_member_role(self, request: UpdateMemberRoleRequest) -> TeamMember:
        """Update a team member's role"""
        try:
            # Check if user has permission to manage team members
            if not await self._has_permission(request.updated_by, request.team_id, "manage_team_members"):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            # Prevent removing admin role from team owner
            team_owner = await self._get_team_owner(request.team_id)
            if request.member_id == team_owner.user_id and request.new_role_id != team_owner.role_id:
                raise HTTPException(status_code=400, detail="Cannot change team owner's role")
            
            # Update member role
            updated_member = TeamMember(
                id=request.member_id,
                team_id=request.team_id,
                user_id="user_id",  # Would fetch from database
                role_id=request.new_role_id,
                status="active",
                joined_at=datetime.utcnow() - timedelta(days=10),
                role_updated_at=datetime.utcnow(),
                role_updated_by=request.updated_by
            )
            
            # Log role change
            await self._log_team_activity(
                team_id=request.team_id,
                user_id=request.updated_by,
                action="member_role_updated",
                details={
                    "member_id": request.member_id,
                    "new_role_id": request.new_role_id,
                    "reason": request.reason
                }
            )
            
            return updated_member
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating member role: {str(e)}")
    
    async def remove_team_member(self, team_id: str, member_id: str, removed_by: str, reason: Optional[str] = None) -> Dict[str, Any]:
        """Remove a member from the team"""
        try:
            # Check if user has permission to manage team members
            if not await self._has_permission(removed_by, team_id, "manage_team_members"):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            # Prevent removing team owner
            team_owner = await self._get_team_owner(team_id)
            if member_id == team_owner.user_id:
                raise HTTPException(status_code=400, detail="Cannot remove team owner")
            
            # Update member status to removed
            removal_time = datetime.utcnow()
            
            # Log member removal
            await self._log_team_activity(
                team_id=team_id,
                user_id=removed_by,
                action="member_removed",
                details={
                    "member_id": member_id,
                    "reason": reason,
                    "removed_at": removal_time.isoformat()
                }
            )
            
            # In a real app, update database
            # await database[f"team_{team_id}"].members.update_one(
            #     {"id": member_id},
            #     {"$set": {"status": "removed", "removed_at": removal_time, "removed_by": removed_by}}
            # )
            
            return {
                "success": True,
                "message": "Team member removed successfully",
                "removed_at": removal_time
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error removing team member: {str(e)}")
    
    async def get_team_activity(self, team_id: str, user_id: str, limit: int = 50) -> List[TeamActivity]:
        """Get team activity feed"""
        try:
            # Check if user has permission to view team activity
            if not await self._has_permission(user_id, team_id, "view_team_activity"):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            # Mock activity data
            activities = [
                TeamActivity(
                    id=str(uuid.uuid4()),
                    team_id=team_id,
                    user_id="user_1",
                    action="content_created",
                    entity_type="content",
                    entity_id=str(uuid.uuid4()),
                    details={
                        "content_type": "caption",
                        "title": "New Instagram caption for fashion brand",
                        "category": "fashion"
                    },
                    created_at=datetime.utcnow() - timedelta(minutes=30)
                ),
                TeamActivity(
                    id=str(uuid.uuid4()),
                    team_id=team_id,
                    user_id="user_2",
                    action="member_joined",
                    entity_type="member",
                    entity_id=str(uuid.uuid4()),
                    details={
                        "member_email": "newuser@example.com",
                        "role": "Content Creator"
                    },
                    created_at=datetime.utcnow() - timedelta(hours=2)
                ),
                TeamActivity(
                    id=str(uuid.uuid4()),
                    team_id=team_id,
                    user_id="user_1",
                    action="workflow_approved",
                    entity_type="workflow",
                    entity_id=str(uuid.uuid4()),
                    details={
                        "content_title": "TikTok video script",
                        "approved_by": "Team Lead",
                        "workflow_stage": "final_approval"
                    },
                    created_at=datetime.utcnow() - timedelta(hours=4)
                )
            ]
            
            return activities[:limit]
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting team activity: {str(e)}")
    
    async def get_team_dashboard(self, team_id: str, user_id: str) -> TeamDashboardData:
        """Get comprehensive team dashboard data"""
        try:
            # Check if user has access to team
            if not await self._has_permission(user_id, team_id, "view_team_dashboard"):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            # Gather dashboard data
            members = await self.get_team_members(team_id, user_id)
            activities = await self.get_team_activity(team_id, user_id, limit=10)
            
            # Mock additional dashboard data
            dashboard_data = TeamDashboardData(
                team_id=team_id,
                team_summary=TeamSummary(
                    total_members=len(members),
                    active_members=len([m for m in members if m.status == "active"]),
                    pending_invitations=2,
                    total_content_pieces=156,
                    content_in_review=8,
                    published_this_month=42
                ),
                recent_activities=activities,
                team_performance=TeamPerformance(
                    avg_approval_time_hours=4.2,
                    content_approval_rate=94.5,
                    team_productivity_score=87.3,
                    collaboration_index=92.1
                ),
                active_workflows=[
                    WorkflowSummary(
                        id=str(uuid.uuid4()),
                        name="Instagram Content Review",
                        items_pending=3,
                        avg_completion_time=2.5
                    ),
                    WorkflowSummary(
                        id=str(uuid.uuid4()),
                        name="Brand Compliance Check",
                        items_pending=1,
                        avg_completion_time=1.2
                    )
                ],
                team_insights=[
                    "Team productivity increased 15% this month",
                    "Average content approval time improved by 2.3 hours",
                    "Brand compliance rate is 98.5% - excellent work!",
                    "3 new team members onboarded successfully"
                ]
            )
            
            return dashboard_data
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting team dashboard: {str(e)}")
    
    # Helper methods
    def _generate_workspace_slug(self, team_name: str) -> str:
        """Generate unique workspace slug from team name"""
        import re
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', team_name.lower()).strip('-')
        return f"{slug}-{secrets.token_hex(4)}"
    
    def _get_admin_permissions(self) -> List[str]:
        """Get all admin permissions"""
        return [
            "manage_team_members", "manage_team_settings", "create_roles", "manage_workflows",
            "view_all_content", "approve_content", "publish_content", "manage_brand_assets",
            "view_analytics", "manage_integrations", "view_team_activity", "view_team_dashboard"
        ]
    
    def _get_member_permissions(self) -> List[str]:
        """Get default member permissions"""
        return [
            "create_content", "edit_own_content", "view_team_content", "comment_on_content",
            "submit_for_approval", "view_team_members", "view_team_dashboard"
        ]
    
    async def _has_permission(self, user_id: str, team_id: str, permission: str) -> bool:
        """Check if user has specific permission in team"""
        # In a real app, this would check user's role permissions
        return True  # Mock implementation
    
    async def _get_team_owner(self, team_id: str) -> TeamMember:
        """Get team owner"""
        # Mock team owner
        return TeamMember(
            id=str(uuid.uuid4()),
            team_id=team_id,
            user_id="owner_user_id",
            role_id="admin_role",
            status="active",
            joined_at=datetime.utcnow() - timedelta(days=30)
        )
    
    async def _send_invitation_email(self, invitation: TeamInvitation, team_name: str):
        """Send invitation email (mock implementation)"""
        print(f"📧 Sending invitation email to {invitation.email} for team {team_name}")
        print(f"🔗 Invitation link: /accept-invitation/{invitation.invitation_token}")
    
    async def _log_team_activity(self, team_id: str, user_id: str, action: str, details: Dict[str, Any]):
        """Log team activity"""
        activity = TeamActivity(
            id=str(uuid.uuid4()),
            team_id=team_id,
            user_id=user_id,
            action=action,
            entity_type="team",
            entity_id=team_id,
            details=details,
            created_at=datetime.utcnow()
        )
        # In a real app, save to database
        print(f"📝 Logged activity: {action} by {user_id} in team {team_id}")

# Create service instance
team_management_service = TeamManagementService()

# API Endpoints
@router.post("/create", response_model=Team)
async def create_team_endpoint(request: CreateTeamRequest):
    """Create a new team workspace"""
    return await team_management_service.create_team(request)

@router.post("/invite", response_model=TeamInvitation)
async def invite_member_endpoint(request: InviteTeamMemberRequest):
    """Invite a new team member"""
    return await team_management_service.invite_team_member(request)

@router.post("/accept-invitation/{token}")
async def accept_invitation_endpoint(token: str, user_id: str):
    """Accept a team invitation"""
    return await team_management_service.accept_invitation(token, user_id)

@router.get("/members/{team_id}")
async def get_team_members_endpoint(team_id: str, user_id: str):
    """Get all team members"""
    return await team_management_service.get_team_members(team_id, user_id)

@router.put("/members/role")
async def update_member_role_endpoint(request: UpdateMemberRoleRequest):
    """Update team member role"""
    return await team_management_service.update_member_role(request)

@router.delete("/members/{team_id}/{member_id}")
async def remove_member_endpoint(team_id: str, member_id: str, removed_by: str, reason: Optional[str] = None):
    """Remove team member"""
    return await team_management_service.remove_team_member(team_id, member_id, removed_by, reason)

@router.get("/activity/{team_id}")
async def get_team_activity_endpoint(team_id: str, user_id: str, limit: int = 50):
    """Get team activity feed"""
    return await team_management_service.get_team_activity(team_id, user_id, limit)

@router.get("/dashboard/{team_id}")
async def get_team_dashboard_endpoint(team_id: str, user_id: str):
    """Get team dashboard data"""
    return await team_management_service.get_team_dashboard(team_id, user_id)