#!/usr/bin/env python3
"""
Minimal server to test basic functionality
"""

from fastapi import FastAPI

app = FastAPI(title="Minimal Test API")

@app.get("/api")
async def api_root():
    return {"message": "Minimal API working"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)