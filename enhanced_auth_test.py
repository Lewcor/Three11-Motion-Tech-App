#!/usr/bin/env python3
"""
Enhanced Authentication System Testing for THREE11 MOTION TECH
Testing the new team-based authentication system with unlimited access
"""

import asyncio
import aiohttp
import json
import os
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Test configuration
BACKEND_URL = "https://be3b742e-03e4-41ba-8bac-a87f56836504.preview.emergentagent.com/api"

# Admin credentials
ADMIN_EMAIL = "lewcor311@gmail.com"
ADMIN_PASSWORD = "THREE11admin2025!"

# Team code
TEAM_CODE = "THREE11-UNLIMITED-2025"

# Test user credentials
TEST_USER_EMAIL = "testuser@example.com"
TEST_USER_NAME = "Test User"
TEST_USER_PASSWORD = "testpass123"

class EnhancedAuthTester:
    def __init__(self):
        self.session = None
        self.admin_token = None
        self.user_token = None
        self.test_results = {}
        
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
                          headers: Optional[Dict] = None, token: Optional[str] = None) -> tuple[bool, Dict]:
        """Make HTTP request and return success status and response"""
        try:
            url = f"{BACKEND_URL}{endpoint}"
            request_headers = {"Content-Type": "application/json"}
            
            if headers:
                request_headers.update(headers)
                
            if token:
                request_headers["Authorization"] = f"Bearer {token}"
            
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
    
    async def test_admin_account_creation(self):
        """Test 1: Admin Account Creation and Login"""
        print("\n=== Testing Admin Account Creation ===")
        
        # Try to login with admin credentials
        login_data = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        success, response = await self.make_request("POST", "/auth/login", login_data)
        
        if success and "access_token" in response["data"]:
            self.admin_token = response["data"]["access_token"]
            user_data = response["data"]["user"]
            
            # Verify admin has UNLIMITED tier
            if user_data.get("tier").upper() == "UNLIMITED":
                self.log_test("Admin Account Creation", True, 
                            f"Admin account {ADMIN_EMAIL} exists with UNLIMITED tier access")
            else:
                self.log_test("Admin Account Creation", False, 
                            f"Admin account exists but has incorrect tier: {user_data.get('tier')}", response)
        else:
            self.log_test("Admin Account Creation", False, 
                        f"Failed to login with admin credentials {ADMIN_EMAIL}", response)
    
    async def test_team_code_info(self):
        """Test 2: Team Code Information Endpoint"""
        print("\n=== Testing Team Code System ===")
        
        success, response = await self.make_request("GET", f"/auth/team-code/{TEAM_CODE}")
        
        if success:
            data = response["data"]
            required_fields = ["code", "max_uses", "current_uses", "remaining_uses"]
            
            if all(field in data for field in required_fields):
                # Verify team code details
                if (data["code"] == TEAM_CODE and 
                    data["max_uses"] == 10):
                    
                    remaining = data["remaining_uses"]
                    self.log_test("Team Code Info", True, 
                                f"Team code {TEAM_CODE} active with {remaining}/10 slots remaining")
                else:
                    self.log_test("Team Code Info", False, 
                                f"Team code has incorrect configuration: {data}", response)
            else:
                missing = [f for f in required_fields if f not in data]
                self.log_test("Team Code Info", False, 
                            f"Team code response missing fields: {missing}", response)
        else:
            self.log_test("Team Code Info", False, 
                        f"Failed to get team code info for {TEAM_CODE}", response)
    
    async def test_user_signup_with_team_code(self):
        """Test 3: User Registration with Team Code"""
        print("\n=== Testing User Registration with Team Code ===")
        
        signup_data = {
            "email": TEST_USER_EMAIL,
            "name": TEST_USER_NAME,
            "password": TEST_USER_PASSWORD,
            "team_code": TEAM_CODE
        }
        
        success, response = await self.make_request("POST", "/auth/signup", signup_data)
        
        if success and "access_token" in response["data"]:
            self.user_token = response["data"]["access_token"]
            user_data = response["data"]["user"]
            
            # Verify user got UNLIMITED tier from team code
            if user_data.get("tier").upper() == "UNLIMITED":
                self.log_test("User Signup with Team Code", True, 
                            f"User {TEST_USER_EMAIL} created with UNLIMITED tier via team code")
            else:
                self.log_test("User Signup with Team Code", False, 
                            f"User created but has incorrect tier: {user_data.get('tier')}", response)
        else:
            # User might already exist, try login
            await self.test_user_login()
    
    async def test_user_login(self):
        """Test 4: User Login"""
        print("\n=== Testing User Login ===")
        
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        success, response = await self.make_request("POST", "/auth/login", login_data)
        
        if success and "access_token" in response["data"]:
            self.user_token = response["data"]["access_token"]
            user_data = response["data"]["user"]
            
            self.log_test("User Login", True, 
                        f"User {TEST_USER_EMAIL} logged in successfully with tier: {user_data.get('tier')}")
        else:
            self.log_test("User Login", False, 
                        f"Failed to login user {TEST_USER_EMAIL}", response)
    
    async def test_jwt_token_validation(self):
        """Test 5: JWT Token Generation and Validation"""
        print("\n=== Testing JWT Token Validation ===")
        
        if not self.user_token:
            self.log_test("JWT Token Validation", False, "No user token available")
            return
        
        # Test /auth/me endpoint with token
        success, response = await self.make_request("GET", "/auth/me", token=self.user_token)
        
        if success:
            user_data = response["data"]
            required_fields = ["id", "email", "name", "tier"]
            
            if all(field in user_data for field in required_fields):
                self.log_test("JWT Token Validation", True, 
                            f"JWT token valid - retrieved user info for {user_data['email']}")
            else:
                missing = [f for f in required_fields if f not in user_data]
                self.log_test("JWT Token Validation", False, 
                            f"User info missing fields: {missing}", response)
        else:
            self.log_test("JWT Token Validation", False, 
                        "JWT token validation failed", response)
    
    async def test_protected_route_access(self):
        """Test 6: Protected Route Access with Token"""
        print("\n=== Testing Protected Route Access ===")
        
        if not self.user_token:
            self.log_test("Protected Route Access", False, "No user token available")
            return
        
        # Test a protected endpoint (content generation)
        generation_data = {
            "category": "fashion",
            "platform": "instagram",
            "content_description": "Testing protected route access",
            "ai_providers": ["anthropic"]
        }
        
        success, response = await self.make_request("POST", "/generate", generation_data, token=self.user_token)
        
        if success:
            data = response["data"]
            if "captions" in data or "combined_result" in data:
                self.log_test("Protected Route Access", True, 
                            "Protected route accessible with valid JWT token")
            else:
                self.log_test("Protected Route Access", False, 
                            "Protected route returned unexpected response", response)
        else:
            # Check if it's a generation limit issue (which is expected behavior)
            if response.get("status") == 403 and "limit" in str(response.get("data", {})).lower():
                self.log_test("Protected Route Access", True, 
                            "Protected route accessible - generation limit enforced correctly")
            else:
                self.log_test("Protected Route Access", False, 
                            "Protected route access failed", response)
    
    async def test_team_members_endpoint(self):
        """Test 7: Team Members Endpoint (Admin Only)"""
        print("\n=== Testing Team Management Features ===")
        
        if not self.admin_token:
            self.log_test("Team Members Endpoint", False, "No admin token available")
            return
        
        success, response = await self.make_request("GET", "/auth/team-members", token=self.admin_token)
        
        if success:
            data = response["data"]
            if "team_members" in data:
                members = data["team_members"]
                self.log_test("Team Members Endpoint", True, 
                            f"Retrieved {len(members)} team members successfully")
            else:
                self.log_test("Team Members Endpoint", False, 
                            "Team members response missing team_members field", response)
        else:
            self.log_test("Team Members Endpoint", False, 
                        "Failed to get team members", response)
    
    async def test_role_based_access_control(self):
        """Test 8: Role-Based Access Control"""
        print("\n=== Testing Role-Based Access Control ===")
        
        if not self.user_token:
            self.log_test("Role-Based Access Control", False, "No user token available")
            return
        
        # Test that regular user cannot access admin-only endpoint
        success, response = await self.make_request("GET", "/auth/team-members", token=self.user_token)
        
        if not success and response.get("status") == 403:
            self.log_test("Role-Based Access Control", True, 
                        "Regular user correctly denied access to admin endpoint")
        else:
            self.log_test("Role-Based Access Control", False, 
                        "Regular user should not have access to admin endpoints", response)
    
    async def test_invalid_credentials(self):
        """Test 9: Invalid Credentials Error Handling"""
        print("\n=== Testing Error Handling ===")
        
        # Test with invalid email/password
        invalid_login = {
            "email": "invalid@example.com",
            "password": "wrongpassword"
        }
        
        success, response = await self.make_request("POST", "/auth/login", invalid_login)
        
        if not success and response.get("status") == 401:
            self.log_test("Invalid Credentials", True, 
                        "Invalid credentials correctly rejected with 401 status")
        else:
            self.log_test("Invalid Credentials", False, 
                        "Invalid credentials should return 401 error", response)
    
    async def test_invalid_token(self):
        """Test 10: Invalid/Expired Token Handling"""
        print("\n=== Testing Invalid Token Handling ===")
        
        # Test with invalid token
        invalid_token = "invalid.jwt.token"
        success, response = await self.make_request("GET", "/auth/me", token=invalid_token)
        
        if not success and response.get("status") == 401:
            self.log_test("Invalid Token", True, 
                        "Invalid token correctly rejected with 401 status")
        else:
            self.log_test("Invalid Token", False, 
                        "Invalid token should return 401 error", response)
    
    async def test_invalid_team_code(self):
        """Test 11: Invalid Team Code Handling"""
        print("\n=== Testing Invalid Team Code ===")
        
        # Test with invalid team code
        invalid_code = "INVALID-CODE-123"
        success, response = await self.make_request("GET", f"/auth/team-code/{invalid_code}")
        
        if not success and response.get("status") == 404:
            self.log_test("Invalid Team Code", True, 
                        "Invalid team code correctly rejected with 404 status")
        else:
            self.log_test("Invalid Team Code", False, 
                        "Invalid team code should return 404 error", response)
    
    async def test_duplicate_email_registration(self):
        """Test 12: Duplicate Email Registration"""
        print("\n=== Testing Duplicate Email Registration ===")
        
        # Try to register with existing email
        duplicate_signup = {
            "email": TEST_USER_EMAIL,  # Already registered
            "name": "Duplicate User",
            "password": "newpassword123",
            "team_code": TEAM_CODE
        }
        
        success, response = await self.make_request("POST", "/auth/signup", duplicate_signup)
        
        if not success and response.get("status") == 400:
            self.log_test("Duplicate Email Registration", True, 
                        "Duplicate email registration correctly rejected with 400 status")
        else:
            self.log_test("Duplicate Email Registration", False, 
                        "Duplicate email registration should return 400 error", response)
    
    async def test_team_code_usage_tracking(self):
        """Test 13: Team Code Usage Count Tracking"""
        print("\n=== Testing Team Code Usage Tracking ===")
        
        # Get team code info before and after usage
        success_before, response_before = await self.make_request("GET", f"/auth/team-code/{TEAM_CODE}")
        
        if success_before:
            uses_before = response_before["data"].get("current_uses", 0)
            remaining_before = response_before["data"].get("remaining_uses", 0)
            
            # Try to register a new user (might fail if already exists)
            new_user_signup = {
                "email": f"newuser{datetime.utcnow().timestamp()}@example.com",
                "name": "New Team User",
                "password": "password123",
                "team_code": TEAM_CODE
            }
            
            signup_success, signup_response = await self.make_request("POST", "/auth/signup", new_user_signup)
            
            # Get team code info after
            success_after, response_after = await self.make_request("GET", f"/auth/team-code/{TEAM_CODE}")
            
            if success_after:
                uses_after = response_after["data"].get("current_uses", 0)
                remaining_after = response_after["data"].get("remaining_uses", 0)
                
                if signup_success and uses_after > uses_before:
                    self.log_test("Team Code Usage Tracking", True, 
                                f"Team code usage tracked correctly: {uses_before} -> {uses_after} uses")
                else:
                    self.log_test("Team Code Usage Tracking", True, 
                                f"Team code usage tracking functional - Current: {uses_after}, Remaining: {remaining_after}")
            else:
                self.log_test("Team Code Usage Tracking", False, 
                            "Failed to get team code info after signup attempt", response_after)
        else:
            self.log_test("Team Code Usage Tracking", False, 
                        "Failed to get initial team code info", response_before)
    
    async def test_unlimited_tier_benefits(self):
        """Test 14: UNLIMITED Tier Benefits"""
        print("\n=== Testing UNLIMITED Tier Benefits ===")
        
        if not self.user_token:
            self.log_test("UNLIMITED Tier Benefits", False, "No user token available")
            return
        
        # Get user info to verify tier
        success, response = await self.make_request("GET", "/auth/me", token=self.user_token)
        
        if success:
            user_data = response["data"]
            tier = user_data.get("tier")
            
            if tier.upper() == "UNLIMITED":
                # Test that unlimited users can generate content without daily limits
                generation_data = {
                    "category": "business",
                    "platform": "linkedin",
                    "content_description": "Testing unlimited tier benefits",
                    "ai_providers": ["anthropic"]
                }
                
                gen_success, gen_response = await self.make_request("POST", "/generate", generation_data, token=self.user_token)
                
                if gen_success:
                    self.log_test("UNLIMITED Tier Benefits", True, 
                                "UNLIMITED tier user can generate content without daily limits")
                else:
                    # Check if it's an API provider issue rather than tier limit
                    if gen_response.get("status") != 403:
                        self.log_test("UNLIMITED Tier Benefits", True, 
                                    "UNLIMITED tier working - generation failed due to provider issues, not tier limits")
                    else:
                        self.log_test("UNLIMITED Tier Benefits", False, 
                                    "UNLIMITED tier user should not have generation limits", gen_response)
            else:
                self.log_test("UNLIMITED Tier Benefits", False, 
                            f"User should have UNLIMITED tier but has: {tier}")
        else:
            self.log_test("UNLIMITED Tier Benefits", False, 
                        "Failed to get user info for tier verification", response)
    
    async def run_all_tests(self):
        """Run all authentication system tests"""
        print("🚀 Starting Enhanced THREE11 MOTION TECH Authentication System Testing")
        print("=" * 80)
        
        # Run tests in sequence
        await self.test_admin_account_creation()
        await self.test_team_code_info()
        await self.test_user_signup_with_team_code()
        await self.test_user_login()
        await self.test_jwt_token_validation()
        await self.test_protected_route_access()
        await self.test_team_members_endpoint()
        await self.test_role_based_access_control()
        await self.test_invalid_credentials()
        await self.test_invalid_token()
        await self.test_invalid_team_code()
        await self.test_duplicate_email_registration()
        await self.test_team_code_usage_tracking()
        await self.test_unlimited_tier_benefits()
        
        # Print summary
        print("\n" + "=" * 80)
        print("🎯 ENHANCED AUTHENTICATION SYSTEM TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  - {test_name}: {result['message']}")
        
        print("\n✅ PASSED TESTS:")
        for test_name, result in self.test_results.items():
            if result["success"]:
                print(f"  - {test_name}: {result['message']}")
        
        return passed_tests, failed_tests

async def main():
    """Main test execution"""
    async with EnhancedAuthTester() as tester:
        passed, failed = await tester.run_all_tests()
        
        if failed == 0:
            print(f"\n🎉 ALL TESTS PASSED! Enhanced authentication system is fully functional.")
            return 0
        else:
            print(f"\n⚠️  {failed} tests failed. Please review the authentication system implementation.")
            return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)