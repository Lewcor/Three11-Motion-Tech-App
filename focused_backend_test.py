#!/usr/bin/env python3
"""
Focused Backend Testing for Perplexity API Key Integration and Core Backend Health
THREE11 MOTION TECH - Testing Agent
"""

import asyncio
import aiohttp
import json
import os
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Test configuration
BACKEND_URL = "https://99f8bfd0-8e38-4a0a-99d8-f0b68f38c63b.preview.emergentagent.com/api"
TEST_USER_EMAIL = "perplexity.tester@three11motion.com"
TEST_USER_NAME = "Perplexity Tester"

class FocusedBackendTester:
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
    
    async def test_backend_health(self):
        """Test 1: Backend Health Check"""
        success, response = await self.make_request("GET", "/")
        
        if success and "THREE11 MOTION TECH" in str(response["data"]):
            self.log_test("Backend Health", True, "Backend is healthy and responding")
        else:
            self.log_test("Backend Health", False, "Backend health check failed", response)
    
    async def test_user_authentication(self):
        """Test 2: User Authentication System"""
        # Try signup first
        signup_data = {
            "email": TEST_USER_EMAIL,
            "name": TEST_USER_NAME
        }
        
        success, response = await self.make_request("POST", "/auth/signup", signup_data)
        
        if success and "access_token" in response["data"]:
            self.auth_token = response["data"]["access_token"]
            self.user_id = response["data"]["user"]["id"]
            self.log_test("User Authentication", True, "User authentication successful")
        else:
            # Try login if signup failed
            login_data = {
                "email": TEST_USER_EMAIL
            }
            
            success, response = await self.make_request("POST", "/auth/login", login_data)
            
            if success and "access_token" in response["data"]:
                self.auth_token = response["data"]["access_token"]
                self.user_id = response["data"]["user"]["id"]
                self.log_test("User Authentication", True, "User login successful")
            else:
                self.log_test("User Authentication", False, "Authentication failed", response)
    
    async def test_perplexity_environment_variable_loading(self):
        """Test 3: Perplexity Environment Variable Loading"""
        try:
            # Test if Perplexity API key is properly loaded from backend .env file
            success, response = await self.make_request("GET", "/ai/providers/perplexity")
            
            if success:
                data = response["data"]
                is_available = data.get("available", False)
                
                if is_available:
                    self.log_test("Perplexity Environment Variable", True, 
                                "✅ Perplexity API key successfully loaded from backend .env file")
                else:
                    self.log_test("Perplexity Environment Variable", False, 
                                "❌ Perplexity API key not loaded - Check PERPLEXITY_API_KEY in backend/.env")
            else:
                self.log_test("Perplexity Environment Variable", False, 
                            "Failed to check Perplexity provider details", response)
                
        except Exception as e:
            self.log_test("Perplexity Environment Variable", False, f"Environment variable test error: {str(e)}")
    
    async def test_ai_providers_availability(self):
        """Test 4: All AI Providers Availability"""
        success, response = await self.make_request("GET", "/ai/providers")
        
        if success:
            data = response["data"]
            providers = data.get("providers", [])
            
            # Check all four providers
            expected_providers = ["openai", "anthropic", "gemini", "perplexity"]
            available_providers = [p["provider"] for p in providers if p.get("available", False)]
            unavailable_providers = [p["provider"] for p in providers if not p.get("available", True)]
            
            # Check if all expected providers are present
            all_present = all(provider in [p["provider"] for p in providers] for provider in expected_providers)
            
            if all_present:
                if "perplexity" in available_providers:
                    self.log_test("AI Providers Availability", True, 
                                f"✅ All 4 AI providers present. Available: {available_providers}, Unavailable: {unavailable_providers}")
                else:
                    self.log_test("AI Providers Availability", False, 
                                f"❌ Perplexity not available. Available: {available_providers}, Unavailable: {unavailable_providers}")
            else:
                missing = [p for p in expected_providers if p not in [pr["provider"] for pr in providers]]
                self.log_test("AI Providers Availability", False, 
                            f"Missing providers: {missing}")
        else:
            self.log_test("AI Providers Availability", False, "Failed to get AI providers list", response)
    
    async def test_perplexity_api_key_integration(self):
        """Test 5: Perplexity API Key Integration Testing"""
        if not self.auth_token:
            self.log_test("Perplexity API Key Integration", False, "No auth token available")
            return
        
        try:
            # Test 1: Check Perplexity provider details
            success, detail_response = await self.make_request("GET", "/ai/providers/perplexity")
            
            if not success:
                self.log_test("Perplexity API Key Integration", False, "Failed to get Perplexity provider details", detail_response)
                return
            
            perplexity_details = detail_response["data"]
            expected_model = "sonar-pro"
            actual_model = perplexity_details.get("model", "")
            is_available = perplexity_details.get("available", False)
            
            if not is_available:
                self.log_test("Perplexity API Key Integration", False, 
                            f"Perplexity API key not loaded - Provider marked as unavailable")
                return
            
            if actual_model != expected_model:
                self.log_test("Perplexity API Key Integration", False, 
                            f"Incorrect Perplexity model. Expected: {expected_model}, Got: {actual_model}")
                return
            
            # Test 2: Test content generation with Perplexity
            generation_data = {
                "user_id": self.user_id,
                "category": "business",
                "platform": "instagram",
                "content_description": "Latest business trends for 2025 with current market insights and real-time data",
                "ai_providers": ["perplexity"]
            }
            
            success, gen_response = await self.make_request("POST", "/generate", generation_data)
            
            if success:
                data = gen_response["data"]
                if "captions" in data and "perplexity" in data["captions"]:
                    perplexity_caption = data["captions"]["perplexity"]
                    if perplexity_caption and not perplexity_caption.startswith("Error:"):
                        self.log_test("Perplexity API Key Integration", True, 
                                    f"🎉 PERPLEXITY API KEY INTEGRATION SUCCESSFUL! Generated content: '{perplexity_caption[:150]}...'")
                    else:
                        self.log_test("Perplexity API Key Integration", False, 
                                    f"Perplexity content generation failed: {perplexity_caption}")
                else:
                    self.log_test("Perplexity API Key Integration", False, 
                                "Perplexity caption not found in generation response", gen_response)
            else:
                self.log_test("Perplexity API Key Integration", False, 
                            "Content generation with Perplexity failed", gen_response)
                
        except Exception as e:
            self.log_test("Perplexity API Key Integration", False, f"Perplexity integration test error: {str(e)}")
    
    async def test_all_four_ai_providers_functionality(self):
        """Test 6: All Four AI Providers Functionality"""
        if not self.auth_token:
            self.log_test("All Four AI Providers", False, "No auth token available")
            return
        
        try:
            # Test all four providers: OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Gemini 2.0 Flash, Perplexity Sonar Pro
            providers_to_test = ["openai", "anthropic", "gemini", "perplexity"]
            working_providers = []
            failed_providers = []
            
            for provider in providers_to_test:
                generation_data = {
                    "user_id": self.user_id,
                    "category": "fashion",
                    "platform": "instagram",
                    "content_description": f"Testing {provider} AI provider for fashion content generation with latest trends",
                    "ai_providers": [provider]
                }
                
                success, response = await self.make_request("POST", "/generate", generation_data)
                
                if success:
                    data = response["data"]
                    if "captions" in data and provider in data["captions"]:
                        caption = data["captions"][provider]
                        if caption and not caption.startswith("Error:"):
                            working_providers.append(provider)
                            self.log_test(f"AI Provider ({provider})", True, 
                                        f"✅ {provider.upper()} working - Generated: '{caption[:80]}...'")
                        else:
                            failed_providers.append(provider)
                            self.log_test(f"AI Provider ({provider})", False, 
                                        f"❌ {provider.upper()} failed: {caption}")
                    else:
                        failed_providers.append(provider)
                        self.log_test(f"AI Provider ({provider})", False, 
                                    f"❌ {provider.upper()} - No caption in response")
                else:
                    failed_providers.append(provider)
                    self.log_test(f"AI Provider ({provider})", False, 
                                f"❌ {provider.upper()} - Request failed: {response}")
            
            # Overall result
            if len(working_providers) == 4:
                self.log_test("All Four AI Providers", True, 
                            f"🎉 ALL FOUR AI PROVIDERS WORKING! OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Gemini 2.0 Flash, Perplexity Sonar Pro")
            elif len(working_providers) >= 3:
                self.log_test("All Four AI Providers", True, 
                            f"✅ {len(working_providers)}/4 providers working: {working_providers}. Failed: {failed_providers}")
            else:
                self.log_test("All Four AI Providers", False, 
                            f"❌ Only {len(working_providers)}/4 providers working: {working_providers}. Failed: {failed_providers}")
                
        except Exception as e:
            self.log_test("All Four AI Providers", False, f"All providers test error: {str(e)}")
    
    async def test_generate_endpoint_functionality(self):
        """Test 7: /api/generate Endpoint Functionality"""
        if not self.auth_token:
            self.log_test("Generate Endpoint", False, "No auth token available")
            return
        
        try:
            # Test with multiple providers including Perplexity
            generation_data = {
                "user_id": self.user_id,
                "category": "business",
                "platform": "instagram",
                "content_description": "Revolutionary AI-powered business strategies for 2025 with market insights",
                "ai_providers": ["openai", "anthropic", "gemini", "perplexity"]
            }
            
            success, response = await self.make_request("POST", "/generate", generation_data)
            
            if success:
                data = response["data"]
                required_fields = ["captions", "hashtags", "combined_result", "category", "platform"]
                
                if all(field in data for field in required_fields):
                    captions = data["captions"]
                    working_count = len([p for p in captions if captions[p] and not captions[p].startswith("Error:")])
                    
                    if working_count >= 3:  # At least 3 providers should work
                        self.log_test("Generate Endpoint", True, 
                                    f"✅ /api/generate endpoint working with {working_count}/4 providers")
                    else:
                        self.log_test("Generate Endpoint", False, 
                                    f"Only {working_count}/4 providers generated content successfully")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Generate Endpoint", False, 
                                f"Missing required fields in response: {missing}")
            else:
                self.log_test("Generate Endpoint", False, 
                            "Generate endpoint request failed", response)
                
        except Exception as e:
            self.log_test("Generate Endpoint", False, f"Generate endpoint test error: {str(e)}")
    
    async def test_database_connectivity(self):
        """Test 8: Database Connectivity"""
        if not self.auth_token:
            self.log_test("Database Connectivity", False, "No auth token available")
            return
        
        try:
            # Test user info retrieval (database read)
            success, response = await self.make_request("GET", "/users/me")
            
            if success and "email" in response["data"]:
                # Test generation history (database read)
                success2, response2 = await self.make_request("GET", "/generations")
                
                if success2 and isinstance(response2["data"], list):
                    self.log_test("Database Connectivity", True, 
                                "✅ Database connectivity working - User data and generation history accessible")
                else:
                    self.log_test("Database Connectivity", False, 
                                "Database read issue with generation history", response2)
            else:
                self.log_test("Database Connectivity", False, 
                            "Database read issue with user data", response)
                
        except Exception as e:
            self.log_test("Database Connectivity", False, f"Database connectivity test error: {str(e)}")
    
    async def test_authentication_endpoints(self):
        """Test 9: Authentication Endpoints"""
        try:
            # Test signup endpoint
            signup_data = {
                "email": f"test.{datetime.utcnow().timestamp()}@three11motion.com",
                "name": "Test User"
            }
            
            success, response = await self.make_request("POST", "/auth/signup", signup_data)
            
            if success and "access_token" in response["data"]:
                # Test login endpoint
                login_data = {
                    "email": signup_data["email"]
                }
                
                success2, response2 = await self.make_request("POST", "/auth/login", login_data)
                
                if success2 and "access_token" in response2["data"]:
                    self.log_test("Authentication Endpoints", True, 
                                "✅ Both /api/auth/signup and /api/auth/login working correctly")
                else:
                    self.log_test("Authentication Endpoints", False, 
                                "Login endpoint failed", response2)
            else:
                self.log_test("Authentication Endpoints", False, 
                            "Signup endpoint failed", response)
                
        except Exception as e:
            self.log_test("Authentication Endpoints", False, f"Authentication endpoints test error: {str(e)}")
    
    async def test_premium_features(self):
        """Test 10: Premium Features"""
        try:
            # Test premium packs endpoint
            success, response = await self.make_request("GET", "/premium/packs")
            
            if success and isinstance(response["data"], list):
                if self.auth_token:
                    # Test premium upgrade endpoint
                    success2, response2 = await self.make_request("POST", "/premium/upgrade")
                    
                    if success2:
                        self.log_test("Premium Features", True, 
                                    "✅ Premium features working - Packs retrieval and upgrade functionality")
                    else:
                        self.log_test("Premium Features", False, 
                                    "Premium upgrade failed", response2)
                else:
                    self.log_test("Premium Features", True, 
                                "✅ Premium packs endpoint working (no auth token for upgrade test)")
            else:
                self.log_test("Premium Features", False, 
                            "Premium packs endpoint failed", response)
                
        except Exception as e:
            self.log_test("Premium Features", False, f"Premium features test error: {str(e)}")
    
    async def test_analytics_endpoints(self):
        """Test 11: Analytics Endpoints"""
        if not self.auth_token:
            self.log_test("Analytics Endpoints", False, "No auth token available")
            return
        
        try:
            success, response = await self.make_request("GET", "/analytics/dashboard")
            
            if success:
                data = response["data"]
                required_fields = ["total_generations", "popular_categories", "popular_platforms"]
                
                if all(field in data for field in required_fields):
                    self.log_test("Analytics Endpoints", True, 
                                "✅ Analytics dashboard endpoint working correctly")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Analytics Endpoints", False, 
                                f"Missing analytics fields: {missing}")
            else:
                self.log_test("Analytics Endpoints", False, 
                            "Analytics dashboard endpoint failed", response)
                
        except Exception as e:
            self.log_test("Analytics Endpoints", False, f"Analytics endpoints test error: {str(e)}")
    
    async def test_error_handling(self):
        """Test 12: Error Handling and Response Formats"""
        try:
            # Test invalid endpoint
            success, response = await self.make_request("GET", "/invalid-endpoint")
            
            if not success and response["status"] == 404:
                # Test invalid data
                if self.auth_token:
                    invalid_data = {
                        "invalid_field": "invalid_value"
                    }
                    
                    success2, response2 = await self.make_request("POST", "/generate", invalid_data)
                    
                    if not success2:
                        self.log_test("Error Handling", True, 
                                    "✅ Error handling working - Invalid requests properly rejected")
                    else:
                        self.log_test("Error Handling", False, 
                                    "Invalid data should be rejected")
                else:
                    self.log_test("Error Handling", True, 
                                "✅ Error handling working - 404 for invalid endpoints")
            else:
                self.log_test("Error Handling", False, 
                            "Invalid endpoint should return 404")
                
        except Exception as e:
            self.log_test("Error Handling", False, f"Error handling test error: {str(e)}")
    
    async def run_focused_tests(self):
        """Run focused backend tests"""
        print("🎯 FOCUSED BACKEND TESTING - PERPLEXITY INTEGRATION & BACKEND HEALTH")
        print("=" * 80)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Focus: Perplexity API Key Integration & Core Backend Functionality")
        print("=" * 80)
        
        # Core backend health
        await self.test_backend_health()
        await self.test_user_authentication()
        
        # Perplexity-specific tests
        print("\n🔍 PERPLEXITY API KEY INTEGRATION TESTS")
        print("-" * 50)
        await self.test_perplexity_environment_variable_loading()
        await self.test_ai_providers_availability()
        await self.test_perplexity_api_key_integration()
        await self.test_all_four_ai_providers_functionality()
        
        # Core backend functionality
        print("\n🏥 GENERAL BACKEND HEALTH CHECK")
        print("-" * 50)
        await self.test_generate_endpoint_functionality()
        await self.test_database_connectivity()
        await self.test_authentication_endpoints()
        await self.test_premium_features()
        await self.test_analytics_endpoints()
        await self.test_error_handling()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 FOCUSED TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results.values() if t["success"]])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Key findings
        print("\n🔍 KEY FINDINGS:")
        
        # Perplexity-specific findings
        perplexity_tests = [
            "Perplexity Environment Variable",
            "Perplexity API Key Integration", 
            "All Four AI Providers"
        ]
        
        perplexity_passed = len([t for t in perplexity_tests if self.test_results.get(t, {}).get("success", False)])
        
        if perplexity_passed == len(perplexity_tests):
            print("  ✅ PERPLEXITY INTEGRATION: Fully functional")
        elif perplexity_passed > 0:
            print(f"  ⚠️  PERPLEXITY INTEGRATION: Partially working ({perplexity_passed}/{len(perplexity_tests)})")
        else:
            print("  ❌ PERPLEXITY INTEGRATION: Not working")
        
        # Backend health findings
        backend_tests = [
            "Backend Health",
            "User Authentication", 
            "Generate Endpoint",
            "Database Connectivity",
            "Authentication Endpoints"
        ]
        
        backend_passed = len([t for t in backend_tests if self.test_results.get(t, {}).get("success", False)])
        
        if backend_passed == len(backend_tests):
            print("  ✅ BACKEND HEALTH: Excellent")
        elif backend_passed >= len(backend_tests) * 0.8:
            print(f"  ✅ BACKEND HEALTH: Good ({backend_passed}/{len(backend_tests)})")
        elif backend_passed >= len(backend_tests) * 0.5:
            print(f"  ⚠️  BACKEND HEALTH: Fair ({backend_passed}/{len(backend_tests)})")
        else:
            print(f"  ❌ BACKEND HEALTH: Poor ({backend_passed}/{len(backend_tests)})")
        
        # Failed tests
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS ({failed_tests}):")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  • {test_name}: {result['message']}")
        
        print("\n" + "=" * 80)
        print("🏁 FOCUSED TESTING COMPLETE")
        print("=" * 80)

async def main():
    async with FocusedBackendTester() as tester:
        await tester.run_focused_tests()

if __name__ == "__main__":
    asyncio.run(main())