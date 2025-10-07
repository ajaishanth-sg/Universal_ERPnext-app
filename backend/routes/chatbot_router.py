from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import requests
import json
import os
import traceback
from datetime import datetime
import re
from fuzzywuzzy import fuzz, process
from database import db

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: datetime

# Ollama configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "llama2")

# Load ERP training data
def load_erp_training_data():
    """Load the comprehensive ERP training data"""
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        training_file = os.path.join(current_dir, "..", "erp_training_data.json")

        with open(training_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("ERP training data file not found")
        return None
    except json.JSONDecodeError:
        print("Error parsing ERP training data file")
        return None

ERP_TRAINING_DATA = load_erp_training_data()

class DataQueryService:
    """Service to query ERP database based on natural language queries"""

    def __init__(self):
        self.collection_mapping = {
            'debit_cards': db.debit_cards,
            'drivers': db.drivers,
            'vehicles': db.vehicles,
            'team_members': db.team_members,
            'inventory': db.inventory,
            'maintenance_requests': db.maintenance_requests,
            'maintenance_schedules': db.maintenance_schedules,
            'housing_staff': db.housing_staff,
            'properties': db.properties,
            'abroad_staff': db.abroad_staff,
            'accounts_payable': db.accounts_payable,
            'accounts_receivable': db.accounts_receivable,
            'purchase_invoices': db.purchase_invoices,
            'sales_invoices': db.sales_invoices,
            'racing_payments': db.racing_payments,
            'shipments': db.shipments,
            'spv_companies': db.spv_companies,
            'travel_trips': db.travel_trips
        }

        self.query_patterns = {
            'count': ['how many', 'count', 'total number', 'number of'],
            'list': ['show me', 'list', 'get all', 'display'],
            'status': ['status', 'active', 'inactive', 'pending'],
            'recent': ['recent', 'latest', 'new', 'last'],
            'search': ['find', 'search', 'look for', 'get'],
            'balance': ['balance', 'amount', 'money', 'cost', 'price'],
            'details': ['details', 'information', 'info', 'about']
        }

        self.entity_keywords = {
            'debit_cards': ['card', 'debit', 'payment', 'balance', 'bank'],
            'drivers': ['driver', 'chauffeur', 'operator'],
            'vehicles': ['vehicle', 'car', 'truck', 'fleet'],
            'team_members': ['team', 'member', 'employee', 'staff', 'person'],
            'inventory': ['inventory', 'stock', 'item', 'product', 'supply'],
            'maintenance_requests': ['maintenance', 'repair', 'service', 'fix'],
            'housing_staff': ['housing', 'accommodation', 'residence'],
            'properties': ['property', 'building', 'house', 'villa'],
            'accounts_payable': ['payable', 'owe', 'debt', 'bill'],
            'accounts_receivable': ['receivable', 'invoice', 'payment due'],
            'racing_payments': ['racing', 'race', 'competition'],
            'shipments': ['shipment', 'delivery', 'package', 'cargo'],
            'travel_trips': ['travel', 'trip', 'journey']
        }

    def identify_entity_type(self, query: str) -> str:
        """Identify which entity type the query is about"""
        query_lower = query.lower()
        best_match = None
        best_score = 0

        for entity_type, keywords in self.entity_keywords.items():
            for keyword in keywords:
                if keyword in query_lower:
                    score = len(keyword)  # Longer keywords get higher priority
                    if score > best_score:
                        best_score = score
                        best_match = entity_type

        return best_match

    def identify_query_type(self, query: str) -> str:
        """Identify what type of query this is (count, list, search, etc.)"""
        query_lower = query.lower()

        for query_type, patterns in self.query_patterns.items():
            for pattern in patterns:
                if pattern in query_lower:
                    return query_type

        return 'details'  # Default to details query

    async def execute_query(self, query: str) -> Dict[str, Any]:
        """Execute a database query based on natural language input"""
        try:
            print(f"DEBUG: Executing query: {query}")

            entity_type = self.identify_entity_type(query)
            query_type = self.identify_query_type(query)

            print(f"DEBUG: Entity type: {entity_type}, Query type: {query_type}")

            if not entity_type:
                return {
                    'success': False,
                    'message': 'I couldn\'t identify what you\'re asking about. Please be more specific.',
                    'data': None
                }
        except Exception as e:
            print(f"ERROR in execute_query setup: {e}")
            return {
                'success': False,
                'message': f'I encountered an error processing your query: {str(e)}',
                'data': None
            }

        collection = self.collection_mapping.get(entity_type)
        if collection is None:
            return {
                'success': False,
                'message': f'Sorry, I don\'t have access to {entity_type} data.',
                'data': None
            }

        try:
            if query_type == 'count':
                return await self._handle_count_query(collection, entity_type, query)
            elif query_type == 'list':
                return await self._handle_list_query(collection, entity_type, query)
            elif query_type == 'status':
                return await self._handle_status_query(collection, entity_type, query)
            elif query_type == 'recent':
                return await self._handle_recent_query(collection, entity_type, query)
            elif query_type == 'balance':
                return await self._handle_balance_query(collection, entity_type, query)
            else:
                return await self._handle_general_query(collection, entity_type, query)

        except Exception as e:
            return {
                'success': False,
                'message': f'Sorry, I encountered an error while fetching the data: {str(e)}',
                'data': None
            }

    async def _handle_count_query(self, collection, entity_type: str, query: str) -> Dict[str, Any]:
        """Handle count queries"""
        try:
            # Get total count
            total_count = 0
            async for _ in collection.find():
                total_count += 1

            # Try to get status-based counts if applicable
            status_counts = {}
            if 'status' in query.lower():
                status_field = 'status'
                async for item in collection.find():
                    status = item.get(status_field, 'unknown')
                    status_counts[status] = status_counts.get(status, 0) + 1

            return {
                'success': True,
                'message': f'Found {total_count} {entity_type.replace("_", " ")}',
                'data': {
                    'total_count': total_count,
                    'status_breakdown': status_counts if status_counts else None,
                    'entity_type': entity_type
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error counting {entity_type}: {str(e)}',
                'data': None
            }

    async def _handle_list_query(self, collection, entity_type: str, query: str) -> Dict[str, Any]:
        """Handle list queries - return limited results"""
        try:
            items = []
            count = 0
            limit = 5  # Limit results for chat display

            async for item in collection.find():
                if count >= limit:
                    break

                # Clean up the item for display
                display_item = self._format_item_for_display(item, entity_type)
                items.append(display_item)
                count += 1

            return {
                'success': True,
                'message': f'Here are {len(items)} {entity_type.replace("_", " ")}:',
                'data': {
                    'items': items,
                    'count': len(items),
                    'entity_type': entity_type,
                    'limited': count >= limit
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error listing {entity_type}: {str(e)}',
                'data': None
            }

    async def _handle_status_query(self, collection, entity_type: str, query: str) -> Dict[str, Any]:
        """Handle status-based queries"""
        try:
            # Extract status from query
            status_keywords = ['active', 'inactive', 'pending', 'completed', 'cancelled']
            found_status = None

            query_lower = query.lower()
            for status in status_keywords:
                if status in query_lower:
                    found_status = status
                    break

            if not found_status:
                found_status = 'active'  # Default to active

            items = []
            count = 0

            async for item in collection.find():
                item_status = item.get('status', '').lower()
                if item_status == found_status.lower():
                    display_item = self._format_item_for_display(item, entity_type)
                    items.append(display_item)
                    count += 1
                    if count >= 5:  # Limit results
                        break

            return {
                'success': True,
                'message': f'Found {count} {found_status} {entity_type.replace("_", " ")}',
                'data': {
                    'items': items,
                    'status': found_status,
                    'count': count,
                    'entity_type': entity_type
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error filtering {entity_type} by status: {str(e)}',
                'data': None
            }

    async def _handle_recent_query(self, collection, entity_type: str, query: str) -> Dict[str, Any]:
        """Handle recent/latest queries"""
        try:
            items = []
            all_items = []

            # Collect all items first
            async for item in collection.find():
                all_items.append(item)

            # Sort by creation date if available
            date_fields = ['createdAt', 'created_at', 'date', 'timestamp']
            sort_field = None

            for field in date_fields:
                if all_items and field in all_items[0]:
                    sort_field = field
                    break

            if sort_field:
                all_items.sort(key=lambda x: x.get(sort_field, ''), reverse=True)

            # Take the most recent 5 items
            recent_items = all_items[:5]

            for item in recent_items:
                display_item = self._format_item_for_display(item, entity_type)
                items.append(display_item)

            return {
                'success': True,
                'message': f'Here are the most recent {entity_type.replace("_", " ")}:',
                'data': {
                    'items': items,
                    'count': len(items),
                    'entity_type': entity_type
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting recent {entity_type}: {str(e)}',
                'data': None
            }

    async def _handle_balance_query(self, collection, entity_type: str, query: str) -> Dict[str, Any]:
        """Handle balance/amount queries"""
        try:
            if entity_type != 'debit_cards':
                return {
                    'success': False,
                    'message': f'Balance information is not available for {entity_type.replace("_", " ")}',
                    'data': None
                }

            total_balance = 0
            card_count = 0
            cards_info = []

            async for card in collection.find():
                balance = card.get('currentBalance', 0)
                total_balance += balance
                card_count += 1

                cards_info.append({
                    'bank': card.get('bankName', 'Unknown'),
                    'type': card.get('cardType', 'Unknown'),
                    'balance': balance,
                    'currency': card.get('currency', 'INR')
                })

            return {
                'success': True,
                'message': f'Total balance across {card_count} cards: {total_balance} INR',
                'data': {
                    'total_balance': total_balance,
                    'card_count': card_count,
                    'cards': cards_info,
                    'entity_type': entity_type
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting balance information: {str(e)}',
                'data': None
            }

    async def _handle_general_query(self, collection, entity_type: str, query: str) -> Dict[str, Any]:
        """Handle general queries"""
        try:
            items = []
            count = 0
            limit = 3  # Smaller limit for general queries

            async for item in collection.find():
                if count >= limit:
                    break

                display_item = self._format_item_for_display(item, entity_type)
                items.append(display_item)
                count += 1

            return {
                'success': True,
                'message': f'Here\'s information about {entity_type.replace("_", " ")}:',
                'data': {
                    'items': items,
                    'count': count,
                    'entity_type': entity_type
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting {entity_type} information: {str(e)}',
                'data': None
            }

    def _format_item_for_display(self, item: Dict, entity_type: str) -> Dict[str, Any]:
        """Format database item for chat display"""
        # Remove MongoDB _id and other internal fields
        display_item = {k: v for k, v in item.items() if not k.startswith('_')}

        # Entity-specific formatting
        if entity_type == 'debit_cards':
            return {
                'bank': item.get('bankName', 'Unknown'),
                'type': item.get('cardType', 'Unknown'),
                'balance': f"{item.get('currentBalance', 0)} {item.get('currency', 'INR')}",
                'status': item.get('status', 'Unknown')
            }
        elif entity_type == 'drivers':
            return {
                'name': item.get('name', 'Unknown'),
                'employee_id': item.get('employeeId', 'Unknown'),
                'status': item.get('status', 'Unknown'),
                'assigned_vehicle': item.get('assignedVehicle', 'None'),
                'rating': item.get('rating', 'N/A')
            }
        elif entity_type == 'vehicles':
            return {
                'make': item.get('make', 'Unknown'),
                'model': item.get('model', 'Unknown'),
                'year': item.get('year', 'Unknown'),
                'license_plate': item.get('licensePlate', 'Unknown'),
                'status': item.get('status', 'Unknown')
            }
        elif entity_type == 'team_members':
            return {
                'name': item.get('name', 'Unknown'),
                'role': item.get('role', 'Unknown'),
                'status': item.get('status', 'Unknown'),
                'location': item.get('location', 'Unknown'),
                'rating': item.get('rating', 'N/A')
            }
        elif entity_type == 'inventory':
            return {
                'name': item.get('name', 'Unknown'),
                'category': item.get('category', 'Unknown'),
                'quantity': item.get('quantity', 0),
                'unit': item.get('unit', 'pcs'),
                'status': item.get('status', 'Unknown')
            }
        else:
            # Generic formatting for other entities
            key_fields = ['name', 'title', 'description', 'status', 'type', 'amount', 'date']
            formatted = {}

            for field in key_fields:
                if field in item:
                    formatted[field] = item[field]

            # If no key fields found, return first few fields
            if not formatted:
                count = 0
                for k, v in item.items():
                    if count >= 4 or k.startswith('_'):
                        break
                    formatted[k] = v
                    count += 1

            return formatted

# Initialize the data query service
data_query_service = DataQueryService()

class ERPChatbot:
    """Enhanced ERP chatbot with intelligent response capabilities and data integration"""

    def __init__(self, training_data):
        self.training_data = training_data
        self.module_keywords = self._extract_module_keywords()
        self.data_service = data_query_service

    def _extract_module_keywords(self):
        """Extract keywords for fuzzy matching"""
        keywords = {}

        if not self.training_data:
            return keywords

        for module_key, module_data in self.training_data.get('module_details', {}).items():
            module_name = module_data.get('name', '').lower()
            keywords[module_name] = {
                'features': [feature.lower() for feature in module_data.get('features', [])],
                'questions': [q.lower() for q in module_data.get('common_questions', [])],
                'responses': module_data.get('responses', {})
            }

        return keywords

    def find_best_module_match(self, user_message):
        """Find the best matching ERP module for the user's query"""
        if not self.training_data or not self.module_keywords:
            return None

        user_lower = user_message.lower()
        best_match = None
        best_score = 0

        # Check module names first
        for module_name in self.module_keywords.keys():
            score = fuzz.partial_ratio(user_lower, module_name)
            if score > best_score and score > 60:  # Threshold for module matching
                best_score = score
                best_match = module_name

        # Check features and questions if no good module match
        if best_score < 70:
            for module_name, data in self.module_keywords.items():
                for feature in data['features']:
                    score = fuzz.partial_ratio(user_lower, feature)
                    if score > best_score and score > 50:
                        best_score = score
                        best_match = module_name

                for question in data['questions']:
                    score = fuzz.partial_ratio(user_lower, question)
                    if score > best_score and score > 60:
                        best_score = score
                        best_match = module_name

        return best_match

    async def get_contextual_response(self, user_message, module_match=None):
        """Generate contextual response based on user message and module match"""
        if not self.training_data:
            return self._get_fallback_response(user_message)

        user_lower = user_message.lower()

        # Handle conversational patterns first (greetings, thanks, etc.)
        conversational_response = self._get_conversational_response(user_lower)
        if conversational_response:
            return conversational_response

        # Check if this is a data query first
        data_query_result = await self._handle_data_query(user_message)
        if data_query_result:
            return data_query_result

        # Handle system overview questions
        if any(word in user_lower for word in ['what is', 'tell me about', 'overview', 'explain']):
            if any(word in user_lower for word in ['universal', 'universererp', 'erp', 'system']):
                return self._get_system_overview()

        # Handle module-specific questions
        if module_match:
            return self._get_module_response(module_match, user_message)

        # Handle navigation questions
        if any(word in user_lower for word in ['how to navigate', 'where is', 'how do i find', 'access']):
            return self._get_navigation_help(user_message)

        # Handle workflow questions
        if any(word in user_lower for word in ['how to', 'steps to', 'process for', 'workflow']):
            return self._get_workflow_help(user_message)

        # Handle troubleshooting questions
        if any(word in user_lower for word in ['problem', 'issue', 'error', 'not working', 'trouble']):
            return self._get_troubleshooting_help(user_message)

        return self._get_fallback_response(user_message)

    async def _handle_data_query(self, user_message: str) -> Optional[str]:
        """Handle data queries using the data service"""
        # Check if this looks like a data query
        data_query_indicators = [
            'how many', 'count', 'show me', 'list', 'get all', 'display',
            'find', 'search', 'balance', 'status', 'recent', 'latest',
            'total', 'number of', 'information about', 'details about'
        ]

        user_lower = user_message.lower()
        is_data_query = any(indicator in user_lower for indicator in data_query_indicators)

        if not is_data_query:
            return None

        try:
            # Execute the data query
            result = await self.data_service.execute_query(user_message)

            if not result['success']:
                return result['message']

            # Format the response based on the data
            response = result['message']
            data = result['data']

            if data and 'items' in data:
                items = data['items']
                if items:
                    response += "\n\n"
                    for i, item in enumerate(items, 1):
                        response += f"{i}. "
                        # Format each item nicely
                        item_parts = []
                        for key, value in item.items():
                            if value and str(value).lower() != 'unknown':
                                formatted_key = key.replace('_', ' ').title()
                                item_parts.append(f"{formatted_key}: {value}")
                        response += " | ".join(item_parts)
                        response += "\n"

                    if data.get('limited'):
                        response += "\n(Showing limited results for better readability)"

            elif data and 'total_balance' in data:
                # Special formatting for balance queries
                response += f"\n\nBreakdown by card:"
                for card in data.get('cards', []):
                    response += f"\n• {card['bank']} ({card['type']}): {card['balance']} {card['currency']}"

            elif data and 'status_breakdown' in data and data['status_breakdown']:
                # Special formatting for status queries
                response += f"\n\nStatus breakdown:"
                for status, count in data['status_breakdown'].items():
                    response += f"\n• {status.title()}: {count}"

            return response

        except Exception as e:
            return f"I encountered an error while fetching the data: {str(e)}. Please try rephrasing your question."

    def _get_system_overview(self):
        """Get system overview response"""
        if not self.training_data:
            return "UniverserERP is a comprehensive enterprise resource planning system designed to manage various business operations."

        overview = self.training_data.get('system_overview', {})
        modules = overview.get('modules', [])

        response = f"UniverserERP is {overview.get('description', 'a comprehensive ERP system')} "
        response += f"It includes the following modules: {', '.join(modules[:5])}"
        if len(modules) > 5:
            response += f", and {len(modules) - 5} more specialized modules."

        return response

    def _get_module_response(self, module_name, user_message):
        """Get response for specific module questions"""
        if not self.training_data:
            return f"I can help you with {module_name} questions. Please be more specific about what you'd like to know."

        module_data = None
        for key, data in self.training_data.get('module_details', {}).items():
            if data.get('name', '').lower() == module_name:
                module_data = data
                break

        if not module_data:
            return f"I have information about {module_name}. What specific aspect would you like to know about?"

        user_lower = user_message.lower()

        # Check for specific response keys
        for response_key, response_text in module_data.get('responses', {}).items():
            key_lower = response_key.lower()
            if any(word in user_lower for word in key_lower.split('_')):
                return response_text

        # Generate general module response
        features = module_data.get('features', [])
        response = f"{module_data.get('name', module_name)} is {module_data.get('description', 'a comprehensive module')}."
        if features:
            response += f" Key features include: {', '.join(features[:3])}"
            if len(features) > 3:
                response += f", and {len(features) - 3} more."

        return response

    def _get_navigation_help(self, user_message):
        """Get navigation help response"""
        nav_guide = self.training_data.get('navigation_guide', {}) if self.training_data else {}

        user_lower = user_message.lower()

        if 'dashboard' in user_lower:
            return nav_guide.get('main_dashboard', 'Use the main dashboard for an overview of all modules.')
        elif 'sidebar' in user_lower or 'menu' in user_lower:
            return nav_guide.get('sidebar_navigation', 'Use the sidebar navigation to access different modules.')
        elif 'search' in user_lower:
            return nav_guide.get('search_functionality', 'Use the search functionality in most dashboards.')
        else:
            return "You can navigate through UniverserERP using the sidebar menu, main dashboard, or search functionality available in most modules."

    def _get_workflow_help(self, user_message):
        """Get workflow help response"""
        workflows = self.training_data.get('common_workflows', {}) if self.training_data else {}

        user_lower = user_message.lower()

        for workflow_name, workflow_steps in workflows.items():
            name_lower = workflow_name.lower()
            if any(word in user_lower for word in name_lower.split('_')):
                return f"Here's the workflow for {workflow_name.replace('_', ' ')}:\n\n{workflow_steps}"

        return "I can help you with common workflows. Please specify which process you'd like guidance on, such as employee onboarding, payroll processing, or maintenance requests."

    def _get_troubleshooting_help(self, user_message):
        """Get troubleshooting help response"""
        troubleshooting = self.training_data.get('troubleshooting', {}) if self.training_data else {}

        user_lower = user_message.lower()

        for issue, solution in troubleshooting.items():
            issue_lower = issue.lower()
            if any(word in user_lower for word in issue_lower.split('_')):
                return f"For the issue '{issue.replace('_', ' ')}': {solution}"

        return "For troubleshooting assistance, please describe the specific problem you're experiencing, and I'll help you resolve it."

    def _get_conversational_response(self, user_message):
        """Get response for conversational patterns like greetings, thanks, etc."""
        conversational_patterns = self.training_data.get('conversational_patterns', {})

        # Check greetings
        greetings = conversational_patterns.get('greetings', {})
        for pattern in greetings.get('patterns', []):
            if pattern in user_message:
                import random
                return random.choice(greetings.get('responses', []))

        # Check payment help
        payment_help = conversational_patterns.get('payment_help', {})
        for pattern in payment_help.get('patterns', []):
            if pattern in user_message:
                import random
                return random.choice(payment_help.get('responses', []))

        # Check financial queries
        financial_queries = conversational_patterns.get('financial_queries', {})
        for pattern in financial_queries.get('patterns', []):
            if pattern in user_message:
                import random
                return random.choice(financial_queries.get('responses', []))

        # Check thanks
        thanks = conversational_patterns.get('thanks_responses', {})
        for pattern in thanks.get('patterns', []):
            if pattern in user_message:
                import random
                return random.choice(thanks.get('responses', []))

        # Check goodbye
        goodbye = conversational_patterns.get('goodbye_responses', {})
        for pattern in goodbye.get('patterns', []):
            if pattern in user_message:
                import random
                return random.choice(goodbye.get('responses', []))

        return None

    def _get_fallback_response(self, user_message):
        """Get fallback response for unmatched queries"""
        fallback_responses = [
            "I can help you with UniverserERP questions. Please be more specific about which module or feature you'd like to know about.",
            "I'm here to assist with your UniverserERP system. You can ask about specific modules like Financial Management, HR, Fleet Management, or general navigation help.",
            "I have comprehensive knowledge about UniverserERP. Try asking about specific features, workflows, or modules you're interested in.",
            "Let me help you with UniverserERP! You can ask about financial management, HR processes, fleet operations, maintenance workflows, or any other module."
        ]

        import random
        return random.choice(fallback_responses)

# Initialize the ERP chatbot
erp_chatbot = ERPChatbot(ERP_TRAINING_DATA) if ERP_TRAINING_DATA else None

@router.post("/message", response_model=ChatResponse)
async def chat_message(chat_message: ChatMessage):
    """Send a message to the chatbot and get a response"""
    try:
        # Check if Ollama is available
        try:
            test_response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
            ollama_available = test_response.status_code == 200
        except:
            ollama_available = False

        if ollama_available:
            try:
                # Use Ollama if available
                ollama_payload = {
                    "model": DEFAULT_MODEL,
                    "prompt": chat_message.message,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_predict": 512
                    }
                }

                response = requests.post(
                    f"{OLLAMA_BASE_URL}/api/generate",
                    json=ollama_payload,
                    timeout=30
                )

                if response.status_code == 404:
                    # Model not found, fall back to enhanced response system
                    ollama_available = False
                elif response.status_code != 200:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Ollama API error: {response.status_code} - {response.text}"
                    )

                try:
                    result = response.json()

                    if 'response' not in result:
                        # Invalid response format, fall back to enhanced system
                        ollama_available = False
                    else:
                        response_text = result['response'].strip()
                        return ChatResponse(
                            response=response_text,
                            conversation_id=chat_message.conversation_id,
                            timestamp=datetime.now()
                        )
                except json.JSONDecodeError:
                    # Invalid JSON response, fall back to enhanced system
                    ollama_available = False

                # If we reach here, it means Ollama had issues, continue to fallback system

            except HTTPException:
                # Re-raise HTTP exceptions (like model not found)
                raise
            except Exception as e:
                # If Ollama request fails for any other reason, fall back to enhanced response system
                print(f"Ollama request failed: {str(e)}")
                ollama_available = False
                response_text = "I have comprehensive knowledge about UniverserERP and can help you with questions about any module or feature."
        else:
            # Enhanced contextual response system
            response_text = "I have comprehensive knowledge about UniverserERP and can help you with questions about any module or feature."

            try:
                if erp_chatbot:
                    # Find best module match
                    module_match = erp_chatbot.find_best_module_match(chat_message.message)

                    # Generate intelligent response (now async)
                    try:
                        response_text = await erp_chatbot.get_contextual_response(chat_message.message, module_match)
                        print(f"DEBUG: Got response from chatbot: {response_text[:50]}...")
                    except Exception as chatbot_error:
                        print(f"ERROR in get_contextual_response: {chatbot_error}")
                        traceback.print_exc()
                        # Fallback to basic response
                        response_text = f"I'm having trouble processing your request right now. However, I can help you with UniverserERP modules. You asked about: {chat_message.message}"

                    # Add helpful tip if module was identified
                    if module_match:
                        response_text += "\n\n💡 Tip: You can access this module through the main navigation sidebar in your UniverserERP dashboard."
                else:
                    # Fallback if training data is not available
                    user_message = chat_message.message.lower()

                    # Enhanced fallback responses with more ERP context
                    if any(word in user_message for word in ['financial', 'accounting', 'money', 'payment', 'invoice', 'bill']):
                        response_text = "I can help you with financial and accounting questions in UniverserERP. The Financial Management module includes dashboards, reporting, cost center tracking, and budget management. You can access it through the main navigation."
                    elif any(word in user_message for word in ['hr', 'human resources', 'employee', 'payroll', 'staff']):
                        response_text = "For HR and employee management questions, UniverserERP's HR module handles employee data, payroll processing, leave management, and performance tracking. Access it through the HR Dashboard in the main navigation."
                    elif any(word in user_message for word in ['fleet', 'vehicle', 'car', 'truck', 'driver']):
                        response_text = "The Fleet Management module in UniverserERP handles vehicle tracking, maintenance scheduling, fuel monitoring, and driver assignments. You can access fleet features through the Operations section."
                    elif any(word in user_message for word in ['maintenance', 'repair', 'fix']):
                        response_text = "UniverserERP includes comprehensive maintenance management with request tracking, scheduling, cost management, and predictive maintenance alerts. Access maintenance features through the Operations > Maintenance section."
                    elif any(word in user_message for word in ['inventory', 'stock', 'warehouse']):
                        response_text = "Inventory management in UniverserERP includes stock tracking, purchase orders, supplier management, and warehouse operations. Access inventory features through the Operations > Inventory section."
                    elif any(word in user_message for word in ['help', 'support', 'assist', 'guide']):
                        response_text = "I'm here to help with your UniverserERP system! I can provide guidance on Financial Management, HR, Fleet Operations, Maintenance, Inventory, and all other modules. What specific area would you like to know about?"
                    elif any(word in user_message for word in ['dashboard', 'main', 'home', 'overview']):
                        response_text = "The UniverserERP dashboard provides a comprehensive overview of all your business operations with real-time metrics, quick access to key modules, and personalized insights based on your role and permissions."
                    elif any(word in user_message for word in ['report', 'analytics', 'data', 'kpi']):
                        response_text = "UniverserERP provides comprehensive reporting and analytics across all modules including financial reports, HR analytics, fleet performance data, maintenance insights, and custom dashboards tailored to your business needs."
            except Exception as e:
                # Log the error for debugging
                print(f"ERROR in chatbot processing: {str(e)}")
                print(f"Error type: {type(e)}")
                import traceback
                traceback.print_exc()

                # Ensure we always have a response
                response_text = f"I apologize, but I encountered an error processing your request: {str(e)}. Please try asking about UniverserERP modules like Financial Management, HR, Fleet Management, or Maintenance."

            # Ensure response_text is never None or empty
            if not response_text or response_text.strip() == "":
                response_text = "I have comprehensive knowledge about UniverserERP and can help you with questions about any module or feature. Please ask me about specific modules like Financial Management, HR, Fleet Operations, or Maintenance."

            return ChatResponse(
                response=response_text,
                conversation_id=chat_message.conversation_id,
                timestamp=datetime.now()
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chatbot error: {str(e)}"
        )

@router.get("/models")
async def get_available_models():
    """Get list of available Ollama models"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=10)

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch models: {response.status_code}"
            )

        data = response.json()
        models = [model['name'] for model in data.get('models', [])]

        return {
            "models": models,
            "default_model": DEFAULT_MODEL,
            "ollama_status": "connected"
        }

    except requests.exceptions.RequestException:
        return {
            "models": [],
            "default_model": DEFAULT_MODEL,
            "ollama_status": "disconnected",
            "error": "Unable to connect to Ollama server"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching models: {str(e)}"
        )

@router.post("/test-connection")
async def test_ollama_connection():
    """Test connection to Ollama server"""
    try:
        # Try to get models list as a connection test
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)

        if response.status_code == 200:
            return {
                "status": "connected",
                "message": "Successfully connected to Ollama server",
                "base_url": OLLAMA_BASE_URL
            }
        else:
            return {
                "status": "error",
                "message": f"Ollama server responded with status: {response.status_code}",
                "base_url": OLLAMA_BASE_URL
            }

    except requests.exceptions.RequestException as e:
        return {
            "status": "disconnected",
            "message": f"Cannot connect to Ollama server: {str(e)}",
            "base_url": OLLAMA_BASE_URL
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Unexpected error: {str(e)}",
            "base_url": OLLAMA_BASE_URL
        }