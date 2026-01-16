#!/usr/bin/env python3
"""
Start the Beijerterm Admin Panel in development mode
"""
import os
import sys
from pathlib import Path

# Set development environment variables
os.environ['ADMIN_DEV_MODE'] = 'true'
os.environ['ADMIN_DEBUG'] = 'true'
os.environ['ADMIN_PORT'] = '5000'
os.environ['FLASK_SECRET_KEY'] = 'dev-secret-key-change-in-production'

# Add admin directory to path
admin_dir = Path(__file__).parent
sys.path.insert(0, str(admin_dir))

# Import and run app
from app import app

if __name__ == '__main__':
    print("=" * 60)
    print("🌐 Beijerterm Admin Panel")
    print("=" * 60)
    print(f"Running in DEVELOPMENT mode (OAuth bypassed)")
    print(f"URL: http://localhost:5000")
    print(f"Press Ctrl+C to stop")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
