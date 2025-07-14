from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
import jwt

# Import our models and services
from models import *
from database import connect_to_mongo, close_mongo_connection, get_database
from ai_service import ai_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_ALGORITHM = "HS256"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    logger.info("Application started")
    yield
    # Shutdown
    await close_mongo_connection()
    logger.info("Application stopped")

# Create the main app
app = FastAPI(
    title="AI-Powered Caption & Hashtag Generator",
    description="THREE11 MOTION TECH - Powered by OpenAI, Anthropic, and Gemini",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper Functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        db = get_database()
        user_doc = await db.users.find_one({"id": user_id})
        if not user_doc:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(**user_doc)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def check_generation_limit(user: User):
    """Check if user has exceeded daily generation limit"""
    if user.tier == UserTier.PREMIUM:
        return True  # Premium users have unlimited generations
    
    # Free users have daily limit
    if user.daily_generations_used >= 10:  # Free limit is 10 per day
        raise HTTPException(
            status_code=403, 
            detail="Daily generation limit reached. Upgrade to Premium for unlimited generations."
        )
    
    return True

# Authentication Routes
@api_router.post("/auth/signup", response_model=Token)
async def signup(user_data: SignupRequest):
    """Create a new user account"""
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user = User(
        email=user_data.email,
        name=user_data.name,
        tier=UserTier.FREE
    )
    
    # Insert user into database
    await db.users.insert_one(user.dict())
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(
        access_token=access_token,
        expires_in=86400,  # 24 hours
        user=UserResponse(**user.dict())
    )

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: LoginRequest):
    """Simple login for demo - in production, implement proper password hashing"""
    db = get_database()
    
    # Find user by email
    user_doc = await db.users.find_one({"email": login_data.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = User(**user_doc)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(
        access_token=access_token,
        expires_in=86400,  # 24 hours
        user=UserResponse(**user.dict())
    )

# User Routes
@api_router.get("/users/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(**current_user.dict())

@api_router.put("/users/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update current user information"""
    db = get_database()
    
    update_data = user_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user_doc = await db.users.find_one({"id": current_user.id})
    return UserResponse(**updated_user_doc)

# Content Generation Routes
@api_router.post("/generate", response_model=GenerationResultResponse)
async def generate_content(
    request: GenerationRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate AI-powered captions and hashtags"""
    db = get_database()
    
    # Check generation limit
    await check_generation_limit(current_user)
    
    try:
        # Generate content using AI service
        result = await ai_service.generate_combined_content(
            category=request.category,
            platform=request.platform,
            content_description=request.content_description,
            providers=request.ai_providers
        )
        
        # Create generation result
        generation_result = GenerationResult(
            user_id=current_user.id,
            category=request.category,
            platform=request.platform,
            content_description=request.content_description,
            ai_responses=result["ai_responses"],
            hashtags=result["hashtags"],
            combined_result=result["combined_result"]
        )
        
        # Save to database
        await db.generation_results.insert_one(generation_result.dict())
        
        # Update user usage
        await db.users.update_one(
            {"id": current_user.id},
            {
                "$inc": {
                    "daily_generations_used": 1,
                    "total_generations": 1
                },
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        # Save analytics
        for ai_response in result["ai_responses"]:
            analytics = UsageAnalytics(
                user_id=current_user.id,
                category=request.category,
                platform=request.platform,
                ai_provider=ai_response.provider,
                generation_time=ai_response.generation_time,
                success=ai_response.success
            )
            await db.usage_analytics.insert_one(analytics.dict())
        
        # Return response
        return GenerationResultResponse(
            id=generation_result.id,
            category=generation_result.category,
            platform=generation_result.platform,
            content_description=generation_result.content_description,
            captions=result["captions"],
            hashtags=result["hashtags"],
            combined_result=result["combined_result"],
            created_at=generation_result.created_at
        )
        
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate content")

# Generation History Routes
@api_router.get("/generations", response_model=List[GenerationResultResponse])
async def get_user_generations(
    current_user: User = Depends(get_current_user),
    limit: int = 20,
    skip: int = 0
):
    """Get user's generation history"""
    db = get_database()
    
    cursor = db.generation_results.find(
        {"user_id": current_user.id}
    ).sort("created_at", -1).skip(skip).limit(limit)
    
    results = []
    async for doc in cursor:
        # Convert ai_responses to captions dict
        captions = {}
        for response in doc.get("ai_responses", []):
            captions[response["provider"]] = response["caption"]
        
        results.append(GenerationResultResponse(
            id=doc["id"],
            category=doc["category"],
            platform=doc["platform"],
            content_description=doc["content_description"],
            captions=captions,
            hashtags=doc["hashtags"],
            combined_result=doc["combined_result"],
            created_at=doc["created_at"]
        ))
    
    return results

# Premium Routes
@api_router.get("/premium/packs", response_model=List[PremiumPack])
async def get_premium_packs():
    """Get available premium packs"""
    db = get_database()
    
    cursor = db.premium_packs.find({"is_active": True})
    packs = []
    async for doc in cursor:
        packs.append(PremiumPack(**doc))
    
    return packs

@api_router.post("/premium/upgrade")
async def upgrade_to_premium(
    current_user: User = Depends(get_current_user)
):
    """Upgrade user to premium (mock implementation)"""
    db = get_database()
    
    # In production, integrate with Stripe or payment processor
    await db.users.update_one(
        {"id": current_user.id},
        {
            "$set": {
                "tier": UserTier.PREMIUM,
                "subscription_expires_at": datetime.utcnow() + timedelta(days=30),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Successfully upgraded to Premium!"}

# Analytics Routes
@api_router.get("/analytics/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    """Get user dashboard statistics"""
    db = get_database()
    
    # Get user's generation stats
    total_generations = await db.generation_results.count_documents({"user_id": current_user.id})
    
    # Get popular categories for user
    pipeline = [
        {"$match": {"user_id": current_user.id}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    
    popular_categories = []
    async for doc in db.generation_results.aggregate(pipeline):
        popular_categories.append({"category": doc["_id"], "count": doc["count"]})
    
    # Get popular platforms for user
    pipeline = [
        {"$match": {"user_id": current_user.id}},
        {"$group": {"_id": "$platform", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 3}
    ]
    
    popular_platforms = []
    async for doc in db.generation_results.aggregate(pipeline):
        popular_platforms.append({"platform": doc["_id"], "count": doc["count"]})
    
    return DashboardStats(
        total_users=1,  # Single user for demo
        total_generations=total_generations,
        daily_active_users=1,
        premium_users=1 if current_user.tier == UserTier.PREMIUM else 0,
        popular_categories=popular_categories,
        popular_platforms=popular_platforms
    )

# Basic Routes
@api_router.get("/")
async def root():
    return {"message": "THREE11 MOTION TECH - AI-Powered Caption & Hashtag Generator API"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)