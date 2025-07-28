#!/usr/bin/env python3
"""
Focused test for AI-Powered Competitor Analysis functionality
"""

import asyncio
import aiohttp
import json
from datetime import datetime

# Test configuration
BACKEND_URL = "https://5595acd4-cd0c-4012-b990-b8309969d56b.preview.emergentagent.com/api"
TEST_USER_EMAIL = "fashionista@three11motion.com"
TEST_USER_NAME = "Fashion Creator"

class CompetitorAnalysisTest:
    def __init__(self):
        self.session = None
        self.auth_token = None
        self.user_id = None
        self.competitor_id = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def make_request(self, method: str, endpoint: str, data: dict = None) -> tuple[bool, dict]:
        """Make HTTP request and return success status and response"""
        try:
            url = f"{BACKEND_URL}{endpoint}"
            headers = {"Content-Type": "application/json"}
            
            if self.auth_token:
                headers["Authorization"] = f"Bearer {self.auth_token}"
            
            async with self.session.request(
                method, url, 
                json=data if data else None,
                headers=headers
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
    
    async def authenticate(self):
        """Authenticate user"""
        print("🔐 Authenticating user...")
        
        # Try login first
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": "test"
        }
        
        success, response = await self.make_request("POST", "/auth/login", login_data)
        
        if success and "access_token" in response["data"]:
            self.auth_token = response["data"]["access_token"]
            self.user_id = response["data"]["user"]["id"]
            print(f"✅ Authentication successful - User ID: {self.user_id[:8]}...")
            return True
        else:
            print(f"❌ Authentication failed: {response}")
            return False
    
    async def test_competitor_discovery(self):
        """Test competitor discovery with Nike"""
        print("\n🔍 Testing Competitor Discovery...")
        
        discovery_data = {
            "query": "Nike"
        }
        
        success, response = await self.make_request("POST", "/competitor/discover", discovery_data)
        
        print(f"Request URL: {BACKEND_URL}/competitor/discover")
        print(f"Request Data: {discovery_data}")
        print(f"Response Status: {response.get('status')}")
        print(f"Response: {json.dumps(response, indent=2)}")
        
        if success:
            data = response["data"]
            if "success" in data and data["success"]:
                self.competitor_id = data["competitor_id"]
                print(f"✅ Competitor discovery successful - ID: {self.competitor_id[:8]}...")
                return True
            else:
                print(f"❌ Discovery failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Discovery request failed: {response}")
            return False
    
    async def test_strategy_analysis(self):
        """Test competitor strategy analysis"""
        if not self.competitor_id:
            print("❌ No competitor_id available for strategy analysis")
            return False
            
        print("\n📊 Testing Strategy Analysis...")
        
        success, response = await self.make_request("POST", f"/competitor/{self.competitor_id}/analyze-strategy")
        
        print(f"Request URL: {BACKEND_URL}/competitor/{self.competitor_id}/analyze-strategy")
        print(f"Response Status: {response.get('status')}")
        print(f"Response: {json.dumps(response, indent=2)}")
        
        if success:
            data = response["data"]
            if "success" in data and data["success"]:
                print(f"✅ Strategy analysis successful - ID: {data['analysis_id'][:8]}...")
                return True
            else:
                print(f"❌ Strategy analysis failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Strategy analysis request failed: {response}")
            return False
    
    async def test_competitive_content_generation(self):
        """Test competitive content generation"""
        if not self.competitor_id:
            print("❌ No competitor_id available for content generation")
            return False
            
        print("\n🎯 Testing Competitive Content Generation...")
        
        content_data = {
            "content_type": "viral_posts"
        }
        
        success, response = await self.make_request("POST", f"/competitor/{self.competitor_id}/generate-content", content_data)
        
        print(f"Request URL: {BACKEND_URL}/competitor/{self.competitor_id}/generate-content")
        print(f"Request Data: {content_data}")
        print(f"Response Status: {response.get('status')}")
        print(f"Response: {json.dumps(response, indent=2)}")
        
        if success:
            data = response["data"]
            if "success" in data and data["success"]:
                print(f"✅ Content generation successful - ID: {data['generation_id'][:8]}...")
                return True
            else:
                print(f"❌ Content generation failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Content generation request failed: {response}")
            return False
    
    async def test_gap_analysis(self):
        """Test competitor gap analysis"""
        if not self.competitor_id:
            print("❌ No competitor_id available for gap analysis")
            return False
            
        print("\n🔍 Testing Gap Analysis...")
        
        success, response = await self.make_request("GET", f"/competitor/{self.competitor_id}/gap-analysis")
        
        print(f"Request URL: {BACKEND_URL}/competitor/{self.competitor_id}/gap-analysis")
        print(f"Response Status: {response.get('status')}")
        print(f"Response: {json.dumps(response, indent=2)}")
        
        if success:
            data = response["data"]
            if "success" in data and data["success"]:
                print(f"✅ Gap analysis successful - ID: {data['analysis_id'][:8]}...")
                return True
            else:
                print(f"❌ Gap analysis failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Gap analysis request failed: {response}")
            return False
    
    async def test_competitors_list(self):
        """Test getting user's competitors list"""
        print("\n📋 Testing Competitors List...")
        
        success, response = await self.make_request("GET", "/competitor/list")
        
        print(f"Request URL: {BACKEND_URL}/competitor/list")
        print(f"Response Status: {response.get('status')}")
        print(f"Response: {json.dumps(response, indent=2)}")
        
        if success:
            data = response["data"]
            if "success" in data and data["success"]:
                competitors_count = len(data["competitors"])
                print(f"✅ Competitors list retrieved - Count: {competitors_count}")
                return True
            else:
                print(f"❌ Competitors list failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Competitors list request failed: {response}")
            return False
    
    async def run_all_tests(self):
        """Run all competitor analysis tests"""
        print("🎯 AI-POWERED COMPETITOR ANALYSIS TESTING")
        print("=" * 50)
        
        # Authenticate first
        if not await self.authenticate():
            print("❌ Cannot proceed without authentication")
            return
        
        # Run tests in sequence
        tests = [
            ("Competitor Discovery", self.test_competitor_discovery),
            ("Strategy Analysis", self.test_strategy_analysis),
            ("Competitive Content Generation", self.test_competitive_content_generation),
            ("Gap Analysis", self.test_gap_analysis),
            ("Competitors List", self.test_competitors_list)
        ]
        
        results = {}
        for test_name, test_func in tests:
            try:
                results[test_name] = await test_func()
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {e}")
                results[test_name] = False
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed} ✅")
        print(f"Failed: {total - passed} ❌")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        print("\n🔍 DETAILED RESULTS:")
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {status} {test_name}")

async def main():
    """Main test runner"""
    async with CompetitorAnalysisTest() as tester:
        await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())