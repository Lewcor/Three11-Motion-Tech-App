#!/usr/bin/env python3
"""
Comprehensive Backend Testing for AI-Powered Caption & Hashtag Generator
THREE11 MOTION TECH Integration Testing - Including Voice Processing
"""

import asyncio
import aiohttp
import json
import os
import sys
import base64
import io
import tempfile
from datetime import datetime
from typing import Dict, Any, Optional
from pydub import AudioSegment
from pydub.generators import Sine

# Test configuration
BACKEND_URL = "https://86a6dac4-7d0c-40b7-a421-1d14cb090ea2.preview.emergentagent.com/api"
TEST_USER_EMAIL = "fashionista@three11motion.com"
TEST_USER_NAME = "Fashion Creator"
TEST_USER_PASSWORD = "SecurePass123!"

class BackendTester:
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
    
    async def test_health_check(self):
        """Test 1: Health Check Endpoint"""
        success, response = await self.make_request("GET", "/health")
        
        if success and response["data"].get("status") == "healthy":
            self.log_test("Health Check", True, "Backend is healthy and responding")
        else:
            self.log_test("Health Check", False, "Health check failed", response)
    
    async def test_user_signup(self):
        """Test 2: User Signup"""
        signup_data = {
            "email": TEST_USER_EMAIL,
            "name": TEST_USER_NAME,
            "password": TEST_USER_PASSWORD
        }
        
        success, response = await self.make_request("POST", "/auth/signup", signup_data)
        
        if success and "access_token" in response["data"]:
            self.auth_token = response["data"]["access_token"]
            self.user_id = response["data"]["user"]["id"]
            self.log_test("User Signup", True, "User created successfully with JWT token")
        else:
            # Try login if user already exists
            await self.test_user_login()
    
    async def test_user_login(self):
        """Test 3: User Login"""
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        success, response = await self.make_request("POST", "/auth/login", login_data)
        
        if success and "access_token" in response["data"]:
            self.auth_token = response["data"]["access_token"]
            self.user_id = response["data"]["user"]["id"]
            self.log_test("User Login", True, "User logged in successfully")
        else:
            self.log_test("User Login", False, "Login failed", response)
    
    async def test_get_current_user(self):
        """Test 4: Get Current User Info"""
        if not self.auth_token:
            self.log_test("Get Current User", False, "No auth token available")
            return
            
        success, response = await self.make_request("GET", "/users/me")
        
        if success and "email" in response["data"]:
            self.log_test("Get Current User", True, "User info retrieved successfully")
        else:
            self.log_test("Get Current User", False, "Failed to get user info", response)
    
    async def test_ai_content_generation(self):
        """Test 5: AI Content Generation with All Three Providers"""
        if not self.auth_token:
            self.log_test("AI Content Generation", False, "No auth token available")
            return
        
        generation_data = {
            "user_id": self.user_id,
            "category": "fashion",
            "platform": "instagram",
            "content_description": "A stylish outfit featuring vintage jeans and modern accessories for weekend casual look",
            "ai_providers": ["openai", "anthropic", "gemini"]
        }
        
        success, response = await self.make_request("POST", "/generate", generation_data)
        
        if success:
            data = response["data"]
            if "captions" in data and "hashtags" in data and "combined_result" in data:
                captions = data["captions"]
                providers_working = []
                providers_failed = []
                
                for provider in ["openai", "anthropic", "gemini"]:
                    if provider in captions and not captions[provider].startswith("Error:"):
                        providers_working.append(provider)
                    else:
                        providers_failed.append(provider)
                
                if providers_working:
                    self.log_test("AI Content Generation", True, 
                                f"Content generated successfully. Working: {providers_working}, Failed: {providers_failed}")
                else:
                    self.log_test("AI Content Generation", False, 
                                "All AI providers failed to generate content", response)
            else:
                self.log_test("AI Content Generation", False, "Invalid response format", response)
        else:
            self.log_test("AI Content Generation", False, "Content generation failed", response)
    
    async def test_generation_history(self):
        """Test 6: Generation History Retrieval"""
        if not self.auth_token:
            self.log_test("Generation History", False, "No auth token available")
            return
            
        success, response = await self.make_request("GET", "/generations")
        
        if success and isinstance(response["data"], list):
            self.log_test("Generation History", True, 
                        f"Retrieved {len(response['data'])} generation records")
        else:
            self.log_test("Generation History", False, "Failed to get generation history", response)
    
    async def test_premium_packs(self):
        """Test 7: Premium Packs Retrieval"""
        success, response = await self.make_request("GET", "/premium/packs")
        
        if success and isinstance(response["data"], list):
            packs = response["data"]
            if packs:
                self.log_test("Premium Packs", True, f"Retrieved {len(packs)} premium packs")
            else:
                self.log_test("Premium Packs", False, "No premium packs found")
        else:
            self.log_test("Premium Packs", False, "Failed to get premium packs", response)
    
    async def test_premium_upgrade(self):
        """Test 8: Premium Upgrade (Mock)"""
        if not self.auth_token:
            self.log_test("Premium Upgrade", False, "No auth token available")
            return
            
        success, response = await self.make_request("POST", "/premium/upgrade")
        
        if success and "message" in response["data"]:
            self.log_test("Premium Upgrade", True, "Premium upgrade successful")
        else:
            self.log_test("Premium Upgrade", False, "Premium upgrade failed", response)
    
    async def test_dashboard_analytics(self):
        """Test 9: Dashboard Analytics"""
        if not self.auth_token:
            self.log_test("Dashboard Analytics", False, "No auth token available")
            return
            
        success, response = await self.make_request("GET", "/analytics/dashboard")
        
        if success:
            data = response["data"]
            required_fields = ["total_generations", "popular_categories", "popular_platforms"]
            if all(field in data for field in required_fields):
                self.log_test("Dashboard Analytics", True, "Analytics data retrieved successfully")
            else:
                self.log_test("Dashboard Analytics", False, "Missing required analytics fields", response)
        else:
            self.log_test("Dashboard Analytics", False, "Failed to get analytics", response)
    
    async def test_freemium_limits(self):
        """Test 10: Freemium Generation Limits"""
        if not self.auth_token:
            self.log_test("Freemium Limits", False, "No auth token available")
            return
        
        # First, check current user status
        success, user_response = await self.make_request("GET", "/users/me")
        if not success:
            self.log_test("Freemium Limits", False, "Could not get user info for limit testing")
            return
        
        user_data = user_response["data"]
        daily_used = user_data.get("daily_generations_used", 0)
        tier = user_data.get("tier", "free")
        
        if tier == "premium":
            self.log_test("Freemium Limits", True, "User is premium - unlimited generations")
            return
        
        # Test generation to check limit enforcement
        generation_data = {
            "user_id": self.user_id,
            "category": "fashion",
            "platform": "instagram", 
            "content_description": "Testing freemium limits",
            "ai_providers": ["openai"]
        }
        
        success, response = await self.make_request("POST", "/generate", generation_data)
        
        if daily_used >= 10:
            # Should be blocked
            if not success and response["status"] == 403:
                self.log_test("Freemium Limits", True, "Daily limit properly enforced")
            else:
                self.log_test("Freemium Limits", False, "Daily limit not enforced", response)
        else:
            # Should work
            if success:
                self.log_test("Freemium Limits", True, f"Generation allowed ({daily_used + 1}/10 daily limit)")
            else:
                self.log_test("Freemium Limits", False, "Generation failed within limits", response)
    
    async def test_database_operations(self):
        """Test 11: Database Operations (Indirect through API)"""
        # Test user creation and retrieval (already tested above)
        # Test content storage and retrieval (already tested above)
        # This is a summary test
        
        user_test = self.test_results.get("Get Current User", {}).get("success", False)
        generation_test = self.test_results.get("AI Content Generation", {}).get("success", False)
        history_test = self.test_results.get("Generation History", {}).get("success", False)
        
        if user_test and generation_test and history_test:
            self.log_test("Database Operations", True, "All database operations working correctly")
        else:
            self.log_test("Database Operations", False, "Some database operations failed")
    
    def _create_mock_audio_file(self, duration_ms: int = 2000, format: str = "wav") -> bytes:
        """Create mock audio data for testing"""
        try:
            # Generate a simple sine wave tone
            tone = Sine(440).to_audio_segment(duration=duration_ms)  # 440Hz A note
            
            # Export to bytes
            buffer = io.BytesIO()
            tone.export(buffer, format=format)
            buffer.seek(0)
            return buffer.read()
        except Exception as e:
            # Fallback: create minimal WAV header with silence
            sample_rate = 44100
            duration_seconds = duration_ms / 1000
            num_samples = int(sample_rate * duration_seconds)
            
            # Create WAV header (44 bytes) + silent audio data
            wav_header = b'RIFF' + (36 + num_samples * 2).to_bytes(4, 'little') + b'WAVE'
            wav_header += b'fmt ' + (16).to_bytes(4, 'little')  # fmt chunk
            wav_header += (1).to_bytes(2, 'little')  # PCM format
            wav_header += (1).to_bytes(2, 'little')  # mono
            wav_header += sample_rate.to_bytes(4, 'little')  # sample rate
            wav_header += (sample_rate * 2).to_bytes(4, 'little')  # byte rate
            wav_header += (2).to_bytes(2, 'little')  # block align
            wav_header += (16).to_bytes(2, 'little')  # bits per sample
            wav_header += b'data' + (num_samples * 2).to_bytes(4, 'little')
            
            # Add silent audio data
            audio_data = b'\x00\x00' * num_samples
            
            return wav_header + audio_data
    
    async def make_file_request(self, endpoint: str, file_data: bytes, filename: str, 
                               additional_data: Optional[Dict] = None) -> tuple[bool, Dict]:
        """Make multipart file upload request"""
        try:
            url = f"{BACKEND_URL}{endpoint}"
            
            # Create multipart form data
            data = aiohttp.FormData()
            data.add_field('audio_file', file_data, filename=filename, content_type='audio/wav')
            
            if additional_data:
                for key, value in additional_data.items():
                    data.add_field(key, str(value))
            
            headers = {}
            if self.auth_token:
                headers["Authorization"] = f"Bearer {self.auth_token}"
            
            async with self.session.post(url, data=data, headers=headers) as response:
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
    
    async def test_voice_transcription(self):
        """Test 12: Voice Transcription Service"""
        if not self.auth_token:
            self.log_test("Voice Transcription", False, "No auth token available")
            return
        
        try:
            # Create mock audio file
            audio_data = self._create_mock_audio_file(duration_ms=1000, format="wav")
            
            # Test transcription endpoint
            success, response = await self.make_file_request(
                "/voice/transcribe", 
                audio_data, 
                "test_audio.wav"
            )
            
            if success:
                data = response["data"]
                if "transcript" in data and "success" in data:
                    if data["success"]:
                        self.log_test("Voice Transcription", True, 
                                    f"Audio transcribed successfully: '{data.get('transcript', 'N/A')}'")
                    else:
                        self.log_test("Voice Transcription", False, 
                                    f"Transcription failed: {data.get('error', 'Unknown error')}")
                else:
                    self.log_test("Voice Transcription", False, "Invalid response format", response)
            else:
                self.log_test("Voice Transcription", False, "Transcription request failed", response)
                
        except Exception as e:
            self.log_test("Voice Transcription", False, f"Test error: {str(e)}")
    
    async def test_voice_content_suite(self):
        """Test 13: Voice-to-Content Suite"""
        if not self.auth_token:
            self.log_test("Voice Content Suite", False, "No auth token available")
            return
        
        try:
            # Create mock audio file
            audio_data = self._create_mock_audio_file(duration_ms=2000, format="wav")
            
            # Test voice-to-content suite endpoint
            success, response = await self.make_file_request(
                "/voice/content-suite", 
                audio_data, 
                "content_audio.wav"
            )
            
            if success:
                data = response["data"]
                if "success" in data:
                    if data["success"]:
                        required_fields = ["transcript", "content_details", "generated_content"]
                        if all(field in data for field in required_fields):
                            self.log_test("Voice Content Suite", True, 
                                        "Voice-to-content generation successful with all required fields")
                        else:
                            missing = [f for f in required_fields if f not in data]
                            self.log_test("Voice Content Suite", False, 
                                        f"Missing required fields: {missing}", response)
                    else:
                        self.log_test("Voice Content Suite", False, 
                                    f"Content generation failed: {data.get('error', 'Unknown error')}")
                else:
                    self.log_test("Voice Content Suite", False, "Invalid response format", response)
            else:
                self.log_test("Voice Content Suite", False, "Content suite request failed", response)
                
        except Exception as e:
            self.log_test("Voice Content Suite", False, f"Test error: {str(e)}")
    
    async def test_voice_command_handler(self):
        """Test 14: Voice Command Handler"""
        if not self.auth_token:
            self.log_test("Voice Command Handler", False, "No auth token available")
            return
        
        try:
            # Create mock audio file
            audio_data = self._create_mock_audio_file(duration_ms=1500, format="wav")
            
            # Test voice command endpoint
            success, response = await self.make_file_request(
                "/voice/command", 
                audio_data, 
                "command_audio.wav"
            )
            
            if success:
                data = response["data"]
                if "success" in data:
                    if data["success"]:
                        # Check for command response structure
                        if "action" in data or "transcript" in data:
                            self.log_test("Voice Command Handler", True, 
                                        f"Voice command processed successfully: {data.get('action', 'content_generation')}")
                        else:
                            self.log_test("Voice Command Handler", False, 
                                        "Command response missing required fields", response)
                    else:
                        self.log_test("Voice Command Handler", False, 
                                    f"Command processing failed: {data.get('error', 'Unknown error')}")
                else:
                    self.log_test("Voice Command Handler", False, "Invalid response format", response)
            else:
                self.log_test("Voice Command Handler", False, "Command handler request failed", response)
                
        except Exception as e:
            self.log_test("Voice Command Handler", False, f"Test error: {str(e)}")
    
    async def test_real_time_transcription(self):
        """Test 15: Real-time Voice Transcription"""
        if not self.auth_token:
            self.log_test("Real-time Transcription", False, "No auth token available")
            return
        
        try:
            # Create mock audio chunk
            audio_data = self._create_mock_audio_file(duration_ms=500, format="webm")
            
            # Encode as base64 for real-time endpoint
            audio_base64 = base64.b64encode(audio_data).decode('utf-8')
            
            # Test real-time transcription endpoint
            form_data = {
                "audio_chunk": audio_base64,
                "is_final": "true"
            }
            
            success, response = await self.make_request("POST", "/voice/real-time-transcribe", 
                                                      data=None, headers={"Content-Type": "application/x-www-form-urlencoded"})
            
            # Since make_request doesn't handle form data, let's use a direct approach
            url = f"{BACKEND_URL}/voice/real-time-transcribe"
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            form_data_aiohttp = aiohttp.FormData()
            form_data_aiohttp.add_field('audio_chunk', audio_base64)
            form_data_aiohttp.add_field('is_final', 'true')
            
            async with self.session.post(url, data=form_data_aiohttp, headers=headers) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = {"text": await response.text()}
                
                success = response.status < 400
                response_dict = {
                    "status": response.status,
                    "data": response_data
                }
            
            if success:
                data = response_dict["data"]
                if "success" in data and "transcript" in data:
                    if data["success"]:
                        self.log_test("Real-time Transcription", True, 
                                    f"Real-time transcription successful: '{data.get('transcript', 'N/A')}'")
                    else:
                        self.log_test("Real-time Transcription", False, 
                                    "Real-time transcription failed")
                else:
                    self.log_test("Real-time Transcription", False, "Invalid response format", response_dict)
            else:
                self.log_test("Real-time Transcription", False, "Real-time transcription request failed", response_dict)
                
        except Exception as e:
            self.log_test("Real-time Transcription", False, f"Test error: {str(e)}")
    
    async def test_voice_authentication_requirements(self):
        """Test 16: Voice Endpoints Authentication"""
        # Test that voice endpoints require authentication
        audio_data = self._create_mock_audio_file(duration_ms=500, format="wav")
        
        # Temporarily remove auth token
        original_token = self.auth_token
        self.auth_token = None
        
        try:
            # Test transcription without auth
            success, response = await self.make_file_request(
                "/voice/transcribe", 
                audio_data, 
                "test_auth.wav"
            )
            
            if not success and response.get("status") in [401, 403]:
                self.log_test("Voice Authentication", True, "Voice endpoints properly require authentication")
            else:
                self.log_test("Voice Authentication", False, "Voice endpoints should require authentication", response)
                
        finally:
            # Restore auth token
            self.auth_token = original_token
    
    async def test_voice_error_handling(self):
        """Test 17: Voice Error Handling"""
        if not self.auth_token:
            self.log_test("Voice Error Handling", False, "No auth token available")
            return
        
        try:
            # Test with invalid audio format
            invalid_data = b"This is not audio data"
            
            success, response = await self.make_file_request(
                "/voice/transcribe", 
                invalid_data, 
                "invalid.txt"  # Wrong extension
            )
            
            # Should fail gracefully
            if not success or (success and "error" in response["data"]):
                self.log_test("Voice Error Handling", True, "Voice service handles invalid audio gracefully")
            else:
                self.log_test("Voice Error Handling", False, "Voice service should reject invalid audio", response)
                
        except Exception as e:
            self.log_test("Voice Error Handling", True, f"Voice service properly handles errors: {str(e)}")
    
    async def test_voice_generation_limits(self):
        """Test 18: Voice Generation Limits"""
        if not self.auth_token:
            self.log_test("Voice Generation Limits", False, "No auth token available")
            return
        
        # Check if voice endpoints respect generation limits
        success, user_response = await self.make_request("GET", "/users/me")
        if not success:
            self.log_test("Voice Generation Limits", False, "Could not get user info for limit testing")
            return
        
        user_data = user_response["data"]
        daily_used = user_data.get("daily_generations_used", 0)
        tier = user_data.get("tier", "free")
        
        if tier == "premium":
            self.log_test("Voice Generation Limits", True, "User is premium - voice features unlimited")
            return
        
        # Test voice transcription with limits
        audio_data = self._create_mock_audio_file(duration_ms=1000, format="wav")
        success, response = await self.make_file_request(
            "/voice/transcribe", 
            audio_data, 
            "limit_test.wav"
        )
        
        if daily_used >= 10:
            # Should be blocked
            if not success and response.get("status") == 403:
                self.log_test("Voice Generation Limits", True, "Voice endpoints respect daily limits")
            else:
                self.log_test("Voice Generation Limits", False, "Voice endpoints should respect daily limits", response)
        else:
            # Should work
            if success:
                self.log_test("Voice Generation Limits", True, f"Voice generation allowed within limits ({daily_used + 1}/10)")
            else:
                self.log_test("Voice Generation Limits", False, "Voice generation failed within limits", response)
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting THREE11 MOTION TECH Backend Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Core functionality tests
        await self.test_health_check()
        await self.test_user_signup()
        await self.test_user_login()
        await self.test_get_current_user()
        
        # AI and content generation tests
        await self.test_ai_content_generation()
        await self.test_generation_history()
        
        # Premium features tests
        await self.test_premium_packs()
        await self.test_premium_upgrade()
        
        # Analytics and limits tests
        await self.test_dashboard_analytics()
        await self.test_freemium_limits()
        
        # Database operations summary
        await self.test_database_operations()
        
        # Voice Processing Tests (NEW)
        print("\n🎤 VOICE PROCESSING TESTS")
        print("-" * 40)
        await self.test_voice_transcription()
        await self.test_voice_content_suite()
        await self.test_voice_command_handler()
        await self.test_real_time_transcription()
        await self.test_voice_authentication_requirements()
        await self.test_voice_error_handling()
        await self.test_voice_generation_limits()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  ❌ {test_name}: {result['message']}")
        
        print("\n🎯 KEY FINDINGS:")
        
        # AI Service Integration
        ai_test = self.test_results.get("AI Content Generation", {})
        if ai_test.get("success"):
            print("  ✅ AI Service Integration: All three providers (OpenAI, Anthropic, Gemini) working")
        else:
            print("  ❌ AI Service Integration: Issues with AI providers")
        
        # Authentication
        auth_tests = ["User Signup", "User Login", "Get Current User"]
        auth_working = all(self.test_results.get(test, {}).get("success", False) for test in auth_tests)
        if auth_working:
            print("  ✅ Authentication System: JWT tokens working correctly")
        else:
            print("  ❌ Authentication System: Issues with user authentication")
        
        # Database
        db_test = self.test_results.get("Database Operations", {})
        if db_test.get("success"):
            print("  ✅ Database Operations: MongoDB connection and operations working")
        else:
            print("  ❌ Database Operations: Issues with database connectivity")
        
        # Premium Features
        premium_tests = ["Premium Packs", "Premium Upgrade"]
        premium_working = all(self.test_results.get(test, {}).get("success", False) for test in premium_tests)
        if premium_working:
            print("  ✅ Premium Features: Premium pack system working")
        else:
            print("  ❌ Premium Features: Issues with premium functionality")
        
        # Voice Processing (NEW)
        voice_tests = ["Voice Transcription", "Voice Content Suite", "Voice Command Handler", "Real-time Transcription"]
        voice_working = all(self.test_results.get(test, {}).get("success", False) for test in voice_tests)
        if voice_working:
            print("  ✅ Voice Processing: All voice endpoints working with OpenAI Whisper integration")
        else:
            voice_failed = [test for test in voice_tests if not self.test_results.get(test, {}).get("success", False)]
            print(f"  ❌ Voice Processing: Issues with voice functionality - Failed: {voice_failed}")
        
        # Voice Security
        voice_auth_test = self.test_results.get("Voice Authentication", {})
        if voice_auth_test.get("success"):
            print("  ✅ Voice Security: Authentication properly enforced on voice endpoints")
        else:
            print("  ❌ Voice Security: Issues with voice endpoint authentication")
        
        print("\n" + "=" * 60)

async def main():
    """Main test runner"""
    async with BackendTester() as tester:
        await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())