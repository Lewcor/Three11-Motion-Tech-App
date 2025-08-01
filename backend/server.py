from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, UploadFile, Form
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
import io
import uuid
import random

# Import our models and services
from models import *
from database import connect_to_mongo, close_mongo_connection, get_database
from ai_service import ai_service
from content_creation_service import content_creation_service
from stripe_service import stripe_service
from voice_service import VoiceService
from trends_service import TrendsService
from content_remix_service import ContentRemixEngine
from competitor_analysis_service import competitor_service
from batch_content_service import batch_content_service
from content_scheduling_service import content_scheduling_service
from template_library_service import template_library_service
from advanced_analytics_service import advanced_analytics_service
# PHASE 3: Content Type Expansion Services
from video_content_service import video_content_service
from podcast_content_service import podcast_content_service
from email_marketing_service import email_marketing_service
from blog_post_service import blog_post_service
from product_description_service import product_description_service
# PHASE 4: Intelligence & Insights Services
from performance_tracking_service import performance_service
from engagement_prediction_service import engagement_service
from ab_testing_service import ab_testing_service
from competitor_monitoring_service import competitor_monitoring_service
from trend_forecasting_service import trend_forecasting_service
# PHASE 5: Team Collaboration Platform Services
from team_management_service import team_management_service
from role_permission_service import role_permission_service
# PHASE 6: Social Media Automation Services
from social_media_publishing_service import social_publishing_service
from crm_integration_service import crm_integration_service
from calendar_integration_service import calendar_integration_service
from social_media_automation_service import social_automation_service

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

# Initialize services
voice_service = VoiceService()
trends_service = TrendsService()
content_remix_engine = ContentRemixEngine()

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
    if user.tier in [UserTier.PREMIUM, UserTier.ADMIN, UserTier.SUPER_ADMIN]:
        return True  # Premium and Admin users have unlimited generations
    
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
        # If admin account already exists, just login
        if existing_user.get("tier") in ["admin", "super_admin"]:
            user = User(**existing_user)
            access_token = create_access_token(data={"sub": user.id})
            return Token(
                access_token=access_token,
                expires_in=86400,  # 24 hours
                user=UserResponse(**user.dict())
            )
        else:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if this is an admin email
    admin_emails = [
        "ceo@three11motiontech.com",
        "admin1@three11motiontech.com",
        "admin2@three11motiontech.com", 
        "admin3@three11motiontech.com",
        "admin4@three11motiontech.com",
        "admin5@three11motiontech.com",
        "admin6@three11motiontech.com",
        "admin7@three11motiontech.com",
        "admin8@three11motiontech.com",
        "admin9@three11motiontech.com"
    ]
    
    if user_data.email in admin_emails:
        # This is an admin account, find the pre-created account
        admin_user = await db.users.find_one({"email": user_data.email})
        if admin_user:
            user = User(**admin_user)
            access_token = create_access_token(data={"sub": user.id})
            return Token(
                access_token=access_token,
                expires_in=86400,  # 24 hours
                user=UserResponse(**user.dict())
            )
    
    # Create new regular user
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
            selected_providers=request.ai_providers
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

# AI Provider Information Routes
@api_router.get("/ai/providers")
async def get_ai_providers():
    """Get information about available AI providers"""
    try:
        providers = ai_service.get_available_providers()
        return {
            "providers": providers,
            "total_providers": len(providers),
            "available_providers": len([p for p in providers if p["available"]])
        }
    except Exception as e:
        logger.error(f"Error getting AI provider info: {e}")
        raise HTTPException(status_code=500, detail="Failed to get provider information")

