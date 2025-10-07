"""
Comprehensive AI Service Layer for UniverserERP
Implements all AI features including predictive analytics, document understanding,
conversational AI, automation triggers, and intelligent insights.
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timedelta, date
from typing import Dict, List, Any, Optional, Tuple
import re
import random
import math
from collections import defaultdict, Counter
import statistics

# ML and AI libraries
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import joblib

# Document processing
import fitz  # PyMuPDF for PDF processing
import docx
from PIL import Image
import pytesseract
import cv2

# Email processing
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import imaplib
import smtplib

# NLP
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Database
from database import db

# Models
from models.predictive_maintenance import AssetType, MaintenanceStatus, MaintenancePriority

class AIService:
    """Main AI service class that orchestrates all AI features"""

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.models_path = os.path.join(os.path.dirname(__file__), '..', 'models')
        os.makedirs(self.models_path, exist_ok=True)

        # Initialize NLP components
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
            nltk.data.find('corpora/wordnet')
        except LookupError:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('wordnet', quiet=True)

        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

        # Initialize collections
        self.collections = {
            'transactions': db.transactions,
            'invoices': db.purchase_invoices,
            'vehicles': db.vehicles,
            'assets': db.inventory,
            'emails': db.emails,
            'documents': db.documents,
            'travel_trips': db.travel_trips,
            'maintenance_requests': db.maintenance_requests,
            'accounts_payable': db.accounts_payable,
            'accounts_receivable': db.accounts_receivable,
            'debit_cards': db.debit_cards,
            'team_members': db.team_members,
            'housing_staff': db.housing_staff,
            'properties': db.properties,
            'drivers': db.drivers,
            'racing_payments': db.racing_payments,
            'shipments': db.shipments,
            'spv_companies': db.spv_companies,
            'abroad_staff': db.abroad_staff,
            'capital_calls': db.capital_calls,
            'payroll': db.payroll,
            'maintenance_schedules': db.maintenance_schedules,
            'predictive_maintenance_alerts': db.predictive_maintenance_alerts,
            'ai_insights': db.ai_insights,
            'vendor_scores': db.vendor_scores,
            'cash_flow_predictions': db.cash_flow_predictions,
            'budget_analytics': db.budget_analytics,
            'document_classifications': db.document_classifications,
            'automation_triggers': db.automation_triggers,
            'travel_suggestions': db.travel_suggestions,
            'historical_patterns': db.historical_patterns
        }

    # ==================== PREDICTIVE & ANALYTICAL INTELLIGENCE ====================

    async def predict_budget_variance(self, department: str = None, months_ahead: int = 3) -> Dict[str, Any]:
        """Predict budget variance based on historical spending patterns"""
        try:
            # Get historical transaction data
            pipeline = [
                {
                    '$group': {
                        '_id': {
                            'month': {'$month': '$date'},
                            'year': {'$year': '$date'},
                            'department': '$department'
                        },
                        'total_amount': {'$sum': '$amount'},
                        'transaction_count': {'$sum': 1}
                    }
                },
                {'$sort': {'_id.year': 1, '_id.month': 1}}
            ]

            if department:
                pipeline.insert(0, {'$match': {'department': department}})

            historical_data = []
            async for record in self.collections['transactions'].aggregate(pipeline):
                historical_data.append({
                    'period': f"{record['_id']['year']}-{record['_id']['month']:02d}",
                    'amount': record['total_amount'],
                    'count': record['transaction_count']
                })

            if len(historical_data) < 3:
                return {
                    'success': False,
                    'message': 'Insufficient historical data for budget prediction',
                    'predictions': []
                }

            # Prepare data for linear regression
            periods = list(range(len(historical_data)))
            amounts = [record['amount'] for record in historical_data]

            # Simple linear regression for trend analysis
            if len(periods) > 1:
                slope = (amounts[-1] - amounts[0]) / len(amounts) if len(amounts) > 1 else 0
            else:
                slope = 0

            # Generate predictions
            predictions = []
            last_period = len(historical_data)

            for i in range(1, months_ahead + 1):
                predicted_amount = amounts[-1] + (slope * i)
                variance = predicted_amount - amounts[-1] if amounts else 0

                predictions.append({
                    'period': f"Month +{i}",
                    'predicted_amount': round(predicted_amount, 2),
                    'expected_variance': round(variance, 2),
                    'confidence': max(60, 90 - (i * 5))  # Decreasing confidence over time
                })

            # Calculate variance alerts
            current_avg = statistics.mean(amounts[-3:]) if len(amounts) >= 3 else amounts[-1]
            alerts = []

            for pred in predictions:
                if pred['expected_variance'] > (current_avg * 0.2):  # 20% threshold
                    alerts.append({
                        'type': 'HIGH_VARIANCE',
                        'message': f"Predicted {pred['expected_variance']:.2f} variance in {pred['period']}",
                        'severity': 'HIGH' if pred['expected_variance'] > (current_avg * 0.3) else 'MEDIUM'
                    })

            return {
                'success': True,
                'predictions': predictions,
                'alerts': alerts,
                'trend': 'increasing' if slope > 0 else 'decreasing',
                'confidence': 85
            }

        except Exception as e:
            self.logger.error(f"Error in budget prediction: {str(e)}")
            return {
                'success': False,
                'message': f'Error generating budget predictions: {str(e)}',
                'predictions': []
            }

    async def forecast_cash_flow(self, days_ahead: int = 30) -> Dict[str, Any]:
        """Forecast cash flow based on historical transactions and patterns"""
        try:
            # Get recent transactions (last 90 days)
            start_date = datetime.utcnow() - timedelta(days=90)

            inflow_query = {'amount': {'$gt': 0}, 'date': {'$gte': start_date}}
            outflow_query = {'amount': {'$lt': 0}, 'date': {'$gte': start_date}}

            inflows = []
            outflows = []

            async for txn in self.collections['transactions'].find(inflow_query):
                inflows.append({
                    'date': txn['date'],
                    'amount': abs(txn['amount']),
                    'type': txn.get('type', 'unknown')
                })

            async for txn in self.collections['transactions'].find(outflow_query):
                outflows.append({
                    'date': txn['date'],
                    'amount': abs(txn['amount']),
                    'type': txn.get('type', 'unknown')
                })

            if not inflows and not outflows:
                return {
                    'success': False,
                    'message': 'Insufficient transaction data for cash flow forecasting',
                    'forecast': []
                }

            # Calculate daily averages
            inflow_avg = statistics.mean([t['amount'] for t in inflows]) if inflows else 0
            outflow_avg = statistics.mean([t['amount'] for t in outflows]) if outflows else 0

            # Generate forecast
            forecast = []
            current_balance = await self._get_current_cash_balance()

            for i in range(1, days_ahead + 1):
                forecast_date = datetime.utcnow() + timedelta(days=i)

                # Add some variance based on day of week and historical patterns
                day_variance = 1 + (0.1 * math.sin(i * 0.5))  # Weekly pattern
                inflow_pred = inflow_avg * day_variance
                outflow_pred = outflow_avg * (1 + (0.05 * (i / 30)))  # Slight increase over time

                daily_balance = current_balance + inflow_pred - outflow_pred

                forecast.append({
                    'date': forecast_date.strftime('%Y-%m-%d'),
                    'predicted_inflow': round(inflow_pred, 2),
                    'predicted_outflow': round(outflow_pred, 2),
                    'predicted_balance': round(daily_balance, 2),
                    'confidence': max(70, 95 - (i * 2))
                })

                current_balance = daily_balance

            # Generate alerts for low balance predictions
            alerts = []
            for entry in forecast:
                if entry['predicted_balance'] < (outflow_avg * 7):  # Less than 1 week of outflows
                    alerts.append({
                        'type': 'LOW_BALANCE_WARNING',
                        'date': entry['date'],
                        'predicted_balance': entry['predicted_balance'],
                        'message': f'Predicted low balance: {entry["predicted_balance"]:.2f}',
                        'severity': 'HIGH' if entry['predicted_balance'] < (outflow_avg * 3) else 'MEDIUM'
                    })

            return {
                'success': True,
                'forecast': forecast,
                'alerts': alerts,
                'summary': {
                    'avg_daily_inflow': round(inflow_avg, 2),
                    'avg_daily_outflow': round(outflow_avg, 2),
                    'projected_trend': 'positive' if inflow_avg > outflow_avg else 'negative'
                }
            }

        except Exception as e:
            self.logger.error(f"Error in cash flow forecasting: {str(e)}")
            return {
                'success': False,
                'message': f'Error generating cash flow forecast: {str(e)}',
                'forecast': []
            }

    async def score_vendor_reliability(self, vendor_id: str = None) -> Dict[str, Any]:
        """Score vendor reliability based on transaction history, email tone, and delay patterns"""
        try:
            # Get vendor transaction history
            query = {}
            if vendor_id:
                query['vendorId'] = vendor_id

            transactions = []
            async for txn in self.collections['transactions'].find(query):
                transactions.append({
                    'date': txn['date'],
                    'amount': txn['amount'],
                    'status': txn.get('status', 'completed'),
                    'vendor': txn.get('vendor', 'Unknown')
                })

            if not transactions:
                return {
                    'success': False,
                    'message': 'No transaction data found for vendor scoring',
                    'scores': []
                }

            # Calculate reliability metrics
            scores = []
            vendors = list(set([t['vendor'] for t in transactions]))

            for vendor in vendors[:10]:  # Limit to top 10 vendors
                vendor_txns = [t for t in transactions if t['vendor'] == vendor]

                # Calculate metrics
                total_txns = len(vendor_txns)
                completed_txns = len([t for t in vendor_txns if t['status'] == 'completed'])
                on_time_txns = len([t for t in vendor_txns if t.get('delay_days', 0) <= 0])

                # Calculate scores
                completion_rate = (completed_txns / total_txns) * 100 if total_txns > 0 else 0
                on_time_rate = (on_time_txns / total_txns) * 100 if total_txns > 0 else 0

                # Calculate average transaction value
                avg_value = statistics.mean([abs(t['amount']) for t in vendor_txns]) if vendor_txns else 0

                # Overall reliability score (weighted average)
                reliability_score = (completion_rate * 0.4) + (on_time_rate * 0.4) + (min(avg_value / 10000, 1) * 20)

                # Analyze email tone (simplified)
                email_tone = await self._analyze_vendor_email_tone(vendor)

                # Generate insights
                insights = []
                if completion_rate < 80:
                    insights.append("Low completion rate detected")
                if on_time_rate < 70:
                    insights.append("Frequent delays observed")
                if email_tone < 0:
                    insights.append("Negative communication patterns")

                scores.append({
                    'vendor': vendor,
                    'reliability_score': round(reliability_score, 2),
                    'completion_rate': round(completion_rate, 2),
                    'on_time_rate': round(on_time_rate, 2),
                    'total_transactions': total_txns,
                    'average_value': round(avg_value, 2),
                    'email_tone': email_tone,
                    'insights': insights,
                    'recommendation': 'RECOMMENDED' if reliability_score > 80 else 'CAUTION' if reliability_score > 60 else 'NOT_RECOMMENDED'
                })

            # Sort by reliability score
            scores.sort(key=lambda x: x['reliability_score'], reverse=True)

            return {
                'success': True,
                'scores': scores,
                'summary': {
                    'total_vendors_analyzed': len(scores),
                    'highly_reliable': len([s for s in scores if s['reliability_score'] > 80]),
                    'needs_monitoring': len([s for s in scores if s['reliability_score'] < 60])
                }
            }

        except Exception as e:
            self.logger.error(f"Error in vendor scoring: {str(e)}")
            return {
                'success': False,
                'message': f'Error generating vendor scores: {str(e)}',
                'scores': []
            }

    async def predict_asset_maintenance(self, asset_type: str = 'vehicle', asset_id: str = None) -> Dict[str, Any]:
        """Predict when assets need maintenance using usage patterns and historical data"""
        try:
            collection_name = f'{asset_type}s' if asset_type != 'vehicle' else 'vehicles'
            collection = self.collections.get(collection_name)

            if not collection:
                return {
                    'success': False,
                    'message': f'Asset type {asset_type} not supported',
                    'predictions': []
                }

            query = {}
            if asset_id:
                query['_id'] = asset_id

            assets = []
            async for asset in collection.find(query):
                assets.append(asset)

            if not assets:
                return {
                    'success': False,
                    'message': 'No assets found for maintenance prediction',
                    'predictions': []
                }

            predictions = []

            for asset in assets[:20]:  # Limit to 20 assets
                # Get asset usage data
                current_mileage = asset.get('mileage', 0)
                last_maintenance = asset.get('lastMaintenanceDate')
                asset_age = asset.get('age_years', 0)

                # Simple prediction algorithm (in production, use ML models)
                base_score = 0

                # Mileage factor (vehicles)
                if 'mileage' in asset and current_mileage > 50000:
                    mileage_factor = min(current_mileage / 100000, 1.0) * 30
                    base_score += mileage_factor

                # Age factor
                if asset_age > 3:
                    age_factor = min(asset_age / 10, 1.0) * 25
                    base_score += age_factor

                # Usage intensity factor
                usage_intensity = asset.get('usage_intensity', 50)  # 0-100 scale
                intensity_factor = (usage_intensity / 100) * 20
                base_score += intensity_factor

                # Environmental factors (simplified)
                env_factor = asset.get('environmental_factor', 10)
                base_score += env_factor

                # Calculate days until maintenance
                if base_score > 60:
                    days_until = max(7, 90 - (base_score * 1.2))
                    priority = 'HIGH' if base_score > 80 else 'MEDIUM'
                elif base_score > 40:
                    days_until = max(30, 180 - (base_score * 1.5))
                    priority = 'MEDIUM'
                else:
                    days_until = 365
                    priority = 'LOW'

                predicted_date = datetime.utcnow() + timedelta(days=int(days_until))

                predictions.append({
                    'asset_id': str(asset['_id']),
                    'asset_name': asset.get('name', f"{asset.get('make', '')} {asset.get('model', '')}".strip()),
                    'asset_type': asset_type,
                    'current_mileage': current_mileage,
                    'maintenance_score': round(base_score, 2),
                    'predicted_maintenance_date': predicted_date.strftime('%Y-%m-%d'),
                    'days_until_maintenance': int(days_until),
                    'priority': priority,
                    'confidence': min(90, base_score + 20),
                    'factors': {
                        'mileage_factor': mileage_factor if 'mileage' in asset else 0,
                        'age_factor': age_factor,
                        'usage_intensity': usage_intensity,
                        'environmental_factor': env_factor
                    }
                })

            # Sort by urgency
            predictions.sort(key=lambda x: x['days_until_maintenance'])

            return {
                'success': True,
                'predictions': predictions,
                'summary': {
                    'total_assets_analyzed': len(assets),
                    'urgent_maintenance': len([p for p in predictions if p['priority'] == 'HIGH']),
                    'scheduled_maintenance': len([p for p in predictions if p['priority'] == 'MEDIUM'])
                }
            }

        except Exception as e:
            self.logger.error(f"Error in asset maintenance prediction: {str(e)}")
            return {
                'success': False,
                'message': f'Error generating maintenance predictions: {str(e)}',
                'predictions': []
            }

    async def _get_current_cash_balance(self) -> float:
        """Get current cash balance from all accounts"""
        try:
            total_balance = 0
            async for card in self.collections['debit_cards'].find():
                total_balance += card.get('currentBalance', 0)
            return total_balance
        except:
            return 0

    async def _analyze_vendor_email_tone(self, vendor: str) -> float:
        """Analyze email tone for vendor (simplified implementation)"""
        try:
            # Get recent emails for vendor
            emails = []
            async for email_doc in self.collections['emails'].find({'sender': vendor}).limit(10):
                emails.append(email_doc.get('content', ''))

            if not emails:
                return 0  # Neutral

            # Simple sentiment analysis (in production, use proper NLP)
            positive_words = ['good', 'excellent', 'satisfied', 'pleased', 'happy', 'thank', 'appreciate']
            negative_words = ['problem', 'issue', 'delay', 'error', 'wrong', 'bad', 'terrible', 'disappointed']

            positive_count = sum(sum(1 for word in email.lower().split() if word in positive_words) for email in emails)
            negative_count = sum(sum(1 for word in email.lower().split() if word in negative_words) for email in emails)

            total_words = sum(len(email.split()) for email in emails)

            if total_words == 0:
                return 0

            sentiment_score = (positive_count - negative_count) / total_words * 100
            return round(sentiment_score, 2)

        except Exception as e:
            self.logger.error(f"Error analyzing email tone: {str(e)}")
            return 0

    # ==================== NATURAL LANGUAGE & CONVERSATIONAL AI ====================

    async def process_natural_language_query(self, query: str, context: Dict = None) -> Dict[str, Any]:
        """Process natural language queries and return structured responses"""
        try:
            # Enhanced query processing with context awareness
            query_lower = query.lower()
            tokens = word_tokenize(query_lower)
            filtered_tokens = [self.lemmatizer.lemmatize(word) for word in tokens if word not in self.stop_words]

            # Identify query intent
            intent = self._identify_query_intent(query_lower, filtered_tokens)

            # Extract entities
            entities = self._extract_entities(query_lower, filtered_tokens)

            # Generate response based on intent and entities
            if intent == 'budget_analysis':
                return await self._handle_budget_query(query, entities)
            elif intent == 'cash_flow':
                return await self._handle_cash_flow_query(query, entities)
            elif intent == 'vendor_analysis':
                return await self._handle_vendor_query(query, entities)
            elif intent == 'maintenance_prediction':
                return await self._handle_maintenance_query(query, entities)
            elif intent == 'expense_summary':
                return await self._handle_expense_summary(query, entities)
            elif intent == 'forecast_request':
                return await self._handle_forecast_request(query, entities)
            else:
                return {
                    'success': False,
                    'message': 'I understand your query but need more specific information to provide accurate insights.',
                    'suggestions': self._get_query_suggestions(intent)
                }

        except Exception as e:
            self.logger.error(f"Error processing natural language query: {str(e)}")
            return {
                'success': False,
                'message': f'Error processing your query: {str(e)}',
                'response': 'I apologize, but I encountered an error processing your request. Please try rephrasing your question.'
            }

    def _identify_query_intent(self, query: str, tokens: List[str]) -> str:
        """Identify the intent of a natural language query"""
        # Budget-related queries
        budget_keywords = ['budget', 'spending', 'expense', 'cost', 'financial plan', 'allocation']
        if any(keyword in query for keyword in budget_keywords):
            return 'budget_analysis'

        # Cash flow queries
        cash_keywords = ['cash flow', 'cashflow', 'liquidity', 'money movement', 'funds']
        if any(keyword in query for keyword in cash_keywords):
            return 'cash_flow'

        # Vendor queries
        vendor_keywords = ['vendor', 'supplier', 'contractor', 'reliability', 'performance']
        if any(keyword in query for keyword in vendor_keywords):
            return 'vendor_analysis'

        # Maintenance queries
        maintenance_keywords = ['maintenance', 'repair', 'service', 'upkeep', 'breakdown']
        if any(keyword in query for keyword in maintenance_keywords):
            return 'maintenance_prediction'

        # Expense summary
        expense_keywords = ['expense', 'spent', 'paid', 'cost analysis', 'spending pattern']
        if any(keyword in query for keyword in expense_keywords):
            return 'expense_summary'

        # Forecast requests
        forecast_keywords = ['forecast', 'predict', 'future', 'trend', 'projection']
        if any(keyword in query for keyword in forecast_keywords):
            return 'forecast_request'

        return 'general'

    def _extract_entities(self, query: str, tokens: List[str]) -> Dict[str, Any]:
        """Extract entities from natural language query"""
        entities = {
            'time_period': None,
            'amount': None,
            'department': None,
            'vendor': None,
            'asset_type': None,
            'date_range': None
        }

        # Extract time periods
        time_patterns = {
            'last_month': ['last month', 'previous month'],
            'this_month': ['this month', 'current month'],
            'last_quarter': ['last quarter', 'previous quarter'],
            'this_year': ['this year', 'current year'],
            'next_month': ['next month', 'coming month']
        }

        for period, patterns in time_patterns.items():
            if any(pattern in query for pattern in patterns):
                entities['time_period'] = period
                break

        # Extract amounts
        amount_patterns = re.findall(r'\$?(\d+(?:,\d{3})*(?:\.\d{2})?)', query)
        if amount_patterns:
            entities['amount'] = float(amount_patterns[0].replace(',', ''))

        # Extract departments
        departments = ['hr', 'finance', 'operations', 'marketing', 'sales', 'it']
        for dept in departments:
            if dept in query:
                entities['department'] = dept.upper()
                break

        # Extract asset types
        asset_types = ['vehicle', 'equipment', 'building', 'machinery']
        for asset in asset_types:
            if asset in query:
                entities['asset_type'] = asset
                break

        return entities

    async def _handle_budget_query(self, query: str, entities: Dict) -> Dict[str, Any]:
        """Handle budget-related queries"""
        try:
            # Get budget predictions
            budget_data = await self.predict_budget_variance(
                department=entities.get('department'),
                months_ahead=3
            )

            if budget_data['success']:
                response = "Here's your budget analysis:\n\n"
                for pred in budget_data['predictions']:
                    response += f"• {pred['period']}: ₹{pred['predicted_amount']:,.2f} "
                    response += f"(Variance: ₹{pred['variance']:+,.2f})\n"

                if budget_data.get('alerts'):
                    response += "\nAlerts:\n"
                    for alert in budget_data['alerts']:
                        response += f"• {alert['message']} ({alert['severity']})\n"

                return {
                    'success': True,
                    'response': response,
                    'data': budget_data
                }
            else:
                return budget_data

        except Exception as e:
            return {
                'success': False,
                'message': f'Error generating budget analysis: {str(e)}'
            }

    async def _handle_cash_flow_query(self, query: str, entities: Dict) -> Dict[str, Any]:
        """Handle cash flow queries"""
        try:
            cash_flow_data = await self.forecast_cash_flow(days_ahead=30)

            if cash_flow_data['success']:
                response = "Here's your cash flow forecast:\n\n"
                response += f"Average daily inflow: ₹{cash_flow_data['summary']['avg_daily_inflow']:,.2f}\n"
                response += f"Average daily outflow: ₹{cash_flow_data['summary']['avg_daily_outflow']:,.2f}\n"
                response += f"Trend: {cash_flow_data['summary']['projected_trend']}\n\n"

                response += "Next 7 days:\n"
                for entry in cash_flow_data['forecast'][:7]:
                    response += f"• {entry['date']}: ₹{entry['predicted_balance']:,.2f}\n"

                if cash_flow_data.get('alerts'):
                    response += "\n⚠️ Alerts:\n"
                    for alert in cash_flow_data['alerts']:
                        response += f"• {alert['message']}\n"

                return {
                    'success': True,
                    'response': response,
                    'data': cash_flow_data
                }
            else:
                return cash_flow_data

        except Exception as e:
            return {
                'success': False,
                'message': f'Error generating cash flow analysis: {str(e)}'
            }

    async def _handle_vendor_query(self, query: str, entities: Dict) -> Dict[str, Any]:
        """Handle vendor-related queries"""
        try:
            vendor_data = await self.score_vendor_reliability()

            if vendor_data['success']:
                response = "Here's the vendor reliability analysis:\n\n"

                for vendor in vendor_data['scores'][:5]:  # Top 5 vendors
                    response += f"• {vendor['vendor']}: {vendor['reliability_score']}/100 "
                    response += f"({vendor['recommendation']})\n"

                response += f"\nSummary: {vendor_data['summary']['total_vendors_analyzed']} vendors analyzed, "
                response += f"{vendor_data['summary']['highly_reliable']} highly reliable"

                return {
                    'success': True,
                    'response': response,
                    'data': vendor_data
                }
            else:
                return vendor_data

        except Exception as e:
            return {
                'success': False,
                'message': f'Error generating vendor analysis: {str(e)}'
            }

    async def _handle_maintenance_query(self, query: str, entities: Dict) -> Dict[str, Any]:
        """Handle maintenance prediction queries"""
        try:
            asset_type = entities.get('asset_type', 'vehicle')
            maintenance_data = await self.predict_asset_maintenance(asset_type=asset_type)

            if maintenance_data['success']:
                response = f"Here's the {asset_type} maintenance prediction:\n\n"

                for pred in maintenance_data['predictions'][:5]:  # Top 5 assets
                    response += f"• {pred['asset_name']}: {pred['days_until_maintenance']} days "
                    response += f"({pred['priority']} priority)\n"

                response += f"\nSummary: {maintenance_data['summary']['total_assets_analyzed']} assets analyzed"

                return {
                    'success': True,
                    'response': response,
                    'data': maintenance_data
                }
            else:
                return maintenance_data

        except Exception as e:
            return {
                'success': False,
                'message': f'Error generating maintenance prediction: {str(e)}'
            }

    async def _handle_expense_summary(self, query: str, entities: Dict) -> Dict[str, Any]:
        """Handle expense summary queries"""
        try:
            # Get expense data from transactions
            start_date = datetime.utcnow() - timedelta(days=30)  # Last 30 days

            expenses = []
            pipeline = [
                {'$match': {'amount': {'$lt': 0}, 'date': {'$gte': start_date}}},
                {'$group': {'_id': '$category', 'total': {'$sum': '$amount'}, 'count': {'$sum': 1}}},
                {'$sort': {'total': 1}}
            ]

            async for expense in self.collections['transactions'].aggregate(pipeline):
                expenses.append({
                    'category': expense['_id'] or 'Uncategorized',
                    'total_amount': abs(expense['total']),
                    'transaction_count': expense['count']
                })

            if not expenses:
                return {
                    'success': False,
                    'message': 'No expense data found for the specified period'
                }

            response = "Here's your expense summary for the last 30 days:\n\n"

            total_expenses = sum(e['total_amount'] for e in expenses)
            response += f"Total Expenses: ₹{total_expenses:,.2f}\n\n"

            for expense in expenses[:10]:  # Top 10 categories
                percentage = (expense['total_amount'] / total_expenses) * 100
                response += f"• {expense['category']}: ₹{expense['total_amount']:,.2f} "
                response += f"({percentage:.1f}% of total)\n"

            return {
                'success': True,
                'response': response,
                'data': {'expenses': expenses, 'total': total_expenses}
            }

        except Exception as e:
            return {
                'success': False,
                'message': f'Error generating expense summary: {str(e)}'
            }

    async def _handle_forecast_request(self, query: str, entities: Dict) -> Dict[str, Any]:
        """Handle forecast requests"""
        try:
            # Determine forecast type based on query
            if 'budget' in query.lower():
                return await self._handle_budget_query(query, entities)
            elif 'cash' in query.lower():
                return await self._handle_cash_flow_query(query, entities)
            elif 'maintenance' in query.lower():
                return await self._handle_maintenance_query(query, entities)
            else:
                return {
                    'success': False,
                    'message': 'Please specify what type of forecast you need (budget, cash flow, or maintenance)'
                }

        except Exception as e:
            return {
                'success': False,
                'message': f'Error generating forecast: {str(e)}'
            }

    def _get_query_suggestions(self, intent: str) -> List[str]:
        """Get query suggestions based on identified intent"""
        suggestions = {
            'budget_analysis': [
                "Show me budget variance for next quarter",
                "Predict spending patterns for IT department",
                "What will be our budget next month?"
            ],
            'cash_flow': [
                "Forecast cash flow for next 30 days",
                "Will we have sufficient funds next week?",
                "Show me cash flow projections"
            ],
            'vendor_analysis': [
                "Which vendors are most reliable?",
                "Show me vendor performance scores",
                "Rate our top suppliers"
            ],
            'maintenance_prediction': [
                "When will vehicles need maintenance?",
                "Predict maintenance schedule for equipment",
                "Show me assets requiring attention"
            ],
            'expense_summary': [
                "Summarize expenses by category",
                "Show me spending patterns",
                "What are our biggest expense categories?"
            ]
        }

        return suggestions.get(intent, ["Please be more specific about what you'd like to know"])

    # ==================== INTELLIGENT DOCUMENT UNDERSTANDING ====================

    async def process_document(self, file_path: str, document_type: str = 'auto') -> Dict[str, Any]:
        """Process documents using OCR and AI for intelligent data extraction"""
        try:
            if not os.path.exists(file_path):
                return {
                    'success': False,
                    'message': 'Document file not found',
                    'data': None
                }

            file_extension = os.path.splitext(file_path)[1].lower()

            # Extract text based on file type
            if file_extension == '.pdf':
                text_content = await self._extract_pdf_text(file_path)
            elif file_extension in ['.docx', '.doc']:
                text_content = await self._extract_docx_text(file_path)
            elif file_extension in ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']:
                text_content = await self._extract_image_text(file_path)
            else:
                return {
                    'success': False,
                    'message': f'Unsupported file type: {file_extension}',
                    'data': None
                }

            if not text_content.strip():
                return {
                    'success': False,
                    'message': 'No text content could be extracted from the document',
                    'data': None
                }

            # Classify document type if auto-detected
            if document_type == 'auto':
                document_type = self._classify_document(text_content)

            # Extract structured data based on document type
            extracted_data = await self._extract_structured_data(text_content, document_type)

            # Store document in database
            document_record = {
                'file_path': file_path,
                'document_type': document_type,
                'extracted_text': text_content[:5000],  # Limit stored text
                'structured_data': extracted_data,
                'processed_at': datetime.utcnow(),
                'file_size': os.path.getsize(file_path)
            }

            result = await self.collections['documents'].insert_one(document_record)

            return {
                'success': True,
                'document_id': str(result.inserted_id),
                'document_type': document_type,
                'extracted_data': extracted_data,
                'text_preview': text_content[:500],
                'message': f'Successfully processed {document_type} document'
            }

        except Exception as e:
            self.logger.error(f"Error processing document: {str(e)}")
            return {
                'success': False,
                'message': f'Error processing document: {str(e)}',
                'data': None
            }

    async def _extract_pdf_text(self, file_path: str) -> str:
        """Extract text from PDF files"""
        try:
            doc = fitz.open(file_path)
            text_content = ""

            for page_num in range(min(10, doc.page_count)):  # Limit to first 10 pages
                page = doc.load_page(page_num)
                text_content += page.get_text()

            doc.close()
            return text_content

        except Exception as e:
            self.logger.error(f"Error extracting PDF text: {str(e)}")
            return ""

    async def _extract_docx_text(self, file_path: str) -> str:
        """Extract text from DOCX files"""
        try:
            doc = docx.Document(file_path)
            text_content = ""

            for paragraph in doc.paragraphs:
                text_content += paragraph.text + "\n"

            return text_content

        except Exception as e:
            self.logger.error(f"Error extracting DOCX text: {str(e)}")
            return ""

    async def _extract_image_text(self, file_path: str) -> str:
        """Extract text from images using OCR"""
        try:
            # Read image
            image = cv2.imread(file_path)
            if image is None:
                return ""

            # Preprocess image for better OCR
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

            # Extract text using pytesseract
            text = pytesseract.image_to_string(binary)

            return text

        except Exception as e:
            self.logger.error(f"Error extracting image text: {str(e)}")
            return ""

    def _classify_document(self, text_content: str) -> str:
        """Classify document type based on content"""
        text_lower = text_content.lower()

        # Invoice patterns
        invoice_keywords = ['invoice', 'bill to', 'ship to', 'total amount', 'due date', 'invoice number']
        if sum(1 for keyword in invoice_keywords if keyword in text_lower) >= 3:
            return 'invoice'

        # Contract patterns
        contract_keywords = ['agreement', 'contract', 'party', 'terms and conditions', 'effective date']
        if sum(1 for keyword in contract_keywords if keyword in text_lower) >= 2:
            return 'contract'

        # Receipt patterns
        receipt_keywords = ['receipt', 'payment received', 'amount paid', 'transaction id']
        if sum(1 for keyword in receipt_keywords if keyword in text_lower) >= 2:
            return 'receipt'

        # Maintenance record patterns
        maintenance_keywords = ['maintenance', 'service record', 'repair', 'inspection', 'work order']
        if sum(1 for keyword in maintenance_keywords if keyword in text_lower) >= 2:
            return 'maintenance_record'

        # Default classification
        return 'general_document'

    async def _extract_structured_data(self, text_content: str, document_type: str) -> Dict[str, Any]:
        """Extract structured data from document based on type"""
        data = {
            'document_type': document_type,
            'raw_text': text_content[:1000],
            'extracted_fields': {}
        }

        if document_type == 'invoice':
            data['extracted_fields'] = self._extract_invoice_data(text_content)
        elif document_type == 'contract':
            data['extracted_fields'] = self._extract_contract_data(text_content)
        elif document_type == 'receipt':
            data['extracted_fields'] = self._extract_receipt_data(text_content)
        elif document_type == 'maintenance_record':
            data['extracted_fields'] = self._extract_maintenance_data(text_content)

        return data

    def _extract_invoice_data(self, text: str) -> Dict[str, Any]:
        """Extract structured data from invoice text"""
        fields = {}

        # Extract invoice number
        invoice_patterns = [
            r'invoice\s*#?:?\s*([A-Z0-9\-]+)',
            r'inv\s*#?:?\s*([A-Z0-9\-]+)',
            r'invoice\s*number:?\s*([A-Z0-9\-]+)'
        ]

        for pattern in invoice_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields['invoice_number'] = match.group(1)
                break

        # Extract amounts
        amount_patterns = [
            r'total\s*:?\s*₹?(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'amount\s*:?\s*₹?(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'₹(\d+(?:,\d{3})*(?:\.\d{2})?)'
        ]

        for pattern in amount_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                fields['amounts'] = [float(m.replace(',', '')) for m in matches]
                break

        # Extract dates
        date_patterns = [
            r'date\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'invoice\s*date:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'due\s*date:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'
        ]

        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields['date'] = match.group(1)
                break

        # Extract vendor information
        vendor_patterns = [
            r'from\s*:?\s*([^\n\r]+)',
            r'vendor\s*:?\s*([^\n\r]+)',
            r'bill\s*from:?\s*([^\n\r]+)'
        ]

        for pattern in vendor_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields['vendor'] = match.group(1).strip()
                break

        return fields

    def _extract_contract_data(self, text: str) -> Dict[str, Any]:
        """Extract structured data from contract text"""
        fields = {}

        # Extract contract type
        contract_types = ['service agreement', 'lease agreement', 'purchase agreement', 'employment contract']
        for contract_type in contract_types:
            if contract_type in text.lower():
                fields['contract_type'] = contract_type
                break

        # Extract parties
        party_patterns = [
            r'between\s+([^\n\r]+?)\s+and\s+([^\n\r]+)',
            r'party.*?([^\n\r]+).*?party.*?([^\n\r]+)'
        ]

        for pattern in party_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                fields['parties'] = [match.group(1).strip(), match.group(2).strip()]
                break

        # Extract effective date
        date_patterns = [
            r'effective\s*date:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'start\s*date:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'commencement:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'
        ]

        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields['effective_date'] = match.group(1)
                break

        return fields

    def _extract_receipt_data(self, text: str) -> Dict[str, Any]:
        """Extract structured data from receipt text"""
        fields = {}

        # Extract receipt number
        receipt_patterns = [
            r'receipt\s*#?:?\s*([A-Z0-9\-]+)',
            r'transaction\s*#?:?\s*([A-Z0-9\-]+)',
            r'ref\s*#?:?\s*([A-Z0-9\-]+)'
        ]

        for pattern in receipt_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields['receipt_number'] = match.group(1)
                break

        # Extract amount
        amount_patterns = [
            r'amount\s*:?\s*₹?(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'total\s*:?\s*₹?(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'₹(\d+(?:,\d{3})*(?:\.\d{2})?)'
        ]

        for pattern in amount_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields['amount'] = float(match.group(1).replace(',', ''))
                break

        # Extract date
        date_patterns = [
            r'date\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'
        ]

        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields['date'] = match.group(1)
                break

        return fields

    def _extract_maintenance_data(self, text: str) -> Dict[str, Any]:
        """Extract structured data from maintenance record text"""
        fields = {}

        # Extract asset information
        asset_patterns = [
            r'vehicle\s*:?\s*([^\n\r]+)',
            r'equipment\s*:?\s*([^\n\r]+)',
            r'asset\s*:?\s*([^\n\r]+)'
        ]

        for pattern in asset_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields['asset'] = match.group(1).strip()
                break

        # Extract maintenance type
        maintenance_types = ['repair', 'service', 'inspection', 'replacement', 'calibration']
        for maint_type in maintenance_types:
            if maint_type in text.lower():
                fields['maintenance_type'] = maint_type
                break

        # Extract cost
        cost_patterns = [
            r'cost\s*:?\s*₹?(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'amount\s*:?\s*₹?(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'total\s*:?\s*₹?(\d+(?:,\d{3})*(?:\.\d{2})?)'
        ]

        for pattern in cost_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields['cost'] = float(match.group(1).replace(',', ''))
                break

        return fields

    # ==================== SMART AUTOMATION TRIGGERS ====================

    async def create_automation_trigger(self, trigger_config: Dict[str, Any]) -> Dict[str, Any]:
        """Create intelligent automation triggers based on AI analysis"""
        try:
            trigger = {
                'name': trigger_config.get('name', 'Auto Trigger'),
                'trigger_type': trigger_config.get('trigger_type', 'threshold'),
                'conditions': trigger_config.get('conditions', {}),
                'actions': trigger_config.get('actions', []),
                'is_active': trigger_config.get('is_active', True),
                'created_by': trigger_config.get('created_by', 'system'),
                'created_at': datetime.utcnow(),
                'ai_insights': await self._generate_trigger_insights(trigger_config)
            }

            result = await self.collections['automation_triggers'].insert_one(trigger)

            return {
                'success': True,
                'trigger_id': str(result.inserted_id),
                'message': f'Automation trigger "{trigger["name"]}" created successfully',
                'ai_insights': trigger['ai_insights']
            }

        except Exception as e:
            self.logger.error(f"Error creating automation trigger: {str(e)}")
            return {
                'success': False,
                'message': f'Error creating automation trigger: {str(e)}'
            }

    async def check_automation_triggers(self) -> Dict[str, Any]:
        """Check all active automation triggers and execute if conditions are met"""
        try:
            active_triggers = []
            async for trigger in self.collections['automation_triggers'].find({'is_active': True}):
                trigger['_id'] = str(trigger['_id'])
                active_triggers.append(trigger)

            executed_triggers = []

            for trigger in active_triggers:
                should_execute = await self._evaluate_trigger_conditions(trigger)

                if should_execute:
                    execution_result = await self._execute_trigger_actions(trigger)
                    executed_triggers.append({
                        'trigger_id': trigger['_id'],
                        'trigger_name': trigger['name'],
                        'executed_at': datetime.utcnow(),
                        'result': execution_result
                    })

            return {
                'success': True,
                'triggers_checked': len(active_triggers),
                'triggers_executed': len(executed_triggers),
                'executed_triggers': executed_triggers
            }

        except Exception as e:
            self.logger.error(f"Error checking automation triggers: {str(e)}")
            return {
                'success': False,
                'message': f'Error checking automation triggers: {str(e)}'
            }

    async def _generate_trigger_insights(self, trigger_config: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI insights for automation trigger configuration"""
        insights = {
            'effectiveness_score': 0,
            'recommendations': [],
            'risk_level': 'low'
        }

        # Analyze trigger conditions
        conditions = trigger_config.get('conditions', {})

        # Budget threshold trigger
        if trigger_config.get('trigger_type') == 'budget_threshold':
            if conditions.get('threshold_percentage', 0) > 20:
                insights['recommendations'].append('Consider lowering threshold for more frequent monitoring')
                insights['effectiveness_score'] += 10

        # Vendor performance trigger
        elif trigger_config.get('trigger_type') == 'vendor_performance':
            if conditions.get('min_score', 0) < 60:
                insights['recommendations'].append('Low score threshold may generate too many alerts')
                insights['risk_level'] = 'medium'

        # Maintenance prediction trigger
        elif trigger_config.get('trigger_type') == 'maintenance_prediction':
            if conditions.get('days_ahead', 0) < 7:
                insights['recommendations'].append('Short prediction window may not allow sufficient preparation time')

        # Calculate overall effectiveness
        base_score = 70  # Base effectiveness score
        insights['effectiveness_score'] = min(100, base_score + len(insights['recommendations']) * 5)

        return insights

    async def _evaluate_trigger_conditions(self, trigger: Dict[str, Any]) -> bool:
        """Evaluate if trigger conditions are met"""
        try:
            conditions = trigger.get('conditions', {})
            trigger_type = trigger.get('trigger_type')

            if trigger_type == 'budget_threshold':
                # Check if spending exceeds threshold
                department = conditions.get('department')
                threshold_percentage = conditions.get('threshold_percentage', 20)

                budget_data = await self.predict_budget_variance(department=department, months_ahead=1)

                if budget_data['success']:
                    for prediction in budget_data['predictions']:
                        if abs(prediction.get('expected_variance', 0)) > threshold_percentage:
                            return True

            elif trigger_type == 'vendor_performance':
                # Check vendor performance scores
                min_score = conditions.get('min_score', 60)

                vendor_data = await self.score_vendor_reliability()

                if vendor_data['success']:
                    low_performers = [v for v in vendor_data['scores'] if v['reliability_score'] < min_score]
                    if low_performers:
                        return True

            elif trigger_type == 'maintenance_prediction':
                # Check maintenance predictions
                days_ahead = conditions.get('days_ahead', 30)
                priority = conditions.get('priority', 'MEDIUM')

                maintenance_data = await self.predict_asset_maintenance()

                if maintenance_data['success']:
                    urgent_maintenance = [
                        p for p in maintenance_data['predictions']
                        if p['days_until_maintenance'] <= days_ahead and p['priority'] == priority
                    ]
                    if urgent_maintenance:
                        return True

            return False

        except Exception as e:
            self.logger.error(f"Error evaluating trigger conditions: {str(e)}")
            return False

    async def _execute_trigger_actions(self, trigger: Dict[str, Any]) -> Dict[str, Any]:
        """Execute actions for triggered automation"""
        try:
            actions = trigger.get('actions', [])
            results = []

            for action in actions:
                action_type = action.get('type')

                if action_type == 'send_notification':
                    result = await self._send_trigger_notification(action, trigger)
                    results.append({'action': 'notification', 'result': result})

                elif action_type == 'create_alert':
                    result = await self._create_trigger_alert(action, trigger)
                    results.append({'action': 'alert', 'result': result})

                elif action_type == 'generate_report':
                    result = await self._generate_trigger_report(action, trigger)
                    results.append({'action': 'report', 'result': result})

            return {
                'success': True,
                'actions_executed': len(results),
                'results': results
            }

        except Exception as e:
            self.logger.error(f"Error executing trigger actions: {str(e)}")
            return {
                'success': False,
                'message': f'Error executing trigger actions: {str(e)}'
            }

    async def _send_trigger_notification(self, action: Dict[str, Any], trigger: Dict[str, Any]) -> Dict[str, Any]:
        """Send notification for trigger"""
        try:
            recipients = action.get('recipients', ['admin'])
            message = action.get('message', f'Automation trigger "{trigger["name"]}" has been activated')

            # In a real implementation, this would send actual notifications
            # For now, we'll just log and store the notification

            notification = {
                'trigger_id': trigger['_id'],
                'trigger_name': trigger['name'],
                'message': message,
                'recipients': recipients,
                'sent_at': datetime.utcnow(),
                'status': 'sent'
            }

            await self.collections['ai_insights'].insert_one({
                'type': 'trigger_notification',
                'data': notification,
                'created_at': datetime.utcnow()
            })

            return {'success': True, 'message': 'Notification sent successfully'}

        except Exception as e:
            return {'success': False, 'message': f'Error sending notification: {str(e)}'}

    async def _create_trigger_alert(self, action: Dict[str, Any], trigger: Dict[str, Any]) -> Dict[str, Any]:
        """Create alert for trigger"""
        try:
            alert = {
                'type': 'automation_trigger',
                'trigger_id': trigger['_id'],
                'trigger_name': trigger['name'],
                'title': action.get('title', f'Automation Alert: {trigger["name"]}'),
                'message': action.get('message', 'An automation trigger has been activated'),
                'priority': action.get('priority', 'MEDIUM'),
                'created_at': datetime.utcnow(),
                'status': 'active'
            }

            result = await self.collections['ai_insights'].insert_one(alert)

            return {
                'success': True,
                'alert_id': str(result.inserted_id),
                'message': 'Alert created successfully'
            }

        except Exception as e:
            return {'success': False, 'message': f'Error creating alert: {str(e)}'}

    async def _generate_trigger_report(self, action: Dict[str, Any], trigger: Dict[str, Any]) -> Dict[str, Any]:
        """Generate report for trigger"""
        try:
            report_type = action.get('report_type', 'summary')

            # Generate report data based on trigger type
            report_data = await self._generate_trigger_report_data(trigger, report_type)

            report = {
                'trigger_id': trigger['_id'],
                'trigger_name': trigger['name'],
                'report_type': report_type,
                'data': report_data,
                'generated_at': datetime.utcnow()
            }

            result = await self.collections['ai_insights'].insert_one({
                'type': 'trigger_report',
                'data': report,
                'created_at': datetime.utcnow()
            })

            return {
                'success': True,
                'report_id': str(result.inserted_id),
                'message': 'Report generated successfully'
            }

        except Exception as e:
            return {'success': False, 'message': f'Error generating report: {str(e)}'}

    async def _generate_trigger_report_data(self, trigger: Dict[str, Any], report_type: str) -> Dict[str, Any]:
        """Generate data for trigger report"""
        trigger_type = trigger.get('trigger_type')

        if trigger_type == 'budget_threshold':
            return await self.predict_budget_variance(months_ahead=3)
        elif trigger_type == 'vendor_performance':
            return await self.score_vendor_reliability()
        elif trigger_type == 'maintenance_prediction':
            return await self.predict_asset_maintenance()
        else:
            return {'message': 'No specific data available for this trigger type'}

    # ==================== TRAVEL & EVENT PLANNING AUTOMATION ====================

    async def generate_travel_suggestions(self, requirements: Dict[str, Any]) -> Dict[str, Any]:
        """Generate intelligent travel suggestions based on requirements"""
        try:
            # Extract travel requirements
            destination = requirements.get('destination')
            start_date = requirements.get('start_date')
            end_date = requirements.get('end_date')
            budget = requirements.get('budget', 0)
            travelers = requirements.get('travelers', 1)
            purpose = requirements.get('purpose', 'business')

            if not destination or not start_date:
                return {
                    'success': False,
                    'message': 'Destination and start date are required for travel suggestions'
                }

            # Generate travel itinerary
            itinerary = await self._generate_travel_itinerary(destination, start_date, end_date, purpose)

            # Estimate costs
            cost_estimate = await self._estimate_travel_costs(itinerary, travelers, budget)

            # Check budget constraints
            budget_analysis = await self._analyze_travel_budget(cost_estimate, budget)

            # Generate alternatives if needed
            alternatives = []
            if not budget_analysis['within_budget']:
                alternatives = await self._generate_budget_alternatives(itinerary, budget)

            # Store travel suggestion
            travel_suggestion = {
                'requirements': requirements,
                'itinerary': itinerary,
                'cost_estimate': cost_estimate,
                'budget_analysis': budget_analysis,
                'alternatives': alternatives,
                'generated_at': datetime.utcnow(),
                'confidence_score': 85
            }

            result = await self.collections['travel_suggestions'].insert_one(travel_suggestion)

            return {
                'success': True,
                'suggestion_id': str(result.inserted_id),
                'itinerary': itinerary,
                'cost_estimate': cost_estimate,
                'budget_analysis': budget_analysis,
                'alternatives': alternatives,
                'message': 'Travel suggestions generated successfully'
            }

        except Exception as e:
            self.logger.error(f"Error generating travel suggestions: {str(e)}")
            return {
                'success': False,
                'message': f'Error generating travel suggestions: {str(e)}'
            }

    async def _generate_travel_itinerary(self, destination: str, start_date: str, end_date: str, purpose: str) -> Dict[str, Any]:
        """Generate travel itinerary based on destination and purpose"""
        # Simple itinerary generation (in production, use travel APIs)
        duration = 3  # Default 3 days

        if end_date:
            start = datetime.strptime(start_date, '%Y-%m-%d')
            end = datetime.strptime(end_date, '%Y-%m-%d')
            duration = (end - start).days

        itinerary = {
            'destination': destination,
            'start_date': start_date,
            'end_date': end_date or (datetime.strptime(start_date, '%Y-%m-%d') + timedelta(days=duration)).strftime('%Y-%m-%d'),
            'duration': duration,
            'purpose': purpose,
            'daily_schedule': []
        }

        # Generate daily schedule based on purpose
        for day in range(1, duration + 1):
            day_date = (datetime.strptime(start_date, '%Y-%m-%d') + timedelta(days=day-1)).strftime('%Y-%m-%d')

            if purpose == 'business':
                daily_plan = {
                    'day': day,
                    'date': day_date,
                    'activities': [
                        'Morning: Business meetings',
                        'Afternoon: Client visits',
                        'Evening: Networking dinner'
                    ]
                }
            elif purpose == 'conference':
                daily_plan = {
                    'day': day,
                    'date': day_date,
                    'activities': [
                        'Morning: Conference sessions',
                        'Afternoon: Workshops',
                        'Evening: Networking events'
                    ]
                }
            else:
                daily_plan = {
                    'day': day,
                    'date': day_date,
                    'activities': [
                        'Morning: Sightseeing',
                        'Afternoon: Local exploration',
                        'Evening: Cultural experience'
                    ]
                }

            itinerary['daily_schedule'].append(daily_plan)

        return itinerary

    async def _estimate_travel_costs(self, itinerary: Dict[str, Any], travelers: int, budget: float) -> Dict[str, Any]:
        """Estimate travel costs based on itinerary"""
        destination = itinerary['destination'].lower()

        # Base costs by destination (simplified)
        base_costs = {
            'delhi': {'hotel': 5000, 'food': 2000, 'transport': 1500},
            'mumbai': {'hotel': 6000, 'food': 2500, 'transport': 2000},
            'bangalore': {'hotel': 5500, 'food': 2200, 'transport': 1800},
            'chennai': {'hotel': 4500, 'food': 1800, 'transport': 1600},
            'default': {'hotel': 4000, 'food': 2000, 'transport': 1500}
        }

        costs = base_costs.get(destination, base_costs['default'])

        # Calculate total costs
        duration = itinerary['duration']
        total_hotel = costs['hotel'] * duration * travelers
        total_food = costs['food'] * duration * travelers
        total_transport = costs['transport'] * duration

        # Add flight costs (estimated)
        flight_cost = 8000 * travelers  # Average domestic flight cost

        total_cost = total_hotel + total_food + total_transport + flight_cost

        return {
            'hotel_cost': total_hotel,
            'food_cost': total_food,
            'transport_cost': total_transport,
            'flight_cost': flight_cost,
            'total_cost': total_cost,
            'cost_per_person': total_cost / travelers,
            'breakdown': {
                'Hotel': f'₹{total_hotel:,.2f}',
                'Food': f'₹{total_food:,.2f}',
                'Transport': f'₹{total_transport:,.2f}',
                'Flight': f'₹{flight_cost:,.2f}'
            }
        }

    async def _analyze_travel_budget(self, cost_estimate: Dict[str, Any], budget: float) -> Dict[str, Any]:
        """Analyze if travel costs are within budget"""
        total_cost = cost_estimate['total_cost']

        return {
            'within_budget': total_cost <= budget,
            'total_cost': total_cost,
            'budget': budget,
            'variance': total_cost - budget,
            'variance_percentage': ((total_cost - budget) / budget) * 100 if budget > 0 else 0
        }

    async def _generate_budget_alternatives(self, itinerary: Dict[str, Any], budget: float) -> List[Dict[str, Any]]:
        """Generate budget-friendly alternatives"""
        alternatives = []

        # Alternative 1: Reduce duration
        if itinerary['duration'] > 2:
            short_itinerary = itinerary.copy()
            short_itinerary['duration'] = itinerary['duration'] - 1
            short_itinerary['daily_schedule'] = itinerary['daily_schedule'][:-1]

            short_costs = await self._estimate_travel_costs(short_itinerary, 1, budget)

            if short_costs['total_cost'] <= budget:
                alternatives.append({
                    'type': 'reduced_duration',
                    'description': f'Reduce trip by 1 day (Duration: {short_itinerary["duration"]} days)',
                    'estimated_cost': short_costs['total_cost'],
                    'savings': itinerary['duration'] * 4000  # Approximate daily savings
                })

        # Alternative 2: Budget hotel
        budget_itinerary = itinerary.copy()
        budget_costs = await self._estimate_travel_costs(budget_itinerary, 1, budget)
        budget_costs['hotel_cost'] = budget_costs['hotel_cost'] * 0.7  # 30% reduction
        budget_costs['total_cost'] = budget_costs['total_cost'] * 0.85  # Overall 15% reduction

        if budget_costs['total_cost'] <= budget:
            alternatives.append({
                'type': 'budget_accommodation',
                'description': 'Switch to budget hotels and dining options',
                'estimated_cost': budget_costs['total_cost'],
                'savings': budget_costs['total_cost'] * 0.15
            })

        return alternatives

    # ==================== HISTORICAL DATA INTELLIGENCE ====================

    async def analyze_historical_patterns(self, data_type: str = 'transactions', months_back: int = 12) -> Dict[str, Any]:
        """Analyze historical data patterns to build intelligence"""
        try:
            # Get historical data based on type
            if data_type == 'transactions':
                return await self._analyze_transaction_patterns(months_back)
            elif data_type == 'maintenance':
                return await self._analyze_maintenance_patterns(months_back)
            elif data_type == 'vendor_performance':
                return await self._analyze_vendor_patterns(months_back)
            else:
                return {
                    'success': False,
                    'message': f'Unsupported data type: {data_type}'
                }

        except Exception as e:
            self.logger.error(f"Error analyzing historical patterns: {str(e)}")
            return {
                'success': False,
                'message': f'Error analyzing historical patterns: {str(e)}'
            }

    async def _analyze_transaction_patterns(self, months_back: int) -> Dict[str, Any]:
        """Analyze transaction patterns for insights"""
        try:
            start_date = datetime.utcnow() - timedelta(days=months_back * 30)

            # Get monthly transaction patterns
            pipeline = [
                {
                    '$match': {
                        'date': {'$gte': start_date}
                    }
                },
                {
                    '$group': {
                        '_id': {
                            'month': {'$month': '$date'},
                            'year': {'$year': '$date'},
                            'type': '$type'
                        },
                        'total_amount': {'$sum': '$amount'},
                        'count': {'$sum': 1},
                        'avg_amount': {'$avg': '$amount'}
                    }
                },
                {'$sort': {'_id.year': 1, '_id.month': 1}}
            ]

            monthly_data = []
            async for record in self.collections['transactions'].aggregate(pipeline):
                monthly_data.append({
                    'period': f"{record['_id']['year']}-{record['_id']['month']:02d}",
                    'type': record['_id']['type'],
                    'total_amount': record['total_amount'],
                    'count': record['count'],
                    'avg_amount': record['avg_amount']
                })

            if not monthly_data:
                return {
                    'success': False,
                    'message': 'Insufficient transaction data for pattern analysis'
                }

            # Analyze trends
            income_data = [m for m in monthly_data if m['total_amount'] > 0]
            expense_data = [m for m in monthly_data if m['total_amount'] < 0]

            # Calculate trend metrics
            total_income = sum(m['total_amount'] for m in income_data)
            total_expenses = abs(sum(m['total_amount'] for m in expense_data))

            # Identify seasonal patterns
            seasonal_patterns = self._identify_seasonal_patterns(monthly_data)

            # Generate insights
            insights = []

            if total_income > total_expenses:
                insights.append('Positive cash flow trend detected')
            else:
                insights.append('Negative cash flow trend - budget review recommended')

            if seasonal_patterns:
                insights.append(f'Seasonal patterns identified: {", ".join(seasonal_patterns)}')

            # Store pattern analysis
            pattern_record = {
                'data_type': 'transactions',
                'analysis_period_months': months_back,
                'patterns': {
                    'total_income': total_income,
                    'total_expenses': total_expenses,
                    'net_cash_flow': total_income - total_expenses,
                    'seasonal_patterns': seasonal_patterns,
                    'monthly_average': statistics.mean([abs(m['total_amount']) for m in monthly_data])
                },
                'insights': insights,
                'analyzed_at': datetime.utcnow()
            }

            await self.collections['historical_patterns'].insert_one(pattern_record)

            return {
                'success': True,
                'patterns': pattern_record['patterns'],
                'insights': insights,
                'monthly_data': monthly_data,
                'message': 'Transaction pattern analysis completed'
            }

        except Exception as e:
            self.logger.error(f"Error analyzing transaction patterns: {str(e)}")
            return {
                'success': False,
                'message': f'Error analyzing transaction patterns: {str(e)}'
            }

    async def _analyze_maintenance_patterns(self, months_back: int) -> Dict[str, Any]:
        """Analyze maintenance patterns for predictive insights"""
        try:
            start_date = datetime.utcnow() - timedelta(days=months_back * 30)

            # Get maintenance request patterns
            maintenance_data = []
            async for record in self.collections['maintenance_requests'].find({'createdAt': {'$gte': start_date}}):
                maintenance_data.append({
                    'date': record.get('createdAt'),
                    'asset_type': record.get('assetType', 'unknown'),
                    'priority': record.get('priority', 'medium'),
                    'cost': record.get('estimatedCost', 0),
                    'status': record.get('status', 'pending')
                })

            if not maintenance_data:
                return {
                    'success': False,
                    'message': 'Insufficient maintenance data for pattern analysis'
                }

            # Analyze patterns by asset type
            asset_patterns = defaultdict(list)
            for record in maintenance_data:
                asset_patterns[record['asset_type']].append(record)

            patterns = {}
            insights = []

            for asset_type, records in asset_patterns.items():
                total_cost = sum(r['cost'] for r in records)
                avg_cost = statistics.mean([r['cost'] for r in records]) if records else 0

                # Calculate frequency
                monthly_frequency = len(records) / months_back

                patterns[asset_type] = {
                    'total_requests': len(records),
                    'total_cost': total_cost,
                    'avg_cost': avg_cost,
                    'monthly_frequency': monthly_frequency,
                    'priority_distribution': Counter(r['priority'] for r in records)
                }

                # Generate insights
                if monthly_frequency > 2:
                    insights.append(f'High maintenance frequency for {asset_type}: {monthly_frequency:.1f} requests/month')
                if avg_cost > 10000:
                    insights.append(f'High average cost for {asset_type} maintenance: ₹{avg_cost:.2f}')

            return {
                'success': True,
                'patterns': patterns,
                'insights': insights,
                'message': 'Maintenance pattern analysis completed'
            }

        except Exception as e:
            self.logger.error(f"Error analyzing maintenance patterns: {str(e)}")
            return {
                'success': False,
                'message': f'Error analyzing maintenance patterns: {str(e)}'
            }

    async def _analyze_vendor_patterns(self, months_back: int) -> Dict[str, Any]:
        """Analyze vendor performance patterns"""
        try:
            # Get vendor transaction patterns
            start_date = datetime.utcnow() - timedelta(days=months_back * 30)

            vendor_data = []
            async for txn in self.collections['transactions'].find({'date': {'$gte': start_date}}):
                if 'vendor' in txn:
                    vendor_data.append({
                        'vendor': txn['vendor'],
                        'amount': txn['amount'],
                        'date': txn['date'],
                        'status': txn.get('status', 'completed')
                    })

            if not vendor_data:
                return {
                    'success': False,
                    'message': 'Insufficient vendor data for pattern analysis'
                }

            # Analyze vendor patterns
            vendor_patterns = defaultdict(list)
            for record in vendor_data:
                vendor_patterns[record['vendor']].append(record)

            patterns = {}
            insights = []

            for vendor, records in vendor_patterns.items():
                total_value = sum(abs(r['amount']) for r in records)
                completed_txns = len([r for r in records if r['status'] == 'completed'])
                completion_rate = (completed_txns / len(records)) * 100 if records else 0

                patterns[vendor] = {
                    'total_transactions': len(records),
                    'total_value': total_value,
                    'completion_rate': completion_rate,
                    'avg_transaction_value': total_value / len(records) if records else 0
                }

                # Generate insights
                if completion_rate < 80:
                    insights.append(f'Low completion rate for {vendor}: {completion_rate:.1f}%')
                if total_value > 100000:
                    insights.append(f'High-value vendor relationship: {vendor} (₹{total_value:,.2f})')

            return {
                'success': True,
                'patterns': patterns,
                'insights': insights,
                'message': 'Vendor pattern analysis completed'
            }

        except Exception as e:
            self.logger.error(f"Error analyzing vendor patterns: {str(e)}")
            return {
                'success': False,
                'message': f'Error analyzing vendor patterns: {str(e)}'
            }

    def _identify_seasonal_patterns(self, monthly_data: List[Dict]) -> List[str]:
        """Identify seasonal patterns in monthly data"""
        patterns = []

        if len(monthly_data) < 6:
            return patterns

        # Look for quarterly patterns
        quarters = defaultdict(list)
        for record in monthly_data:
            quarter = (int(record['period'].split('-')[1]) - 1) // 3 + 1
            year = record['period'].split('-')[0]
            quarters[f'Q{quarter}_{year}'].append(record['total_amount'])

        # Analyze quarter-over-quarter growth
        quarter_totals = {k: sum(v) for k, v in quarters.items()}

        if len(quarter_totals) >= 2:
            sorted_quarters = sorted(quarter_totals.items())
            growth_rates = []

            for i in range(1, len(sorted_quarters)):
                prev_total = sorted_quarters[i-1][1]
                curr_total = sorted_quarters[i][1]
                if prev_total > 0:
                    growth_rate = ((curr_total - prev_total) / prev_total) * 100
                    growth_rates.append(growth_rate)

            if growth_rates:
                avg_growth = statistics.mean(growth_rates)
                if avg_growth > 10:
                    patterns.append('Strong quarterly growth trend')
                elif avg_growth < -5:
                    patterns.append('Declining quarterly trend')

        return patterns

# Initialize the AI service
ai_service = AIService()