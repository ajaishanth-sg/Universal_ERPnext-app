#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from routes.chatbot_router import ERPChatbot, load_erp_training_data

def test_chatbot():
    print("Testing UniverserERP Chatbot...")

    # Load training data
    training_data = load_erp_training_data()
    if not training_data:
        print("ERROR: Failed to load training data")
        return

    print("SUCCESS: Training data loaded successfully")

    # Initialize chatbot
    chatbot = ERPChatbot(training_data)
    if not chatbot:
        print("ERROR: Failed to initialize chatbot")
        return

    print("SUCCESS: Chatbot initialized successfully")

    # Test conversational patterns and module matching
    test_queries = [
        "Hi",
        "payment help",
        "financial help",
        "thanks",
        "bye",
        "Tell me about HR management",
        "What is financial management?",
        "How do I manage fleet?",
        "Tell me about maintenance",
        "What is inventory management?"
    ]

    for query in test_queries:
        print(f"\nTESTING: '{query}'")
        module_match = chatbot.find_best_module_match(query)
        print(f"   Module match: {module_match}")

        response = chatbot.get_contextual_response(query, module_match)
        # Clean response for display (remove emojis and special chars)
        clean_response = response.encode('ascii', 'ignore').decode('ascii')
        print(f"   Response: {clean_response[:100]}...")

    print("\nSUCCESS: All tests completed successfully!")

if __name__ == "__main__":
    test_chatbot()