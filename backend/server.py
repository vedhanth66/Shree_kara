from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
import os
from dotenv import load_dotenv
import base64
from pydantic import BaseModel
import shutil

load_dotenv()

app = FastAPI(title="Shree Kara Studios API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/shree_kara_db")
client = MongoClient(MONGO_URL)
db = client.shree_kara_db

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# Create uploads directory for assets
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)

# Build frontend if build directory doesn't exist
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
build_path = os.path.join(frontend_path, "build")

# Serve React build static files
if os.path.exists(build_path):
    app.mount("/static", StaticFiles(directory=os.path.join(build_path, "static")), name="static")

# Serve assets from app root for backward compatibility
app.mount("/assets", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "..")), name="assets")

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ImageUpload(BaseModel):
    title: str
    description: Optional[str] = None
    image_data: str  # base64 encoded image

class VideoUpload(BaseModel):
    title: str
    description: Optional[str] = None
    video_data: str  # base64 encoded video

class PoemUpload(BaseModel):
    title: str
    content: str
    author: str

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        AUTHORS = db.Auth.find()
        authors = (author["Username"] for author in AUTHORS)

        if username is None or username not in authors:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return {"username": username}

# API Routes
@app.get("/api")
async def api_root():
    return {"message": "Shree Kara Studios API"}

# Pre-defined authors (you can modify these)
# AUTHORS = {
#     "admin": get_password_hash("shree123"),
#     "author1": get_password_hash("kara456"),
#     "editor": get_password_hash("studios789")
# }

@app.post("/api/auth/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Check against pre-defined authors
    AUTHORS = db.Auth.find()
    for author in AUTHORS:
        if author["Username"] == form_data.username and verify_password(form_data.password, author["Password"]):
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": form_data.username}, expires_delta=access_token_expires
            )
            return {"access_token": access_token, "token_type": "bearer"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid author credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

# Upload routes
@app.post("/api/upload/image")
async def upload_image(image: ImageUpload, current_user: dict = Depends(get_current_user)):
    image_doc = {
        "title": image.title,
        "description": image.description,
        "image_data": image.image_data,
        "uploaded_by": current_user["username"],
        "uploaded_at": datetime.utcnow()
    }
    
    result = db.images.insert_one(image_doc)
    return {"message": "Image uploaded successfully", "image_id": str(result.inserted_id)}

@app.post("/api/upload/video")
async def upload_video(video: VideoUpload, current_user: dict = Depends(get_current_user)):
    video_doc = {
        "title": video.title,
        "description": video.description,
        "video_data": video.video_data,
        "uploaded_by": current_user["username"],
        "uploaded_at": datetime.utcnow()
    }
    
    result = db.videos.insert_one(video_doc)
    return {"message": "Video uploaded successfully", "video_id": str(result.inserted_id)}

@app.post("/api/upload/poem")
async def upload_poem(poem: PoemUpload, current_user: dict = Depends(get_current_user)):
    poem_doc = {
        "title": poem.title,
        "content": poem.content,
        "author": poem.author,
        "uploaded_by": current_user["username"],
        "uploaded_at": datetime.utcnow()
    }
    
    result = db.poems.insert_one(poem_doc)
    return {"message": "Poem uploaded successfully", "poem_id": str(result.inserted_id)}

# Get routes
@app.get("/api/images")
async def get_images():
    images = []
    for image in db.images.find().sort("uploaded_at", -1):
        image["_id"] = str(image["_id"])
        images.append(image)
    return images

@app.get("/api/videos")
async def get_videos():
    videos = []
    for video in db.videos.find().sort("uploaded_at", -1):
        video["_id"] = str(video["_id"])
        videos.append(video)
    return videos

@app.get("/api/poems")
async def get_poems():
    poems = []
    for poem in db.poems.find().sort("uploaded_at", -1):
        poem["_id"] = str(poem["_id"])
        poems.append(poem)
    return poems

@app.get("/api/user/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "username": current_user["username"],
        "role": "author"
    }

# Serve React app for all other routes (SPA fallback)
@app.get("/{full_path:path}")
async def serve_frontend(request: Request, full_path: str):
    # If the request is for an API route, return 404
    if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
        raise HTTPException(status_code=404, detail="Route not found")
    
    # For static files, try to serve them from the build directory
    if os.path.exists(build_path):
        # Check if it's a static file request
        if full_path.startswith("static/") or full_path.endswith(('.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2')):
            static_file_path = os.path.join(build_path, full_path)
            if os.path.exists(static_file_path):
                return FileResponse(static_file_path)
        
        # For all other routes, serve the React app
        index_path = os.path.join(build_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
    
    raise HTTPException(status_code=404, detail="Frontend not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)