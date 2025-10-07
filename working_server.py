#!/usr/bin/env python3

import sys
import os
import asyncio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Create FastAPI app
app = FastAPI(title="UniverserERP Working Server")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: datetime

@app.get("/")
async def root():
    return {"message": "UniverserERP Working Server is running!"}

@app.get("/api/test")
async def test():
    return {"message": "API is working perfectly!"}

@app.post("/api/chatbot/message", response_model=ChatResponse)
async def chat_message(chat_message: ChatMessage):
    """Enhanced chatbot endpoint with custom data integration"""
    
    try:
        print(f"Received message: {chat_message.message}")
        
        # Import chatbot components
        from routes.chatbot_router import erp_chatbot, data_query_service
        
        if not erp_chatbot:
            return ChatResponse(
                response="I'm sorry, the chatbot is not properly initialized. Please contact support.",
                conversation_id=chat_message.conversation_id,
                timestamp=datetime.now()
            )
        
        # Find module match
        module_match = erp_chatbot.find_best_module_match(chat_message.message)
        print(f"Module match: {module_match}")
        
        # Generate response
        response_text = await erp_chatbot.get_contextual_response(chat_message.message, module_match)
        print(f"Generated response: {response_text[:100]}...")
        
        return ChatResponse(
            response=response_text,
            conversation_id=chat_message.conversation_id,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        print(f"ERROR in chatbot endpoint: {e}")
        import traceback
        traceback.print_exc()
        
        # Return error response
        return ChatResponse(
            response=f"I apologize, but I encountered an error: {str(e)}. Please try again or contact support.",
            conversation_id=chat_message.conversation_id,
            timestamp=datetime.now()
        )

def main():
    """Start the working server"""
    print("🚀 Starting UniverserERP Working Server...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("🤖 Chatbot endpoint: http://localhost:5000/api/chatbot/message")
    print("📋 API docs: http://localhost:5000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=5000,
            reload=False,  # Disable reload to avoid issues
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n⏹️  Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    main()
