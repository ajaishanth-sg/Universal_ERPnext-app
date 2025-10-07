#!/usr/bin/env python3

import sys
import os
import asyncio
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from routes.chatbot_router import ERPChatbot, load_erp_training_data

async def interactive_chatbot_demo():
    """Interactive demo of the enhanced chatbot"""
    print("="*60)
    print("🤖 UNIVERSERERP ENHANCED CHATBOT DEMO")
    print("="*60)
    print("This chatbot can now answer questions about your actual ERP data!")
    print("Try asking questions like:")
    print("• 'How many debit cards do we have?'")
    print("• 'Show me all drivers'")
    print("• 'What's the total balance on cards?'")
    print("• 'List active team members'")
    print("• 'Tell me about financial management'")
    print("• 'What is UniverserERP?'")
    print("\nType 'quit' or 'exit' to end the demo.")
    print("="*60)
    
    # Load training data and initialize chatbot
    training_data = load_erp_training_data()
    if not training_data:
        print("❌ ERROR: Could not load training data")
        return
    
    chatbot = ERPChatbot(training_data)
    print("✅ Chatbot initialized successfully!\n")
    
    while True:
        try:
            # Get user input
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye', 'goodbye']:
                print("🤖 Chatbot: Goodbye! Thanks for using UniverserERP Assistant!")
                break
            
            if not user_input:
                continue
            
            # Process the query
            print("🤖 Chatbot: ", end="", flush=True)
            
            try:
                # Find module match
                module_match = chatbot.find_best_module_match(user_input)
                
                # Get response
                response = await chatbot.get_contextual_response(user_input, module_match)
                
                print(response)
                
            except Exception as e:
                print(f"Sorry, I encountered an error: {str(e)}")
            
            print()  # Add spacing
            
        except KeyboardInterrupt:
            print("\n🤖 Chatbot: Goodbye! Thanks for using UniverserERP Assistant!")
            break
        except Exception as e:
            print(f"An error occurred: {str(e)}")

async def quick_demo():
    """Quick demo with predefined questions"""
    print("="*60)
    print("🚀 QUICK DEMO - ENHANCED CHATBOT CAPABILITIES")
    print("="*60)
    
    # Load training data and initialize chatbot
    training_data = load_erp_training_data()
    if not training_data:
        print("❌ ERROR: Could not load training data")
        return
    
    chatbot = ERPChatbot(training_data)
    print("✅ Chatbot initialized successfully!\n")
    
    demo_questions = [
        "Hi! What can you help me with?",
        "How many debit cards do we have?",
        "Show me the card balances",
        "List all drivers",
        "How many active team members are there?",
        "Tell me about financial management",
        "What is UniverserERP?",
        "Thanks for your help!"
    ]
    
    for i, question in enumerate(demo_questions, 1):
        print(f"[{i}] You: {question}")
        print("🤖 Chatbot: ", end="", flush=True)
        
        try:
            module_match = chatbot.find_best_module_match(question)
            response = await chatbot.get_contextual_response(question, module_match)
            print(response)
        except Exception as e:
            print(f"Sorry, I encountered an error: {str(e)}")
        
        print("-" * 60)
        
        # Small delay for readability
        await asyncio.sleep(1)
    
    print("\n✅ Quick demo completed!")

def show_menu():
    """Show the demo menu"""
    print("\n" + "="*60)
    print("🤖 UNIVERSERERP CHATBOT DEMO MENU")
    print("="*60)
    print("1. Interactive Chat Demo")
    print("2. Quick Demo (Predefined Questions)")
    print("3. Exit")
    print("="*60)

async def main():
    """Main demo function"""
    while True:
        show_menu()
        
        try:
            choice = input("Select an option (1-3): ").strip()
            
            if choice == '1':
                await interactive_chatbot_demo()
            elif choice == '2':
                await quick_demo()
            elif choice == '3':
                print("👋 Goodbye! Thanks for trying the UniverserERP Chatbot!")
                break
            else:
                print("❌ Invalid choice. Please select 1, 2, or 3.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye! Thanks for trying the UniverserERP Chatbot!")
            break
        except Exception as e:
            print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    print("🔄 Starting UniverserERP Enhanced Chatbot Demo...")
    asyncio.run(main())
