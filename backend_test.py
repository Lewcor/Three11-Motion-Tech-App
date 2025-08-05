import requests
import sys
from datetime import datetime
import json

class THREE11MotionTechAPITester:
    def __init__(self, base_url="https://b239be0c-b21a-457e-8061-7daef839fe41.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"   Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    print(f"   Response: {response.text}")
                    return True, response.text
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ FAILED - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ FAILED - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )

    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"THREE11_Test_Client_{datetime.now().strftime('%H%M%S')}"
        }
        
        success, response = self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,  # Based on the FastAPI response_model, it should return 200
            data=test_data
        )
        
        if success and isinstance(response, dict):
            # Verify the response structure
            required_fields = ['id', 'client_name', 'timestamp']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field '{field}' in response")
                    return False, None
            
            print(f"   Created status check with ID: {response.get('id')}")
            return True, response.get('id')
        
        return False, None

    def test_get_status_checks(self):
        """Test retrieving status checks"""
        return self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )

    def test_cors_headers(self):
        """Test CORS configuration"""
        print(f"\n🔍 Testing CORS Headers...")
        url = f"{self.base_url}/api/"
        
        try:
            # Make an OPTIONS request to check CORS
            response = requests.options(url, headers={
                'Origin': 'https://b239be0c-b21a-457e-8061-7daef839fe41.preview.emergentagent.com',
                'Access-Control-Request-Method': 'GET'
            }, timeout=10)
            
            print(f"   OPTIONS Response Status: {response.status_code}")
            
            # Check for CORS headers
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            print(f"   CORS Headers: {json.dumps(cors_headers, indent=2)}")
            
            if cors_headers['Access-Control-Allow-Origin']:
                print("✅ CORS is configured")
                self.tests_passed += 1
            else:
                print("❌ CORS headers not found")
            
            self.tests_run += 1
            return True
            
        except Exception as e:
            print(f"❌ CORS test failed: {str(e)}")
            self.tests_run += 1
            return False

def main():
    print("🚀 Starting THREE11 MOTION TECH API Testing...")
    print("=" * 60)
    
    # Setup
    tester = THREE11MotionTechAPITester()
    
    # Test 1: Root endpoint
    print("\n📍 PHASE 1: Testing Root Endpoint")
    root_success, _ = tester.test_root_endpoint()
    
    # Test 2: Create status check
    print("\n📍 PHASE 2: Testing Status Check Creation")
    create_success, status_id = tester.test_create_status_check()
    
    # Test 3: Get status checks
    print("\n📍 PHASE 3: Testing Status Check Retrieval")
    get_success, _ = tester.test_get_status_checks()
    
    # Test 4: CORS configuration
    print("\n📍 PHASE 4: Testing CORS Configuration")
    cors_success = tester.test_cors_headers()
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 ALL TESTS PASSED! Backend is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the details above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())