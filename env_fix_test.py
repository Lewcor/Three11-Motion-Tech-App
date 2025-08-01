#!/usr/bin/env python3
"""
Focused Environment Variable Fix Testing
Testing AI Provider Availability and Perplexity Integration
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional

# Test configuration
BACKEND_URL = "https://99f8bfd0-8e38-4a0a-99d8-f0b68f38c63b.preview.emergentagent.com/api"
TEST_USER_EMAIL = "perplexity.tester@three11motion.com"
TEST_USER_NAME = "Perplexity Tester"

class EnvFixTester:
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
        if details:
            print(f"    Details: {json.dumps(details, indent=2)}")
    
    async def authenticate(self):
        """Authenticate test user"""
        try:
            # Try signup first
            signup_data = {
                "email": TEST_USER_EMAIL,
                "name": TEST_USER_NAME
            }
            
            async with self.session.post(f"{BACKEND_URL}/auth/signup", json=signup_data) as response:
                if response.status in [200, 400]:  # 400 if user exists
                    if response.status == 200:
                        data = await response.json()
                        self.auth_token = data["access_token"]
                        self.user_id = data["user"]["id"]
                        self.log_test("Authentication", True, "User signup successful")
                        return True
                    else:
                        # User exists, try login
                        login_data = {
                            "email": TEST_USER_EMAIL,
                            "password": "dummy"  # Simple login for demo
                        }
                        
                        async with self.session.post(f"{BACKEND_URL}/auth/login", json=login_data) as login_response:
                            if login_response.status == 200:
                                data = await login_response.json()
                                self.auth_token = data["access_token"]
                                self.user_id = data["user"]["id"]
                                self.log_test("Authentication", True, "User login successful")
                                return True
                            else:
                                self.log_test("Authentication", False, f"Login failed: {login_response.status}")
                                return False
                else:
                    self.log_test("Authentication", False, f"Signup failed: {response.status}")
                    return False
                    
        except Exception as e:
            self.log_test("Authentication", False, f"Authentication error: {str(e)}")
            return False
    
    async def test_ai_providers_endpoint(self):
        """Test GET /api/ai/providers endpoint"""
        try:
            async with self.session.get(f"{BACKEND_URL}/ai/providers") as response:
                if response.status == 200:
                    data = await response.json()
                    providers = data.get("providers", [])
                    
                    # Check if we have all 4 providers
                    expected_providers = ["openai", "anthropic", "gemini", "perplexity"]
                    found_providers = [p["provider"] for p in providers]  # Changed from "name" to "provider"
                    
                    # Check availability status
                    available_providers = [p for p in providers if p.get("available", False)]
                    perplexity_provider = next((p for p in providers if p["provider"] == "perplexity"), None)
                    
                    details = {
                        "total_providers": len(providers),
                        "available_providers": len(available_providers),
                        "found_providers": found_providers,
                        "perplexity_available": perplexity_provider.get("available", False) if perplexity_provider else False,
                        "all_providers_data": providers
                    }
                    
                    # Check if all 4 providers are available
                    all_available = len(available_providers) == 4
                    perplexity_available = perplexity_provider and perplexity_provider.get("available", False)
                    
                    if all_available and perplexity_available:
                        self.log_test("AI Providers Availability", True, 
                                    f"All 4 AI providers available including Perplexity", details)
                    else:
                        self.log_test("AI Providers Availability", False, 
                                    f"Not all providers available. Available: {len(available_providers)}/4, Perplexity: {perplexity_available}", details)
                    
                    return data
                else:
                    self.log_test("AI Providers Availability", False, f"API returned status {response.status}")
                    return None
                    
        except Exception as e:
            self.log_test("AI Providers Availability", False, f"Error: {str(e)}")
            return None
    
    async def test_perplexity_specific(self):
        """Test Perplexity provider specifically"""
        try:
            async with self.session.get(f"{BACKEND_URL}/ai/providers/perplexity") as response:
                if response.status == 200:
                    data = await response.json()
                    is_available = data.get("available", False)
                    model = data.get("model", "")
                    
                    details = {
                        "provider": data.get("provider"),
                        "available": is_available,
                        "model": model,
                        "full_response": data
                    }
                    
                    if is_available:
                        self.log_test("Perplexity Provider Check", True, 
                                    f"Perplexity provider available with model: {model}", details)
                    else:
                        self.log_test("Perplexity Provider Check", False, 
                                    "Perplexity provider not available", details)
                    
                    return data
                else:
                    self.log_test("Perplexity Provider Check", False, f"API returned status {response.status}")
                    return None
                    
        except Exception as e:
            self.log_test("Perplexity Provider Check", False, f"Error: {str(e)}")
            return None
    
    async def test_perplexity_content_generation(self):
        """Test content generation using Perplexity provider specifically"""
        if not self.auth_token:
            self.log_test("Perplexity Content Generation", False, "No auth token available")
            return None
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            generation_request = {
                "category": "business",
                "platform": "instagram",
                "content_description": "Professional networking event for entrepreneurs and startup founders",
                "ai_providers": ["perplexity"]  # Test Perplexity specifically
            }
            
            async with self.session.post(f"{BACKEND_URL}/generate", 
                                       json=generation_request, 
                                       headers=headers) as response:
                
                response_text = await response.text()
                
                if response.status == 200:
                    data = await response.json()
                    captions = data.get("captions", {})
                    perplexity_caption = captions.get("perplexity")
                    
                    details = {
                        "status": response.status,
                        "captions_count": len(captions),
                        "perplexity_caption_length": len(perplexity_caption) if perplexity_caption else 0,
                        "hashtags_count": len(data.get("hashtags", [])),
                        "has_combined_result": bool(data.get("combined_result")),
                        "perplexity_caption_preview": perplexity_caption[:100] + "..." if perplexity_caption and len(perplexity_caption) > 100 else perplexity_caption
                    }
                    
                    if perplexity_caption:
                        self.log_test("Perplexity Content Generation", True, 
                                    f"Successfully generated content using Perplexity", details)
                    else:
                        self.log_test("Perplexity Content Generation", False, 
                                    "No Perplexity caption in response", details)
                    
                    return data
                else:
                    details = {
                        "status": response.status,
                        "response_text": response_text[:500]
                    }
                    self.log_test("Perplexity Content Generation", False, 
                                f"Generation failed with status {response.status}", details)
                    return None
                    
        except Exception as e:
            self.log_test("Perplexity Content Generation", False, f"Error: {str(e)}")
            return None
    
    async def test_all_providers_content_generation(self):
        """Test content generation with all four AI providers"""
        if not self.auth_token:
            self.log_test("All Providers Content Generation", False, "No auth token available")
            return None
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            generation_request = {
                "category": "fitness",
                "platform": "tiktok",
                "content_description": "Morning workout routine for busy professionals",
                "ai_providers": ["openai", "anthropic", "gemini", "perplexity"]  # All providers
            }
            
            async with self.session.post(f"{BACKEND_URL}/generate", 
                                       json=generation_request, 
                                       headers=headers) as response:
                
                response_text = await response.text()
                
                if response.status == 200:
                    data = await response.json()
                    captions = data.get("captions", {})
                    
                    # Check which providers returned content
                    successful_providers = [provider for provider, caption in captions.items() if caption]
                    
                    details = {
                        "status": response.status,
                        "total_providers_requested": 4,
                        "successful_providers": successful_providers,
                        "successful_count": len(successful_providers),
                        "captions_preview": {provider: (caption[:50] + "..." if len(caption) > 50 else caption) 
                                           for provider, caption in captions.items() if caption},
                        "hashtags_count": len(data.get("hashtags", [])),
                        "has_combined_result": bool(data.get("combined_result"))
                    }
                    
                    if len(successful_providers) >= 3:  # At least 3 out of 4 should work
                        self.log_test("All Providers Content Generation", True, 
                                    f"Successfully generated content with {len(successful_providers)}/4 providers", details)
                    else:
                        self.log_test("All Providers Content Generation", False, 
                                    f"Only {len(successful_providers)}/4 providers successful", details)
                    
                    return data
                else:
                    details = {
                        "status": response.status,
                        "response_text": response_text[:500]
                    }
                    self.log_test("All Providers Content Generation", False, 
                                f"Generation failed with status {response.status}", details)
                    return None
                    
        except Exception as e:
            self.log_test("All Providers Content Generation", False, f"Error: {str(e)}")
            return None
    
    async def test_environment_variable_loading(self):
        """Test that environment variables are properly loaded"""
        try:
            # Test by checking if providers show as available
            providers_data = await self.test_ai_providers_endpoint()
            
            if providers_data:
                providers = providers_data.get("providers", [])
                env_status = {}
                
                for provider in providers:
                    provider_name = provider.get("name")
                    is_available = provider.get("available", False)
                    env_status[provider_name] = {
                        "available": is_available,
                        "model": provider.get("model", "")
                    }
                
                # Check specifically for Perplexity
                perplexity_available = env_status.get("perplexity", {}).get("available", False)
                
                details = {
                    "environment_status": env_status,
                    "perplexity_specifically_available": perplexity_available,
                    "total_available": sum(1 for status in env_status.values() if status["available"])
                }
                
                if perplexity_available:
                    self.log_test("Environment Variable Loading", True, 
                                "Environment variables loaded correctly, Perplexity available", details)
                else:
                    self.log_test("Environment Variable Loading", False, 
                                "Perplexity still not available - environment variable issue", details)
                
                return env_status
            else:
                self.log_test("Environment Variable Loading", False, "Could not retrieve provider data")
                return None
                
        except Exception as e:
            self.log_test("Environment Variable Loading", False, f"Error: {str(e)}")
            return None
    
    async def run_focused_tests(self):
        """Run focused tests for environment variable fix"""
        print("🚀 STARTING FOCUSED ENVIRONMENT VARIABLE FIX TESTING")
        print("=" * 60)
        
        print("\n📋 RUNNING FOCUSED TESTS:")
        print("-" * 40)
        
        # Test 1: AI Providers Endpoint (no auth needed)
        print("\n1️⃣ Testing AI Providers Availability...")
        await self.test_ai_providers_endpoint()
        
        # Test 2: Perplexity Specific Check (no auth needed)
        print("\n2️⃣ Testing Perplexity Provider Specifically...")
        await self.test_perplexity_specific()
        
        # Test 3: Environment Variable Loading
        print("\n3️⃣ Testing Environment Variable Loading...")
        await self.test_environment_variable_loading()
        
        # Authenticate for content generation tests
        print("\n🔐 Authenticating for content generation tests...")
        auth_success = await self.authenticate()
        
        if auth_success:
            # Test 4: Perplexity Content Generation
            print("\n4️⃣ Testing Perplexity Content Generation...")
            await self.test_perplexity_content_generation()
            
            # Test 5: All Providers Content Generation
            print("\n5️⃣ Testing All Providers Content Generation...")
            await self.test_all_providers_content_generation()
        else:
            print("⚠️ Skipping content generation tests due to authentication failure")
            self.log_test("Perplexity Content Generation", False, "Skipped due to authentication failure")
            self.log_test("All Providers Content Generation", False, "Skipped due to authentication failure")
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        total_tests = len(self.test_results)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        print("\n📋 DETAILED RESULTS:")
        for test_name, result in self.test_results.items():
            status = "✅" if result["success"] else "❌"
            print(f"{status} {test_name}: {result['message']}")
        
        return self.test_results

async def main():
    """Main test execution"""
    async with EnvFixTester() as tester:
        results = await tester.run_focused_tests()
        
        # Return exit code based on results
        if results:
            failed_tests = sum(1 for result in results.values() if not result["success"])
            return 0 if failed_tests == 0 else 1
        else:
            return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)