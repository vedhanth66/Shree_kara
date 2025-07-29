#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Shree Kara Studios
Tests all authentication, upload, and retrieval endpoints
"""

import requests
import json
import base64
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "http://localhost:8001"

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.token = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_api_root(self):
        """Test the root API endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api")
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Shree Kara Studios API":
                    self.log_test("API Root", True, "API root endpoint working correctly")
                    return True
                else:
                    self.log_test("API Root", False, "Unexpected response message", data)
                    return False
            else:
                self.log_test("API Root", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("API Root", False, "Connection error", str(e))
            return False
    
    def test_login_valid_credentials(self):
        """Test login with valid credentials"""
        test_users = [
            {"username": "admin", "password": "shree123"},
            {"username": "author1", "password": "kara456"},
            {"username": "editor", "password": "studios789"}
        ]
        
        all_passed = True
        for user in test_users:
            try:
                response = requests.post(
                    f"{self.base_url}/api/auth/token",
                    data={
                        "username": user["username"],
                        "password": user["password"]
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "access_token" in data and "token_type" in data:
                        # Store token for first successful login
                        if not self.token:
                            self.token = data["access_token"]
                        self.log_test(f"Login Valid ({user['username']})", True, "Login successful with valid token")
                    else:
                        self.log_test(f"Login Valid ({user['username']})", False, "Missing token fields", data)
                        all_passed = False
                else:
                    self.log_test(f"Login Valid ({user['username']})", False, f"HTTP {response.status_code}", response.text)
                    all_passed = False
            except Exception as e:
                self.log_test(f"Login Valid ({user['username']})", False, "Connection error", str(e))
                all_passed = False
        
        return all_passed
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        invalid_tests = [
            {"username": "admin", "password": "wrongpass"},
            {"username": "nonexistent", "password": "anypass"},
            {"username": "author1", "password": "wrongpass"}
        ]
        
        all_passed = True
        for user in invalid_tests:
            try:
                response = requests.post(
                    f"{self.base_url}/api/auth/token",
                    data={
                        "username": user["username"],
                        "password": user["password"]
                    }
                )
                
                if response.status_code == 401:
                    self.log_test(f"Login Invalid ({user['username']})", True, "Correctly rejected invalid credentials")
                else:
                    self.log_test(f"Login Invalid ({user['username']})", False, f"Expected 401, got {response.status_code}", response.text)
                    all_passed = False
            except Exception as e:
                self.log_test(f"Login Invalid ({user['username']})", False, "Connection error", str(e))
                all_passed = False
        
        return all_passed
    
    def test_protected_route_without_token(self):
        """Test protected routes without authentication"""
        protected_endpoints = [
            "/api/upload/poem",
            "/api/upload/image", 
            "/api/upload/video",
            "/api/user/profile"
        ]
        
        all_passed = True
        for endpoint in protected_endpoints:
            try:
                if endpoint.startswith("/api/upload"):
                    # POST request for upload endpoints
                    response = requests.post(f"{self.base_url}{endpoint}", json={})
                else:
                    # GET request for other endpoints
                    response = requests.get(f"{self.base_url}{endpoint}")
                
                if response.status_code == 401:
                    self.log_test(f"Protected Route No Auth ({endpoint})", True, "Correctly requires authentication")
                else:
                    self.log_test(f"Protected Route No Auth ({endpoint})", False, f"Expected 401, got {response.status_code}", response.text)
                    all_passed = False
            except Exception as e:
                self.log_test(f"Protected Route No Auth ({endpoint})", False, "Connection error", str(e))
                all_passed = False
        
        return all_passed
    
    def test_protected_route_with_token(self):
        """Test protected routes with valid token"""
        if not self.token:
            self.log_test("Protected Route With Auth", False, "No valid token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        try:
            # Test profile endpoint
            response = requests.get(f"{self.base_url}/api/user/profile", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if "username" in data and "role" in data:
                    self.log_test("Protected Route With Auth", True, "Profile endpoint accessible with valid token")
                    return True
                else:
                    self.log_test("Protected Route With Auth", False, "Missing expected profile fields", data)
                    return False
            else:
                self.log_test("Protected Route With Auth", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Protected Route With Auth", False, "Connection error", str(e))
            return False
    
    def test_poem_upload(self):
        """Test poem upload endpoint"""
        if not self.token:
            self.log_test("Poem Upload", False, "No valid token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        poem_data = {
            "title": "Test Poem - Shree Kara",
            "content": "In the realm of art and creativity,\nShree Kara Studios stands tall,\nWhere poems flow like rivers,\nAnd stories captivate all.",
            "author": "Kara Poet"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/upload/poem",
                json=poem_data,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "poem_id" in data:
                    self.log_test("Poem Upload", True, "Poem uploaded successfully")
                    return True
                else:
                    self.log_test("Poem Upload", False, "Missing expected response fields", data)
                    return False
            else:
                self.log_test("Poem Upload", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Poem Upload", False, "Connection error", str(e))
            return False
    
    def test_poem_upload_missing_fields(self):
        """Test poem upload with missing required fields"""
        if not self.token:
            self.log_test("Poem Upload Missing Fields", False, "No valid token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Test with missing title
        incomplete_data = {
            "content": "Some content",
            "author": "Some author"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/upload/poem",
                json=incomplete_data,
                headers=headers
            )
            
            if response.status_code == 422:  # FastAPI validation error
                self.log_test("Poem Upload Missing Fields", True, "Correctly validates required fields")
                return True
            else:
                self.log_test("Poem Upload Missing Fields", False, f"Expected 422, got {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Poem Upload Missing Fields", False, "Connection error", str(e))
            return False
    
    def test_image_upload(self):
        """Test image upload endpoint"""
        if not self.token:
            self.log_test("Image Upload", False, "No valid token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Create a simple base64 encoded test image (1x1 pixel PNG)
        test_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        image_data = {
            "title": "Test Image - Shree Kara Gallery",
            "description": "A beautiful test image for Shree Kara Studios gallery",
            "image_data": test_image_b64
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/upload/image",
                json=image_data,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "image_id" in data:
                    self.log_test("Image Upload", True, "Image uploaded successfully")
                    return True
                else:
                    self.log_test("Image Upload", False, "Missing expected response fields", data)
                    return False
            else:
                self.log_test("Image Upload", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Image Upload", False, "Connection error", str(e))
            return False
    
    def test_video_upload(self):
        """Test video upload endpoint"""
        if not self.token:
            self.log_test("Video Upload", False, "No valid token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Create a simple base64 encoded test video data (minimal)
        test_video_b64 = "UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA=="
        
        video_data = {
            "title": "Test Video - Shree Kara Productions",
            "description": "A sample video for Shree Kara Studios showcase",
            "video_data": test_video_b64
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/upload/video",
                json=video_data,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "video_id" in data:
                    self.log_test("Video Upload", True, "Video uploaded successfully")
                    return True
                else:
                    self.log_test("Video Upload", False, "Missing expected response fields", data)
                    return False
            else:
                self.log_test("Video Upload", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Video Upload", False, "Connection error", str(e))
            return False
    
    def test_public_endpoints(self):
        """Test public content retrieval endpoints"""
        public_endpoints = [
            "/api/poems",
            "/api/images", 
            "/api/videos"
        ]
        
        all_passed = True
        for endpoint in public_endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}")
                
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        self.log_test(f"Public Endpoint ({endpoint})", True, f"Returns list with {len(data)} items")
                    else:
                        self.log_test(f"Public Endpoint ({endpoint})", False, "Expected list response", type(data))
                        all_passed = False
                else:
                    self.log_test(f"Public Endpoint ({endpoint})", False, f"HTTP {response.status_code}", response.text)
                    all_passed = False
            except Exception as e:
                self.log_test(f"Public Endpoint ({endpoint})", False, "Connection error", str(e))
                all_passed = False
        
        return all_passed
    
    def run_all_tests(self):
        """Run all test suites"""
        print("=" * 60)
        print("SHREE KARA STUDIOS BACKEND API TEST SUITE")
        print("=" * 60)
        
        # Test sequence
        tests = [
            ("API Root", self.test_api_root),
            ("Valid Login", self.test_login_valid_credentials),
            ("Invalid Login", self.test_login_invalid_credentials),
            ("Protected Routes (No Auth)", self.test_protected_route_without_token),
            ("Protected Routes (With Auth)", self.test_protected_route_with_token),
            ("Poem Upload", self.test_poem_upload),
            ("Poem Upload (Missing Fields)", self.test_poem_upload_missing_fields),
            ("Image Upload", self.test_image_upload),
            ("Video Upload", self.test_video_upload),
            ("Public Endpoints", self.test_public_endpoints)
        ]
        
        passed = 0
        total = 0
        
        for test_name, test_func in tests:
            print(f"\n--- Running {test_name} Tests ---")
            if test_func():
                passed += 1
            total += 1
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Test Suites: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Detailed results
        print("\nDETAILED RESULTS:")
        for result in self.test_results:
            print(f"{result['status']}: {result['test']} - {result['message']}")
        
        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)