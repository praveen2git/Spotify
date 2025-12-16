import uvicorn
import os
import sys

# Ensure current directory is in sys.path
sys.path.append(os.getcwd())

if __name__ == "__main__":
    print("Starting server...")
    try:
        uvicorn.run("api.main:app", host="127.0.0.1", port=8000, reload=True)
    except Exception as e:
        print(f"Error starting server: {e}")
