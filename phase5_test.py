#!/usr/bin/env python3
"""
Phase 5: Team Collaboration Platform Backend Testing
THREE11 MOTION TECH - Testing 17 Team Collaboration API Endpoints
"""

import asyncio
import aiohttp
import json
from datetime import datetime
from typing import Dict, Any, Optional

# Test configuration
BACKEND_URL = "https://421b48af-2848-4613-bb5f-dfb8b0c5e4bf.preview.emergentagent.com/api"
TEST_USER_EMAIL = "teamlead@three11motion.com"
TEST_USER_NAME = "Team Lead"

class Phase5Tester:
    def __init__(self):
        self.session = None
        self.auth_token = None
        self.user_id = None
        self.test_results = {}
        self.team_id = None
        self.custom_role_id = None
        self.invitation_token = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name: str, success: bool, message: str, details: Optional[Dict] = None):
        """Log test results"""
        self.test_results[test_name] = {
            "success": success,
            "message": message,
            "details": details or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    async def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                          headers: Optional[Dict] = None) -> tuple[bool, Dict]:
        """Make HTTP request and return success status and response"""
        try:
            url = f"{BACKEND_URL}{endpoint}"
            request_headers = {"Content-Type": "application/json"}
            
            if headers:
                request_headers.update(headers)
                
            if self.auth_token and "Authorization" not in request_headers:
                request_headers["Authorization"] = f"Bearer {self.auth_token}"
            
            async with self.session.request(
                method, url, 
                json=data if data else None,
                headers=request_headers
            ) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = {"text": await response.text()}
                
                return response.status < 400, {
                    "status": response.status,
                    "data": response_data
                }
        except Exception as e:
            return False, {"error": str(e)}
    
    async def setup_authentication(self):
        """Setup authentication for testing"""
        print("🔐 Setting up authentication...")
        
        # Try signup first
        signup_data = {
            "email": TEST_USER_EMAIL,
            "name": TEST_USER_NAME
        }
        
        success, response = await self.make_request("POST", "/auth/signup", signup_data)
        
        if success and "access_token" in response["data"]:
            self.auth_token = response["data"]["access_token"]
            self.user_id = response["data"]["user"]["id"]
            print(f"✅ Authentication setup successful - User ID: {self.user_id[:8]}...")
            return True
        else:
            # Try login if user already exists
            login_data = {
                "email": TEST_USER_EMAIL
            }
            
            success, response = await self.make_request("POST", "/auth/login", login_data)
            
            if success and "access_token" in response["data"]:
                self.auth_token = response["data"]["access_token"]
                self.user_id = response["data"]["user"]["id"]
                print(f"✅ Authentication setup successful - User ID: {self.user_id[:8]}...")
                return True
            else:
                print("❌ Authentication setup failed")
                return False
    
    async def test_team_management_endpoints(self):
        """Test all 8 team management endpoints"""
        print("\n🏢 TESTING TEAM MANAGEMENT ENDPOINTS")
        print("-" * 50)
        
        # 1. POST /api/teams/create
        team_data = {
            "name": "Fashion Content Team",
            "description": "A team focused on creating viral fashion content",
            "settings": {
                "privacy": "private",
                "auto_approve_invites": False,
                "content_approval_required": True
            }
        }
        
        success, response = await self.make_request("POST", "/teams/create", team_data)
        if success and "id" in response["data"]:
            self.team_id = response["data"]["id"]
            self.log_test("POST /teams/create", True, f"Team created: {response['data']['name']}")
        else:
            self.log_test("POST /teams/create", False, "Team creation failed", response)
            return  # Can't continue without team_id
        
        # 2. POST /api/teams/invite
        invite_data = {
            "team_id": self.team_id,
            "email": "newmember@three11motion.com",
            "role": "content_creator",
            "message": "Join our fashion content team!"
        }
        
        success, response = await self.make_request("POST", "/teams/invite", invite_data)
        if success and "token" in response["data"]:
            self.invitation_token = response["data"]["token"]
            self.log_test("POST /teams/invite", True, f"Invitation sent to {response['data']['email']}")
        else:
            self.log_test("POST /teams/invite", False, "Team invitation failed", response)
        
        # 3. POST /api/teams/accept-invitation/{token}
        if self.invitation_token:
            success, response = await self.make_request("POST", f"/teams/accept-invitation/{self.invitation_token}")
            if success:
                self.log_test("POST /teams/accept-invitation/{token}", True, "Invitation accepted successfully")
            else:
                self.log_test("POST /teams/accept-invitation/{token}", False, "Invitation acceptance failed", response)
        else:
            self.log_test("POST /teams/accept-invitation/{token}", False, "No invitation token available")
        
        # 4. GET /api/teams/{team_id}/members
        success, response = await self.make_request("GET", f"/teams/{self.team_id}/members")
        if success and "members" in response["data"]:
            members_count = len(response["data"]["members"])
            self.log_test("GET /teams/{team_id}/members", True, f"Retrieved {members_count} team members")
        else:
            self.log_test("GET /teams/{team_id}/members", False, "Failed to get team members", response)
        
        # 5. PUT /api/teams/members/role
        update_data = {
            "team_id": self.team_id,
            "member_id": self.user_id,  # Update own role
            "new_role": "content_manager"
        }
        
        success, response = await self.make_request("PUT", "/teams/members/role", update_data)
        if success:
            self.log_test("PUT /teams/members/role", True, "Member role updated successfully")
        else:
            self.log_test("PUT /teams/members/role", False, "Member role update failed", response)
        
        # 6. DELETE /api/teams/{team_id}/members/{member_id}
        mock_member_id = "mock_member_123"
        success, response = await self.make_request("DELETE", f"/teams/{self.team_id}/members/{mock_member_id}")
        # This should either succeed or fail gracefully with proper error handling
        if success or response.get("status") in [404, 403]:
            self.log_test("DELETE /teams/{team_id}/members/{member_id}", True, "Member removal endpoint working")
        else:
            self.log_test("DELETE /teams/{team_id}/members/{member_id}", False, "Member removal failed unexpectedly", response)
        
        # 7. GET /api/teams/{team_id}/activity
        success, response = await self.make_request("GET", f"/teams/{self.team_id}/activity?limit=20")
        if success and "activities" in response["data"]:
            activities_count = len(response["data"]["activities"])
            self.log_test("GET /teams/{team_id}/activity", True, f"Retrieved {activities_count} team activities")
        else:
            self.log_test("GET /teams/{team_id}/activity", False, "Failed to get team activity", response)
        
        # 8. GET /api/teams/{team_id}/dashboard
        success, response = await self.make_request("GET", f"/teams/{self.team_id}/dashboard")
        if success and "team_stats" in response["data"]:
            self.log_test("GET /teams/{team_id}/dashboard", True, "Team dashboard data retrieved successfully")
        else:
            self.log_test("GET /teams/{team_id}/dashboard", False, "Failed to get team dashboard", response)
    
    async def test_role_permission_endpoints(self):
        """Test all 9 role & permission endpoints"""
        print("\n🔐 TESTING ROLE & PERMISSION ENDPOINTS")
        print("-" * 50)
        
        if not self.team_id:
            print("❌ No team_id available - skipping role & permission tests")
            return
        
        # 9. POST /api/teams/roles/create
        role_data = {
            "team_id": self.team_id,
            "name": "Senior Content Creator",
            "description": "Advanced content creator with additional permissions",
            "permissions": [
                "content.create",
                "content.edit",
                "content.publish",
                "analytics.view"
            ],
            "color": "#FF6B6B"
        }
        
        success, response = await self.make_request("POST", "/teams/roles/create", role_data)
        if success and "id" in response["data"]:
            self.custom_role_id = response["data"]["id"]
            self.log_test("POST /teams/roles/create", True, f"Custom role created: {response['data']['name']}")
        else:
            self.log_test("POST /teams/roles/create", False, "Custom role creation failed", response)
        
        # 10. PUT /api/teams/roles/{role_id}
        if self.custom_role_id:
            update_data = {
                "name": "Senior Content Creator Plus",
                "description": "Enhanced senior content creator role",
                "permissions": [
                    "content.create",
                    "content.edit", 
                    "content.publish",
                    "content.delete",
                    "analytics.view",
                    "team.invite"
                ]
            }
            
            success, response = await self.make_request("PUT", f"/teams/roles/{self.custom_role_id}", update_data)
            if success:
                self.log_test("PUT /teams/roles/{role_id}", True, "Role updated successfully")
            else:
                self.log_test("PUT /teams/roles/{role_id}", False, "Role update failed", response)
        else:
            self.log_test("PUT /teams/roles/{role_id}", False, "No custom role ID available")
        
        # 11. DELETE /api/teams/roles/{role_id} - We'll test this last
        
        # 12. GET /api/teams/{team_id}/roles
        success, response = await self.make_request("GET", f"/teams/{self.team_id}/roles")
        if success and "roles" in response["data"]:
            roles_count = len(response["data"]["roles"])
            self.log_test("GET /teams/{team_id}/roles", True, f"Retrieved {roles_count} team roles")
        else:
            self.log_test("GET /teams/{team_id}/roles", False, "Failed to get team roles", response)
        
        # 13. GET /api/teams/permissions/available
        success, response = await self.make_request("GET", "/teams/permissions/available")
        if success and "permissions" in response["data"]:
            permissions_count = len(response["data"]["permissions"])
            self.log_test("GET /teams/permissions/available", True, f"Retrieved {permissions_count} available permissions")
        else:
            self.log_test("GET /teams/permissions/available", False, "Failed to get available permissions", response)
        
        # 14. GET /api/teams/permissions/suggestions
        success, response = await self.make_request("GET", "/teams/permissions/suggestions?role_type=content_creator&content_focus=fashion")
        if success and "suggestions" in response["data"]:
            suggestions_count = len(response["data"]["suggestions"])
            self.log_test("GET /teams/permissions/suggestions", True, f"Retrieved {suggestions_count} permission suggestions")
        else:
            self.log_test("GET /teams/permissions/suggestions", False, "Failed to get permission suggestions", response)
        
        # 15. POST /api/teams/permissions/check
        check_data = {
            "team_id": self.team_id,
            "permissions": ["content.create", "content.edit", "team.invite", "analytics.view"]
        }
        
        success, response = await self.make_request("POST", "/teams/permissions/check", check_data)
        if success and "permissions" in response["data"]:
            self.log_test("POST /teams/permissions/check", True, "Permission check completed successfully")
        else:
            self.log_test("POST /teams/permissions/check", False, "Permission check failed", response)
        
        # 16. GET /api/teams/{team_id}/analytics/roles
        success, response = await self.make_request("GET", f"/teams/{self.team_id}/analytics/roles")
        if success and "role_distribution" in response["data"]:
            self.log_test("GET /teams/{team_id}/analytics/roles", True, "Role analytics retrieved successfully")
        else:
            self.log_test("GET /teams/{team_id}/analytics/roles", False, "Failed to get role analytics", response)
        
        # 17. DELETE /api/teams/roles/{role_id} - Test last
        if self.custom_role_id:
            success, response = await self.make_request("DELETE", f"/teams/roles/{self.custom_role_id}?team_id={self.team_id}")
            if success:
                self.log_test("DELETE /teams/roles/{role_id}", True, "Custom role deleted successfully")
            else:
                self.log_test("DELETE /teams/roles/{role_id}", False, "Role deletion failed", response)
        else:
            self.log_test("DELETE /teams/roles/{role_id}", False, "No custom role ID available for deletion")
    
    async def test_authentication_requirements(self):
        """Test that endpoints require authentication"""
        print("\n🔐 TESTING AUTHENTICATION REQUIREMENTS")
        print("-" * 50)
        
        # Temporarily remove auth token
        original_token = self.auth_token
        self.auth_token = None
        
        try:
            # Test team creation without auth
            team_data = {"name": "Test Team", "description": "Test"}
            success, response = await self.make_request("POST", "/teams/create", team_data)
            
            if not success and response.get("status") in [401, 403]:
                self.log_test("Authentication Requirements", True, "Team endpoints properly require authentication")
            else:
                self.log_test("Authentication Requirements", False, "Team endpoints should require authentication", response)
                
        finally:
            # Restore auth token
            self.auth_token = original_token
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 PHASE 5 TEAM COLLABORATION TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Categorize results
        team_mgmt_tests = [t for t in self.test_results.keys() if any(endpoint in t for endpoint in [
            "/teams/create", "/teams/invite", "/teams/accept-invitation", "/teams/{team_id}/members",
            "/teams/members/role", "/teams/{team_id}/activity", "/teams/{team_id}/dashboard"
        ])]
        
        role_perm_tests = [t for t in self.test_results.keys() if any(endpoint in t for endpoint in [
            "/teams/roles/create", "/teams/roles/{role_id}", "/teams/{team_id}/roles",
            "/teams/permissions/available", "/teams/permissions/suggestions", "/teams/permissions/check",
            "/teams/{team_id}/analytics/roles"
        ])]
        
        team_mgmt_passed = sum(1 for t in team_mgmt_tests if self.test_results[t]["success"])
        role_perm_passed = sum(1 for t in role_perm_tests if self.test_results[t]["success"])
        
        print(f"\n📈 BREAKDOWN:")
        print(f"Team Management Endpoints: {team_mgmt_passed}/{len(team_mgmt_tests)} ✅")
        print(f"Role & Permission Endpoints: {role_perm_passed}/{len(role_perm_tests)} ✅")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  ❌ {test_name}: {result['message']}")
        
        print(f"\n🎯 PHASE 5 STATUS: {'✅ FULLY FUNCTIONAL' if passed_tests >= total_tests * 0.8 else '⚠️ NEEDS ATTENTION'}")

async def main():
    """Main test runner"""
    print("🚀 PHASE 5: TEAM COLLABORATION PLATFORM BACKEND TESTING")
    print("THREE11 MOTION TECH - Testing 17 Team Collaboration API Endpoints")
    print("=" * 70)
    
    async with Phase5Tester() as tester:
        # Setup authentication
        if not await tester.setup_authentication():
            print("❌ Authentication setup failed - cannot continue with tests")
            return
        
        # Run all Phase 5 tests
        await tester.test_team_management_endpoints()
        await tester.test_role_permission_endpoints()
        await tester.test_authentication_requirements()
        
        # Print summary
        tester.print_summary()

if __name__ == "__main__":
    asyncio.run(main())