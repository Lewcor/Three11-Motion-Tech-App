from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class UserTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"

class ContentCategory(str, Enum):
    FASHION = "fashion"
    FITNESS = "fitness"
    FOOD = "food"
    TRAVEL = "travel"
    BUSINESS = "business"
    GAMING = "gaming"
    MUSIC = "music"
    IDEAS = "ideas"
    EVENT_SPACE = "event_space"

class Platform(str, Enum):
    TIKTOK = "tiktok"
    INSTAGRAM = "instagram"
    YOUTUBE = "youtube"

class AIProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"

class ContentType(str, Enum):
    CAPTION = "caption"
    HASHTAGS = "hashtags"
    CONTENT_IDEA = "content_idea"
    VIDEO_SCRIPT = "video_script"
    BLOG_OUTLINE = "blog_outline"
    STORY_ARC = "story_arc"
    HOOK = "hook"
    CTA = "cta"
    TRENDING_TOPIC = "trending_topic"
    CONTENT_STRATEGY = "content_strategy"

class ContentTemplate(str, Enum):
    EDUCATIONAL = "educational"
    ENTERTAINING = "entertaining"
    PROMOTIONAL = "promotional"
    INSPIRATIONAL = "inspirational"
    TUTORIAL = "tutorial"
    BEHIND_SCENES = "behind_scenes"
    USER_GENERATED = "user_generated"
    SEASONAL = "seasonal"

class PostTiming(str, Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    EVENING = "evening"
    LATE_NIGHT = "late_night"
    WEEKEND = "weekend"
    WEEKDAY = "weekday"

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    tier: UserTier = UserTier.FREE
    daily_generations_used: int = 0
    total_generations: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    subscription_expires_at: Optional[datetime] = None
    preferred_categories: List[ContentCategory] = []
    preferred_platforms: List[Platform] = []

class UserCreate(BaseModel):
    email: EmailStr
    name: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    preferred_categories: Optional[List[ContentCategory]] = None
    preferred_platforms: Optional[List[Platform]] = None

# Content Generation Models
class GenerationRequest(BaseModel):
    user_id: str
    category: ContentCategory
    platform: Platform
    content_description: str
    ai_providers: List[AIProvider] = [AIProvider.OPENAI, AIProvider.ANTHROPIC, AIProvider.GEMINI]

class AIResponse(BaseModel):
    provider: AIProvider
    caption: str
    generation_time: float
    success: bool
    error: Optional[str] = None

class GenerationResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    category: ContentCategory
    platform: Platform
    content_description: str
    ai_responses: List[AIResponse]
    hashtags: List[str]
    combined_result: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    performance_metrics: Optional[Dict[str, Any]] = None

class GenerationResultResponse(BaseModel):
    id: str
    category: ContentCategory
    platform: Platform
    content_description: str
    captions: Dict[str, str]  # provider -> caption
    hashtags: List[str]
    combined_result: str
    created_at: datetime

# Premium Pack Models
class PremiumPack(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: ContentCategory
    price: float
    features: List[str]
    templates: List[str]
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PremiumPackPurchase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    pack_id: str
    price_paid: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Analytics Models
class UsageAnalytics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    category: ContentCategory
    platform: Platform
    ai_provider: AIProvider
    generation_time: float
    success: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContentPerformance(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    generation_id: str
    platform: Platform
    likes: Optional[int] = None
    shares: Optional[int] = None
    comments: Optional[int] = None
    reach: Optional[int] = None
    engagement_rate: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Response Models
class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    tier: UserTier
    daily_generations_used: int
    total_generations: int
    subscription_expires_at: Optional[datetime]
    preferred_categories: List[ContentCategory]
    preferred_platforms: List[Platform]
    created_at: datetime

class DashboardStats(BaseModel):
    total_users: int
    total_generations: int
    daily_active_users: int
    premium_users: int
    popular_categories: List[Dict[str, Any]]
    popular_platforms: List[Dict[str, Any]]

# Authentication Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str

# Subscription Models
class SubscriptionPlan(BaseModel):
    id: str
    name: str
    price: float
    duration_days: int
    features: List[str]
    daily_generation_limit: Optional[int] = None  # None means unlimited

class SubscriptionCreate(BaseModel):
    user_id: str
    plan_id: str
    payment_method: str
    payment_id: str