#!/usr/bin/env python3

import sys
import os
import traceback

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

def test_imports():
    """Test if all imports work correctly"""
    print("🔍 Testing imports...")
    
    try:
        print("  - Testing FastAPI...")
        from fastapi import FastAPI
        print("  ✅ FastAPI imported successfully")
        
        print("  - Testing database...")
        from database import db
        print("  ✅ Database imported successfully")
        
        print("  - Testing chatbot router...")
        from routes.chatbot_router import router as chatbot_router
        print("  ✅ Chatbot router imported successfully")
        
        print("  - Testing main app...")
        from main import app
        print("  ✅ Main app imported successfully")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Import error: {e}")
        traceback.print_exc()
        return False

def test_database():
    """Test database connection"""
    print("\n🔍 Testing database connection...")
    
    try:
        from database import db
        
        # Test if we can access collections
        collections = ['debit_cards', 'drivers', 'vehicles', 'team_members', 'inventory']
        
        for collection_name in collections:
            collection = getattr(db, collection_name, None)
            if collection is not None:
                print(f"  ✅ Collection '{collection_name}' accessible")
            else:
                print(f"  ⚠️  Collection '{collection_name}' not found")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Database error: {e}")
        traceback.print_exc()
        return False

def test_chatbot():
    """Test chatbot functionality"""
    print("\n🔍 Testing chatbot functionality...")
    
    try:
        from routes.chatbot_router import erp_chatbot, data_query_service
        
        if erp_chatbot:
            print("  ✅ ERP Chatbot initialized")
        else:
            print("  ⚠️  ERP Chatbot not initialized")
            
        if data_query_service:
            print("  ✅ Data Query Service initialized")
        else:
            print("  ⚠️  Data Query Service not initialized")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Chatbot error: {e}")
        traceback.print_exc()
        return False

def start_simple_server():
    """Start a simple server for testing"""
    print("\n🚀 Starting simple test server...")
    
    try:
        import uvicorn
        from fastapi import FastAPI
        from fastapi.middleware.cors import CORSMiddleware
        
        # Create simple app
        app = FastAPI()
        
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        @app.get("/")
        async def root():
            return {"message": "Debug server is running"}
        
        @app.get("/api/test")
        async def test():
            return {"message": "API is working"}
        
        # Try to import and add chatbot router
        try:
            from routes.chatbot_router import router as chatbot_router
            app.include_router(chatbot_router, prefix="/api/chatbot", tags=["chatbot"])
            print("  ✅ Chatbot router added successfully")
        except Exception as e:
            print(f"  ⚠️  Could not add chatbot router: {e}")
        
        print("  🌐 Starting server on http://localhost:5000")
        uvicorn.run(app, host="0.0.0.0", port=5000)
        
    except Exception as e:
        print(f"  ❌ Server error: {e}")
        traceback.print_exc()

def main():
    """Main debug function"""
    print("🔧 UniverserERP Server Debug Tool")
    print("=" * 50)
    
    # Test imports
    if not test_imports():
        print("\n❌ Import test failed. Cannot proceed.")
        return
    
    # Test database
    if not test_database():
        print("\n⚠️  Database test failed. Server may have issues.")
    
    # Test chatbot
    if not test_chatbot():
        print("\n⚠️  Chatbot test failed. Chatbot may not work properly.")
    
    print("\n" + "=" * 50)
    print("🚀 All tests completed. Starting server...")
    
    # Start server
    start_simple_server()

if __name__ == "__main__":
    main()
