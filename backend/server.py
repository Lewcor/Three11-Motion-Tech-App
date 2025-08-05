from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import base64
import asyncio
from emergentintegrations.llm.gemeni.image_generation import GeminiImageGeneration


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Authentication Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    access_code: Optional[str] = None
    role: str = "user"  # user, ceo, co-ceo, team_member
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuthRequest(BaseModel):
    email: str
    password: Optional[str] = None
    access_code: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[User] = None
    token: Optional[str] = None

# Predefined Team Access Codes
TEAM_ACCESS_CODES = {
    "THREE11-CEO-2025": {"role": "ceo", "email": "ceo@three11motiontech.com"},
    "THREE11-COCEO-2025": {"role": "co-ceo", "email": "coceo@three11motiontech.com"},
    "THREE11-TEAM01-2025": {"role": "team_member", "email": "team1@three11motiontech.com"},
    "THREE11-TEAM02-2025": {"role": "team_member", "email": "team2@three11motiontech.com"},
    "THREE11-TEAM03-2025": {"role": "team_member", "email": "team3@three11motiontech.com"},
    "THREE11-TEAM04-2025": {"role": "team_member", "email": "team4@three11motiontech.com"},
    "THREE11-TEAM05-2025": {"role": "team_member", "email": "team5@three11motiontech.com"},
    "THREE11-TEAM06-2025": {"role": "team_member", "email": "team6@three11motiontech.com"},
    "THREE11-TEAM07-2025": {"role": "team_member", "email": "team7@three11motiontech.com"},
    "THREE11-TEAM08-2025": {"role": "team_member", "email": "team8@three11motiontech.com"},
    "THREE11-TEAM09-2025": {"role": "team_member", "email": "team9@three11motiontech.com"},
    "THREE11-TEAM10-2025": {"role": "team_member", "email": "team10@three11motiontech.com"},
    "THREE11-ADMIN-2025": {"role": "admin", "email": "admin@three11motiontech.com"}
}

# AI Video Studio Models
class VideoGenerationRequest(BaseModel):
    title: str
    script: str
    video_format: str  # 'tiktok', 'youtube_shorts', 'youtube_standard'
    voice_style: Optional[str] = "professional"
    number_of_scenes: Optional[int] = 4

