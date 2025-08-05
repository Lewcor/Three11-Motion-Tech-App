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
