import requests
import sys
from datetime import datetime
import json
import time
import base64

class THREE11MotionTechAPITester:
    def __init__(self, base_url="https://app.gentag.ai"):
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
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)

            print(f"   Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    # Truncate large base64 data for readability
                    if isinstance(response_data, dict) and 'scenes' in response_data:
                        for scene in response_data.get('scenes', []):
                            if 'image_base64' in scene and len(scene['image_base64']) > 100:
                                scene['image_base64'] = scene['image_base64'][:50] + "...[truncated]"
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
                'Origin': 'https://aa0e4ae2-2066-4d52-994a-7dc6ae7f1f0b.preview.emergentagent.com',
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

    # AI Video Studio Tests
    def test_video_generation(self):
        """Test AI video generation endpoint"""
        test_data = {
            "title": "Test Video Creation",
            "script": "Welcome to THREE11 MOTION TECH. We create amazing content with AI. Join thousands of creators worldwide.",
            "video_format": "tiktok",
            "voice_style": "professional",
            "number_of_scenes": 3
        }
        
        success, response = self.run_test(
            "AI Video Generation",
            "POST",
            "api/video/generate",
            200,
            data=test_data
        )
        
        if success and isinstance(response, dict):
            # Verify the response structure
            required_fields = ['id', 'title', 'script', 'video_format', 'voice_style', 'scenes', 'status', 'created_at']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field '{field}' in response")
                    return False, None
            
            # Verify scenes structure
            scenes = response.get('scenes', [])
            if not scenes:
                print(f"❌ No scenes generated")
                return False, None
                
            for i, scene in enumerate(scenes):
                scene_fields = ['id', 'text', 'duration']
                for field in scene_fields:
                    if field not in scene:
                        print(f"❌ Missing field '{field}' in scene {i}")
                        return False, None
            
            print(f"   Generated {len(scenes)} scenes for video project")
            print(f"   Project ID: {response.get('id')}")
            print(f"   Status: {response.get('status')}")
            return True, response.get('id')
        
        return False, None

    def test_get_video_projects(self):
        """Test retrieving all video projects"""
        success, response = self.run_test(
            "Get Video Projects",
            "GET",
            "api/video/projects",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} video projects")
            return True, response
        
        return False, []

    def test_get_specific_video_project(self, project_id):
        """Test retrieving a specific video project"""
        if not project_id:
            print("❌ No project ID provided for specific project test")
            return False, None
            
        success, response = self.run_test(
            f"Get Specific Video Project ({project_id})",
            "GET",
            f"api/video/projects/{project_id}",
            200
        )
        
        if success and isinstance(response, dict):
            if response.get('id') == project_id:
                print(f"   Successfully retrieved project: {response.get('title')}")
                return True, response
            else:
                print(f"❌ Project ID mismatch: expected {project_id}, got {response.get('id')}")
        
        return False, None

    def test_delete_video_project(self, project_id):
        """Test deleting a video project"""
        if not project_id:
            print("❌ No project ID provided for deletion test")
            return False
            
        success, response = self.run_test(
            f"Delete Video Project ({project_id})",
            "DELETE",
            f"api/video/projects/{project_id}",
            200
        )
        
        if success:
            print(f"   Successfully deleted project {project_id}")
            return True
        
        return False

    def test_video_generation_error_handling(self):
        """Test error handling for video generation"""
        print(f"\n🔍 Testing Video Generation Error Handling...")
        
        # Test with missing required fields
        invalid_data = {
            "title": "Test Video",
            # Missing script, video_format
        }
        
        success, response = self.run_test(
            "Video Generation - Invalid Data",
            "POST",
            "api/video/generate",
            422,  # Validation error
            data=invalid_data
        )
        
        return success

    def test_nonexistent_project_retrieval(self):
        """Test retrieving a non-existent project"""
        fake_project_id = "nonexistent-project-id-12345"
        
        success, response = self.run_test(
            "Get Non-existent Project",
            "GET",
            f"api/video/projects/{fake_project_id}",
            404
        )
        
        return success

    def test_nonexistent_project_deletion(self):
        """Test deleting a non-existent project"""
        fake_project_id = "nonexistent-project-id-12345"
        
        success, response = self.run_test(
            "Delete Non-existent Project",
            "DELETE",
            f"api/video/projects/{fake_project_id}",
            404
        )
        
        return success

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
    
    # AI Video Studio Tests
    print("\n📍 PHASE 5: Testing AI Video Generation")
    video_gen_success, project_id = tester.test_video_generation()
    
    print("\n📍 PHASE 6: Testing Video Project Management")
    projects_success, projects = tester.test_get_video_projects()
    
    # Test specific project retrieval if we have a project ID
    specific_project_success = False
    if project_id:
        specific_project_success, _ = tester.test_get_specific_video_project(project_id)
    
    print("\n📍 PHASE 7: Testing Error Handling")
    error_handling_success = tester.test_video_generation_error_handling()
    nonexistent_get_success = tester.test_nonexistent_project_retrieval()
    nonexistent_delete_success = tester.test_nonexistent_project_deletion()
    
    # Test project deletion (if we have a project to delete)
    delete_success = False
    if project_id:
        print("\n📍 PHASE 8: Testing Project Deletion")
        delete_success = tester.test_delete_video_project(project_id)
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Detailed results
    print("\n📋 DETAILED RESULTS:")
    print(f"✅ Basic API Tests: {'PASSED' if all([root_success, create_success, get_success, cors_success]) else 'FAILED'}")
    print(f"✅ AI Video Generation: {'PASSED' if video_gen_success else 'FAILED'}")
    print(f"✅ Project Management: {'PASSED' if projects_success else 'FAILED'}")
    print(f"✅ Error Handling: {'PASSED' if all([error_handling_success, nonexistent_get_success, nonexistent_delete_success]) else 'FAILED'}")
    
    if tester.tests_passed == tester.tests_run:
        print("\n🎉 ALL TESTS PASSED! AI Video Studio Backend is working correctly.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())