class VideoScene(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_base64: str
    text: str
    duration: float  # seconds

class VideoProject(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    script: str
    video_format: str
    voice_style: str
    scenes: List[VideoScene]
    status: str  # 'generating', 'completed', 'failed'
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Authentication Endpoints
@api_router.post("/auth/login", response_model=AuthResponse)
async def login(auth_request: AuthRequest):
    """Authenticate user with email and access code"""
    try:
        email = auth_request.email.lower().strip()
        access_code = auth_request.access_code
        
        # Check if access code is provided and valid
        if access_code and access_code in TEAM_ACCESS_CODES:
            team_info = TEAM_ACCESS_CODES[access_code]
            
            # For team access codes, email must match or be flexible
            if email == team_info["email"].lower() or email.endswith("@three11motiontech.com"):
                # Check if user already exists
                existing_user = await db.users.find_one({"email": email})
                
                if existing_user:
                    user = User(**existing_user)
                else:
                    # Create new user with team access
                    user = User(
                        email=email,
                        access_code=access_code,
                        role=team_info["role"],
                        is_active=True
                    )
                    await db.users.insert_one(user.dict())
                
                # Generate simple token (in production, use JWT)
                token = f"THREE11-{user.id}-{access_code}"
                
                return AuthResponse(
                    success=True,
                    message=f"Welcome to THREE11 MOTION TECH! Signed in as {team_info['role'].replace('_', ' ').title()}",
                    user=user,
                    token=token
                )
            else:
                return AuthResponse(
                    success=False,
                    message="Email does not match the access code. Please use the correct email address.",
                    user=None,
                    token=None
                )
        
        # Regular email/password authentication (for future use)
        elif auth_request.password:
            # Check regular user login
            existing_user = await db.users.find_one({"email": email})
            if existing_user:
                user = User(**existing_user)
                token = f"THREE11-{user.id}-REGULAR"
                return AuthResponse(
                    success=True,
                    message="Welcome back to THREE11 MOTION TECH!",
                    user=user,
                    token=token
                )
        
        # Invalid credentials
        return AuthResponse(
            success=False,
            message="Invalid credentials. Please check your email and access code.",
            user=None,
            token=None
        )
        
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return AuthResponse(
            success=False,
            message="Authentication failed. Please try again.",
            user=None,
            token=None
        )

@api_router.get("/auth/verify/{token}")
async def verify_token(token: str):
    """Verify authentication token"""
    try:
        if token.startswith("THREE11-"):
            parts = token.split("-")
            if len(parts) >= 3:
                user_id = parts[1]
                user = await db.users.find_one({"id": user_id})
                if user:
                    return {"valid": True, "user": User(**user)}
        
        return {"valid": False, "message": "Invalid token"}
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return {"valid": False, "message": "Token verification failed"}

@api_router.get("/auth/access-codes")
async def get_access_codes():
    """Get list of available access codes (for admin/reference)"""
    return {
        "total_codes": len(TEAM_ACCESS_CODES),
        "roles": {
            "ceo": 1,
            "co_ceo": 1, 
            "team_member": 10,
            "admin": 1
        },
        "codes": list(TEAM_ACCESS_CODES.keys())
    }

# AI Video Studio Endpoints
@api_router.post("/video/generate", response_model=VideoProject)
async def generate_video(request: VideoGenerationRequest):
    """Generate AI video with images and scenes"""
    try:
        # Initialize Gemini Image Generation
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
        
        image_gen = GeminiImageGeneration(api_key=api_key)
        
        # Create video project
        video_project = VideoProject(
            title=request.title,
            script=request.script,
            video_format=request.video_format,
            voice_style=request.voice_style,
            scenes=[],
            status="generating"
        )
        
        # Save initial project to database
        await db.video_projects.insert_one(video_project.dict())
        
        # Split script into scenes based on sentences or paragraphs
        script_parts = request.script.split('.')[:request.number_of_scenes]
        if not script_parts[-1]:  # Remove empty last element if script ends with period
            script_parts = script_parts[:-1]
        
        scenes = []
        
        for i, scene_text in enumerate(script_parts):
            scene_text = scene_text.strip()
            if not scene_text:
                continue
                
            try:
                # Generate image prompt based on scene text
                image_prompt = f"Professional, high-quality scene: {scene_text}. Cinematic, vibrant colors, suitable for social media content."
                
                # Generate images using Gemini
                images = await image_gen.generate_images(
                    prompt=image_prompt,
                    model="imagen-3.0-generate-002",
                    number_of_images=1
                )
                
                if images and len(images) > 0:
                    # Convert image bytes to base64
                    image_base64 = base64.b64encode(images[0]).decode('utf-8')
                    
                    # Create scene
                    scene = VideoScene(
                        image_base64=image_base64,
                        text=scene_text,
                        duration=3.0  # Default 3 seconds per scene
                    )
                    scenes.append(scene)
                    
            except Exception as e:
                logger.error(f"Error generating image for scene {i}: {str(e)}")
                # Create scene with placeholder if image generation fails
                scene = VideoScene(
                    image_base64="",
                    text=scene_text,
                    duration=3.0
                )
                scenes.append(scene)
        
        # Update project with scenes
        video_project.scenes = scenes
        video_project.status = "completed" if scenes else "failed"
        video_project.updated_at = datetime.utcnow()
        
        # Update in database
        await db.video_projects.update_one(
            {"id": video_project.id},
            {"$set": video_project.dict()}
        )
        
        return video_project
        
    except Exception as e:
        logger.error(f"Error generating video: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Video generation failed: {str(e)}")

@api_router.get("/video/projects", response_model=List[VideoProject])
async def get_video_projects():
    """Get all video projects"""
    try:
        projects = await db.video_projects.find().sort("created_at", -1).to_list(100)
        return [VideoProject(**project) for project in projects]
    except Exception as e:
        logger.error(f"Error fetching video projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch video projects")

@api_router.get("/video/projects/{project_id}", response_model=VideoProject)
async def get_video_project(project_id: str):
    """Get specific video project"""
    try:
        project = await db.video_projects.find_one({"id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Video project not found")
        return VideoProject(**project)
    except HTTPException:
        raise  # Re-raise HTTPExceptions as-is
    except Exception as e:
        logger.error(f"Error fetching video project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch video project")

@api_router.delete("/video/projects/{project_id}")
async def delete_video_project(project_id: str):
    """Delete video project"""
    try:
        result = await db.video_projects.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Video project not found")
        return {"message": "Video project deleted successfully"}
    except HTTPException:
        raise  # Re-raise HTTPExceptions as-is
    except Exception as e:
        logger.error(f"Error deleting video project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete video project")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
