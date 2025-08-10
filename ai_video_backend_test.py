#!/usr/bin/env python3
"""
AI Video Studio Backend Testing
THREE11 MOTION TECH - Comprehensive AI Video Generation Testing
"""

import asyncio
import aiohttp
import json
import os
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Test configuration
BACKEND_URL = "https://62026ea1-c285-45e5-8d7d-08217e83b971.preview.emergentagent.com/api"
TEST_USER_EMAIL = "videocreator@three11motion.com"
TEST_USER_NAME = "Video Creator"
TEST_USER_PASSWORD = "VideoPass123!"

class AIVideoTester:
    def __init__(self):
        self.session = None
        self.auth_token = None
        self.user_id = None
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
        
        # Try to login first
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        success, response = await self.make_request("POST", "/auth/login", login_data)
        
        if success and "access_token" in response["data"]:
            self.auth_token = response["data"]["access_token"]
            self.user_id = response["data"]["user"]["id"]
            print(f"✅ Logged in successfully as {TEST_USER_EMAIL}")
            return True
        else:
            # Try to signup if login fails
            signup_data = {
                "email": TEST_USER_EMAIL,
                "name": TEST_USER_NAME,
                "password": TEST_USER_PASSWORD
            }
            
            success, response = await self.make_request("POST", "/auth/signup", signup_data)
            
            if success and "access_token" in response["data"]:
                self.auth_token = response["data"]["access_token"]
                self.user_id = response["data"]["user"]["id"]
                print(f"✅ Signed up successfully as {TEST_USER_EMAIL}")
                return True
            else:
                print(f"❌ Authentication failed: {response}")
                return False
    
    async def test_ai_video_test_endpoint(self):
        """Test 1: AI Video Test Endpoint"""
        success, response = await self.make_request("GET", "/ai-video/test")
        
        if success and "message" in response["data"]:
            self.log_test("AI Video Test Endpoint", True, "Test endpoint is accessible and responding")
        else:
            self.log_test("AI Video Test Endpoint", False, "Test endpoint failed", response)
    
    async def test_ai_video_authentication(self):
        """Test 2: AI Video Authentication Requirements"""
        # Test without authentication
        original_token = self.auth_token
        self.auth_token = None
        
        try:
            video_request = {
                "title": "Test Video",
                "script": "This is a test video script",
                "style": "cinematic",
                "duration": 30,
                "format": "16:9",
                "voice_style": "professional",
                "number_of_scenes": 3
            }
            
            success, response = await self.make_request("POST", "/ai-video/generate", video_request)
            
            if not success and response.get("status") in [401, 403]:
                self.log_test("AI Video Authentication", True, "AI video endpoints properly require authentication")
            else:
                self.log_test("AI Video Authentication", False, "AI video endpoints should require authentication", response)
                
        finally:
            # Restore auth token
            self.auth_token = original_token
    
    async def test_gemini_api_key_availability(self):
        """Test 3: GEMINI_API_KEY Environment Variable"""
        # Check if we can access the AI providers endpoint to see if Gemini is available
        success, response = await self.make_request("GET", "/ai/providers")
        
        if success:
            providers = response["data"].get("providers", [])
            gemini_provider = next((p for p in providers if p.get("provider") == "gemini"), None)
            
            if gemini_provider and gemini_provider.get("available", False):
                self.log_test("GEMINI API Key", True, "GEMINI_API_KEY is loaded and Gemini provider is available")
            else:
                self.log_test("GEMINI API Key", False, f"GEMINI_API_KEY not available. Gemini provider: {gemini_provider}")
        else:
            self.log_test("GEMINI API Key", False, "Could not check AI providers", response)
    
    async def test_ai_video_service_initialization(self):
        """Test 4: AI Video Service Initialization"""
        if not self.auth_token:
            self.log_test("AI Video Service Init", False, "No auth token available")
            return
        
        # Test getting projects (should work even if empty)
        success, response = await self.make_request("GET", "/ai-video/projects")
        
        if success and "projects" in response["data"]:
            self.log_test("AI Video Service Init", True, "AI video service is initialized and accessible")
        else:
            self.log_test("AI Video Service Init", False, "AI video service initialization failed", response)
    
    async def test_ai_video_generation_basic(self):
        """Test 5: Basic AI Video Generation"""
        if not self.auth_token:
            self.log_test("AI Video Generation Basic", False, "No auth token available")
            return
        
        video_request = {
            "title": "Fashion Showcase Video",
            "script": "Discover the latest fashion trends that will make you stand out this season. From elegant evening wear to casual street style, we have everything you need to express your unique personality.",
            "style": "cinematic",
            "duration": 30,
            "format": "16:9",
            "voice_style": "professional",
            "number_of_scenes": 3
        }
        
        success, response = await self.make_request("POST", "/ai-video/generate", video_request)
        
        if success:
            data = response["data"]
            if "success" in data and data["success"] and "video" in data:
                video = data["video"]
                required_fields = ["id", "title", "script", "style", "scenes", "status"]
                
                if all(field in video for field in required_fields):
                    self.log_test("AI Video Generation Basic", True, 
                                f"Video generated successfully with ID: {video['id']}")
                    
                    # Store video ID for further tests
                    self.test_video_id = video["id"]
                    
                    # Check scenes
                    scenes = video.get("scenes", [])
                    if len(scenes) == 3:
                        self.log_test("AI Video Scenes Generation", True, 
                                    f"Generated {len(scenes)} scenes as requested")
                    else:
                        self.log_test("AI Video Scenes Generation", False, 
                                    f"Expected 3 scenes, got {len(scenes)}")
                else:
                    missing = [f for f in required_fields if f not in video]
                    self.log_test("AI Video Generation Basic", False, 
                                f"Video response missing fields: {missing}", response)
            else:
                error_msg = data.get("error", "Unknown error")
                self.log_test("AI Video Generation Basic", False, 
                            f"Video generation failed: {error_msg}", response)
        else:
            self.log_test("AI Video Generation Basic", False, "Video generation request failed", response)
    
    async def test_ai_video_generation_different_styles(self):
        """Test 6: AI Video Generation with Different Styles"""
        if not self.auth_token:
            self.log_test("AI Video Different Styles", False, "No auth token available")
            return
        
        styles_to_test = ["modern", "vibrant", "minimal", "artistic"]
        successful_styles = 0
        
        for style in styles_to_test:
            video_request = {
                "title": f"Test Video - {style.title()} Style",
                "script": f"This is a test video showcasing the {style} visual style with professional quality.",
                "style": style,
                "duration": 15,
                "format": "9:16",
                "voice_style": "casual",
                "number_of_scenes": 2
            }
            
            success, response = await self.make_request("POST", "/ai-video/generate", video_request)
            
            if success and response["data"].get("success"):
                successful_styles += 1
                self.log_test(f"AI Video Style ({style})", True, f"{style.title()} style video generated successfully")
            else:
                error_msg = response["data"].get("error", "Unknown error") if success else response.get("error", "Request failed")
                self.log_test(f"AI Video Style ({style})", False, f"{style.title()} style failed: {error_msg}")
        
        # Overall test result
        if successful_styles >= 2:  # At least half should work
            self.log_test("AI Video Different Styles", True, f"{successful_styles}/4 styles working")
        else:
            self.log_test("AI Video Different Styles", False, f"Only {successful_styles}/4 styles working")
    
    async def test_ai_video_generation_different_formats(self):
        """Test 7: AI Video Generation with Different Formats"""
        if not self.auth_token:
            self.log_test("AI Video Different Formats", False, "No auth token available")
            return
        
        formats_to_test = ["9:16", "16:9", "1:1"]
        successful_formats = 0
        
        for format_type in formats_to_test:
            video_request = {
                "title": f"Test Video - {format_type} Format",
                "script": f"This is a test video in {format_type} format for optimal viewing experience.",
                "style": "modern",
                "duration": 20,
                "format": format_type,
                "voice_style": "professional",
                "number_of_scenes": 2
            }
            
            success, response = await self.make_request("POST", "/ai-video/generate", video_request)
            
            if success and response["data"].get("success"):
                successful_formats += 1
                video = response["data"]["video"]
                if video.get("format") == format_type:
                    self.log_test(f"AI Video Format ({format_type})", True, f"{format_type} format video generated correctly")
                else:
                    self.log_test(f"AI Video Format ({format_type})", False, f"Format mismatch: expected {format_type}, got {video.get('format')}")
            else:
                error_msg = response["data"].get("error", "Unknown error") if success else response.get("error", "Request failed")
                self.log_test(f"AI Video Format ({format_type})", False, f"{format_type} format failed: {error_msg}")
        
        # Overall test result
        if successful_formats == 3:
            self.log_test("AI Video Different Formats", True, "All 3 video formats working")
        else:
            self.log_test("AI Video Different Formats", False, f"Only {successful_formats}/3 formats working")
    
    async def test_ai_video_projects_retrieval(self):
        """Test 8: AI Video Projects Retrieval"""
        if not self.auth_token:
            self.log_test("AI Video Projects Retrieval", False, "No auth token available")
            return
        
        success, response = await self.make_request("GET", "/ai-video/projects")
        
        if success:
            data = response["data"]
            if "success" in data and data["success"] and "projects" in data:
                projects = data["projects"]
                self.log_test("AI Video Projects Retrieval", True, 
                            f"Retrieved {len(projects)} video projects successfully")
                
                # Check if we have any projects from previous tests
                if projects:
                    project = projects[0]
                    required_fields = ["id", "title", "script", "style", "status", "created_at"]
                    if all(field in project for field in required_fields):
                        self.log_test("AI Video Project Structure", True, "Project structure is correct")
                    else:
                        missing = [f for f in required_fields if f not in project]
                        self.log_test("AI Video Project Structure", False, f"Project missing fields: {missing}")
            else:
                self.log_test("AI Video Projects Retrieval", False, "Invalid projects response", response)
        else:
            self.log_test("AI Video Projects Retrieval", False, "Failed to retrieve projects", response)
    
    async def test_ai_video_specific_retrieval(self):
        """Test 9: Specific AI Video Retrieval"""
        if not self.auth_token:
            self.log_test("AI Video Specific Retrieval", False, "No auth token available")
            return
        
        # First get projects to find a video ID
        success, response = await self.make_request("GET", "/ai-video/projects")
        
        if success and response["data"].get("projects"):
            video_id = response["data"]["projects"][0]["id"]
            
            # Test getting specific video
            success, response = await self.make_request("GET", f"/ai-video/{video_id}")
            
            if success:
                data = response["data"]
                if "success" in data and data["success"] and "video" in data:
                    video = data["video"]
                    if video["id"] == video_id:
                        self.log_test("AI Video Specific Retrieval", True, 
                                    f"Successfully retrieved specific video: {video_id}")
                    else:
                        self.log_test("AI Video Specific Retrieval", False, "Video ID mismatch")
                else:
                    self.log_test("AI Video Specific Retrieval", False, "Invalid video response", response)
            else:
                self.log_test("AI Video Specific Retrieval", False, "Failed to retrieve specific video", response)
        else:
            self.log_test("AI Video Specific Retrieval", False, "No videos available for testing")
    
    async def test_ai_video_preview_endpoint(self):
        """Test 10: AI Video Preview Endpoint"""
        if not self.auth_token:
            self.log_test("AI Video Preview", False, "No auth token available")
            return
        
        # First get projects to find a video ID
        success, response = await self.make_request("GET", "/ai-video/projects")
        
        if success and response["data"].get("projects"):
            video_id = response["data"]["projects"][0]["id"]
            
            # Test preview endpoint
            success, response = await self.make_request("GET", f"/ai-video/{video_id}/preview")
            
            if success:
                data = response["data"]
                if "success" in data and data["success"]:
                    required_fields = ["preview_url", "download_url", "video"]
                    if all(field in data for field in required_fields):
                        self.log_test("AI Video Preview", True, "Preview endpoint working correctly")
                    else:
                        missing = [f for f in required_fields if f not in data]
                        self.log_test("AI Video Preview", False, f"Preview response missing fields: {missing}")
                else:
                    self.log_test("AI Video Preview", False, "Preview request unsuccessful", response)
            else:
                self.log_test("AI Video Preview", False, "Preview endpoint failed", response)
        else:
            self.log_test("AI Video Preview", False, "No videos available for preview testing")
    
    async def test_ai_video_generation_limits(self):
        """Test 11: AI Video Generation Limits"""
        if not self.auth_token:
            self.log_test("AI Video Generation Limits", False, "No auth token available")
            return
        
        # Check current user status
        success, user_response = await self.make_request("GET", "/auth/me")
        if not success:
            self.log_test("AI Video Generation Limits", False, "Could not get user info for limit testing")
            return
        
        user_data = user_response["data"]
        daily_used = user_data.get("daily_generations_used", 0)
        tier = user_data.get("tier", "free")
        
        if tier.upper() in ["PREMIUM", "ADMIN", "SUPER_ADMIN", "UNLIMITED"]:
            self.log_test("AI Video Generation Limits", True, "User is premium - AI video generation unlimited")
            return
        
        # Test video generation with limits
        video_request = {
            "title": "Limit Test Video",
            "script": "Testing generation limits",
            "style": "modern",
            "duration": 15,
            "format": "16:9",
            "voice_style": "casual",
            "number_of_scenes": 2
        }
        
        success, response = await self.make_request("POST", "/ai-video/generate", video_request)
        
        if daily_used >= 10:
            # Should be blocked
            if not success and response.get("status") == 403:
                self.log_test("AI Video Generation Limits", True, "AI video generation properly respects daily limits")
            else:
                self.log_test("AI Video Generation Limits", False, "AI video generation should respect daily limits", response)
        else:
            # Should work
            if success:
                self.log_test("AI Video Generation Limits", True, f"AI video generation allowed within limits ({daily_used + 1}/10)")
            else:
                self.log_test("AI Video Generation Limits", False, "AI video generation failed within limits", response)
    
    async def test_ai_video_error_handling(self):
        """Test 12: AI Video Error Handling"""
        if not self.auth_token:
            self.log_test("AI Video Error Handling", False, "No auth token available")
            return
        
        # Test with invalid request data
        invalid_requests = [
            {
                "name": "Missing Title",
                "request": {
                    "script": "Test script",
                    "style": "modern",
                    "duration": 30,
                    "format": "16:9",
                    "voice_style": "professional",
                    "number_of_scenes": 3
                }
            },
            {
                "name": "Invalid Style",
                "request": {
                    "title": "Test Video",
                    "script": "Test script",
                    "style": "invalid_style",
                    "duration": 30,
                    "format": "16:9",
                    "voice_style": "professional",
                    "number_of_scenes": 3
                }
            },
            {
                "name": "Invalid Format",
                "request": {
                    "title": "Test Video",
                    "script": "Test script",
                    "style": "modern",
                    "duration": 30,
                    "format": "invalid_format",
                    "voice_style": "professional",
                    "number_of_scenes": 3
                }
            }
        ]
        
        error_handling_working = 0
        
        for test_case in invalid_requests:
            success, response = await self.make_request("POST", "/ai-video/generate", test_case["request"])
            
            # Should either fail gracefully or handle the error
            if not success or (success and not response["data"].get("success")):
                error_handling_working += 1
                self.log_test(f"AI Video Error ({test_case['name']})", True, "Error handled gracefully")
            else:
                self.log_test(f"AI Video Error ({test_case['name']})", False, "Should handle invalid input", response)
        
        # Overall error handling test
        if error_handling_working >= 2:
            self.log_test("AI Video Error Handling", True, f"{error_handling_working}/3 error cases handled correctly")
        else:
            self.log_test("AI Video Error Handling", False, f"Only {error_handling_working}/3 error cases handled correctly")
    
    async def test_database_connectivity(self):
        """Test 13: Database Connectivity for AI Videos"""
        if not self.auth_token:
            self.log_test("AI Video Database", False, "No auth token available")
            return
        
        # Test database operations through API
        # 1. Create a video (tests insert)
        video_request = {
            "title": "Database Test Video",
            "script": "Testing database connectivity",
            "style": "modern",
            "duration": 15,
            "format": "16:9",
            "voice_style": "professional",
            "number_of_scenes": 2
        }
        
        success, response = await self.make_request("POST", "/ai-video/generate", video_request)
        
        if success and response["data"].get("success"):
            video_id = response["data"]["video"]["id"]
            
            # 2. Retrieve the video (tests find)
            success, response = await self.make_request("GET", f"/ai-video/{video_id}")
            
            if success and response["data"].get("success"):
                # 3. List projects (tests find with query)
                success, response = await self.make_request("GET", "/ai-video/projects")
                
                if success and response["data"].get("success"):
                    self.log_test("AI Video Database", True, "Database connectivity working - CRUD operations successful")
                else:
                    self.log_test("AI Video Database", False, "Database list operation failed", response)
            else:
                self.log_test("AI Video Database", False, "Database retrieve operation failed", response)
        else:
            self.log_test("AI Video Database", False, "Database insert operation failed", response)
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*80)
        print("AI VIDEO STUDIO BACKEND TEST SUMMARY")
        print("="*80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS ({failed_tests}):")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  • {test_name}: {result['message']}")
        
        print(f"\n✅ PASSED TESTS ({passed_tests}):")
        for test_name, result in self.test_results.items():
            if result["success"]:
                print(f"  • {test_name}: {result['message']}")
        
        print("\n" + "="*80)
        
        # Determine overall status
        if passed_tests == total_tests:
            print("🎉 ALL TESTS PASSED - AI Video Studio is fully functional!")
        elif passed_tests >= total_tests * 0.8:
            print("✅ MOSTLY WORKING - AI Video Studio has minor issues")
        elif passed_tests >= total_tests * 0.5:
            print("⚠️  PARTIALLY WORKING - AI Video Studio has significant issues")
        else:
            print("❌ MAJOR ISSUES - AI Video Studio needs significant fixes")

async def main():
    """Run all AI Video Studio backend tests"""
    print("🚀 Starting AI Video Studio Backend Testing...")
    print("="*80)
    
    async with AIVideoTester() as tester:
        # Setup authentication
        if not await tester.setup_authentication():
            print("❌ Authentication setup failed. Cannot proceed with tests.")
            return
        
        print("\n🧪 Running AI Video Studio Tests...")
        print("-"*50)
        
        # Run all tests
        await tester.test_ai_video_test_endpoint()
        await tester.test_ai_video_authentication()
        await tester.test_gemini_api_key_availability()
        await tester.test_ai_video_service_initialization()
        await tester.test_ai_video_generation_basic()
        await tester.test_ai_video_generation_different_styles()
        await tester.test_ai_video_generation_different_formats()
        await tester.test_ai_video_projects_retrieval()
        await tester.test_ai_video_specific_retrieval()
        await tester.test_ai_video_preview_endpoint()
        await tester.test_ai_video_generation_limits()
        await tester.test_ai_video_error_handling()
        await tester.test_database_connectivity()
        
        # Print summary
        tester.print_summary()

if __name__ == "__main__":
    asyncio.run(main())