#!/usr/bin/env python3

import requests
import json

def test_server():
    """Test if the server is running and the chatbot endpoint works"""
    
    server_url = "http://localhost:5000"
    chatbot_url = f"{server_url}/api/chatbot/message"
    
    print("🔍 Testing UniverserERP Server...")
    
    # Test if server is running
    try:
        response = requests.get(f"{server_url}/api/test", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running!")
        else:
            print(f"⚠️  Server responded with status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Server is not running: {e}")
        print("💡 Please start the server using: python backend/main.py")
        return False
    
    # Test chatbot endpoint
    test_messages = [
        "Hello!",
        "How many debit cards do we have?",
        "Show me all drivers",
        "What's the total balance on cards?",
        "Tell me about financial management"
    ]
    
    print("\n🤖 Testing Chatbot Endpoint...")
    
    for message in test_messages:
        print(f"\n📤 Sending: '{message}'")
        
        try:
            payload = {
                "message": message,
                "conversation_id": "test"
            }
            
            response = requests.post(
                chatbot_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                response_text = data.get('response', 'No response')
                print(f"📥 Response: {response_text[:100]}...")
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {e}")
    
    print("\n✅ Server test completed!")
    return True

if __name__ == "__main__":
    test_server()
