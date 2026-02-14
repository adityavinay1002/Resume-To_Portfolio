import uvicorn
from app.main import app

if __name__ == "__main__":
    print("--- REGISTERED ROUTES ---")
    for route in app.routes:
        print(f"{route.path} [{route.name}]")
    print("-------------------------")
    uvicorn.run(app, host="127.0.0.1", port=8080)
