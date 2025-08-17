from fastapi import FastAPI

app = FastAPI(title="Test API")

@app.get("/api")
async def api_root():
    return {"message": "Test API working"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)