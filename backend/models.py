from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class UserTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

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
    FACEBOOK = "facebook"

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

# Content Creation Models
class ContentIdeaRequest(BaseModel):
    user_id: str
    category: ContentCategory
    platform: Platform
    content_type: ContentType
    template: Optional[ContentTemplate] = None
    quantity: int = 5
    audience_focus: Optional[str] = None

class ContentIdeaResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_type: ContentType
    ideas: List[str]
    trending_topics: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VideoScriptRequest(BaseModel):
    user_id: str
    category: ContentCategory
    platform: Platform
    topic: str
    duration: int = 60  # seconds
    style: ContentTemplate = ContentTemplate.EDUCATIONAL

class VideoScriptResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hook: str
    main_content: str
    call_to_action: str
    timestamps: List[Dict[str, Any]]
    estimated_duration: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContentStrategyRequest(BaseModel):
    user_id: str
    category: ContentCategory
    platform: Platform
    audience_size: Optional[int] = None
    posting_frequency: int = 7  # posts per week
    goals: List[str] = []

class ContentStrategyResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    weekly_plan: List[Dict[str, Any]]
    best_posting_times: List[PostTiming]
    content_mix: Dict[str, float]  # percentage of each content type
    trending_opportunities: List[str]
    growth_recommendations: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContentCalendar(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: datetime
    content_type: ContentType
    category: ContentCategory
    platform: Platform
    title: str
    description: str
    status: str = "planned"  # planned, created, published
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TrendingTopic(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: ContentCategory
    platform: Platform
    topic: str
    engagement_score: float
    relevance_score: float
    expiry_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContentTemplateModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: ContentCategory
    template_type: ContentTemplate
    template_content: str
    variables: List[str]
    is_premium: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BrandVoice(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    tone: str  # professional, casual, funny, inspiring
    style: str  # formal, conversational, energetic
    keywords: List[str]
    avoid_words: List[str]
    sample_content: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

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

# Competitor Analysis Models
class CompetitorProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    original_query: str
    platforms: Dict[str, Any] = {}
    analysis_data: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    created_by: str

class CompetitorAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    analysis_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str
    user_id: str
    analysis_type: str  # content_strategy, gap_analysis, performance_analysis
    insights: Dict[str, Any]
    recommendations: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AnalysisInsight(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str
    insight_type: str  # strength, weakness, opportunity, threat
    description: str
    impact_score: float  # 0-10
    actionable_recommendation: str
    evidence: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CompetitiveContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    generation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str
    user_id: str
    content_type: str
    generated_content: Dict[str, Any]
    competitive_advantages: List[str] = []
    expected_performance: Dict[str, float] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)