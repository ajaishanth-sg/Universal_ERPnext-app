#!/usr/bin/env python3

import os
import sys
import subprocess

def start_server():
    """Start the UniverserERP backend server"""
    print("🚀 Starting UniverserERP Backend Server...")
    
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_dir)
    
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Start the server
    try:
        print("🔄 Launching FastAPI server...")
        subprocess.run([sys.executable, "main.py"], check=True)
    except KeyboardInterrupt:
        print("\n⏹️  Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    start_server()