@api_router.get("/ai/providers/{provider}")
async def get_ai_provider_info(provider: str):
    """Get detailed information about a specific AI provider"""
    try:
        # Validate provider
        try:
            ai_provider = AIProvider(provider)
        except ValueError:
            raise HTTPException(status_code=404, detail=f"Provider '{provider}' not found")
        
        provider_info = ai_service.get_provider_info(ai_provider)
        if not provider_info:
            raise HTTPException(status_code=404, detail=f"Provider '{provider}' not found")
        
        # Check if provider is available
        is_available = True
        if ai_provider == AIProvider.OPENAI and not ai_service.openai_key:
            is_available = False
        elif ai_provider == AIProvider.ANTHROPIC and not ai_service.anthropic_key:
            is_available = False
        elif ai_provider == AIProvider.GEMINI and not ai_service.gemini_key:
            is_available = False
        elif ai_provider == AIProvider.PERPLEXITY and not ai_service.perplexity_key:
            is_available = False
        
        return {
            "provider": provider,
            "available": is_available,
            "model": ai_service.model_versions.get(ai_provider, ""),
            **provider_info
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting provider info for {provider}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get provider information")

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

# Content Creation Routes
@api_router.post("/content/ideas", response_model=ContentIdeaResponse)
async def generate_content_ideas(
    request: ContentIdeaRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate content ideas using AI"""
    db = get_database()
    
    # Check generation limit
    await check_generation_limit(current_user)
    
    try:
        result = await content_creation_service.generate_content_ideas(request)
        
        # Save to database
        await db.content_ideas.insert_one(result.dict())
        
        # Update user usage
        await db.users.update_one(
            {"id": current_user.id},
            {
                "$inc": {"daily_generations_used": 1, "total_generations": 1},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error generating content ideas: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate content ideas")

@api_router.post("/content/video-script", response_model=VideoScriptResponse)
async def generate_video_script(
    request: VideoScriptRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate video script using AI"""
    db = get_database()
    
    # Check generation limit
    await check_generation_limit(current_user)
    
    try:
        result = await content_creation_service.generate_video_script(request)
        
        # Save to database
        await db.video_scripts.insert_one(result.dict())
        
        # Update user usage
        await db.users.update_one(
            {"id": current_user.id},
            {
                "$inc": {"daily_generations_used": 1, "total_generations": 1},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error generating video script: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate video script")

@api_router.post("/content/strategy", response_model=ContentStrategyResponse)
async def generate_content_strategy(
    request: ContentStrategyRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate content strategy using AI"""
    db = get_database()
    
    # Check generation limit (premium feature)
    if current_user.tier not in [UserTier.PREMIUM, UserTier.ADMIN, UserTier.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Content strategy is a premium feature")
    
    try:
        result = await content_creation_service.generate_content_strategy(request)
        
        # Save to database
        await db.content_strategies.insert_one(result.dict())
        
        return result
        
    except Exception as e:
        logger.error(f"Error generating content strategy: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate content strategy")

@api_router.get("/content/trending/{category}/{platform}")
async def get_trending_topics(
    category: ContentCategory,
    platform: Platform,
    current_user: User = Depends(get_current_user)
):
    """Get trending topics for category and platform"""
    try:
        topics = await content_creation_service.get_trending_topics(category, platform)
        return {"trending_topics": topics}
        
    except Exception as e:
        logger.error(f"Error getting trending topics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get trending topics")

@api_router.post("/content/hooks")
async def generate_hooks(
    topic: str,
    platform: Platform,
    quantity: int = 5,
    current_user: User = Depends(get_current_user)
):
    """Generate attention-grabbing hooks"""
    db = get_database()
    
    # Check generation limit
    await check_generation_limit(current_user)
    
    try:
        hooks = await content_creation_service.generate_hooks(topic, platform, quantity)
        
        # Save to database
        await db.content_hooks.insert_one({
            "user_id": current_user.id,
            "topic": topic,
            "platform": platform.value,
            "hooks": hooks,
            "created_at": datetime.utcnow()
        })
        
        # Update user usage
        await db.users.update_one(
            {"id": current_user.id},
            {
                "$inc": {"daily_generations_used": 1, "total_generations": 1},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return {"hooks": hooks}
        
    except Exception as e:
        logger.error(f"Error generating hooks: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate hooks")

@api_router.post("/content/cta")
async def generate_cta(
    goal: str,
    platform: Platform,
    quantity: int = 3,
    current_user: User = Depends(get_current_user)
):
    """Generate compelling calls-to-action"""
    db = get_database()
    
    # Check generation limit
    await check_generation_limit(current_user)
    
    try:
        ctas = await content_creation_service.generate_cta(goal, platform, quantity)
        
        # Save to database
        await db.content_ctas.insert_one({
            "user_id": current_user.id,
            "goal": goal,
            "platform": platform.value,
            "ctas": ctas,
            "created_at": datetime.utcnow()
        })
        
        # Update user usage
        await db.users.update_one(
            {"id": current_user.id},
            {
                "$inc": {"daily_generations_used": 1, "total_generations": 1},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return {"ctas": ctas}
        
    except Exception as e:
        logger.error(f"Error generating CTAs: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate CTAs")

# Content Calendar Routes
@api_router.get("/content/calendar")
async def get_content_calendar(
    current_user: User = Depends(get_current_user),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """Get user's content calendar"""
    db = get_database()
    
    try:
        query = {"user_id": current_user.id}
        
        if start_date and end_date:
            query["date"] = {
                "$gte": datetime.fromisoformat(start_date),
                "$lte": datetime.fromisoformat(end_date)
            }
        
        cursor = db.content_calendar.find(query).sort("date", 1)
        calendar_items = []
        
        async for doc in cursor:
            calendar_items.append(ContentCalendar(**doc))
        
        return {"calendar": calendar_items}
        
    except Exception as e:
        logger.error(f"Error getting content calendar: {e}")
        raise HTTPException(status_code=500, detail="Failed to get content calendar")

@api_router.post("/content/calendar", response_model=ContentCalendar)
async def create_calendar_item(
    calendar_item: ContentCalendar,
    current_user: User = Depends(get_current_user)
):
    """Create a new calendar item"""
    db = get_database()
    
    try:
        calendar_item.user_id = current_user.id
        await db.content_calendar.insert_one(calendar_item.dict())
        
        return calendar_item
        
    except Exception as e:
        logger.error(f"Error creating calendar item: {e}")
        raise HTTPException(status_code=500, detail="Failed to create calendar item")

# Stripe Payment Routes
@api_router.post("/payments/create-customer")
async def create_stripe_customer(
    current_user: User = Depends(get_current_user)
):
    """Create a Stripe customer for the user"""
    db = get_database()
    
    try:
        # Check if customer already exists
        user_doc = await db.users.find_one({"id": current_user.id})
        if user_doc.get("stripe_customer_id"):
            return {"customer_id": user_doc["stripe_customer_id"]}
        
        # Create new Stripe customer
        customer_id = await stripe_service.create_customer(current_user)
        
        # Save customer ID to user record
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": {"stripe_customer_id": customer_id}}
        )
        
        return {"customer_id": customer_id}
        
    except Exception as e:
        logger.error(f"Error creating Stripe customer: {e}")
        raise HTTPException(status_code=500, detail="Failed to create customer")

@api_router.post("/payments/create-subscription")
async def create_subscription(
    plan_type: str,
    current_user: User = Depends(get_current_user)
):
    """Create a premium subscription"""
    db = get_database()
    
    try:
        # Get or create Stripe customer
        user_doc = await db.users.find_one({"id": current_user.id})
        customer_id = user_doc.get("stripe_customer_id")
        
        if not customer_id:
            customer_id = await stripe_service.create_customer(current_user)
            await db.users.update_one(
                {"id": current_user.id},
                {"$set": {"stripe_customer_id": customer_id}}
            )
        
        # Create subscription
        subscription_data = await stripe_service.create_subscription(customer_id, plan_type)
        
        # Update user tier to premium
        await db.users.update_one(
            {"id": current_user.id},
            {
                "$set": {
                    "tier": UserTier.PREMIUM,
                    "stripe_subscription_id": subscription_data["subscription_id"],
                    "subscription_expires_at": subscription_data["current_period_end"],
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return subscription_data
        
    except Exception as e:
        logger.error(f"Error creating subscription: {e}")
        raise HTTPException(status_code=500, detail="Failed to create subscription")

@api_router.post("/payments/create-payment-intent")
async def create_payment_intent(
    amount: int,
    pack_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Create a payment intent for one-time purchases"""
    db = get_database()
    
    try:
        # Get or create Stripe customer
        user_doc = await db.users.find_one({"id": current_user.id})
        customer_id = user_doc.get("stripe_customer_id")
        
        if not customer_id:
            customer_id = await stripe_service.create_customer(current_user)
            await db.users.update_one(
                {"id": current_user.id},
                {"$set": {"stripe_customer_id": customer_id}}
            )
        
        if pack_id:
            # Premium pack purchase
            payment_data = await stripe_service.create_premium_pack_purchase(customer_id, pack_id)
        else:
            # Generic payment
            payment_data = await stripe_service.create_payment_intent(amount, customer_id=customer_id)
        
        return payment_data
        
    except Exception as e:
        logger.error(f"Error creating payment intent: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment intent")

@api_router.post("/payments/cancel-subscription")
async def cancel_subscription(
    current_user: User = Depends(get_current_user)
):
    """Cancel user's subscription"""
    db = get_database()
    
    try:
        user_doc = await db.users.find_one({"id": current_user.id})
        subscription_id = user_doc.get("stripe_subscription_id")
        
        if not subscription_id:
            raise HTTPException(status_code=400, detail="No active subscription found")
        
        # Cancel subscription
        cancellation_data = await stripe_service.cancel_subscription(subscription_id)
        
        # Update user record
        await db.users.update_one(
            {"id": current_user.id},
            {
                "$set": {
                    "subscription_cancel_at_period_end": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return cancellation_data
        
    except Exception as e:
        logger.error(f"Error canceling subscription: {e}")
        raise HTTPException(status_code=500, detail="Failed to cancel subscription")

@api_router.get("/payments/billing-portal")
async def create_billing_portal_session(
    current_user: User = Depends(get_current_user)
):
    """Create a billing portal session for customer self-service"""
    db = get_database()
    
    try:
        user_doc = await db.users.find_one({"id": current_user.id})
        customer_id = user_doc.get("stripe_customer_id")
        
        if not customer_id:
            raise HTTPException(status_code=400, detail="No customer record found")
        
        # Create billing portal session
        portal_url = await stripe_service.create_billing_portal_session(
            customer_id, 
            "https://your-domain.com/account"  # Replace with your domain
        )
        
        return {"url": portal_url}
        
    except Exception as e:
        logger.error(f"Error creating billing portal session: {e}")
        raise HTTPException(status_code=500, detail="Failed to create billing portal session")

@api_router.get("/payments/history")
async def get_payment_history(
    current_user: User = Depends(get_current_user)
):
    """Get user's payment history"""
    db = get_database()
    
    try:
        user_doc = await db.users.find_one({"id": current_user.id})
        customer_id = user_doc.get("stripe_customer_id")
        
        if not customer_id:
            return {"payments": []}
        
        payments = await stripe_service.get_customer_payments(customer_id)
        
        return {"payments": payments}
        
    except Exception as e:
        logger.error(f"Error getting payment history: {e}")
        raise HTTPException(status_code=500, detail="Failed to get payment history")

@api_router.get("/payments/config")
async def get_payment_config():
    """Get Stripe configuration for frontend"""
    return {
        "publishable_key": stripe_service.get_publishable_key(),
        "plans": {
            "monthly": {"amount": 999, "currency": "usd"},
            "yearly": {"amount": 7999, "currency": "usd"}
        }
    }

@api_router.post("/payments/webhook")
async def handle_stripe_webhook(request):
    """Handle Stripe webhook events"""
    try:
        payload = await request.body()
        signature = request.headers.get("stripe-signature")
        
        webhook_data = await stripe_service.handle_webhook(payload, signature)
        
        # Process webhook data based on event type
        if webhook_data["status"] == "premium_pack_purchased":
            # Handle premium pack purchase
            await process_premium_pack_purchase(webhook_data)
        elif webhook_data["status"] == "subscription_payment_succeeded":
            # Handle subscription renewal
            await process_subscription_renewal(webhook_data)
        elif webhook_data["status"] == "subscription_cancelled":
            # Handle subscription cancellation
            await process_subscription_cancellation(webhook_data)
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Error handling webhook: {e}")
        raise HTTPException(status_code=400, detail="Webhook error")

async def process_premium_pack_purchase(webhook_data: Dict):
    """Process premium pack purchase"""
    # Implementation depends on your business logic
    pass

async def process_subscription_renewal(webhook_data: Dict):
    """Process subscription renewal"""
    # Implementation depends on your business logic
    pass

async def process_subscription_cancellation(webhook_data: Dict):
    """Process subscription cancellation"""
    # Implementation depends on your business logic
    pass

# Admin Routes
@api_router.get("/admin/users")
async def get_all_users(
    current_user: User = Depends(get_current_user),
    limit: int = 100,
    skip: int = 0
):
    """Get all users (admin only)"""
    if current_user.tier not in [UserTier.ADMIN, UserTier.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db = get_database()
    
    cursor = db.users.find({}).skip(skip).limit(limit)
    users = []
    
    async for user_doc in cursor:
        users.append(UserResponse(**user_doc))
    
    return {"users": users}

@api_router.get("/admin/stats")
async def get_admin_stats(
    current_user: User = Depends(get_current_user)
):
    """Get admin dashboard statistics"""
    if current_user.tier not in [UserTier.ADMIN, UserTier.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db = get_database()
    
    # Get user statistics
    total_users = await db.users.count_documents({})
    free_users = await db.users.count_documents({"tier": "free"})
    premium_users = await db.users.count_documents({"tier": "premium"})
    admin_users = await db.users.count_documents({"tier": {"$in": ["admin", "super_admin"]}})
    
    # Get generation statistics
    total_generations = await db.generation_results.count_documents({})
    today_generations = await db.generation_results.count_documents({
        "created_at": {"$gte": datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)}
    })
    
    # Get popular categories
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    
    popular_categories = []
    async for doc in db.generation_results.aggregate(pipeline):
        popular_categories.append({"category": doc["_id"], "count": doc["count"]})
    
    return {
        "users": {
            "total": total_users,
            "free": free_users,
            "premium": premium_users,
            "admin": admin_users
        },
        "generations": {
            "total": total_generations,
            "today": today_generations
        },
        "popular_categories": popular_categories
    }

@api_router.put("/admin/users/{user_id}/tier")
async def update_user_tier(
    user_id: str,
    new_tier: UserTier,
    current_user: User = Depends(get_current_user)
):
    """Update user tier (admin only)"""
    if current_user.tier not in [UserTier.ADMIN, UserTier.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db = get_database()
    
    # Update user tier
    result = await db.users.update_one(
        {"id": user_id},
        {
            "$set": {
                "tier": new_tier,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"User tier updated to {new_tier}"}

@api_router.get("/admin/generations")
async def get_all_generations(
    current_user: User = Depends(get_current_user),
    limit: int = 100,
    skip: int = 0
):
    """Get all generations (admin only)"""
    if current_user.tier not in [UserTier.ADMIN, UserTier.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db = get_database()
    
    cursor = db.generation_results.find({}).sort("created_at", -1).skip(skip).limit(limit)
    generations = []
    
    async for doc in cursor:
        # Convert ai_responses to captions dict
        captions = {}
        for response in doc.get("ai_responses", []):
            captions[response["provider"]] = response["caption"]
        
        generations.append(GenerationResultResponse(
            id=doc["id"],
            category=doc["category"],
            platform=doc["platform"],
            content_description=doc["content_description"],
            captions=captions,
            hashtags=doc["hashtags"],
            combined_result=doc["combined_result"],
            created_at=doc["created_at"]
        ))
    
    return {"generations": generations}

# Voice Processing Routes
@api_router.post("/voice/transcribe")
async def transcribe_voice(
    audio_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Transcribe audio file to text"""
    await check_generation_limit(current_user)
    
    try:
        # Read audio file
        audio_data = await audio_file.read()
        
        # Get file extension to determine format
        file_format = audio_file.filename.split('.')[-1].lower()
        if file_format not in ['wav', 'mp3', 'webm', 'ogg', 'm4a']:
            raise HTTPException(status_code=400, detail="Unsupported audio format")
        
        # Transcribe audio
        transcript = await voice_service.transcribe_audio(audio_data, file_format)
        
        return {
            "success": True,
            "transcript": transcript,
            "file_format": file_format,
            "file_size": len(audio_data)
        }
        
    except Exception as e:
        logger.error(f"Voice transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@api_router.post("/voice/content-suite")
async def voice_to_content_suite(
    audio_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Convert voice input to complete content suite"""
    await check_generation_limit(current_user)
    
    try:
        # Read audio file
        audio_data = await audio_file.read()
        
        # Get file extension to determine format
        file_format = audio_file.filename.split('.')[-1].lower()
        if file_format not in ['wav', 'mp3', 'webm', 'ogg', 'm4a']:
            raise HTTPException(status_code=400, detail="Unsupported audio format")
        
        # Process voice to content suite
        result = await voice_service.voice_to_content_suite(audio_data, file_format)
        
        if result["success"]:
            # Update user generation count
            db = get_database()
            await db.users.update_one(
                {"id": current_user.id},
                {"$inc": {"daily_generations_used": 1}}
            )
            
            # Store generation result
            generation_result = GenerationResult(
                id=str(uuid.uuid4()),
                user_id=current_user.id,
                category=result["content_details"]["category"],
                platform=result["content_details"]["platform"],
                content_description=result["transcript"],
                ai_responses=result["generated_content"]["ai_responses"],
                hashtags=result["generated_content"]["hashtags"],
                combined_result=result["generated_content"]["combined_result"],
                created_at=datetime.utcnow()
            )
            
            await db.generation_results.insert_one(generation_result.dict())
        
        return result
        
    except Exception as e:
        logger.error(f"Voice to content suite error: {e}")
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")

@api_router.post("/voice/command")
async def voice_command_handler(
    audio_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Handle voice commands for hands-free operation"""
    try:
        # Read audio file
        audio_data = await audio_file.read()
        
        # Get file extension to determine format
        file_format = audio_file.filename.split('.')[-1].lower()
        if file_format not in ['wav', 'mp3', 'webm', 'ogg', 'm4a']:
            raise HTTPException(status_code=400, detail="Unsupported audio format")
        
        # Process voice command
        result = await voice_service.voice_command_handler(audio_data, file_format)
        
        return result
        
    except Exception as e:
        logger.error(f"Voice command error: {e}")
        raise HTTPException(status_code=500, detail=f"Voice command processing failed: {str(e)}")

@api_router.post("/voice/real-time-transcribe")
async def real_time_transcribe(
    audio_chunk: str = Form(...),  # Base64 encoded audio chunk
    is_final: bool = Form(False),
    current_user: User = Depends(get_current_user)
):
    """Real-time transcription for streaming audio"""
    try:
        import base64
        
        # Decode base64 audio chunk
        audio_data = base64.b64decode(audio_chunk)
        
        # Transcribe chunk
        transcript = await voice_service.transcribe_audio(audio_data, "webm")
        
        return {
            "success": True,
            "transcript": transcript,
            "is_final": is_final,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Real-time transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Real-time transcription failed: {str(e)}")

# Real-Time Trends Routes
@api_router.get("/trends/{platform}")
async def get_trending_topics(
    platform: Platform,
    category: Optional[ContentCategory] = None,
    limit: int = 20,
    current_user: User = Depends(get_current_user)
):
    """Get real-time trending topics for a platform"""
    try:
        trends = await trends_service.get_trending_topics(platform, category, limit)
        
        # Convert TrendData objects to dictionaries
        trends_data = []
        for trend in trends:
            trends_data.append({
                "keyword": trend.keyword,
                "platform": trend.platform.value,
                "volume": trend.volume,
                "growth_rate": trend.growth_rate,
                "engagement_score": trend.engagement_score,
                "predicted_duration": trend.predicted_duration,
                "related_hashtags": trend.related_hashtags,
                "sentiment": trend.sentiment,
                "category": trend.category.value,
                "created_at": trend.created_at.isoformat()
            })
        
        return {
            "success": True,
            "trends": trends_data,
            "platform": platform.value,
            "category": category.value if category else None,
            "total_count": len(trends_data)
        }
        
    except Exception as e:
        logger.error(f"Error getting trending topics: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get trending topics: {str(e)}")

@api_router.get("/trends/{platform}/predictions")
async def get_trend_predictions(
    platform: Platform,
    days_ahead: int = 7,
    current_user: User = Depends(get_current_user)
):
    """Get predicted future trends for a platform"""
    await check_generation_limit(current_user)
    
    try:
        predictions = await trends_service.predict_future_trends(platform, days_ahead)
        
        # Convert TrendPrediction objects to dictionaries
        predictions_data = []
        for prediction in predictions:
            predictions_data.append({
                "keyword": prediction.keyword,
                "platform": prediction.platform.value,
                "likelihood": prediction.likelihood,
                "estimated_peak_date": prediction.estimated_peak_date.isoformat(),
                "recommended_action": prediction.recommended_action,
                "content_suggestions": prediction.content_suggestions
            })
        
        return {
            "success": True,
            "predictions": predictions_data,
            "platform": platform.value,
            "days_ahead": days_ahead,
            "total_predictions": len(predictions_data)
        }
        
    except Exception as e:
        logger.error(f"Error getting trend predictions: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get trend predictions: {str(e)}")

@api_router.get("/trends/{platform}/analysis/{keyword}")
async def get_trend_analysis(
    platform: Platform,
    keyword: str,
    current_user: User = Depends(get_current_user)
):
    """Get detailed analysis for a specific trend"""
    await check_generation_limit(current_user)
    
    try:
        analysis = await trends_service.get_trend_analysis(keyword, platform)
        
        if "error" in analysis:
            raise HTTPException(status_code=404, detail=analysis["error"])
        
        return {
            "success": True,
            "keyword": keyword,
            "platform": platform.value,
            "analysis": analysis
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting trend analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get trend analysis: {str(e)}")

@api_router.get("/trends/all/summary")
async def get_trends_summary(
    current_user: User = Depends(get_current_user)
):
    """Get summary of trends across all platforms"""
    try:
        summary = {}
        
        # Get top trends for each platform
        for platform in Platform:
            try:
                trends = await trends_service.get_trending_topics(platform, limit=5)
                summary[platform.value] = {
                    "top_trends": [
                        {
                            "keyword": trend.keyword,
                            "volume": trend.volume,
                            "growth_rate": trend.growth_rate,
                            "category": trend.category.value
                        }
                        for trend in trends[:3]
                    ],
                    "total_trends": len(trends)
                }
            except Exception as e:
                logger.error(f"Error getting trends for {platform.value}: {e}")
                summary[platform.value] = {"error": str(e)}
        
        return {
            "success": True,
            "summary": summary,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting trends summary: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get trends summary: {str(e)}")

@api_router.post("/trends/content-from-trend")
async def generate_content_from_trend(
    request: dict,
    current_user: User = Depends(get_current_user)
):
    """Generate content based on a trending topic"""
    await check_generation_limit(current_user)
    
    try:
        keyword = request.get("keyword")
        platform = Platform(request.get("platform"))
        category = ContentCategory(request.get("category", "business"))
        
        if not keyword:
            raise HTTPException(status_code=400, detail="Keyword is required")
        
        # Get trend analysis
        trend_analysis = await trends_service.get_trend_analysis(keyword, platform)
        
        # Create enhanced prompt with trend context
        trend_context = f"""
        Trending Topic: {keyword}
        Platform: {platform.value}
        Category: {category.value}
        
        Trend Analysis: {trend_analysis.get('analysis', {})}
        Content Suggestions: {trend_analysis.get('content_suggestions', [])}
        Optimal Timing: {trend_analysis.get('optimal_timing', {})}
        
        Create viral content that leverages this trending topic for maximum engagement.
        """
        
        # Generate content using existing AI service
        content_result = await ai_service.generate_combined_content(
            category=category,
            platform=platform,
            content_description=trend_context,
            providers=["openai", "anthropic", "gemini"]
        )
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        # Store generation result
        generation_result = GenerationResult(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            category=category,
            platform=platform,
            content_description=f"Trend-based content: {keyword}",
            ai_responses=content_result["ai_responses"],
            hashtags=content_result["hashtags"],
            combined_result=content_result["combined_result"],
            created_at=datetime.utcnow()
        )
        
        await db.generation_results.insert_one(generation_result.dict())
        
        return {
            "success": True,
            "trend_keyword": keyword,
            "trend_analysis": trend_analysis,
            "generated_content": content_result,
            "timing_recommendation": trend_analysis.get('optimal_timing', {})
        }
        
    except Exception as e:
        logger.error(f"Error generating content from trend: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate content from trend: {str(e)}")

# Smart Content Remix Routes
@api_router.post("/remix/platform-adapt")
async def remix_content_for_platform(
    request: dict,
    current_user: User = Depends(get_current_user)
):
    """Remix content for a different platform"""
    await check_generation_limit(current_user)
    
    try:
        content = request.get("content")
        source_platform = Platform(request.get("source_platform"))
        target_platform = Platform(request.get("target_platform"))
        category = ContentCategory(request.get("category", "business"))
        
        if not content:
            raise HTTPException(status_code=400, detail="Content is required")
        
        # Generate platform remix
        remix = await content_remix_engine.remix_content_for_platform(
            content, source_platform, target_platform, category
        )
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        return {
            "success": True,
            "original_content": remix.original_content,
            "original_platform": remix.original_platform.value,
            "target_platform": remix.target_platform.value,
            "remixed_content": remix.remixed_content,
            "adaptation_notes": remix.adaptation_notes,
            "engagement_prediction": remix.engagement_prediction,
            "created_at": remix.created_at.isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error remixing content for platform: {e}")
        raise HTTPException(status_code=500, detail=f"Content remix failed: {str(e)}")

@api_router.post("/remix/generate-variations")
async def generate_content_variations(
    request: dict,
    current_user: User = Depends(get_current_user)
):
    """Generate multiple variations of content"""
    await check_generation_limit(current_user)
    
    try:
        content = request.get("content")
        platform = Platform(request.get("platform"))
        category = ContentCategory(request.get("category", "business"))
        variation_count = request.get("variation_count", 5)
        
        if not content:
            raise HTTPException(status_code=400, detail="Content is required")
        
        # Generate variations
        variations = await content_remix_engine.generate_content_variations(
            content, platform, category, variation_count
        )
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        variations_data = []
        for variation in variations:
            variations_data.append({
                "variation_type": variation.variation_type,
                "variation_content": variation.variation_content,
                "tone": variation.tone,
                "target_audience": variation.target_audience,
                "engagement_score": variation.engagement_score,
                "created_at": variation.created_at.isoformat()
            })
        
        return {
            "success": True,
            "original_content": content,
            "platform": platform.value,
            "category": category.value,
            "variations": variations_data,
            "total_variations": len(variations_data)
        }
        
    except Exception as e:
        logger.error(f"Error generating content variations: {e}")
        raise HTTPException(status_code=500, detail=f"Content variation generation failed: {str(e)}")

@api_router.post("/remix/cross-platform-suite")
async def generate_cross_platform_suite(
    request: dict,
    current_user: User = Depends(get_current_user)
):
    """Generate complete cross-platform content suite"""
    await check_generation_limit(current_user)
    
    try:
        content = request.get("content")
        category = ContentCategory(request.get("category", "business"))
        
        if not content:
            raise HTTPException(status_code=400, detail="Content is required")
        
        # Generate cross-platform suite
        suite = await content_remix_engine.cross_platform_content_suite(
            content, category, current_user.id
        )
        
        if "error" in suite:
            raise HTTPException(status_code=500, detail=suite["error"])
        
        # Update user generation count (this is a premium feature)
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 2}}  # Cross-platform costs 2 generations
        )
        
        return {
            "success": True,
            "suite": suite
        }
        
    except Exception as e:
        logger.error(f"Error generating cross-platform suite: {e}")
        raise HTTPException(status_code=500, detail=f"Cross-platform suite generation failed: {str(e)}")

@api_router.get("/remix/user-remixes")
async def get_user_remixes(
    limit: int = 20,
    current_user: User = Depends(get_current_user)
):
    """Get user's content remixes"""
    try:
        remixes = await content_remix_engine.get_user_remixes(current_user.id, limit)
        
        return {
            "success": True,
            "remixes": remixes,
            "total_count": len(remixes)
        }
        
    except Exception as e:
        logger.error(f"Error getting user remixes: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get user remixes: {str(e)}")

@api_router.get("/remix/analytics")
async def get_remix_analytics(
    current_user: User = Depends(get_current_user)
):
    """Get remix analytics for user"""
    try:
        analytics = await content_remix_engine.get_remix_analytics(current_user.id)
        
        if "error" in analytics:
            raise HTTPException(status_code=500, detail=analytics["error"])
        
        return {
            "success": True,
            "analytics": analytics
        }
        
    except Exception as e:
        logger.error(f"Error getting remix analytics: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get remix analytics: {str(e)}")

# AI-Powered Competitor Analysis Routes
@api_router.post("/competitor/discover")
async def discover_competitor(
    request: dict,
    current_user: User = Depends(get_current_user)
):
    """Discover and analyze a competitor"""
    await check_generation_limit(current_user)
    
    try:
        query = request.get("query")
        if not query:
            raise HTTPException(status_code=400, detail="Competitor query is required")
        
        result = await competitor_service.discover_competitor(query, current_user.id)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result.get("error", "Failed to discover competitor"))
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error discovering competitor: {e}")
        raise HTTPException(status_code=500, detail=f"Competitor discovery failed: {str(e)}")

@api_router.post("/competitor/{competitor_id}/analyze-strategy")
async def analyze_competitor_strategy(
    competitor_id: str,
    current_user: User = Depends(get_current_user)
):
    """Analyze competitor's content strategy"""
    await check_generation_limit(current_user)
    
    try:
        result = await competitor_service.analyze_content_strategy(competitor_id, current_user.id)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result.get("error", "Failed to analyze strategy"))
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing competitor strategy: {e}")
        raise HTTPException(status_code=500, detail=f"Strategy analysis failed: {str(e)}")

@api_router.post("/competitor/{competitor_id}/generate-content")
async def generate_competitive_content(
    competitor_id: str,
    request: dict,
    current_user: User = Depends(get_current_user)
):
    """Generate content to outperform competitor"""
    await check_generation_limit(current_user)
    
    try:
        content_type = request.get("content_type", "viral_posts")
        
        result = await competitor_service.generate_competitive_content(
            competitor_id, content_type, current_user.id
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result.get("error", "Failed to generate competitive content"))
        
        # Update user generation count (premium feature costs more)
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 2}}
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating competitive content: {e}")
        raise HTTPException(status_code=500, detail=f"Competitive content generation failed: {str(e)}")

@api_router.get("/competitor/{competitor_id}/gap-analysis")
async def get_competitor_gap_analysis(
    competitor_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get gap analysis for competitor"""
    await check_generation_limit(current_user)
    
    try:
        result = await competitor_service.get_gap_analysis(competitor_id, current_user.id)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result.get("error", "Failed to perform gap analysis"))
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error performing gap analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Gap analysis failed: {str(e)}")

@api_router.get("/competitor/list")
async def get_user_competitors(
    current_user: User = Depends(get_current_user)
):
    """Get user's analyzed competitors"""
    try:
        competitors = await competitor_service.get_user_competitors(current_user.id)
        
        return {
            "success": True,
            "competitors": competitors,
            "total_count": len(competitors)
        }
        
    except Exception as e:
        logger.error(f"Error getting user competitors: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get competitors: {str(e)}")

# Basic Routes
@api_router.get("/")
async def root():
    return {"message": "THREE11 MOTION TECH - Complete Content Creation Suite API"}

# PHASE 2: Power User Features API Endpoints

# Batch Content Generation Routes
@api_router.post("/batch/generate", response_model=BatchGenerationResult)
async def create_batch_generation(
    request: BatchGenerationRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a batch content generation job"""
    # Check generation limits for batch operations
    if current_user.tier == UserTier.FREE:
        total_items = len(request.content_descriptions)
        if total_items > 10:
            raise HTTPException(status_code=403, detail="Free users limited to 10 items per batch. Upgrade to Premium for unlimited batch generation.")
        
        # Check daily limit
        if current_user.daily_generations_used + total_items > 10:
            raise HTTPException(status_code=403, detail="Batch would exceed daily generation limit. Upgrade to Premium for unlimited generations.")
    
    try:
        request.user_id = current_user.id
        batch_result = await batch_content_service.create_batch_generation(request)
        return batch_result
    except Exception as e:
        logger.error(f"Error creating batch generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to create batch generation")

@api_router.get("/batch/{batch_id}", response_model=BatchGenerationResult)
async def get_batch_status(
    batch_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get batch generation status"""
    batch_result = await batch_content_service.get_batch_status(batch_id, current_user.id)
    if not batch_result:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch_result

@api_router.get("/batch", response_model=List[BatchGenerationResult])
async def get_user_batches(
    current_user: User = Depends(get_current_user),
    limit: int = 20,
    skip: int = 0
):
    """Get user's batch generation history"""
    return await batch_content_service.get_user_batches(current_user.id, limit, skip)

@api_router.post("/batch/{batch_id}/cancel")
async def cancel_batch(
    batch_id: str,
    current_user: User = Depends(get_current_user)
):
    """Cancel a batch generation job"""
    success = await batch_content_service.cancel_batch(batch_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Batch not found or cannot be cancelled")
    return {"message": "Batch cancelled successfully"}

# Content Scheduling Routes
@api_router.post("/schedule", response_model=ScheduledContent)
async def schedule_content(
    user_id: str = Form(...),
    generation_result_id: str = Form(...),
    platform: Platform = Form(...),
    scheduled_time: datetime = Form(...),
    auto_post: bool = Form(False),
    notes: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
):
    """Schedule content for posting"""
    if current_user.tier == UserTier.FREE:
        # Count existing scheduled posts
        scheduled_posts = await content_scheduling_service.get_scheduled_content(current_user.id)
        if len(scheduled_posts) >= 5:
            raise HTTPException(status_code=403, detail="Free users limited to 5 scheduled posts. Upgrade to Premium for unlimited scheduling.")
    
    try:
        scheduled_content = await content_scheduling_service.schedule_content(
            user_id=current_user.id,
            generation_result_id=generation_result_id,
            platform=platform,
            scheduled_time=scheduled_time,
            auto_post=auto_post,
            notes=notes
        )
        return scheduled_content
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error scheduling content: {e}")
        raise HTTPException(status_code=500, detail="Failed to schedule content")

@api_router.get("/schedule", response_model=List[ScheduledContent])
async def get_scheduled_content(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user)
):
    """Get user's scheduled content"""
    return await content_scheduling_service.get_scheduled_content(current_user.id, start_date, end_date)

@api_router.get("/schedule/calendar")
async def get_calendar_overview(
    days_ahead: int = 30,
    current_user: User = Depends(get_current_user)
):
    """Get calendar overview with statistics"""
    return await content_scheduling_service.get_calendar_overview(current_user.id, days_ahead)

@api_router.put("/schedule/{scheduled_id}")
async def update_scheduled_content(
    scheduled_id: str,
    scheduled_time: Optional[datetime] = None,
    auto_post: Optional[bool] = None,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Update scheduled content"""
    success = await content_scheduling_service.update_scheduled_content(
        scheduled_id, current_user.id, scheduled_time, auto_post, notes
    )
    if not success:
        raise HTTPException(status_code=404, detail="Scheduled content not found")
    return {"message": "Scheduled content updated successfully"}

@api_router.delete("/schedule/{scheduled_id}")
async def cancel_scheduled_content(
    scheduled_id: str,
    current_user: User = Depends(get_current_user)
):
    """Cancel scheduled content"""
    success = await content_scheduling_service.cancel_scheduled_content(scheduled_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Scheduled content not found")
    return {"message": "Scheduled content cancelled successfully"}

# Template Library Routes
@api_router.get("/templates", response_model=List[ContentTemplate])
async def get_templates(
    category: Optional[ContentCategory] = None,
    platform: Optional[Platform] = None,
    template_type: Optional[str] = None,
    include_premium: bool = True,
    current_user: User = Depends(get_current_user)
):
    """Get content templates"""
    # Free users can't access premium templates
    if current_user.tier == UserTier.FREE:
        include_premium = False
    
    return await template_library_service.get_templates(
        category=category,
        platform=platform,
        template_type=template_type,
        user_id=current_user.id,
        include_premium=include_premium
    )

@api_router.get("/templates/{template_id}", response_model=ContentTemplate)
async def get_template(
    template_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific template"""
    template = await template_library_service.get_template_by_id(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Check premium access
    if template.is_premium and current_user.tier == UserTier.FREE:
        raise HTTPException(status_code=403, detail="Premium template access requires upgrade")
    
    return template

@api_router.post("/templates/use/{template_id}")
async def use_template(
    template_id: str,
    placeholders: Dict[str, str],
    current_user: User = Depends(get_current_user)
):
    """Use a template by filling in placeholders"""
    try:
        content = await template_library_service.use_template(template_id, placeholders)
        return {"content": content}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error using template: {e}")
        raise HTTPException(status_code=500, detail="Failed to use template")

@api_router.post("/templates/suggestions")
async def get_template_suggestions(
    category: ContentCategory,
    platform: Platform,
    content_description: str,
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered template suggestions"""
    try:
        suggestions = await template_library_service.generate_template_suggestions(
            category, platform, content_description
        )
        return {"suggestions": suggestions}
    except Exception as e:
        logger.error(f"Error generating template suggestions: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate suggestions")

@api_router.post("/templates", response_model=ContentTemplate)
async def create_custom_template(
    template: ContentTemplate,
    current_user: User = Depends(get_current_user)
):
    """Create a custom template"""
    if current_user.tier == UserTier.FREE:
        # Count user's custom templates
        user_templates = await template_library_service.get_templates(user_id=current_user.id)
        custom_templates = [t for t in user_templates if t.created_by == current_user.id]
        if len(custom_templates) >= 3:
            raise HTTPException(status_code=403, detail="Free users limited to 3 custom templates. Upgrade to Premium for unlimited templates.")
    
    try:
        return await template_library_service.create_custom_template(current_user.id, template)
    except Exception as e:
        logger.error(f"Error creating custom template: {e}")
        raise HTTPException(status_code=500, detail="Failed to create template")

# Advanced Analytics Routes
@api_router.get("/analytics/dashboard", response_model=AnalyticsDashboard)
async def get_analytics_dashboard(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive analytics dashboard"""
    try:
        dashboard = await advanced_analytics_service.generate_analytics_dashboard(
            current_user.id, start_date, end_date
        )
        return dashboard
    except Exception as e:
        logger.error(f"Error generating analytics dashboard: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate analytics")

@api_router.get("/analytics/insights")
async def get_content_insights(
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered content insights"""
    try:
        insights = await advanced_analytics_service.get_content_insights(current_user.id, limit)
        return insights
    except Exception as e:
        logger.error(f"Error generating insights: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate insights")

@api_router.post("/analytics/performance", response_model=ContentPerformance)
async def create_performance_record(
    generation_result_id: str,
    platform: Platform,
    post_url: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Create a performance tracking record"""
    try:
        performance = await advanced_analytics_service.create_performance_record(
            current_user.id, generation_result_id, platform, post_url
        )
        return performance
    except Exception as e:
        logger.error(f"Error creating performance record: {e}")
        raise HTTPException(status_code=500, detail="Failed to create performance record")

@api_router.put("/analytics/performance/{performance_id}")
async def update_performance_metrics(
    performance_id: str,
    views: Optional[int] = None,
    likes: Optional[int] = None,
    comments: Optional[int] = None,
    shares: Optional[int] = None,
    reach: Optional[int] = None,
    impressions: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    """Update performance metrics"""
    success = await advanced_analytics_service.update_performance_metrics(
        performance_id, current_user.id, views, likes, comments, shares, reach, impressions
    )
    if not success:
        raise HTTPException(status_code=404, detail="Performance record not found")
    return {"message": "Performance metrics updated successfully"}

@api_router.post("/analytics/competitor-benchmark", response_model=CompetitorBenchmark)
async def create_competitor_benchmark(
    competitor_name: str,
    platform: Platform,
    category: ContentCategory,
    competitor_avg_engagement: float,
    current_user: User = Depends(get_current_user)
):
    """Create competitor benchmark analysis"""
    try:
        benchmark = await advanced_analytics_service.create_competitor_benchmark(
            current_user.id, competitor_name, platform, category, competitor_avg_engagement
        )
        return benchmark
    except Exception as e:
        logger.error(f"Error creating competitor benchmark: {e}")
        raise HTTPException(status_code=500, detail="Failed to create benchmark")

# PHASE 3: Content Type Expansion API Endpoints

# Video Content Routes
@api_router.post("/video/captions", response_model=VideoCaptionResult)
async def generate_video_captions(
    request: VideoCaptionRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate video captions and subtitles"""
    if current_user.tier == UserTier.FREE:
        # Count recent video generations
        recent_videos = await video_content_service.get_user_video_captions(current_user.id, 30)
        if len(recent_videos) >= 5:
            raise HTTPException(status_code=403, detail="Free users limited to 5 video captions per month. Upgrade to Premium for unlimited access.")
    
    try:
        request.user_id = current_user.id
        result = await video_content_service.generate_video_captions(request)
        return result
    except Exception as e:
        logger.error(f"Error generating video captions: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate video captions")

@api_router.get("/video/captions", response_model=List[VideoCaptionResult])
async def get_user_video_captions(
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Get user's video caption history"""
    return await video_content_service.get_user_video_captions(current_user.id, limit)

# Podcast Content Routes
@api_router.post("/podcast/content", response_model=PodcastContentResult)
async def generate_podcast_content(
    request: PodcastContentRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate podcast descriptions and show notes"""
    if current_user.tier == UserTier.FREE:
        recent_podcasts = await podcast_content_service.get_user_podcast_content(current_user.id, 30)
        if len(recent_podcasts) >= 3:
            raise HTTPException(status_code=403, detail="Free users limited to 3 podcast contents per month. Upgrade to Premium for unlimited access.")
    
    try:
        request.user_id = current_user.id
        result = await podcast_content_service.generate_podcast_content(request)
        return result
    except Exception as e:
        logger.error(f"Error generating podcast content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate podcast content")

@api_router.get("/podcast/content", response_model=List[PodcastContentResult])
async def get_user_podcast_content(
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Get user's podcast content history"""
    return await podcast_content_service.get_user_podcast_content(current_user.id, limit)

@api_router.get("/podcast/analytics")
async def get_podcast_analytics(
    current_user: User = Depends(get_current_user)
):
    """Get podcast content analytics"""
    return await podcast_content_service.get_podcast_analytics(current_user.id)

# Email Marketing Routes
@api_router.post("/email/content", response_model=EmailContentResult)
async def generate_email_content(
    request: EmailContentRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate email marketing content"""
    if current_user.tier == UserTier.FREE:
        recent_emails = await email_marketing_service.get_user_email_campaigns(current_user.id, 30)
        if len(recent_emails) >= 5:
            raise HTTPException(status_code=403, detail="Free users limited to 5 email campaigns per month. Upgrade to Premium for unlimited access.")
    
    try:
        request.user_id = current_user.id
        result = await email_marketing_service.generate_email_content(request)
        return result
    except Exception as e:
        logger.error(f"Error generating email content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate email content")

@api_router.get("/email/campaigns", response_model=List[EmailContentResult])
async def get_user_email_campaigns(
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Get user's email campaign history"""
    return await email_marketing_service.get_user_email_campaigns(current_user.id, limit)

@api_router.get("/email/analytics")
async def get_email_analytics(
    current_user: User = Depends(get_current_user)
):
    """Get email marketing analytics"""
    return await email_marketing_service.get_email_analytics(current_user.id)

# Blog Post Routes
@api_router.post("/blog/post", response_model=BlogPostResult)
async def generate_blog_post(
    request: BlogPostRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate SEO-optimized blog post"""
    if current_user.tier == UserTier.FREE:
        recent_blogs = await blog_post_service.get_user_blog_posts(current_user.id, 30)
        if len(recent_blogs) >= 3:
            raise HTTPException(status_code=403, detail="Free users limited to 3 blog posts per month. Upgrade to Premium for unlimited access.")
    
    try:
        request.user_id = current_user.id
        result = await blog_post_service.generate_blog_post(request)
        return result
    except Exception as e:
        logger.error(f"Error generating blog post: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate blog post")

@api_router.get("/blog/posts", response_model=List[BlogPostResult])
async def get_user_blog_posts(
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Get user's blog post history"""
    return await blog_post_service.get_user_blog_posts(current_user.id, limit)

@api_router.get("/blog/analytics")
async def get_blog_analytics(
    current_user: User = Depends(get_current_user)
):
    """Get blog post analytics"""
    return await blog_post_service.get_blog_analytics(current_user.id)

# Product Description Routes
@api_router.post("/product/description", response_model=ProductDescriptionResult)
async def generate_product_description(
    request: ProductDescriptionRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate product descriptions"""
    if current_user.tier == UserTier.FREE:
        recent_products = await product_description_service.get_user_products(current_user.id, 30)
        if len(recent_products) >= 10:
            raise HTTPException(status_code=403, detail="Free users limited to 10 product descriptions per month. Upgrade to Premium for unlimited access.")
    
    try:
        request.user_id = current_user.id
        result = await product_description_service.generate_product_description(request)
        return result
    except Exception as e:
        logger.error(f"Error generating product description: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate product description")

@api_router.get("/product/descriptions", response_model=List[ProductDescriptionResult])
async def get_user_product_descriptions(
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Get user's product description history"""
    return await product_description_service.get_user_products(current_user.id, limit)

@api_router.get("/product/analytics")
async def get_product_analytics(
    current_user: User = Depends(get_current_user)
):
    """Get product description analytics"""
    return await product_description_service.get_product_analytics(current_user.id)

# PHASE 3: Content Type Expansion API Endpoints (Matching Review Request Paths)

@api_router.post("/video-content/generate", response_model=VideoCaptionResult)
async def generate_video_content(
    request: VideoCaptionRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate video captions and subtitles"""
    await check_generation_limit(current_user)
    
    try:
        request.user_id = current_user.id
        result = await video_content_service.generate_video_captions(request)
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        return result
    except Exception as e:
        logger.error(f"Error generating video content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate video content")

@api_router.post("/podcast-content/generate", response_model=PodcastContentResult)
async def generate_podcast_content_alt(
    request: PodcastContentRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate podcast descriptions and show notes"""
    await check_generation_limit(current_user)
    
    try:
        request.user_id = current_user.id
        result = await podcast_content_service.generate_podcast_content(request)
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        return result
    except Exception as e:
        logger.error(f"Error generating podcast content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate podcast content")

@api_router.post("/email-marketing/generate", response_model=EmailContentResult)
async def generate_email_marketing_content(
    request: EmailContentRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate email marketing campaigns"""
    await check_generation_limit(current_user)
    
    try:
        request.user_id = current_user.id
        result = await email_marketing_service.generate_email_content(request)
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        return result
    except Exception as e:
        logger.error(f"Error generating email marketing content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate email marketing content")

@api_router.post("/blog-post/generate", response_model=BlogPostResult)
async def generate_blog_post_content(
    request: BlogPostRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate SEO-optimized blog posts"""
    await check_generation_limit(current_user)
    
    try:
        request.user_id = current_user.id
        result = await blog_post_service.generate_blog_post(request)
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        return result
    except Exception as e:
        logger.error(f"Error generating blog post: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate blog post")

@api_router.post("/product-descriptions/generate", response_model=ProductDescriptionResult)
async def generate_product_descriptions_content(
    request: ProductDescriptionRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate e-commerce product descriptions"""
    await check_generation_limit(current_user)
    
    try:
        request.user_id = current_user.id
        result = await product_description_service.generate_product_description(request)
        
        # Update user generation count
        db = get_database()
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"daily_generations_used": 1}}
        )
        
        return result
    except Exception as e:
        logger.error(f"Error generating product descriptions: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate product descriptions")

# =====================================
# PHASE 4: INTELLIGENCE & INSIGHTS API ENDPOINTS
# =====================================

# Performance Tracking Routes
@api_router.post("/performance/track")
async def track_performance_endpoint(
    user_id: str,
    content_id: str,
    platform: Platform,
    category: ContentCategory,
    metrics_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Track performance metrics for content"""
    return await performance_service.track_content_performance(
        user_id, content_id, platform, category, metrics_data
    )

@api_router.post("/performance/analyze")
async def get_performance_analysis_endpoint(
    request: PerformanceTrackingRequest,
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive performance analysis"""
    return await performance_service.get_performance_analysis(request)

@api_router.get("/performance/real-time/{content_id}")
async def get_real_time_metrics_endpoint(
    content_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get real-time performance metrics"""
    return await performance_service.get_real_time_metrics(current_user.id, content_id)

@api_router.get("/performance/insights")
async def get_performance_insights_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered performance insights"""
    # Mock metrics data for insight generation
    mock_metrics = [
        {"engagement_rate": 3.2, "platform": "instagram", "category": "fitness"},
        {"engagement_rate": 5.8, "platform": "tiktok", "category": "fashion"},
        {"engagement_rate": 1.9, "platform": "facebook", "category": "business"}
    ]
    return await performance_service.generate_performance_insights(current_user.id, mock_metrics)

@api_router.get("/performance/dashboard")
async def get_performance_dashboard_endpoint(
    date_range: str = "30_days",
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive performance dashboard data"""
    request = PerformanceTrackingRequest(user_id=current_user.id, date_range=date_range)
    analysis = await performance_service.get_performance_analysis(request)
    insights = await performance_service.generate_performance_insights(current_user.id, [])
    
    return {
        "performance_analysis": analysis,
        "key_insights": insights[:3],  # Top 3 insights
        "real_time_summary": {
            "active_content_pieces": random.randint(10, 50),
            "total_views_today": random.randint(1000, 10000),
            "trending_content_count": random.randint(1, 5)
        }
    }

# Engagement Prediction Routes
@api_router.post("/engagement/predict")
async def predict_engagement_endpoint(
    request: EngagementPredictionRequest,
    current_user: User = Depends(get_current_user)
):
    """Predict engagement for content"""
    return await engagement_service.predict_engagement(request)

@api_router.post("/engagement/track-accuracy")
async def track_prediction_accuracy_endpoint(
    prediction_id: str,
    actual_metrics: Dict[str, int],
    current_user: User = Depends(get_current_user)
):
    """Track prediction accuracy for model improvement"""
    return await engagement_service.track_prediction_accuracy(prediction_id, actual_metrics)

@api_router.get("/engagement/best-posting-time")
async def get_best_posting_time_endpoint(
    platform: Platform,
    category: ContentCategory,
    current_user: User = Depends(get_current_user)
):
    """Get predicted best posting time"""
    request = EngagementPredictionRequest(
        user_id=current_user.id,
        content_type=ContentType.CAPTION,
        category=category,
        platform=platform,
        content_preview="Sample content"
    )
    
    best_time = await engagement_service._predict_best_posting_time(request)
    
    return {
        "best_posting_time": best_time,
        "timezone_note": "Times shown in UTC",
        "confidence": "medium",
        "alternative_times": [
            best_time + timedelta(hours=2),
            best_time + timedelta(hours=4),
            best_time - timedelta(hours=1)
        ]
    }

@api_router.get("/engagement/insights")
async def get_engagement_insights_endpoint(
    platform: Platform,
    category: ContentCategory,
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered engagement insights for user"""
    
    # Simulate user's historical performance
    mock_request = EngagementPredictionRequest(
        user_id=current_user.id,
        content_type=ContentType.CAPTION,
        category=category,
        platform=platform,
        content_preview="Your typical content style"
    )
    
    prediction = await engagement_service.predict_engagement(mock_request)
    
    return {
        "platform_benchmark": engagement_service.platform_benchmarks[platform],
        "category_performance": engagement_service.category_modifiers[category],
        "your_predicted_performance": {
            "engagement_rate": prediction.predicted_engagement_rate,
            "confidence": prediction.confidence_score
        },
        "optimization_opportunities": prediction.optimization_suggestions,
        "best_practices": [
            f"Post during peak hours for {platform.value}",
            f"Optimize content for {category.value} audience",
            "Use engaging hooks in first 3 seconds",
            "Include relevant trending hashtags"
        ]
    }

# A/B Testing Routes
@api_router.post("/ab-testing/create")
async def create_ab_test_endpoint(
    request: ABTestRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a new A/B test experiment"""
    return await ab_testing_service.create_ab_test(request)

@api_router.post("/ab-testing/start/{experiment_id}")
async def start_ab_test_endpoint(
    experiment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Start an A/B test experiment"""
    return await ab_testing_service.start_ab_test(experiment_id)

@api_router.get("/ab-testing/results/{experiment_id}")
async def get_ab_test_results_endpoint(
    experiment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get A/B test results"""
    return await ab_testing_service.get_ab_test_results(experiment_id)

@api_router.post("/ab-testing/stop/{experiment_id}")
async def stop_ab_test_endpoint(
    experiment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Stop an A/B test experiment"""
    return await ab_testing_service.stop_ab_test(experiment_id)

@api_router.get("/ab-testing/user-experiments")
async def get_user_experiments_endpoint(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get all A/B test experiments for a user"""
    return await ab_testing_service.get_user_experiments(current_user.id, status)

@api_router.get("/ab-testing/analyze/{experiment_id}")
async def analyze_ab_test_endpoint(
    experiment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get detailed A/B test analysis"""
    return await ab_testing_service.analyze_ab_test_performance(experiment_id)

@api_router.get("/ab-testing/suggestions")
async def suggest_ab_tests_endpoint(
    platform: Platform,
    category: ContentCategory,
    current_user: User = Depends(get_current_user)
):
    """Get A/B test suggestions"""
    return await ab_testing_service.suggest_ab_tests(current_user.id, platform, category)

@api_router.get("/ab-testing/dashboard")
async def get_ab_testing_dashboard_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get A/B testing dashboard data"""
    active_tests = await ab_testing_service.get_user_experiments(current_user.id, "running")
    completed_tests = await ab_testing_service.get_user_experiments(current_user.id, "completed")
    suggestions = await ab_testing_service.suggest_ab_tests(current_user.id, Platform.INSTAGRAM, ContentCategory.FASHION)
    
    # Calculate summary stats
    import statistics
    total_tests = len(active_tests) + len(completed_tests)
    avg_improvement = statistics.mean([test.get("improvement", 0) for test in completed_tests if test.get("improvement")]) if completed_tests else 0
    
    return {
        "summary": {
            "total_tests": total_tests,
            "active_tests": len(active_tests),
            "completed_tests": len(completed_tests),
            "average_improvement": round(avg_improvement, 1)
        },
        "active_experiments": active_tests[:3],  # Show top 3 active
        "recent_results": completed_tests[:3],   # Show 3 most recent
        "suggested_tests": suggestions,
        "success_rate": round(len([t for t in completed_tests if t.get("improvement", 0) > 5]) / max(1, len(completed_tests)) * 100, 1)
    }

# Competitor Monitoring Routes
@api_router.post("/competitor-monitoring/alert")
async def create_monitoring_alert_endpoint(
    user_id: str,
    competitor_id: str,
    alert_type: str,
    content_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create competitor monitoring alert"""
    return await competitor_monitoring_service.create_monitoring_alert(
        user_id, competitor_id, alert_type, content_data
    )

@api_router.get("/competitor-monitoring/alerts")
async def get_competitor_alerts_endpoint(
    priority: Optional[str] = None,
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Get competitor monitoring alerts"""
    return await competitor_monitoring_service.get_competitor_alerts(current_user.id, priority, limit)

@api_router.post("/competitor-monitoring/insight-update")
async def create_insight_update_endpoint(
    competitor_id: str,
    insight_type: str,
    previous_data: Dict[str, Any],
    current_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create competitor insight update"""
    return await competitor_monitoring_service.create_insight_update(
        competitor_id, current_user.id, insight_type, previous_data, current_data
    )

@api_router.get("/competitor-monitoring/benchmark")
async def generate_benchmark_endpoint(
    category: ContentCategory,
    platform: Platform,
    current_user: User = Depends(get_current_user)
):
    """Generate competitor benchmark analysis"""
    return await competitor_monitoring_service.generate_competitor_benchmark(current_user.id, category, platform)

@api_router.get("/competitor-monitoring/trends")
async def monitor_trends_endpoint(
    competitor_ids: str,
    current_user: User = Depends(get_current_user)
):
    """Monitor competitor trends"""
    competitor_list = competitor_ids.split(",") if competitor_ids else []
    return await competitor_monitoring_service.monitor_competitor_trends(current_user.id, competitor_list)

@api_router.get("/competitor-monitoring/intelligence-report")
async def get_intelligence_report_endpoint(
    category: ContentCategory,
    platform: Platform,
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive competitive intelligence report"""
    return await competitor_monitoring_service.get_competitive_intelligence_report(current_user.id, category, platform)

@api_router.get("/competitor-monitoring/dashboard")
async def get_monitoring_dashboard_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get competitor monitoring dashboard"""
    alerts = await competitor_monitoring_service.get_competitor_alerts(current_user.id, limit=5)
    benchmark = await competitor_monitoring_service.generate_competitor_benchmark(
        current_user.id, ContentCategory.FASHION, Platform.INSTAGRAM
    )
    
    # Calculate dashboard metrics
    high_priority_alerts = len([a for a in alerts if a.alert_priority in ["high", "critical"]])
    unread_alerts = len([a for a in alerts if not a.is_read])
    
    return {
        "summary": {
            "total_alerts": len(alerts),
            "high_priority_alerts": high_priority_alerts,
            "unread_alerts": unread_alerts,
            "competitive_score": random.randint(65, 85)
        },
        "recent_alerts": alerts[:3],
        "benchmark_summary": {
            "your_percentile": benchmark.performance_percentile,
            "improvement_potential": benchmark.improvement_potential,
            "quick_wins_available": len(benchmark.quick_wins)
        },
        "trending_opportunities": [
            "Video content showing 25% higher engagement",
            "Educational carousels gaining popularity",
            "Behind-the-scenes content trending up"
        ]
    }

# Trend Forecasting Routes
@api_router.post("/trend-forecasting/forecast")
async def generate_trend_forecast_endpoint(
    request: TrendForecastRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate trend forecasts"""
    return await trend_forecasting_service.generate_trend_forecast(request)

@api_router.post("/trend-forecasting/alert")
async def create_trend_alert_endpoint(
    trend_id: str,
    alert_type: str,
    current_user: User = Depends(get_current_user)
):
    """Create trend opportunity alert"""
    return await trend_forecasting_service.create_trend_opportunity_alert(current_user.id, trend_id, alert_type)

@api_router.get("/trend-forecasting/alerts")
async def get_trend_alerts_endpoint(
    urgency: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get trend opportunity alerts"""
    return await trend_forecasting_service.get_trend_alerts(current_user.id, urgency)

@api_router.get("/trend-forecasting/analyze/{trend_id}")
async def analyze_trend_performance_endpoint(
    trend_id: str,
    current_user: User = Depends(get_current_user)
):
    """Analyze trend performance"""
    return await trend_forecasting_service.analyze_trend_performance(current_user.id, trend_id)

@api_router.get("/trend-forecasting/dashboard")
async def get_trend_forecasting_dashboard_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get trend forecasting dashboard"""
    
    # Get recent forecasts
    request = TrendForecastRequest(user_id=current_user.id, forecast_horizon_days=30)
    forecasts = await trend_forecasting_service.generate_trend_forecast(request)
    
    # Get alerts
    alerts = await trend_forecasting_service.get_trend_alerts(current_user.id)
    
    # Calculate dashboard metrics
    high_confidence_forecasts = len([f for f in forecasts if f.confidence_score > 0.8])
    urgent_alerts = len([a for a in alerts if a.urgency_level in ["high", "critical"]])
    
    return {
        "summary": {
            "total_forecasts": len(forecasts),
            "high_confidence_forecasts": high_confidence_forecasts,
            "active_alerts": len(alerts),
            "urgent_opportunities": urgent_alerts
        },
        "top_forecasts": forecasts[:3],
        "urgent_alerts": [a for a in alerts if a.urgency_level in ["high", "critical"]][:3],
        "trending_now": [
            {
                "trend": "AI-generated content",
                "popularity": 85,
                "growth_rate": 25,
                "recommended_action": "act_now"
            },
            {
                "trend": "Short-form educational content",
                "popularity": 78,
                "growth_rate": 18,
                "recommended_action": "prepare_for_peak"
            },
            {
                "trend": "Behind-the-scenes content",
                "popularity": 72,
                "growth_rate": 12,
                "recommended_action": "act_now"
            }
        ],
        "forecast_accuracy": {
            "last_month": round(random.uniform(70, 85), 1),
            "trend_direction": "improving",
            "confidence_level": "high"
        }
    }

@api_router.get("/trend-forecasting/trending-topics")
async def get_trending_topics_endpoint(
    category: Optional[ContentCategory] = None,
    platform: Optional[Platform] = None,
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Get current trending topics"""
    
    # Generate trending topics based on filters
    topics = []
    
    base_topics = [
        "AI and automation",
        "Sustainable living",
        "Mental health awareness",
        "Remote work culture",
        "Digital minimalism",
        "Plant-based lifestyle",
        "Personal branding",
        "Side hustle economy",
        "Mindful consumption",
        "Tech wellness"
    ]
    
    for topic in base_topics[:limit]:
        topics.append({
            "topic": topic,
            "category": category.value if category else random.choice(list(ContentCategory)).value,
            "platform": platform.value if platform else random.choice(list(Platform)).value,
            "popularity_score": round(random.uniform(60, 95), 1),
            "growth_rate": round(random.uniform(5, 40), 1),
            "estimated_peak": datetime.utcnow() + timedelta(days=random.randint(3, 21)),
            "engagement_potential": random.choice(["high", "medium", "very_high"]),
            "content_gap": random.choice(["low", "medium", "high"])  # How much competition exists
        })
    
    return {
        "trending_topics": topics,
        "last_updated": datetime.utcnow(),
        "data_sources": ["social_media_apis", "search_trends", "ai_analysis"],
        "next_update": datetime.utcnow() + timedelta(hours=6)
    }

# Intelligence Dashboard Route (Combined Phase 4 Overview)
@api_router.get("/intelligence/dashboard")
async def get_intelligence_dashboard(
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive Phase 4 Intelligence & Insights dashboard"""
    
    # Get data from all Phase 4 services
    performance_request = PerformanceTrackingRequest(user_id=current_user.id, date_range="30_days")
    performance_analysis = await performance_service.get_performance_analysis(performance_request)
    
    # Get recent trend forecasts
    forecast_request = TrendForecastRequest(user_id=current_user.id, forecast_horizon_days=30)
    forecasts = await trend_forecasting_service.generate_trend_forecast(forecast_request)
    
    # Get competitor alerts
    competitor_alerts = await competitor_monitoring_service.get_competitor_alerts(current_user.id, limit=5)
    
    # Get A/B test summary
    active_tests = await ab_testing_service.get_user_experiments(current_user.id, "running")
    
    # Get engagement insights
    mock_request = EngagementPredictionRequest(
        user_id=current_user.id,
        content_type=ContentType.CAPTION,
        category=ContentCategory.FASHION,
        platform=Platform.INSTAGRAM,
        content_preview="Sample content for insights"
    )
    engagement_prediction = await engagement_service.predict_engagement(mock_request)
    
    return {
        "intelligence_score": random.randint(75, 95),  # Overall intelligence score
        "performance_summary": {
            "avg_engagement_rate": performance_analysis.avg_engagement_rate,
            "total_content_pieces": performance_analysis.total_content_pieces,
            "top_performing_platform": max(performance_analysis.platform_performance.items(), key=lambda x: x[1]["avg_engagement_rate"])[0] if performance_analysis.platform_performance else "instagram"
        },
        "trend_opportunities": {
            "high_confidence_forecasts": len([f for f in forecasts if f.confidence_score > 0.8]),
            "urgent_trends": forecasts[:2],  # Top 2 urgent trends
            "next_big_trend": forecasts[0].trend_topic if forecasts else "AI-generated content"
        },
        "competitive_intelligence": {
            "high_priority_alerts": len([a for a in competitor_alerts if a.alert_priority in ["high", "critical"]]),
            "competitive_position": "Strong" if random.random() > 0.5 else "Improving",
            "key_opportunities": [
                "Video content gap identified",
                "Underutilized trending hashtags",
                "Optimal posting times available"
            ]
        },
        "optimization_insights": {
            "predicted_engagement_boost": f"+{random.randint(15, 45)}%",
            "active_experiments": len(active_tests),
            "next_recommended_test": "Caption hook optimization",
            "best_posting_time": engagement_prediction.best_posting_time
        },
        "key_recommendations": [
            "Focus on video content for 25% engagement boost",
            "Test new posting times during identified peak hours",
            "Capitalize on emerging trend: AI-generated content",
            "Implement competitor strategy: behind-the-scenes content"
        ],
        "alerts_summary": {
            "total_active_alerts": len(competitor_alerts),
            "urgent_actions_needed": random.randint(1, 3),
            "opportunities_expiring_soon": random.randint(0, 2)
        }
    }

# =====================================
# PHASE 5: TEAM COLLABORATION PLATFORM API ENDPOINTS
# =====================================

# Team Management Endpoints
@api_router.post("/teams/create", response_model=Team)
async def create_team_endpoint(
    request: CreateTeamRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a new team workspace"""
    request.owner_id = current_user.id
    return await team_management_service.create_team(request)

@api_router.post("/teams/invite", response_model=TeamInvitation)
async def invite_team_member_endpoint(
    request: InviteTeamMemberRequest,
    current_user: User = Depends(get_current_user)
):
    """Invite a new team member"""
    request.invited_by = current_user.id
    return await team_management_service.invite_team_member(request)

@api_router.post("/teams/accept-invitation/{token}")
async def accept_team_invitation_endpoint(
    token: str,
    current_user: User = Depends(get_current_user)
):
    """Accept a team invitation"""
    return await team_management_service.accept_invitation(token, current_user.id)

@api_router.get("/teams/{team_id}/members")
async def get_team_members_endpoint(
    team_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get all team members"""
    return await team_management_service.get_team_members(team_id, current_user.id)

@api_router.put("/teams/members/role")
async def update_member_role_endpoint(
    request: UpdateMemberRoleRequest,
    current_user: User = Depends(get_current_user)
):
    """Update team member role"""
    request.updated_by = current_user.id
    return await team_management_service.update_member_role(request)

@api_router.delete("/teams/{team_id}/members/{member_id}")
async def remove_team_member_endpoint(
    team_id: str,
    member_id: str,
    reason: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Remove team member"""
    return await team_management_service.remove_team_member(team_id, member_id, current_user.id, reason)

@api_router.get("/teams/{team_id}/activity")
async def get_team_activity_endpoint(
    team_id: str,
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    """Get team activity feed"""
    return await team_management_service.get_team_activity(team_id, current_user.id, limit)

@api_router.get("/teams/{team_id}/dashboard")
async def get_team_dashboard_endpoint(
    team_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get team dashboard data"""
    return await team_management_service.get_team_dashboard(team_id, current_user.id)

# Role and Permission Management Endpoints
@api_router.post("/teams/roles/create", response_model=TeamRole)
async def create_custom_role_endpoint(
    request: CreateRoleRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a new custom role"""
    request.created_by = current_user.id
    return await role_permission_service.create_custom_role(request)

@api_router.put("/teams/roles/{role_id}", response_model=TeamRole)
async def update_role_endpoint(
    role_id: str,
    request: UpdateRoleRequest,
    current_user: User = Depends(get_current_user)
):
    """Update an existing role"""
    request.updated_by = current_user.id
    return await role_permission_service.update_role(role_id, request)

@api_router.delete("/teams/roles/{role_id}")
async def delete_role_endpoint(
    role_id: str,
    team_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a custom role"""
    return await role_permission_service.delete_role(role_id, team_id, current_user.id)

@api_router.get("/teams/{team_id}/roles")
async def get_team_roles_endpoint(
    team_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get all roles for a team"""
    return await role_permission_service.get_team_roles(team_id, current_user.id)

@api_router.get("/teams/permissions/available")
async def get_available_permissions_endpoint():
    """Get all available permissions in the system"""
    return await role_permission_service.get_available_permissions()

@api_router.get("/teams/permissions/suggestions")
async def get_permission_suggestions_endpoint(
    role_type: str,
    content_focus: str = "general"
):
    """Get AI-powered permission suggestions for role creation"""
    return await role_permission_service.get_permission_suggestions(role_type, content_focus)

@api_router.post("/teams/permissions/check")
async def check_user_permissions_endpoint(
    team_id: str,
    permissions: List[str],
    current_user: User = Depends(get_current_user)
):
    """Check if user has specific permissions"""
    return await role_permission_service.check_user_permissions(current_user.id, team_id, permissions)

@api_router.get("/teams/{team_id}/analytics/roles")
async def get_role_analytics_endpoint(
    team_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get role analytics and insights"""
    return await role_permission_service.get_role_analytics(team_id, current_user.id)

# =====================================
# PHASE 6: SOCIAL MEDIA AUTOMATION API ENDPOINTS
# =====================================

# Social Media Publishing Endpoints
@api_router.post("/social/accounts/connect", response_model=SocialAccount)
async def connect_social_account_endpoint(
    request: ConnectSocialAccountRequest,
    current_user: User = Depends(get_current_user)
):
    """Connect a social media account"""
    return await social_media_publishing_service.connect_social_account(request, current_user.id)

@api_router.get("/social/accounts")
async def get_connected_accounts_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get all connected social media accounts"""
    return await social_media_publishing_service.get_connected_accounts(current_user.id)

@api_router.post("/social/posts/create", response_model=SocialMediaPost)
async def create_social_post_endpoint(
    request: CreatePostRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a new social media post"""
    return await social_media_publishing_service.create_social_post(request, current_user.id)

@api_router.post("/social/posts/{post_id}/publish")
async def publish_post_endpoint(
    post_id: str,
    current_user: User = Depends(get_current_user)
):
    """Publish a post to selected platforms"""
    return await social_media_publishing_service.publish_post(post_id, current_user.id)

@api_router.post("/social/posts/schedule")
async def schedule_posts_endpoint(
    request: SchedulePostsRequest,
    current_user: User = Depends(get_current_user)
):
    """Schedule multiple posts for future publishing"""
    return await social_media_publishing_service.schedule_posts(request, current_user.id)

@api_router.get("/social/posts")
async def get_user_posts_endpoint(
    status: Optional[PostStatus] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    """Get user's social media posts"""
    return await social_media_publishing_service.get_user_posts(current_user.id, status, limit)

@api_router.get("/social/analytics")
async def get_publishing_analytics_endpoint(
    date_range: str = "30_days",
    current_user: User = Depends(get_current_user)
):
    """Get publishing analytics and insights"""
    return await social_media_publishing_service.get_publishing_analytics(current_user.id, date_range)

# CRM Integration Endpoints
@api_router.post("/crm/connect", response_model=CRMIntegration)
async def connect_crm_endpoint(
    platform: CRMPlatform,
    api_key: str,
    settings: Dict[str, Any] = {},
    current_user: User = Depends(get_current_user)
):
    """Connect a CRM platform integration"""
    return await crm_integration_service.connect_crm_integration(platform, api_key, current_user.id, settings)

@api_router.post("/crm/{integration_id}/sync")
async def sync_crm_data_endpoint(
    integration_id: str,
    sync_type: str = "contacts",
    current_user: User = Depends(get_current_user)
):
    """Sync data from CRM platform"""
    return await crm_integration_service.sync_crm_data(integration_id, current_user.id, sync_type)

@api_router.get("/crm/contacts")
async def get_crm_contacts_endpoint(
    integration_id: Optional[str] = None,
    filters: Dict[str, Any] = {},
    current_user: User = Depends(get_current_user)
):
    """Get CRM contacts with optional filtering"""
    return await crm_integration_service.get_crm_contacts(current_user.id, integration_id, filters)

@api_router.put("/crm/contacts/{contact_id}/engagement")
async def update_contact_engagement_endpoint(
    contact_id: str,
    engagement_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Update contact engagement based on social media activity"""
    return await crm_integration_service.update_contact_engagement(contact_id, current_user.id, engagement_data)

@api_router.get("/crm/insights")
async def get_engagement_insights_endpoint(
    date_range: str = "30_days",
    current_user: User = Depends(get_current_user)
):
    """Get CRM engagement insights and social media correlation"""
    return await crm_integration_service.get_engagement_insights(current_user.id, date_range)

@api_router.post("/crm/campaigns/create")
async def create_automated_campaign_endpoint(
    campaign_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create automated marketing campaign based on CRM segments"""
    return await crm_integration_service.create_automated_campaign(current_user.id, campaign_data)

@api_router.get("/crm/integrations")
async def get_crm_integrations_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get all CRM integrations for a user"""
    return await crm_integration_service.get_crm_integrations(current_user.id)

# Calendar Integration Endpoints
@api_router.post("/calendar/connect", response_model=CalendarIntegration)
async def connect_calendar_endpoint(
    provider: CalendarProvider,
    access_token: str,
    settings: Dict[str, Any] = {},
    current_user: User = Depends(get_current_user)
):
    """Connect a calendar integration"""
    return await calendar_integration_service.connect_calendar_integration(provider, access_token, current_user.id, settings)

@api_router.post("/calendar/{integration_id}/sync")
async def sync_calendar_events_endpoint(
    integration_id: str,
    date_range_days: int = 30,
    current_user: User = Depends(get_current_user)
):
    """Sync calendar events for content planning"""
    return await calendar_integration_service.sync_calendar_events(integration_id, current_user.id, date_range_days)

@api_router.post("/calendar/events/create", response_model=ContentCalendarEvent)
async def create_content_event_endpoint(
    event_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a new content planning event"""
    return await calendar_integration_service.create_content_event(current_user.id, event_data)

@api_router.get("/calendar/events")
async def get_content_calendar_endpoint(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get content calendar events"""
    start_dt = datetime.fromisoformat(start_date) if start_date else None
    end_dt = datetime.fromisoformat(end_date) if end_date else None
    return await calendar_integration_service.get_content_calendar(current_user.id, start_dt, end_dt)

@api_router.put("/calendar/events/{event_id}/status")
async def update_event_status_endpoint(
    event_id: str,
    status: str,
    post_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Update content event status"""
    return await calendar_integration_service.update_event_status(event_id, current_user.id, status, post_id)

@api_router.get("/calendar/analytics")
async def get_calendar_analytics_endpoint(
    date_range: str = "30_days",
    current_user: User = Depends(get_current_user)
):
    """Get calendar and content planning analytics"""
    return await calendar_integration_service.get_calendar_analytics(current_user.id, date_range)

@api_router.get("/calendar/optimal-times")
async def get_optimal_times_endpoint(
    content_type: ContentType,
    platforms: List[SocialPlatform],
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered optimal posting time suggestions"""
    return await calendar_integration_service.suggest_optimal_times(current_user.id, content_type, platforms)

@api_router.get("/calendar/integrations")
async def get_calendar_integrations_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get all calendar integrations for a user"""
    return await calendar_integration_service.get_calendar_integrations(current_user.id)

# Social Media Automation Endpoints
@api_router.post("/automation/workflows/create", response_model=AutomationWorkflow)
async def create_automation_workflow_endpoint(
    workflow_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a new automation workflow"""
    return await social_automation_service.create_automation_workflow(current_user.id, workflow_data)

@api_router.get("/automation/workflows")
async def get_automation_workflows_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get all automation workflows for a user"""
    return await social_automation_service.get_automation_workflows(current_user.id)

@api_router.post("/automation/workflows/{workflow_id}/execute")
async def execute_workflow_endpoint(
    workflow_id: str,
    trigger_data: Dict[str, Any] = {},
    current_user: User = Depends(get_current_user)
):
    """Execute an automation workflow"""
    return await social_automation_service.execute_workflow(workflow_id, current_user.id, trigger_data)

@api_router.get("/automation/analytics")
async def get_automation_analytics_endpoint(
    date_range: str = "30_days",
    current_user: User = Depends(get_current_user)
):
    """Get automation analytics and performance insights"""
    return await social_automation_service.get_automation_analytics(current_user.id, date_range)

@api_router.get("/social/dashboard", response_model=SocialMediaDashboard)
async def get_social_media_dashboard_endpoint(
    date_range: str = "30_days",
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive social media automation dashboard"""
    return await social_automation_service.get_social_media_dashboard(current_user.id, date_range)

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