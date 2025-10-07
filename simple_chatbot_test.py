#!/usr/bin/env python3

import sys
import os
import asyncio

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

async def test_chatbot_directly():
    """Test the chatbot functionality directly without the web server"""
    
    print("🔍 Testing Chatbot Directly...")
    
    try:
        # Import the chatbot components
        from routes.chatbot_router import erp_chatbot, data_query_service
        
        if not erp_chatbot:
            print("❌ ERP Chatbot not initialized")
            return
            
        if not data_query_service:
            print("❌ Data Query Service not initialized")
            return
            
        print("✅ Chatbot components loaded successfully")
        
        # Test queries
        test_queries = [
            "Hello!",
            "How many debit cards do we have?",
            "Show me all drivers",
            "What's the total balance on cards?",
            "Tell me about financial management"
        ]
        
        for query in test_queries:
            print(f"\n📤 Testing: '{query}'")
            
            try:
                # Test the chatbot response
                module_match = erp_chatbot.find_best_module_match(query)
                print(f"  Module match: {module_match}")
                
                response = await erp_chatbot.get_contextual_response(query, module_match)
                print(f"  ✅ Response: {response[:100]}...")
                
            except Exception as e:
                print(f"  ❌ Error: {e}")
                import traceback
                traceback.print_exc()
        
        print("\n✅ Direct chatbot test completed!")
        
    except Exception as e:
        print(f"❌ Failed to test chatbot: {e}")
        import traceback
        traceback.print_exc()

async def test_data_service_directly():
    """Test the data query service directly"""
    
    print("\n🔍 Testing Data Query Service Directly...")
    
    try:
        from routes.chatbot_router import data_query_service
        
        if not data_query_service:
            print("❌ Data Query Service not initialized")
            return
            
        # Test data queries
        data_queries = [
            "How many debit cards?",
            "Show me drivers",
            "What's the balance on cards?",
            "List team members"
        ]
        
        for query in data_queries:
            print(f"\n📤 Testing data query: '{query}'")
            
            try:
                result = await data_query_service.execute_query(query)
                
                if result.get('success'):
                    print(f"  ✅ Success: {result.get('message', 'No message')[:100]}...")
                else:
                    print(f"  ⚠️  Failed: {result.get('message', 'No message')}")
                    
            except Exception as e:
                print(f"  ❌ Error: {e}")
                import traceback
                traceback.print_exc()
        
        print("\n✅ Data service test completed!")
        
    except Exception as e:
        print(f"❌ Failed to test data service: {e}")
        import traceback
        traceback.print_exc()

async def main():
    """Main test function"""
    print("🧪 UniverserERP Chatbot Direct Test")
    print("=" * 50)
    
    await test_chatbot_directly()
    await test_data_service_directly()
    
    print("\n" + "=" * 50)
    print("🏁 All tests completed!")

if __name__ == "__main__":
    asyncio.run(main())
