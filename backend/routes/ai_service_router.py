"""
AI Service Router for UniverserERP
Exposes all AI features through REST API endpoints
"""

from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime, date
import json

from services.ai_service import ai_service

router = APIRouter()

# Request/Response Models
class BudgetPredictionRequest(BaseModel):
    department: Optional[str] = None
    months_ahead: int = 3

class CashFlowForecastRequest(BaseModel):
    days_ahead: int = 30

class VendorScoringRequest(BaseModel):
    vendor_id: Optional[str] = None

class AssetMaintenanceRequest(BaseModel):
    asset_type: str = 'vehicle'
    asset_id: Optional[str] = None

class NaturalLanguageQueryRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

class DocumentProcessingRequest(BaseModel):
    file_path: str
    document_type: str = 'auto'

class AutomationTriggerRequest(BaseModel):
    name: str
    trigger_type: str
    conditions: Dict[str, Any]
    actions: List[Dict[str, Any]]
    is_active: bool = True
    created_by: str = 'system'

class TravelSuggestionRequest(BaseModel):
    destination: str
    start_date: str
    end_date: Optional[str] = None
    budget: float = 0
    travelers: int = 1
    purpose: str = 'business'

class HistoricalAnalysisRequest(BaseModel):
    data_type: str = 'transactions'
    months_back: int = 12

# ==================== PREDICTIVE & ANALYTICAL INTELLIGENCE ====================

