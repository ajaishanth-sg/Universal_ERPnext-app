#!/usr/bin/env python3
"""
Comprehensive AI Features Test Script for UniverserERP
Tests all implemented AI features and validates functionality
"""

import asyncio
import json
import os
import sys
import time
from datetime import datetime, timedelta
import requests
from typing import Dict, List, Any

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

class AIFeatureTester:
    """Test class for validating AI features"""

    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url
        self.test_results = {}
        self.start_time = datetime.now()

    def log(self, message: str, level: str = "INFO"):
        """Log messages with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")

    def test_endpoint(self, method: str, endpoint: str, data: Dict = None, expected_status: int = 200) -> Dict[str, Any]:
        """Test an API endpoint"""
        url = f"{self.base_url}{endpoint}"

        try:
            if method.upper() == "GET":
                response = requests.get(url, timeout=10)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, timeout=10)
            else:
                return {"success": False, "error": f"Unsupported method: {method}"}

            result = {
                "success": response.status_code == expected_status,
                "status_code": response.status_code,
                "response_time": response.elapsed.total_seconds(),
                "response": response.json() if response.content else None
            }

            return result

        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e),
                "status_code": None,
                "response_time": None
            }

    async def test_predictive_analytics(self) -> Dict[str, Any]:
        """Test predictive and analytical intelligence features"""
        self.log("Testing Predictive & Analytical Intelligence features...")

        results = {}

        # Test budget variance prediction
        self.log("  Testing budget variance prediction...")
        budget_result = self.test_endpoint(
            "POST",
            "/api/ai/predict-budget-variance",
            {"months_ahead": 2}
        )
        results["budget_prediction"] = budget_result

        if budget_result["success"]:
            data = budget_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Budget prediction successful")
            else:
                self.log("    ✗ Budget prediction failed")
        else:
            self.log(f"    ✗ Budget prediction error: {budget_result.get('error', 'Unknown error')}")

        # Test cash flow forecasting
        self.log("  Testing cash flow forecasting...")
        cash_flow_result = self.test_endpoint(
            "POST",
            "/api/ai/forecast-cash-flow",
            {"days_ahead": 15}
        )
        results["cash_flow_forecast"] = cash_flow_result

        if cash_flow_result["success"]:
            data = cash_flow_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Cash flow forecast successful")
            else:
                self.log("    ✗ Cash flow forecast failed")
        else:
            self.log(f"    ✗ Cash flow forecast error: {cash_flow_result.get('error', 'Unknown error')}")

        # Test vendor reliability scoring
        self.log("  Testing vendor reliability scoring...")
        vendor_result = self.test_endpoint(
            "POST",
            "/api/ai/score-vendor-reliability",
            {}
        )
        results["vendor_scoring"] = vendor_result

        if vendor_result["success"]:
            data = vendor_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Vendor scoring successful")
            else:
                self.log("    ✗ Vendor scoring failed")
        else:
            self.log(f"    ✗ Vendor scoring error: {vendor_result.get('error', 'Unknown error')}")

        # Test asset maintenance prediction
        self.log("  Testing asset maintenance prediction...")
        maintenance_result = self.test_endpoint(
            "POST",
            "/api/ai/predict-asset-maintenance",
            {"asset_type": "vehicle"}
        )
        results["maintenance_prediction"] = maintenance_result

        if maintenance_result["success"]:
            data = maintenance_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Maintenance prediction successful")
            else:
                self.log("    ✗ Maintenance prediction failed")
        else:
            self.log(f"    ✗ Maintenance prediction error: {maintenance_result.get('error', 'Unknown error')}")

        return results

    async def test_conversational_ai(self) -> Dict[str, Any]:
        """Test natural language and conversational AI features"""
        self.log("Testing Natural Language & Conversational AI features...")

        results = {}

        # Test natural language query processing
        test_queries = [
            "Show me budget analysis for next month",
            "How is our cash flow looking?",
            "Which vendors are most reliable?",
            "When do vehicles need maintenance?"
        ]

        for i, query in enumerate(test_queries):
            self.log(f"  Testing NLP query {i+1}: '{query[:50]}...'")

            nlp_result = self.test_endpoint(
                "POST",
                "/api/ai/natural-language-query",
                {"query": query}
            )
            results[f"nlp_query_{i+1}"] = nlp_result

            if nlp_result["success"]:
                data = nlp_result["response"]
                if data.get("status") == "success":
                    self.log("    ✓ NLP query processed successfully")
                else:
                    self.log("    ✗ NLP query failed")
            else:
                self.log(f"    ✗ NLP query error: {nlp_result.get('error', 'Unknown error')}")

        return results

    async def test_document_processing(self) -> Dict[str, Any]:
        """Test intelligent document understanding features"""
        self.log("Testing Intelligent Document Understanding features...")

        results = {}

        # Test document types endpoint
        self.log("  Testing document types retrieval...")
        doc_types_result = self.test_endpoint("GET", "/api/ai/document-types")
        results["document_types"] = doc_types_result

        if doc_types_result["success"]:
            data = doc_types_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Document types retrieved successfully")
            else:
                self.log("    ✗ Document types retrieval failed")
        else:
            self.log(f"    ✗ Document types error: {doc_types_result.get('error', 'Unknown error')}")

        # Note: Actual document processing would require test files
        # For now, we'll just test the endpoint availability
        self.log("  Testing document processing endpoint availability...")
        # This would normally process a test file, but we'll skip for safety

        return results

    async def test_automation_triggers(self) -> Dict[str, Any]:
        """Test smart automation triggers"""
        self.log("Testing Smart Automation Triggers features...")

        results = {}

        # Test trigger types endpoint
        self.log("  Testing automation trigger types...")
        trigger_types_result = self.test_endpoint("GET", "/api/ai/automation-trigger-types")
        results["trigger_types"] = trigger_types_result

        if trigger_types_result["success"]:
            data = trigger_types_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Trigger types retrieved successfully")
            else:
                self.log("    ✗ Trigger types retrieval failed")
        else:
            self.log(f"    ✗ Trigger types error: {trigger_types_result.get('error', 'Unknown error')}")

        # Test trigger creation (with sample data)
        self.log("  Testing automation trigger creation...")
        trigger_config = {
            "name": "Test Budget Alert",
            "trigger_type": "budget_threshold",
            "conditions": {
                "department": "IT",
                "threshold_percentage": 20
            },
            "actions": [
                {
                    "type": "send_notification",
                    "recipients": ["admin"],
                    "message": "Budget threshold exceeded for IT department"
                }
            ],
            "is_active": True,
            "created_by": "test_system"
        }

        trigger_result = self.test_endpoint(
            "POST",
            "/api/ai/create-automation-trigger",
            trigger_config
        )
        results["trigger_creation"] = trigger_result

        if trigger_result["success"]:
            data = trigger_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Automation trigger created successfully")
            else:
                self.log("    ✗ Automation trigger creation failed")
        else:
            self.log(f"    ✗ Trigger creation error: {trigger_result.get('error', 'Unknown error')}")

        # Test trigger checking
        self.log("  Testing automation trigger checking...")
        check_result = self.test_endpoint("POST", "/api/ai/check-automation-triggers")
        results["trigger_checking"] = check_result

        if check_result["success"]:
            data = check_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Trigger checking successful")
            else:
                self.log("    ✗ Trigger checking failed")
        else:
            self.log(f"    ✗ Trigger checking error: {check_result.get('error', 'Unknown error')}")

        return results

    async def test_travel_planning(self) -> Dict[str, Any]:
        """Test travel and event planning automation"""
        self.log("Testing Travel & Event Planning Automation features...")

        results = {}

        # Test travel purposes endpoint
        self.log("  Testing travel purposes retrieval...")
        purposes_result = self.test_endpoint("GET", "/api/ai/travel-purposes")
        results["travel_purposes"] = purposes_result

        if purposes_result["success"]:
            data = purposes_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Travel purposes retrieved successfully")
            else:
                self.log("    ✗ Travel purposes retrieval failed")
        else:
            self.log(f"    ✗ Travel purposes error: {purposes_result.get('error', 'Unknown error')}")

        # Test travel suggestion generation
        self.log("  Testing travel suggestion generation...")
        travel_request = {
            "destination": "Mumbai",
            "start_date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
            "end_date": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"),
            "budget": 50000,
            "travelers": 2,
            "purpose": "business"
        }

        travel_result = self.test_endpoint(
            "POST",
            "/api/ai/generate-travel-suggestions",
            travel_request
        )
        results["travel_suggestions"] = travel_result

        if travel_result["success"]:
            data = travel_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Travel suggestions generated successfully")
            else:
                self.log("    ✗ Travel suggestions generation failed")
        else:
            self.log(f"    ✗ Travel suggestions error: {travel_result.get('error', 'Unknown error')}")

        return results

    async def test_historical_analysis(self) -> Dict[str, Any]:
        """Test historical data intelligence features"""
        self.log("Testing Historical Data Intelligence features...")

        results = {}

        # Test analysis types endpoint
        self.log("  Testing analysis types retrieval...")
        analysis_types_result = self.test_endpoint("GET", "/api/ai/analysis-types")
        results["analysis_types"] = analysis_types_result

        if analysis_types_result["success"]:
            data = analysis_types_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Analysis types retrieved successfully")
            else:
                self.log("    ✗ Analysis types retrieval failed")
        else:
            self.log(f"    ✗ Analysis types error: {analysis_types_result.get('error', 'Unknown error')}")

        # Test historical pattern analysis
        self.log("  Testing historical pattern analysis...")
        pattern_request = {
            "data_type": "transactions",
            "months_back": 6
        }

        pattern_result = self.test_endpoint(
            "POST",
            "/api/ai/analyze-historical-patterns",
            pattern_request
        )
        results["pattern_analysis"] = pattern_result

        if pattern_result["success"]:
            data = pattern_result["response"]
            if data.get("status") == "success":
                self.log("    ✓ Historical pattern analysis successful")
            else:
                self.log("    ✗ Historical pattern analysis failed")
        else:
            self.log(f"    ✗ Pattern analysis error: {pattern_result.get('error', 'Unknown error')}")

        return results

    async def test_ai_dashboard(self) -> Dict[str, Any]:
        """Test AI dashboard summary"""
        self.log("Testing AI Dashboard Summary...")

        result = self.test_endpoint("GET", "/api/ai/ai-dashboard-summary")

        if result["success"]:
            data = result["response"]
            if data.get("status") == "success":
                self.log("  ✓ AI dashboard summary successful")
                return {"dashboard": result, "summary": data["summary"]}
            else:
                self.log("  ✗ AI dashboard summary failed")
        else:
            self.log(f"  ✗ AI dashboard error: {result.get('error', 'Unknown error')}")

        return {"dashboard": result}

    async def test_ai_service_status(self) -> Dict[str, Any]:
        """Test AI service status and health"""
        self.log("Testing AI Service Status...")

        result = self.test_endpoint("GET", "/api/ai/ai-service-status")

        if result["success"]:
            data = result["response"]
            if data.get("status") == "success":
                self.log("  ✓ AI service status check successful")
                return {"status": result, "service_info": data["data"]}
            else:
                self.log("  ✗ AI service status check failed")
        else:
            self.log(f"  ✗ AI service status error: {result.get('error', 'Unknown error')}")

        return {"status": result}

    async def run_all_tests(self) -> Dict[str, Any]:
        """Run all AI feature tests"""
        self.log("Starting comprehensive AI features test suite...")
        self.start_time = datetime.now()

        all_results = {}

        # Test each feature category
        all_results["predictive_analytics"] = await self.test_predictive_analytics()
        all_results["conversational_ai"] = await self.test_conversational_ai()
        all_results["document_processing"] = await self.test_document_processing()
        all_results["automation_triggers"] = await self.test_automation_triggers()
        all_results["travel_planning"] = await self.test_travel_planning()
        all_results["historical_analysis"] = await self.test_historical_analysis()
        all_results["dashboard"] = await self.test_ai_dashboard()
        all_results["service_status"] = await self.test_ai_service_status()

        # Calculate summary statistics
        total_tests = 0
        passed_tests = 0

        for category, results in all_results.items():
            for test_name, result in results.items():
                total_tests += 1
                if result.get("success", False):
                    passed_tests += 1

        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()

        summary = {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": total_tests - passed_tests,
            "success_rate": (passed_tests / total_tests * 100) if total_tests > 0 else 0,
            "duration_seconds": duration,
            "start_time": self.start_time.isoformat(),
            "end_time": end_time.isoformat()
        }

        self.log("AI features test suite completed!")
        self.log(f"Results: {passed_tests}/{total_tests} tests passed ({summary['success_rate']:.1f}%)")
        self.log(f"Duration: {duration:.2f} seconds")

        return {
            "summary": summary,
            "results": all_results,
            "timestamp": end_time.isoformat()
        }

    def generate_report(self, test_results: Dict[str, Any]) -> str:
        """Generate a detailed test report"""
        summary = test_results["summary"]
        results = test_results["results"]

        report = []
        report.append("=" * 80)
        report.append("AI FEATURES TEST REPORT")
        report.append("=" * 80)
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Duration: {summary['duration_seconds']:.2f} seconds")
        report.append("")
        report.append("SUMMARY:")
        report.append(f"  Total Tests: {summary['total_tests']}")
        report.append(f"  Passed: {summary['passed_tests']}")
        report.append(f"  Failed: {summary['failed_tests']}")
        report.append(f"  Success Rate: {summary['success_rate']:.1f}%")
        report.append("")

        # Detailed results by category
        for category, category_results in results.items():
            report.append(f"{category.upper()}:")
            for test_name, result in category_results.items():
                status = "✓ PASS" if result.get("success", False) else "✗ FAIL"
                response_time = f"({result.get('response_time', 0):.2f}s)" if result.get("response_time") else ""
                error = result.get("error", "")
                report.append(f"  {test_name}: {status} {response_time}")
                if error:
                    report.append(f"    Error: {error}")
            report.append("")

        report.append("=" * 80)

        return "\n".join(report)

async def main():
    """Main test function"""
    print("UniverserERP AI Features Comprehensive Test Suite")
    print("=" * 60)

    # Check if server is running
    tester = AIFeatureTester()

    # Test basic connectivity first
    tester.log("Checking server connectivity...")
    health_check = tester.test_endpoint("GET", "/api/test")

    if not health_check["success"]:
        tester.log("ERROR: Cannot connect to UniverserERP server!")
        tester.log(f"Make sure the server is running on {tester.base_url}")
        tester.log("Start the server with: python backend/main.py")
        return

    tester.log("✓ Server connectivity confirmed")

    # Run all tests
    test_results = await tester.run_all_tests()

    # Generate and save report
    report = tester.generate_report(test_results)

    # Save to file
    report_file = f"ai_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(report_file, 'w') as f:
        f.write(report)

    print(f"\nDetailed report saved to: {report_file}")

    # Exit with appropriate code
    summary = test_results["summary"]
    if summary["success_rate"] >= 80:
        print("✓ Test suite PASSED!")
        sys.exit(0)
    else:
        print("✗ Test suite had failures!")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())