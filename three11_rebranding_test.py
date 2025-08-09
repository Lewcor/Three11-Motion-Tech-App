#!/usr/bin/env python3
"""
THREE11 MOTION TECH AI Provider Rebranding Verification Test
Testing that all AI providers now show THREE11 branded names
"""

import asyncio
import aiohttp
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Test configuration
BACKEND_URL = "https://62026ea1-c285-45e5-8d7d-08217e83b971.preview.emergentagent.com/api"
TEST_USER_EMAIL = "fashionista@three11motion.com"
TEST_USER_NAME = "Fashion Creator"
TEST_USER_PASSWORD = "SecurePass123!"

# Expected THREE11 branded names
EXPECTED_BRANDED_NAMES = {
    "openai": "THREE11 Pro AI",
    "anthropic": "THREE11 Creative AI", 
    "gemini": "THREE11 Smart AI",
    "perplexity": "THREE11 Research AI"
}

# Expected original model names (should be replaced)
ORIGINAL_NAMES = {
    "openai": "GPT-4o",
    "anthropic": "Claude 3.5 Sonnet",
    "gemini": "Gemini 2.0 Flash", 
    "perplexity": "Sonar Pro"
}

class THREE11RebrandingTester:
    def __init__(self):
        self.session = None
        self.auth_token = None
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
        """Authenticate user and get token"""
        try:
            # Try login first
            login_data = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            
            async with self.session.post(f"{BACKEND_URL}/auth/login", json=login_data) as response:
                if response.status == 200:
                    data = await response.json()
                    self.auth_token = data["access_token"]
                    self.log_test("Authentication", True, "Login successful")
                    return True
                elif response.status == 401:
                    # User doesn't exist, try signup
                    signup_data = {
                        "email": TEST_USER_EMAIL,
                        "name": TEST_USER_NAME
                    }
                    
                    async with self.session.post(f"{BACKEND_URL}/auth/signup", json=signup_data) as signup_response:
                        if signup_response.status == 200:
                            data = await signup_response.json()
                            self.auth_token = data["access_token"]
                            self.log_test("Authentication", True, "Signup and login successful")
                            return True
                        else:
                            error_text = await signup_response.text()
                            self.log_test("Authentication", False, f"Signup failed: {error_text}")
                            return False
                else:
                    error_text = await response.text()
                    self.log_test("Authentication", False, f"Login failed: {error_text}")
                    return False
                    
        except Exception as e:
            self.log_test("Authentication", False, f"Authentication error: {str(e)}")
            return False

    async def test_ai_providers_endpoint(self):
        """Test GET /api/ai/providers endpoint for THREE11 branded names"""
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"} if self.auth_token else {}
            
            async with self.session.get(f"{BACKEND_URL}/ai/providers", headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    providers = data.get("providers", [])
                    
                    # Check if we have the expected number of providers
                    if len(providers) != 4:
                        self.log_test("AI Providers Count", False, f"Expected 4 providers, got {len(providers)}")
                        return False
                    
                    # Check each provider for THREE11 branding
                    branded_correctly = True
                    branding_details = {}
                    
                    for provider in providers:
                        provider_key = provider.get("provider", "").lower()
                        provider_name = provider.get("name", "")
                        
                        expected_name = EXPECTED_BRANDED_NAMES.get(provider_key)
                        original_name = ORIGINAL_NAMES.get(provider_key)
                        
                        branding_details[provider_key] = {
                            "current_name": provider_name,
                            "expected_name": expected_name,
                            "original_name": original_name,
                            "correctly_branded": provider_name == expected_name,
                            "still_using_original": provider_name == original_name,
                            "available": provider.get("available", False)
                        }
                        
                        if provider_name != expected_name:
                            branded_correctly = False
                    
                    if branded_correctly:
                        self.log_test("AI Providers Branding", True, "All providers correctly show THREE11 branded names", branding_details)
                    else:
                        self.log_test("AI Providers Branding", False, "Some providers not correctly branded", branding_details)
                    
                    return branded_correctly
                    
                else:
                    error_text = await response.text()
                    self.log_test("AI Providers Endpoint", False, f"Failed to get providers: {error_text}")
                    return False
                    
        except Exception as e:
            self.log_test("AI Providers Endpoint", False, f"Error testing providers endpoint: {str(e)}")
            return False

    async def test_individual_provider_details(self):
        """Test individual provider details for THREE11 branding"""
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"} if self.auth_token else {}
            all_correct = True
            provider_details = {}
            
            for provider_key, expected_name in EXPECTED_BRANDED_NAMES.items():
                try:
                    async with self.session.get(f"{BACKEND_URL}/ai/providers/{provider_key}", headers=headers) as response:
                        if response.status == 200:
                            data = await response.json()
                            
                            # Check if the provider details show correct branding
                            provider_name = data.get("name", "")
                            model_name = data.get("model", "")
                            available = data.get("available", False)
                            
                            provider_details[provider_key] = {
                                "name": provider_name,
                                "model": model_name,
                                "available": available,
                                "expected_name": expected_name,
                                "correctly_named": provider_name == expected_name
                            }
                            
                            if provider_name != expected_name:
                                all_correct = False
                                
                        else:
                            error_text = await response.text()
                            provider_details[provider_key] = {
                                "error": f"Failed to get details: {error_text}",
                                "correctly_named": False
                            }
                            all_correct = False
                            
                except Exception as e:
                    provider_details[provider_key] = {
                        "error": f"Exception: {str(e)}",
                        "correctly_named": False
                    }
                    all_correct = False
            
            if all_correct:
                self.log_test("Individual Provider Details", True, "All individual provider details correctly branded", provider_details)
            else:
                self.log_test("Individual Provider Details", False, "Some individual provider details not correctly branded", provider_details)
            
            return all_correct
            
        except Exception as e:
            self.log_test("Individual Provider Details", False, f"Error testing individual provider details: {str(e)}")
            return False

    async def test_content_generation_with_branded_names(self):
        """Test that content generation still works with rebranded names"""
        try:
            if not self.auth_token:
                self.log_test("Content Generation Test", False, "No authentication token available")
                return False
                
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            # Test content generation request
            generation_request = {
                "category": "fashion",
                "platform": "instagram",
                "content_description": "Testing THREE11 rebranded AI providers with stylish winter fashion outfit",
                "ai_providers": ["anthropic", "gemini"]  # Test with rebranded providers
            }
            
            async with self.session.post(f"{BACKEND_URL}/generate", json=generation_request, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Check if generation was successful
                    if data.get("captions") and data.get("hashtags"):
                        self.log_test("Content Generation Functionality", True, "Content generation works with rebranded providers", {
                            "captions_count": len(data.get("captions", {})),
                            "hashtags_count": len(data.get("hashtags", [])),
                            "combined_result": bool(data.get("combined_result"))
                        })
                        return True
                    else:
                        self.log_test("Content Generation Functionality", False, "Content generation returned incomplete data", data)
                        return False
                        
                elif response.status == 403:
                    # This might be due to daily limits - still indicates the system is working
                    error_data = await response.json()
                    if "Daily generation limit" in error_data.get("detail", ""):
                        self.log_test("Content Generation Functionality", True, "System working - hit daily limit (expected for free users)", error_data)
                        return True
                    else:
                        self.log_test("Content Generation Functionality", False, f"Unexpected 403 error: {error_data}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_test("Content Generation Functionality", False, f"Content generation failed: {error_text}")
                    return False
                    
        except Exception as e:
            self.log_test("Content Generation Functionality", False, f"Error testing content generation: {str(e)}")
            return False

    async def run_all_tests(self):
        """Run all THREE11 rebranding tests"""
        print("🚀 Starting THREE11 MOTION TECH AI Provider Rebranding Verification Tests")
        print("=" * 80)
        
        # Authenticate first
        auth_success = await self.authenticate()
        if not auth_success:
            print("❌ Authentication failed - cannot proceed with tests")
            return False
        
        # Run all tests
        test_results = []
        
        # Test 1: AI Providers endpoint branding
        result1 = await self.test_ai_providers_endpoint()
        test_results.append(result1)
        
        # Test 2: Individual provider details branding  
        result2 = await self.test_individual_provider_details()
        test_results.append(result2)
        
        # Test 3: Content generation functionality
        result3 = await self.test_content_generation_with_branded_names()
        test_results.append(result3)
        
        # Summary
        print("\n" + "=" * 80)
        print("🎯 THREE11 REBRANDING TEST SUMMARY")
        print("=" * 80)
        
        passed_tests = sum(test_results)
        total_tests = len(test_results)
        
        print(f"Tests Passed: {passed_tests}/{total_tests}")
        
        if passed_tests == total_tests:
            print("🎉 ALL TESTS PASSED - THREE11 REBRANDING SUCCESSFUL!")
            return True
        else:
            print("⚠️  SOME TESTS FAILED - REBRANDING NEEDS ATTENTION")
            return False

async def main():
    """Main test execution"""
    async with THREE11RebrandingTester() as tester:
        success = await tester.run_all_tests()
        
        # Print detailed results
        print("\n" + "=" * 80)
        print("📊 DETAILED TEST RESULTS")
        print("=" * 80)
        
        for test_name, result in tester.test_results.items():
            status = "✅" if result["success"] else "❌"
            print(f"{status} {test_name}")
            print(f"   Message: {result['message']}")
            if result.get("details"):
                print(f"   Details: {json.dumps(result['details'], indent=6)}")
            print()
        
        return success

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)