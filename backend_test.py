#!/usr/bin/env python3
"""
Backend API Test Suite for PDF Comparison Report Download Feature
Tests the /api/compare and /api/cars endpoints required for PDF generation
"""

import requests
import json
import sys
from typing import Dict, Any, List

# Backend URL from frontend environment
BACKEND_URL = "https://carsidebyside.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'response_data': response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
    def test_cars_endpoint(self) -> List[Dict]:
        """Test GET /api/cars endpoint"""
        print("\n=== Testing Cars Endpoint ===")
        
        try:
            # Test basic cars listing
            response = self.session.get(f"{BACKEND_URL}/cars?page=1&limit=5")
            
            if response.status_code != 200:
                self.log_test(
                    "Cars Endpoint - Basic Request", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return []
                
            cars_data = response.json()
            
            if not isinstance(cars_data, list):
                self.log_test(
                    "Cars Endpoint - Response Format", 
                    False, 
                    f"Expected list, got {type(cars_data)}"
                )
                return []
                
            if len(cars_data) < 2:
                self.log_test(
                    "Cars Endpoint - Minimum Data", 
                    False, 
                    f"Need at least 2 cars for comparison, found {len(cars_data)}"
                )
                return []
                
            # Validate car data structure
            required_fields = ['CarID', 'ArabaMarka', 'CarModel', 'CarPrice', 'averageRating']
            for i, car in enumerate(cars_data[:2]):  # Check first 2 cars
                missing_fields = [field for field in required_fields if field not in car]
                if missing_fields:
                    self.log_test(
                        f"Cars Endpoint - Car {i+1} Structure", 
                        False, 
                        f"Missing fields: {missing_fields}"
                    )
                else:
                    self.log_test(
                        f"Cars Endpoint - Car {i+1} Structure", 
                        True, 
                        f"All required fields present: {car['CarID']}"
                    )
                    
            self.log_test(
                "Cars Endpoint - Basic Request", 
                True, 
                f"Successfully retrieved {len(cars_data)} cars"
            )
            
            return cars_data
            
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Cars Endpoint - Network", 
                False, 
                f"Network error: {str(e)}"
            )
            return []
        except json.JSONDecodeError as e:
            self.log_test(
                "Cars Endpoint - JSON Parse", 
                False, 
                f"Invalid JSON response: {str(e)}"
            )
            return []
        except Exception as e:
            self.log_test(
                "Cars Endpoint - Unexpected Error", 
                False, 
                f"Unexpected error: {str(e)}"
            )
            return []
            
    def test_compare_endpoint(self, cars_data: List[Dict]):
        """Test POST /api/compare endpoint"""
        print("\n=== Testing Compare Endpoint ===")
        
        if len(cars_data) < 2:
            self.log_test(
                "Compare Endpoint - Prerequisites", 
                False, 
                "Need at least 2 cars to test comparison"
            )
            return
            
        # Use first two cars for comparison
        car1_id = cars_data[0]['CarID']
        car2_id = cars_data[1]['CarID']
        
        try:
            # Test comparison request
            comparison_data = {
                "car1Id": car1_id,
                "car2Id": car2_id
            }
            
            response = self.session.post(
                f"{BACKEND_URL}/compare",
                json=comparison_data
            )
            
            if response.status_code != 200:
                self.log_test(
                    "Compare Endpoint - Basic Request", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return
                
            compare_result = response.json()
            
            # Validate response structure
            if not isinstance(compare_result, dict):
                self.log_test(
                    "Compare Endpoint - Response Format", 
                    False, 
                    f"Expected dict, got {type(compare_result)}"
                )
                return
                
            if 'car1' not in compare_result or 'car2' not in compare_result:
                self.log_test(
                    "Compare Endpoint - Response Structure", 
                    False, 
                    "Missing car1 or car2 in response"
                )
                return
                
            # Validate car data in comparison
            car1_data = compare_result['car1']
            car2_data = compare_result['car2']
            
            required_fields = ['CarID', 'ArabaMarka', 'CarModel', 'CarPrice', 'averageRating']
            
            for car_name, car_data in [('car1', car1_data), ('car2', car2_data)]:
                missing_fields = [field for field in required_fields if field not in car_data]
                if missing_fields:
                    self.log_test(
                        f"Compare Endpoint - {car_name} Data", 
                        False, 
                        f"Missing fields in {car_name}: {missing_fields}"
                    )
                else:
                    self.log_test(
                        f"Compare Endpoint - {car_name} Data", 
                        True, 
                        f"All required fields present for {car_data['CarID']}"
                    )
                    
            # Verify correct cars returned
            if car1_data['CarID'] != car1_id:
                self.log_test(
                    "Compare Endpoint - Car1 ID Match", 
                    False, 
                    f"Expected {car1_id}, got {car1_data['CarID']}"
                )
            else:
                self.log_test(
                    "Compare Endpoint - Car1 ID Match", 
                    True, 
                    f"Correct car1 returned: {car1_id}"
                )
                
            if car2_data['CarID'] != car2_id:
                self.log_test(
                    "Compare Endpoint - Car2 ID Match", 
                    False, 
                    f"Expected {car2_id}, got {car2_data['CarID']}"
                )
            else:
                self.log_test(
                    "Compare Endpoint - Car2 ID Match", 
                    True, 
                    f"Correct car2 returned: {car2_id}"
                )
                
            self.log_test(
                "Compare Endpoint - Basic Request", 
                True, 
                f"Successfully compared {car1_id} vs {car2_id}"
            )
            
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Compare Endpoint - Network", 
                False, 
                f"Network error: {str(e)}"
            )
        except json.JSONDecodeError as e:
            self.log_test(
                "Compare Endpoint - JSON Parse", 
                False, 
                f"Invalid JSON response: {str(e)}"
            )
        except Exception as e:
            self.log_test(
                "Compare Endpoint - Unexpected Error", 
                False, 
                f"Unexpected error: {str(e)}"
            )
            
    def test_compare_with_specific_ids(self):
        """Test compare endpoint with specific car IDs mentioned in requirements"""
        print("\n=== Testing Compare with Specific IDs ===")
        
        test_cases = [
            ("car-001", "car-002"),
            ("car-001", "car-003"),  # Alternative if car-002 doesn't exist
        ]
        
        for car1_id, car2_id in test_cases:
            try:
                comparison_data = {
                    "car1Id": car1_id,
                    "car2Id": car2_id
                }
                
                response = self.session.post(
                    f"{BACKEND_URL}/compare",
                    json=comparison_data
                )
                
                if response.status_code == 200:
                    self.log_test(
                        f"Compare Specific IDs - {car1_id} vs {car2_id}", 
                        True, 
                        "Successfully compared specific car IDs"
                    )
                    break  # Success with these IDs
                elif response.status_code == 404:
                    self.log_test(
                        f"Compare Specific IDs - {car1_id} vs {car2_id}", 
                        False, 
                        "One or both cars not found (404)"
                    )
                else:
                    self.log_test(
                        f"Compare Specific IDs - {car1_id} vs {car2_id}", 
                        False, 
                        f"HTTP {response.status_code}: {response.text}"
                    )
                    
            except Exception as e:
                self.log_test(
                    f"Compare Specific IDs - {car1_id} vs {car2_id}", 
                    False, 
                    f"Error: {str(e)}"
                )
                
    def test_error_handling(self):
        """Test error handling scenarios"""
        print("\n=== Testing Error Handling ===")
        
        # Test invalid car IDs
        try:
            invalid_comparison = {
                "car1Id": "invalid-car-1",
                "car2Id": "invalid-car-2"
            }
            
            response = self.session.post(
                f"{BACKEND_URL}/compare",
                json=invalid_comparison
            )
            
            if response.status_code == 404:
                self.log_test(
                    "Error Handling - Invalid Car IDs", 
                    True, 
                    "Correctly returned 404 for invalid car IDs"
                )
            else:
                self.log_test(
                    "Error Handling - Invalid Car IDs", 
                    False, 
                    f"Expected 404, got {response.status_code}"
                )
                
        except Exception as e:
            self.log_test(
                "Error Handling - Invalid Car IDs", 
                False, 
                f"Error: {str(e)}"
            )
            
        # Test malformed request
        try:
            response = self.session.post(
                f"{BACKEND_URL}/compare",
                json={"invalid": "data"}
            )
            
            if response.status_code in [400, 422]:  # Bad request or validation error
                self.log_test(
                    "Error Handling - Malformed Request", 
                    True, 
                    f"Correctly returned {response.status_code} for malformed request"
                )
            else:
                self.log_test(
                    "Error Handling - Malformed Request", 
                    False, 
                    f"Expected 400/422, got {response.status_code}"
                )
                
        except Exception as e:
            self.log_test(
                "Error Handling - Malformed Request", 
                False, 
                f"Error: {str(e)}"
            )
            
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests for PDF Comparison Feature")
        print(f"Backend URL: {BACKEND_URL}")
        
        # Test cars endpoint first
        cars_data = self.test_cars_endpoint()
        
        # Test compare endpoint with available cars
        if cars_data:
            self.test_compare_endpoint(cars_data)
            
        # Test compare with specific IDs
        self.test_compare_with_specific_ids()
        
        # Test error handling
        self.test_error_handling()
        
        # Summary
        self.print_summary()
        
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  ❌ {result['test']}: {result['message']}")
                    
        print("\n" + "="*60)
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)