@router.post("/predict-budget-variance")
async def predict_budget_variance(request: BudgetPredictionRequest):
    """Predict budget variance based on historical spending patterns"""
    try:
        result = await ai_service.predict_budget_variance(
            department=request.department,
            months_ahead=request.months_ahead
        )

        if result['success']:
            return {
                "status": "success",
                "data": result,
                "timestamp": datetime.utcnow()
            }
        else:
            raise HTTPException(status_code=400, detail=result['message'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting budget variance: {str(e)}")

@router.post("/forecast-cash-flow")
async def forecast_cash_flow(request: CashFlowForecastRequest):
    """Forecast cash flow based on historical transactions"""
    try:
        result = await ai_service.forecast_cash_flow(days_ahead=request.days_ahead)

        if result['success']:
            return {
                "status": "success",
                "data": result,
                "timestamp": datetime.utcnow()
            }
        else:
            raise HTTPException(status_code=400, detail=result['message'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error forecasting cash flow: {str(e)}")

@router.post("/score-vendor-reliability")
async def score_vendor_reliability(request: VendorScoringRequest):
    """Score vendor reliability based on transaction history and patterns"""
    try:
        result = await ai_service.score_vendor_reliability(vendor_id=request.vendor_id)

        if result['success']:
            return {
                "status": "success",
                "data": result,
                "timestamp": datetime.utcnow()
            }
        else:
            raise HTTPException(status_code=400, detail=result['message'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scoring vendor reliability: {str(e)}")

@router.post("/predict-asset-maintenance")
async def predict_asset_maintenance(request: AssetMaintenanceRequest):
    """Predict when assets need maintenance"""
    try:
        result = await ai_service.predict_asset_maintenance(
            asset_type=request.asset_type,
            asset_id=request.asset_id
        )

        if result['success']:
            return {
                "status": "success",
                "data": result,
                "timestamp": datetime.utcnow()
            }
        else:
            raise HTTPException(status_code=400, detail=result['message'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting asset maintenance: {str(e)}")

# ==================== NATURAL LANGUAGE & CONVERSATIONAL AI ====================

@router.post("/natural-language-query")
async def process_natural_language_query(request: NaturalLanguageQueryRequest):
    """Process natural language queries and return structured responses"""
    try:
        result = await ai_service.process_natural_language_query(
            query=request.query,
            context=request.context
        )

        return {
            "status": "success",
            "data": result,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing natural language query: {str(e)}")

@router.get("/query-suggestions")
async def get_query_suggestions(intent: str = Query(default="general")):
    """Get query suggestions based on intent"""
    try:
        suggestions = ai_service._get_query_suggestions(intent)

        return {
            "status": "success",
            "suggestions": suggestions,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting query suggestions: {str(e)}")

# ==================== INTELLIGENT DOCUMENT UNDERSTANDING ====================

@router.post("/process-document")
async def process_document(request: DocumentProcessingRequest):
    """Process documents using OCR and AI for intelligent data extraction"""
    try:
        result = await ai_service.process_document(
            file_path=request.file_path,
            document_type=request.document_type
        )

        if result['success']:
            return {
                "status": "success",
                "data": result,
                "timestamp": datetime.utcnow()
            }
        else:
            raise HTTPException(status_code=400, detail=result['message'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

@router.get("/document-types")
async def get_supported_document_types():
    """Get list of supported document types"""
    try:
        document_types = [
            "invoice",
            "contract",
            "receipt",
            "maintenance_record",
            "general_document"
        ]

        return {
            "status": "success",
            "document_types": document_types,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting document types: {str(e)}")

# ==================== SMART AUTOMATION TRIGGERS ====================

@router.post("/create-automation-trigger")
async def create_automation_trigger(request: AutomationTriggerRequest):
    """Create intelligent automation triggers"""
    try:
        result = await ai_service.create_automation_trigger(request.dict())

        if result['success']:
            return {
                "status": "success",
                "data": result,
                "timestamp": datetime.utcnow()
            }
        else:
            raise HTTPException(status_code=400, detail=result['message'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating automation trigger: {str(e)}")

@router.post("/check-automation-triggers")
async def check_automation_triggers():
    """Check all active automation triggers and execute if conditions are met"""
    try:
        result = await ai_service.check_automation_triggers()

        return {
            "status": "success",
            "data": result,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking automation triggers: {str(e)}")

@router.get("/automation-trigger-types")
async def get_automation_trigger_types():
    """Get available automation trigger types"""
    try:
        trigger_types = [
            {
                "type": "budget_threshold",
                "name": "Budget Threshold",
                "description": "Triggers when spending exceeds budget threshold",
                "conditions": ["department", "threshold_percentage"]
            },
            {
                "type": "vendor_performance",
                "name": "Vendor Performance",
                "description": "Triggers when vendor performance drops below threshold",
                "conditions": ["min_score"]
            },
            {
                "type": "maintenance_prediction",
                "name": "Maintenance Prediction",
                "description": "Triggers when maintenance is predicted within timeframe",
                "conditions": ["days_ahead", "priority"]
            }
        ]

        return {
            "status": "success",
            "trigger_types": trigger_types,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting trigger types: {str(e)}")

# ==================== TRAVEL & EVENT PLANNING AUTOMATION ====================

@router.post("/generate-travel-suggestions")
async def generate_travel_suggestions(request: TravelSuggestionRequest):
    """Generate intelligent travel suggestions based on requirements"""
    try:
        result = await ai_service.generate_travel_suggestions(request.dict())

        if result['success']:
            return {
                "status": "success",
                "data": result,
                "timestamp": datetime.utcnow()
            }
        else:
            raise HTTPException(status_code=400, detail=result['message'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating travel suggestions: {str(e)}")

@router.get("/travel-purposes")
async def get_travel_purposes():
    """Get available travel purposes"""
    try:
        purposes = [
            "business",
            "conference",
            "training",
            "client_visit",
            "site_inspection",
            "personal"
        ]

        return {
            "status": "success",
            "purposes": purposes,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting travel purposes: {str(e)}")

# ==================== HISTORICAL DATA INTELLIGENCE ====================

@router.post("/analyze-historical-patterns")
async def analyze_historical_patterns(request: HistoricalAnalysisRequest):
    """Analyze historical data patterns to build intelligence"""
    try:
        result = await ai_service.analyze_historical_patterns(
            data_type=request.data_type,
            months_back=request.months_back
        )

        if result['success']:
            return {
                "status": "success",
                "data": result,
                "timestamp": datetime.utcnow()
            }
        else:
            raise HTTPException(status_code=400, detail=result['message'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing historical patterns: {str(e)}")

@router.get("/analysis-types")
async def get_analysis_types():
    """Get available analysis types"""
    try:
        analysis_types = [
            {
                "type": "transactions",
                "name": "Transaction Patterns",
                "description": "Analyze spending and income patterns"
            },
            {
                "type": "maintenance",
                "name": "Maintenance Patterns",
                "description": "Analyze maintenance request patterns"
            },
            {
                "type": "vendor_performance",
                "name": "Vendor Performance Patterns",
                "description": "Analyze vendor relationship patterns"
            }
        ]

        return {
            "status": "success",
            "analysis_types": analysis_types,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting analysis types: {str(e)}")

# ==================== COMPREHENSIVE AI DASHBOARD ====================

@router.get("/ai-dashboard-summary")
async def get_ai_dashboard_summary():
    """Get comprehensive AI dashboard summary"""
    try:
        # Get summary data from all AI features
        summary = {
            "predictive_analytics": {},
            "automation_status": {},
            "document_processing": {},
            "travel_insights": {},
            "historical_insights": {}
        }

        # Budget predictions summary
        budget_data = await ai_service.predict_budget_variance(months_ahead=1)
        if budget_data['success']:
            summary["predictive_analytics"]["budget_alerts"] = len(budget_data.get('alerts', []))

        # Cash flow summary
        cash_flow_data = await ai_service.forecast_cash_flow(days_ahead=7)
        if cash_flow_data['success']:
            summary["predictive_analytics"]["cash_flow_alerts"] = len(cash_flow_data.get('alerts', []))

        # Vendor scoring summary
        vendor_data = await ai_service.score_vendor_reliability()
        if vendor_data['success']:
            summary["predictive_analytics"]["vendor_insights"] = vendor_data['summary']

        # Maintenance predictions summary
        maintenance_data = await ai_service.predict_asset_maintenance()
        if maintenance_data['success']:
            summary["predictive_analytics"]["maintenance_alerts"] = maintenance_data['summary']

        # Automation triggers summary
        triggers_data = await ai_service.check_automation_triggers()
        if triggers_data['success']:
            summary["automation_status"] = {
                "triggers_checked": triggers_data['triggers_checked'],
                "triggers_executed": triggers_data['triggers_executed']
            }

        # Document processing summary (mock data for now)
        summary["document_processing"] = {
            "documents_processed_today": 0,
            "pending_classifications": 0
        }

        # Travel suggestions summary (mock data for now)
        summary["travel_insights"] = {
            "active_suggestions": 0,
            "budget_optimizations": 0
        }

        # Historical patterns summary
        patterns_data = await ai_service.analyze_historical_patterns()
        if patterns_data['success']:
            summary["historical_insights"] = {
                "patterns_identified": len(patterns_data.get('insights', [])),
                "analysis_coverage": "12_months"
            }

        return {
            "status": "success",
            "summary": summary,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting AI dashboard summary: {str(e)}")

# ==================== AI INSIGHTS AND RECOMMENDATIONS ====================

@router.get("/ai-insights")
async def get_ai_insights(
    insight_type: Optional[str] = None,
    limit: int = Query(default=20, le=100)
):
    """Get AI-generated insights and recommendations"""
    try:
        query = {}
        if insight_type:
            query['type'] = insight_type

        insights = []
        async for insight in ai_service.collections['ai_insights'].find(query).sort('created_at', -1).limit(limit):
            insight['_id'] = str(insight['_id'])
            insights.append(insight)

        return {
            "status": "success",
            "insights": insights,
            "count": len(insights),
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting AI insights: {str(e)}")

@router.post("/generate-custom-insights")
async def generate_custom_insights(
    analysis_type: str = Body(...),
    parameters: Dict[str, Any] = Body(...)
):
    """Generate custom AI insights based on specific requirements"""
    try:
        if analysis_type == 'budget_analysis':
            result = await ai_service.predict_budget_variance(**parameters)
        elif analysis_type == 'cash_flow_analysis':
            result = await ai_service.forecast_cash_flow(**parameters)
        elif analysis_type == 'vendor_analysis':
            result = await ai_service.score_vendor_reliability(**parameters)
        elif analysis_type == 'maintenance_analysis':
            result = await ai_service.predict_asset_maintenance(**parameters)
        elif analysis_type == 'pattern_analysis':
            result = await ai_service.analyze_historical_patterns(**parameters)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported analysis type: {analysis_type}")

        if result['success']:
            # Store the insight
            insight_record = {
                'type': f'custom_{analysis_type}',
                'data': result,
                'parameters': parameters,
                'created_at': datetime.utcnow()
            }

            await ai_service.collections['ai_insights'].insert_one(insight_record)

            return {
                "status": "success",
                "insight_id": str(insight_record['_id']),
                "data": result,
                "timestamp": datetime.utcnow()
            }
        else:
            raise HTTPException(status_code=400, detail=result['message'])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating custom insights: {str(e)}")

# ==================== SYSTEM STATUS AND HEALTH ====================

@router.get("/ai-service-status")
async def get_ai_service_status():
    """Get AI service status and capabilities"""
    try:
        status = {
            "service_status": "operational",
            "available_features": [
                "predictive_budget_variance",
                "cash_flow_forecasting",
                "vendor_reliability_scoring",
                "asset_maintenance_prediction",
                "natural_language_processing",
                "document_understanding",
                "automation_triggers",
                "travel_suggestions",
                "historical_pattern_analysis"
            ],
            "supported_document_types": [
                "invoice",
                "contract",
                "receipt",
                "maintenance_record"
            ],
            "supported_languages": ["english"],
            "model_status": {
                "nlp_models": "loaded",
                "prediction_models": "initialized",
                "document_processing": "ready"
            },
            "last_updated": datetime.utcnow()
        }

        return {
            "status": "success",
            "data": status,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting AI service status: {str(e)}")

@router.post("/test-ai-features")
async def test_ai_features():
    """Test all AI features and return comprehensive results"""
    try:
        test_results = {}

        # Test budget prediction
        try:
            budget_result = await ai_service.predict_budget_variance(months_ahead=1)
            test_results['budget_prediction'] = 'PASS' if budget_result['success'] else 'FAIL'
        except:
            test_results['budget_prediction'] = 'FAIL'

        # Test cash flow forecasting
        try:
            cash_flow_result = await ai_service.forecast_cash_flow(days_ahead=7)
            test_results['cash_flow_forecasting'] = 'PASS' if cash_flow_result['success'] else 'FAIL'
        except:
            test_results['cash_flow_forecasting'] = 'FAIL'

        # Test vendor scoring
        try:
            vendor_result = await ai_service.score_vendor_reliability()
            test_results['vendor_scoring'] = 'PASS' if vendor_result['success'] else 'FAIL'
        except:
            test_results['vendor_scoring'] = 'FAIL'

        # Test maintenance prediction
        try:
            maintenance_result = await ai_service.predict_asset_maintenance()
            test_results['maintenance_prediction'] = 'PASS' if maintenance_result['success'] else 'FAIL'
        except:
            test_results['maintenance_prediction'] = 'FAIL'

        # Test NLP processing
        try:
            nlp_result = await ai_service.process_natural_language_query("Show me budget analysis")
            test_results['nlp_processing'] = 'PASS' if nlp_result else 'FAIL'
        except:
            test_results['nlp_processing'] = 'FAIL'

        # Calculate overall status
        passed_tests = sum(1 for result in test_results.values() if result == 'PASS')
        total_tests = len(test_results)
        overall_status = 'PASS' if passed_tests >= total_tests * 0.8 else 'PARTIAL'

        return {
            "status": "success",
            "test_results": test_results,
            "overall_status": overall_status,
            "passed_tests": passed_tests,
            "total_tests": total_tests,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error testing AI features: {str(e)}")