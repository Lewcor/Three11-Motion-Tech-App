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
    UNLIMITED = "unlimited"  # New tier for team members

class AuthProvider(str, Enum):
    EMAIL = "email"
    GOOGLE = "google"

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
    PERPLEXITY = "perplexity"  # Will be added when key is ready

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
    # PHASE 3: New Content Types
    VIDEO_CAPTIONS = "video_captions"
    VIDEO_SUBTITLES = "video_subtitles"
    PODCAST_DESCRIPTION = "podcast_description"
    PODCAST_SHOW_NOTES = "podcast_show_notes"
    EMAIL_MARKETING = "email_marketing"
    EMAIL_NEWSLETTER = "email_newsletter"
    EMAIL_SEQUENCE = "email_sequence"
    BLOG_POST = "blog_post"
    SEO_ARTICLE = "seo_article"
    PRODUCT_DESCRIPTION = "product_description"
    ECOMMERCE_COPY = "ecommerce_copy"

class ContentTemplateType(str, Enum):
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
    auth_provider: AuthProvider = AuthProvider.EMAIL
    google_id: Optional[str] = None
    password_hash: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    daily_generations_used: int = 0
    total_generations: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    subscription_expires_at: Optional[datetime] = None
    preferred_categories: List[ContentCategory] = []
    preferred_platforms: List[Platform] = []
    # Team access
    team_code_used: Optional[str] = None
    invited_by: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: Optional[str] = None
    auth_provider: AuthProvider = AuthProvider.EMAIL
    google_id: Optional[str] = None
    team_code: Optional[str] = None

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

# PHASE 2: Power User Features Models

# Batch Content Generation Models
class BatchGenerationRequest(BaseModel):
    user_id: str
    category: ContentCategory
    platform: Platform
    content_descriptions: List[str]  # Multiple content descriptions
    ai_providers: List[AIProvider] = [AIProvider.OPENAI, AIProvider.ANTHROPIC, AIProvider.GEMINI]
    template_id: Optional[str] = None
    batch_name: Optional[str] = None

class BatchGenerationResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    batch_name: Optional[str] = None
    category: ContentCategory
    platform: Platform
    total_items: int
    completed_items: int = 0
    failed_items: int = 0
    status: str = "pending"  # pending, processing, completed, failed
    results: List[GenerationResult] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    estimated_completion: Optional[datetime] = None

# Content Scheduling Models
class ScheduledContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    generation_result_id: str
    platform: Platform
    scheduled_time: datetime
    status: str = "scheduled"  # scheduled, posted, failed, cancelled
    post_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    posted_at: Optional[datetime] = None
    auto_post: bool = False
    notes: Optional[str] = None

class ContentCalendar(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    description: Optional[str] = None
    scheduled_posts: List[ScheduledContent] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Content Templates Models
class ContentTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: ContentCategory
    platform: Platform
    template_type: str  # "caption", "hooks", "cta", "story_arc"
    template_content: str  # The actual template with placeholders
    placeholders: List[str] = []  # List of placeholder names like {product_name}, {benefit}
    example_output: str
    usage_count: int = 0
    is_premium: bool = False
    created_by: str = "system"  # "system" or user_id
    created_at: datetime = Field(default_factory=datetime.utcnow)
    tags: List[str] = []

class TemplateLibrary(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    templates: List[ContentTemplate] = []
    is_shared: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Advanced Analytics Models
class ContentPerformance(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    generation_result_id: str
    platform: Platform
    post_url: Optional[str] = None
    views: int = 0
    likes: int = 0
    comments: int = 0
    shares: int = 0
    engagement_rate: float = 0.0
    reach: int = 0
    impressions: int = 0
    click_through_rate: float = 0.0
    conversion_rate: float = 0.0
    revenue_generated: float = 0.0
    posted_at: datetime
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class AnalyticsDashboard(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date_range_start: datetime
    date_range_end: datetime
    total_posts: int
    total_views: int
    total_engagement: int
    avg_engagement_rate: float
    best_performing_category: ContentCategory
    best_performing_platform: Platform
    growth_metrics: Dict[str, float]  # week_over_week, month_over_month
    ai_provider_performance: Dict[str, Dict[str, float]]  # provider -> metrics
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class CompetitorBenchmark(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    competitor_name: str
    platform: Platform
    category: ContentCategory
    competitor_avg_engagement: float
    user_avg_engagement: float
    benchmark_score: float  # user performance vs competitor
    insights: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# PHASE 3: Content Type Expansion Models

# Video Captions & Subtitles Models
class VideoContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    video_title: str
    video_description: Optional[str] = None
    video_duration: int  # in seconds
    video_url: Optional[str] = None
    platform: Platform
    category: ContentCategory
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VideoCaptionRequest(BaseModel):
    user_id: str
    video_title: str
    video_description: str
    video_duration: int  # in seconds
    platform: Platform
    category: ContentCategory
    caption_style: str = "engaging"  # engaging, informative, storytelling, promotional
    include_timestamps: bool = True
    language: str = "en"
    ai_providers: List[AIProvider] = [AIProvider.OPENAI, AIProvider.ANTHROPIC]

class VideoCaptionResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    video_content_id: str
    captions: List[Dict[str, Any]]  # [{"timestamp": "00:00", "text": "caption", "provider": "openai"}]
    subtitle_file: Optional[str] = None  # SRT format
    language: str
    style: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Podcast Models
class PodcastContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    podcast_title: str
    episode_number: Optional[int] = None
    duration: int  # in minutes
    topics: List[str]
    guests: List[str] = []
    key_points: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PodcastContentRequest(BaseModel):
    user_id: str
    podcast_title: str
    episode_number: Optional[int] = None
    duration: int  # in minutes
    topics: List[str]
    guests: List[str] = []
    key_points: List[str] = []
    content_type: ContentType  # PODCAST_DESCRIPTION or PODCAST_SHOW_NOTES
    tone: str = "professional"  # professional, casual, educational, entertaining
    include_timestamps: bool = True
    ai_providers: List[AIProvider] = [AIProvider.ANTHROPIC, AIProvider.OPENAI]

class PodcastContentResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    podcast_content_id: str
    content_type: ContentType
    description: Optional[str] = None
    show_notes: Optional[str] = None
    chapters: List[Dict[str, Any]] = []  # [{"timestamp": "12:30", "title": "Topic", "summary": "..."}]
    key_quotes: List[str] = []
    resources_mentioned: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Email Marketing Models
class EmailCampaign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    campaign_name: str
    campaign_type: ContentType  # EMAIL_MARKETING, EMAIL_NEWSLETTER, EMAIL_SEQUENCE
    target_audience: str
    campaign_goal: str  # conversion, engagement, information, promotion
    brand_voice: str = "professional"  # professional, friendly, casual, authoritative
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EmailContentRequest(BaseModel):
    user_id: str
    campaign_name: str
    email_type: ContentType  # EMAIL_MARKETING, EMAIL_NEWSLETTER, EMAIL_SEQUENCE
    subject_line_ideas: int = 5
    target_audience: str
    campaign_goal: str  # conversion, engagement, information, promotion
    key_message: str
    call_to_action: str
    brand_voice: str = "professional"
    include_personalization: bool = True
    email_length: str = "medium"  # short, medium, long
    ai_providers: List[AIProvider] = [AIProvider.ANTHROPIC, AIProvider.OPENAI]

class EmailContentResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    campaign_id: str
    email_type: ContentType
    subject_lines: List[str]
    email_content: str
    preview_text: str
    personalization_tags: List[str] = []
    a_b_variations: List[Dict[str, str]] = []  # [{"version": "A", "subject": "...", "content": "..."}]
    estimated_read_time: int  # in minutes
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Blog Post & SEO Models
class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    target_keywords: List[str]
    word_count_target: int = 1500
    audience: str
    purpose: str  # inform, persuade, entertain, educate
    tone: str = "professional"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPostRequest(BaseModel):
    user_id: str
    topic: str
    target_keywords: List[str]
    word_count_target: int = 1500
    audience: str
    purpose: str = "inform"  # inform, persuade, entertain, educate
    tone: str = "professional"  # professional, casual, authoritative, conversational
    include_outline: bool = True
    include_meta_description: bool = True
    include_social_snippets: bool = True
    seo_focus: bool = True
    ai_providers: List[AIProvider] = [AIProvider.ANTHROPIC, AIProvider.OPENAI]

class BlogPostResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    blog_post_id: str
    title: str
    meta_description: str
    outline: List[Dict[str, str]]  # [{"section": "Introduction", "points": ["point1", "point2"]}]
    content: str
    word_count: int
    readability_score: Optional[float] = None
    seo_score: Optional[float] = None
    social_snippets: Dict[str, str] = {}  # {"twitter": "...", "linkedin": "...", "facebook": "..."}
    suggested_images: List[str] = []
    internal_link_suggestions: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Product Description & E-commerce Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_name: str
    category: str
    price: Optional[float] = None
    key_features: List[str]
    target_audience: str
    brand_style: str = "modern"  # modern, classic, playful, luxury, minimalist
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductDescriptionRequest(BaseModel):
    user_id: str
    product_name: str
    category: str
    price: Optional[float] = None
    key_features: List[str]
    benefits: List[str]
    target_audience: str
    brand_style: str = "modern"
    description_length: str = "medium"  # short, medium, long
    include_bullet_points: bool = True
    include_specifications: bool = True
    include_usage_instructions: bool = False
    persuasion_style: str = "benefits_focused"  # benefits_focused, feature_focused, story_driven
    ai_providers: List[AIProvider] = [AIProvider.ANTHROPIC, AIProvider.OPENAI]

class ProductDescriptionResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    title: str
    short_description: str  # For product listings
    long_description: str  # For product pages
    bullet_points: List[str]
    specifications: Dict[str, str] = {}
    usage_instructions: Optional[str] = None
    seo_keywords: List[str] = []
    marketing_angles: List[str] = []  # Different ways to position the product
    cross_sell_suggestions: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Content Creation Models
class ContentIdeaRequest(BaseModel):
    user_id: str
    category: ContentCategory
    platform: Platform
    content_type: ContentType
    template: Optional[ContentTemplateType] = None
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
    style: ContentTemplateType = ContentTemplateType.EDUCATIONAL

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
    password: Optional[str] = None
    access_code: Optional[str] = None

class GoogleLoginRequest(BaseModel):
    google_token: str
    
class TeamSignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str
    team_code: str

class SignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str
    team_code: Optional[str] = None

class TeamCode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    created_by: str  # Admin user ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    max_uses: Optional[int] = None
    current_uses: int = 0
    is_active: bool = True
    tier_granted: Optional[UserTier] = UserTier.FREE
    description: Optional[str] = None

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

# =====================================
# PHASE 4: INTELLIGENCE & INSIGHTS MODELS
# =====================================

# Performance Tracking Models
class ContentPerformanceMetrics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    content_id: str  # References generated content
    platform: Platform
    category: ContentCategory
    # Engagement Metrics
    views: Optional[int] = None
    likes: Optional[int] = None
    shares: Optional[int] = None
    comments: Optional[int] = None
    saves: Optional[int] = None
    clicks: Optional[int] = None
    # Advanced Metrics
    reach: Optional[int] = None
    impressions: Optional[int] = None
    engagement_rate: Optional[float] = None
    conversion_rate: Optional[float] = None
    ctr: Optional[float] = None  # Click-through rate
    # Time-based Metrics
    watch_time: Optional[int] = None  # For video content
    completion_rate: Optional[float] = None
    # Meta Data
    posted_at: Optional[datetime] = None
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    data_source: str = "manual"  # manual, api, simulation
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PerformanceTrackingRequest(BaseModel):
    user_id: str
    platform: Optional[Platform] = None
    category: Optional[ContentCategory] = None
    date_range: str = "7_days"  # 7_days, 30_days, 90_days, 1_year
    metrics: List[str] = ["engagement_rate", "views", "likes", "shares"]

class PerformanceAnalysisResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    analysis_period: str
    total_content_pieces: int
    avg_engagement_rate: float
    best_performing_content: List[Dict[str, Any]]
    worst_performing_content: List[Dict[str, Any]]
    platform_performance: Dict[str, Dict[str, float]]
    category_performance: Dict[str, Dict[str, float]]
    growth_insights: List[str]
    optimization_recommendations: List[str]
    predicted_trends: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Engagement Prediction Models
class EngagementPredictionRequest(BaseModel):
    user_id: str
    content_type: ContentType
    category: ContentCategory
    platform: Platform
    content_preview: str  # Caption/title preview
    post_time: Optional[datetime] = None
    hashtags: List[str] = []
    has_visual: bool = True
    content_length: Optional[int] = None
    ai_providers: List[AIProvider] = [AIProvider.ANTHROPIC, AIProvider.OPENAI]

class EngagementPrediction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    content_preview: str
    platform: Platform
    category: ContentCategory
    # Predictions
    predicted_likes: int
    predicted_shares: int
    predicted_comments: int
    predicted_reach: int
    predicted_engagement_rate: float
    confidence_score: float  # 0-1
    # Factors
    positive_factors: List[str]
    negative_factors: List[str]
    optimization_suggestions: List[str]
    best_posting_time: Optional[datetime] = None
    # AI Analysis
    ai_sentiment_score: float  # -1 to 1
    trend_alignment_score: float  # 0-1
    audience_match_score: float  # 0-1
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PredictionAccuracyTracker(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prediction_id: str
    actual_metrics: Dict[str, int]  # actual performance data
    accuracy_scores: Dict[str, float]  # accuracy for each predicted metric
    overall_accuracy: float
    model_version: str = "v1.0"
    created_at: datetime = Field(default_factory=datetime.utcnow)

# A/B Testing Models
class ABTestExperiment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    test_name: str
    test_type: str  # caption_ab, hashtag_ab, visual_ab, posting_time_ab
    category: ContentCategory
    platform: Platform
    # Test Configuration
    variant_a: Dict[str, Any]  # {"caption": "...", "hashtags": [...]}
    variant_b: Dict[str, Any]
    success_metric: str = "engagement_rate"  # engagement_rate, reach, conversions
    sample_size_target: int = 100
    confidence_level: float = 0.95
    test_duration_days: int = 7
    # Test Status
    status: str = "draft"  # draft, running, completed, paused
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    # Results
    variant_a_performance: Dict[str, float] = {}
    variant_b_performance: Dict[str, float] = {}
    winner: Optional[str] = None  # "a", "b", or "no_difference"
    statistical_significance: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ABTestRequest(BaseModel):
    user_id: str
    test_name: str
    test_type: str
    category: ContentCategory
    platform: Platform
    variant_a: Dict[str, Any]
    variant_b: Dict[str, Any]
    success_metric: str = "engagement_rate"
    test_duration_days: int = 7

class ABTestResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    experiment_id: str
    winner: str  # "a", "b", or "tie"
    improvement_percentage: float
    confidence_level: float
    sample_size: int
    detailed_results: Dict[str, Any]
    recommendations: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Enhanced Competitor Monitoring Models
class CompetitorMonitoringAlert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    competitor_id: str
    alert_type: str  # new_content, viral_content, strategy_change, trend_adoption
    content_data: Dict[str, Any]
    performance_metrics: Dict[str, float]
    alert_priority: str = "medium"  # low, medium, high, critical
    action_recommendations: List[str]
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CompetitorInsightUpdate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str
    user_id: str
    insight_type: str  # content_pattern, engagement_trend, strategy_shift
    previous_data: Dict[str, Any]
    current_data: Dict[str, Any]
    change_percentage: float
    impact_assessment: str  # low, medium, high
    strategic_implications: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CompetitorBenchmark(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    category: ContentCategory
    platform: Platform
    # Benchmark Metrics
    industry_avg_engagement: float
    top_performer_engagement: float
    user_current_performance: float
    performance_percentile: float  # Where user ranks (0-100)
    # Gap Analysis
    gap_to_average: float
    gap_to_top_performer: float
    improvement_potential: float
    # Recommendations
    quick_wins: List[str]
    long_term_strategies: List[str]
    competitor_tactics_to_adopt: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Advanced Trend Forecasting Models
class TrendForecast(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    category: ContentCategory
    platform: Platform
    # Trend Data
    trend_topic: str
    current_popularity_score: float  # 0-100
    predicted_peak_date: datetime
    predicted_decline_date: datetime
    trend_duration_estimate: int  # days
    confidence_score: float  # 0-1
    # Analysis
    driving_factors: List[str]
    related_trends: List[str]
    target_demographics: List[str]
    content_opportunities: List[str]
    recommended_action: str  # "act_now", "wait_and_see", "prepare_for_peak"
    # Historical Context
    similar_past_trends: List[str]
    historical_performance_data: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TrendForecastRequest(BaseModel):
    user_id: str
    categories: List[ContentCategory] = []
    platforms: List[Platform] = []
    forecast_horizon_days: int = 30
    include_emerging_trends: bool = True
    include_declining_trends: bool = False
    min_confidence_threshold: float = 0.7

class TrendOpportunityAlert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    trend_id: str
    alert_type: str  # "emerging", "peaking", "declining", "opportunity"
    urgency_level: str = "medium"  # low, medium, high, critical
    opportunity_window: int  # days remaining to capitalize
    potential_reach_increase: float  # estimated percentage
    content_suggestions: List[str]
    competitor_activity: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Intelligence Dashboard Models
class IntelligenceInsight(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    insight_type: str  # performance, prediction, trend, competitor, optimization
    title: str
    description: str
    impact_level: str = "medium"  # low, medium, high
    action_required: bool = False
    data_points: Dict[str, Any]
    recommendations: List[str]
    expires_at: Optional[datetime] = None
    is_dismissed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class IntelligenceDashboardData(BaseModel):
    user_id: str
    performance_summary: Dict[str, Any]
    recent_predictions: List[EngagementPrediction]
    active_ab_tests: List[ABTestExperiment]
    competitor_alerts: List[CompetitorMonitoringAlert]
    trend_opportunities: List[TrendOpportunityAlert]
    key_insights: List[IntelligenceInsight]
    overall_intelligence_score: float  # 0-100
    generated_at: datetime = Field(default_factory=datetime.utcnow)

# =====================================
# PHASE 5: TEAM COLLABORATION PLATFORM MODELS
# =====================================

# Team Management Models
class TeamPlanType(str, Enum):
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class TeamSettings(BaseModel):
    allow_external_sharing: bool = False
    require_approval_for_publishing: bool = True
    enable_brand_compliance: bool = True
    default_content_visibility: str = "team"  # team, public, private
    max_team_members: int = 10
    notification_preferences: Dict[str, bool] = {}
    integration_settings: Dict[str, Any] = {}

class Team(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    workspace_slug: str  # Unique workspace identifier
    owner_id: str
    plan_type: TeamPlanType = TeamPlanType.STARTER
    settings: TeamSettings = Field(default_factory=TeamSettings)
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    is_active: bool = True

class CreateTeamRequest(BaseModel):
    team_name: str
    description: Optional[str] = None
    owner_id: str
    plan_type: TeamPlanType = TeamPlanType.STARTER
    settings: Dict[str, Any] = {}

# Role and Permission Models
class TeamRole(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_id: str
    name: str
    description: Optional[str] = None
    permissions: List[str] = []
    color: str = "#4ECDC4"  # Hex color for role display
    is_default: bool = False  # Default role for new members
    is_system_role: bool = False  # Cannot be deleted
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

class CreateRoleRequest(BaseModel):
    team_id: str
    name: str
    description: Optional[str] = None
    permissions: List[str]
    color: str = "#4ECDC4"
    is_default: bool = False
    created_by: str

class UpdateRoleRequest(BaseModel):
    team_id: str
    name: Optional[str] = None
    description: Optional[str] = None
    permissions: Optional[List[str]] = None
    color: Optional[str] = None
    is_default: Optional[bool] = None
    updated_by: str

# =====================================
# PHASE 6: SOCIAL MEDIA AUTOMATION MODELS
# =====================================

# Social Platform Integration Models
class SocialPlatform(str, Enum):
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    TIKTOK = "tiktok"
    YOUTUBE = "youtube"
    PINTEREST = "pinterest"

class SocialAccountStatus(str, Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    EXPIRED = "expired"
    PENDING = "pending"

class SocialAccount(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    platform: SocialPlatform
    account_id: str  # Platform-specific account ID
    account_name: str
    username: str
    access_token: str
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    status: SocialAccountStatus = SocialAccountStatus.CONNECTED
    followers_count: Optional[int] = None
    profile_picture_url: Optional[str] = None
    account_type: str = "personal"  # personal, business, creator
    permissions: List[str] = []  # Platform-specific permissions
    connected_at: datetime = Field(default_factory=datetime.utcnow)
    last_sync: Optional[datetime] = None
    metadata: Dict[str, Any] = {}

# Social Media Posting Models
class PostStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHING = "publishing"
    PUBLISHED = "published"
    FAILED = "failed"
    DELETED = "deleted"

class PostType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    CAROUSEL = "carousel"
    STORY = "story"
    REEL = "reel"
    THREAD = "thread"

class MediaAsset(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    type: str  # image, video, gif
    size: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[int] = None  # For videos
    thumbnail_url: Optional[str] = None
    alt_text: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class SocialMediaPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    team_id: Optional[str] = None
    title: str
    content: str
    platforms: List[SocialPlatform]
    post_type: PostType = PostType.TEXT
    media_assets: List[MediaAsset] = []
    hashtags: List[str] = []
    mentions: List[str] = []
    location: Optional[str] = None
    # Scheduling
    scheduled_time: Optional[datetime] = None
    publish_immediately: bool = False
    status: PostStatus = PostStatus.DRAFT
    # Platform-specific content
    platform_content: Dict[str, Dict[str, Any]] = {}  # platform -> custom content
    # Publishing results
    published_posts: Dict[str, Dict[str, Any]] = {}  # platform -> post data
    failed_platforms: List[str] = []
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    created_by: str

class PublishingRequest(BaseModel):
    user_id: str
    post_id: str
    platforms: List[SocialPlatform]
    schedule_time: Optional[datetime] = None
    publish_immediately: bool = True

class PublishingResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    post_id: str
    platform: SocialPlatform
    platform_post_id: Optional[str] = None
    status: PostStatus
    error_message: Optional[str] = None
    post_url: Optional[str] = None
    metrics: Dict[str, Any] = {}
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Cross-Platform Publishing Models
class PublishingStrategy(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    description: Optional[str] = None
    platforms: List[SocialPlatform]
    content_adaptations: Dict[str, Dict[str, Any]] = {}  # platform -> adaptations
    timing_strategy: Dict[str, Any] = {}  # Optimal posting times per platform
    hashtag_strategy: Dict[str, List[str]] = {}  # Platform-specific hashtags
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CrossPlatformCampaign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    description: Optional[str] = None
    base_content: str
    base_media: List[MediaAsset] = []
    target_platforms: List[SocialPlatform]
    campaign_posts: List[str] = []  # Post IDs
    start_date: datetime
    end_date: Optional[datetime] = None
    status: str = "draft"  # draft, active, completed, paused
    performance_goals: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Social Media Analytics Models
class SocialAnalytics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    post_id: str
    platform: SocialPlatform
    platform_post_id: str
    # Engagement Metrics
    likes: int = 0
    comments: int = 0
    shares: int = 0
    saves: int = 0
    clicks: int = 0
    # Reach Metrics
    impressions: int = 0
    reach: int = 0
    # Video Metrics (if applicable)
    views: int = 0
    watch_time: int = 0  # seconds
    completion_rate: float = 0.0
    # Advanced Metrics
    engagement_rate: float = 0.0
    click_through_rate: float = 0.0
    conversion_rate: float = 0.0
    # Time-based
    collected_at: datetime = Field(default_factory=datetime.utcnow)
    period_start: datetime
    period_end: datetime

class SocialAccountAnalytics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    account_id: str
    platform: SocialPlatform
    # Follower Metrics
    followers_count: int = 0
    following_count: int = 0
    followers_growth: float = 0.0
    # Content Metrics
    posts_count: int = 0
    avg_engagement_rate: float = 0.0
    total_likes: int = 0
    total_comments: int = 0
    total_shares: int = 0
    total_impressions: int = 0
    # Time-based
    date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

# CRM Integration Models
class CRMPlatform(str, Enum):
    HUBSPOT = "hubspot"
    SALESFORCE = "salesforce"
    PIPEDRIVE = "pipedrive"
    ZOHO = "zoho"
    MONDAY = "monday"
    AIRTABLE = "airtable"

class CRMIntegration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    platform: CRMPlatform
    api_key: str
    base_url: Optional[str] = None
    organization_id: Optional[str] = None
    status: str = "active"  # active, inactive, error
    sync_frequency: str = "daily"  # real_time, hourly, daily, weekly
    last_sync: Optional[datetime] = None
    settings: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CRMContact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    crm_integration_id: str
    crm_contact_id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    # Social Media Data
    social_profiles: Dict[str, str] = {}  # platform -> username
    engagement_score: float = 0.0
    content_preferences: List[str] = []
    # CRM Data
    deal_stage: Optional[str] = None
    lead_score: Optional[int] = None
    tags: List[str] = []
    custom_fields: Dict[str, Any] = {}
    last_interaction: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

# Calendar Integration Models
class CalendarProvider(str, Enum):
    GOOGLE_CALENDAR = "google_calendar"
    OUTLOOK = "outlook"
    APPLE_CALENDAR = "apple_calendar"
    CALENDLY = "calendly"

class CalendarIntegration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    provider: CalendarProvider
    account_email: str
    access_token: str
    refresh_token: Optional[str] = None
    calendar_ids: List[str] = []  # Specific calendars to sync
    status: str = "active"
    last_sync: Optional[datetime] = None
    sync_settings: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContentCalendarEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    calendar_integration_id: str
    event_id: str  # Calendar provider event ID
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    # Content Planning
    content_type: Optional[ContentType] = None
    platforms: List[SocialPlatform] = []
    content_status: str = "planned"  # planned, in_progress, completed
    assigned_to: Optional[str] = None
    # Social Media Post Reference
    post_id: Optional[str] = None
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

# Automation Workflow Models
class AutomationTrigger(str, Enum):
    SCHEDULE = "schedule"
    ENGAGEMENT_THRESHOLD = "engagement_threshold"
    FOLLOWER_MILESTONE = "follower_milestone"
    HASHTAG_PERFORMANCE = "hashtag_performance"
    CONTENT_APPROVAL = "content_approval"
    CRM_UPDATE = "crm_update"

class AutomationAction(str, Enum):
    PUBLISH_POST = "publish_post"
    SEND_EMAIL = "send_email"
    UPDATE_CRM = "update_crm"
    CREATE_CALENDAR_EVENT = "create_calendar_event"
    GENERATE_REPORT = "generate_report"
    NOTIFY_TEAM = "notify_team"

class AutomationWorkflow(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    description: Optional[str] = None
    trigger: AutomationTrigger
    trigger_conditions: Dict[str, Any] = {}
    actions: List[Dict[str, Any]] = []  # action_type, parameters
    is_active: bool = True
    execution_count: int = 0
    last_executed: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Request/Response Models
class ConnectSocialAccountRequest(BaseModel):
    platform: SocialPlatform
    auth_code: str
    redirect_uri: str

class CreatePostRequest(BaseModel):
    title: str
    content: str
    platforms: List[SocialPlatform]
    post_type: PostType = PostType.TEXT
    media_urls: List[str] = []
    hashtags: List[str] = []
    scheduled_time: Optional[datetime] = None
    publish_immediately: bool = False
    platform_customizations: Dict[str, Dict[str, Any]] = {}

class SchedulePostsRequest(BaseModel):
    posts: List[str]  # Post IDs
    schedule_times: Dict[str, datetime]  # post_id -> schedule_time
    timezone: str = "UTC"

class SocialAnalyticsRequest(BaseModel):
    platforms: List[SocialPlatform] = []
    date_range: str = "30_days"  # 7_days, 30_days, 90_days, 1_year
    metrics: List[str] = ["engagement_rate", "reach", "impressions"]
    account_ids: List[str] = []

class CRMSyncRequest(BaseModel):
    crm_platform: CRMPlatform
    sync_type: str = "contacts"  # contacts, deals, activities
    filters: Dict[str, Any] = {}

class CalendarSyncRequest(BaseModel):
    calendar_provider: CalendarProvider
    calendar_ids: List[str] = []
    date_range_days: int = 30

# Analytics Response Models
class SocialPlatformMetrics(BaseModel):
    platform: SocialPlatform
    followers_count: int
    posts_published: int
    total_engagement: int
    avg_engagement_rate: float
    top_performing_post: Optional[Dict[str, Any]] = None

class SocialMediaDashboard(BaseModel):
    user_id: str
    date_range: str
    connected_accounts: List[SocialAccount]
    platform_metrics: List[SocialPlatformMetrics]
    scheduled_posts_count: int
    published_posts_count: int
    total_reach: int
    total_engagement: int
    growth_metrics: Dict[str, float]
    top_content: List[Dict[str, Any]]
    upcoming_posts: List[Dict[str, Any]]
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class RoleAnalytics(BaseModel):
    team_id: str
    total_roles: int
    custom_roles: int
    role_distribution: Dict[str, int]  # role_name -> member_count
    permission_usage: Dict[str, float]  # permission -> usage_percentage
    role_effectiveness: Dict[str, Dict[str, float]]  # role -> metrics
    recommendations: List[str]

# Team Member Models
class TeamMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_id: str
    user_id: str
    role_id: str
    status: str = "active"  # active, inactive, pending, removed
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    invited_by: Optional[str] = None
    last_active: Optional[datetime] = None
    role_updated_at: Optional[datetime] = None
    role_updated_by: Optional[str] = None
    removed_at: Optional[datetime] = None
    removed_by: Optional[str] = None

class UserDetails(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    last_active: Optional[datetime] = None

class RoleDetails(BaseModel):
    id: str
    name: str
    color: str

class TeamMemberWithUser(BaseModel):
    id: str
    team_id: str
    user_id: str
    role_id: str
    status: str
    joined_at: datetime
    user_details: UserDetails
    role_details: RoleDetails
    last_active: Optional[datetime] = None

class InviteTeamMemberRequest(BaseModel):
    team_id: str
    email: str
    role_id: str
    invited_by: str
    team_name: str
    message: Optional[str] = None

class UpdateMemberRoleRequest(BaseModel):
    team_id: str
    member_id: str
    new_role_id: str
    updated_by: str
    reason: Optional[str] = None

class TeamInvitation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_id: str
    email: str
    role_id: str
    invited_by: str
    invitation_token: str
    status: str = "pending"  # pending, accepted, expired, declined
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    accepted_at: Optional[datetime] = None
    declined_at: Optional[datetime] = None

# Team Activity Models
class TeamActivity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_id: str
    user_id: str
    action: str  # content_created, member_joined, role_assigned, etc.
    entity_type: str  # content, member, role, workflow, etc.
    entity_id: str
    details: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Team Dashboard Models
class TeamSummary(BaseModel):
    total_members: int
    active_members: int
    pending_invitations: int
    total_content_pieces: int
    content_in_review: int
    published_this_month: int

class TeamPerformance(BaseModel):
    avg_approval_time_hours: float
    content_approval_rate: float
    team_productivity_score: float
    collaboration_index: float

class WorkflowSummary(BaseModel):
    id: str
    name: str
    items_pending: int
    avg_completion_time: float

class TeamDashboardData(BaseModel):
    team_id: str
    team_summary: TeamSummary
    recent_activities: List[TeamActivity]
    team_performance: TeamPerformance
    active_workflows: List[WorkflowSummary]
    team_insights: List[str]

# Workflow Engine Models
class WorkflowStage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    order: int
    required_permissions: List[str] = []
    required_roles: List[str] = []
    auto_approve_conditions: List[str] = []
    escalation_rules: Dict[str, Any] = {}
    time_limit_hours: Optional[int] = None

class WorkflowTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_id: str
    name: str
    description: Optional[str] = None
    content_types: List[str] = []  # Which content types this applies to
    conditions: Dict[str, Any] = {}  # Conditional logic
    stages: List[WorkflowStage] = []
    is_active: bool = True
    is_default: bool = False
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class WorkflowInstance(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workflow_template_id: str
    team_id: str
    content_id: str
    current_stage_id: str
    status: str = "in_progress"  # in_progress, completed, rejected, cancelled
    started_by: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    stage_history: List[Dict[str, Any]] = []
    metadata: Dict[str, Any] = {}

class WorkflowAction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workflow_instance_id: str
    stage_id: str
    user_id: str
    action: str  # approve, reject, request_changes, delegate
    comment: Optional[str] = None
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CreateWorkflowRequest(BaseModel):
    team_id: str
    name: str
    description: Optional[str] = None
    content_types: List[str]
    stages: List[Dict[str, Any]]
    conditions: Dict[str, Any] = {}
    created_by: str

# Collaboration Models
class ContentComment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_id: str
    team_id: str
    user_id: str
    comment_text: str
    parent_comment_id: Optional[str] = None  # For reply threads
    mentions: List[str] = []  # User IDs mentioned in comment
    attachments: List[str] = []  # File URLs
    is_resolved: bool = False
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    reactions: Dict[str, List[str]] = {}  # emoji -> [user_ids]

class ContentReview(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_id: str
    team_id: str
    reviewer_id: str
    review_type: str = "general"  # general, brand_compliance, legal, technical
    status: str = "pending"  # pending, approved, rejected, changes_requested
    overall_rating: Optional[int] = None  # 1-5 stars
    feedback_areas: Dict[str, str] = {}  # area -> feedback
    action_items: List[str] = []
    decision_comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

class ContentVersion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_id: str
    version_number: int
    created_by: str
    changes_summary: Optional[str] = None
    content_data: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_current: bool = False

class CollaborationSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_id: str
    team_id: str
    participants: List[str] = []  # User IDs
    started_by: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    is_active: bool = True
    session_data: Dict[str, Any] = {}  # Real-time collaboration state

# Brand Management Models
class BrandAsset(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_id: str
    name: str
    asset_type: str  # logo, color_palette, font, template, image
    category: str  # primary, secondary, social, print, etc.
    file_url: Optional[str] = None
    file_metadata: Dict[str, Any] = {}  # size, format, dimensions, etc.
    usage_guidelines: Optional[str] = None
    tags: List[str] = []
    uploaded_by: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    is_active: bool = True

class BrandGuideline(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_id: str
    title: str
    category: str  # colors, typography, voice_tone, imagery, etc.
    content: str  # Guidelines content
    examples: List[Dict[str, Any]] = []  # Good/bad examples
    rules: List[str] = []  # Specific rules for compliance
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    is_active: bool = True

class BrandComplianceCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_id: str
    team_id: str
    checked_by: str  # user_id or "system" for auto-checks
    compliance_score: float  # 0-100
    violations: List[Dict[str, Any]] = []  # guideline violations
    suggestions: List[str] = []
    status: str = "compliant"  # compliant, minor_issues, major_issues
    checked_at: datetime = Field(default_factory=datetime.utcnow)
    auto_generated: bool = False

class BrandCenter(BaseModel):
    team_id: str
    brand_assets: List[BrandAsset]
    brand_guidelines: List[BrandGuideline]
    compliance_stats: Dict[str, Any]
    recent_activity: List[Dict[str, Any]]
    brand_health_score: float  # Overall brand consistency score

# Notification Models
class TeamNotification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_id: str
    recipient_id: str  # user_id
    notification_type: str  # mention, assignment, approval_needed, etc.
    title: str
    message: str
    entity_type: str  # content, comment, workflow, etc.
    entity_id: str
    action_url: Optional[str] = None
    priority: str = "normal"  # low, normal, high, urgent
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None
    metadata: Dict[str, Any] = {}

class NotificationPreferences(BaseModel):
    user_id: str
    team_id: str
    email_notifications: Dict[str, bool] = {}  # notification_type -> enabled
    push_notifications: Dict[str, bool] = {}
    in_app_notifications: Dict[str, bool] = {}
    notification_frequency: str = "immediate"  # immediate, daily, weekly
    quiet_hours_start: Optional[str] = None  # "22:00"
    quiet_hours_end: Optional[str] = None  # "08:00"

class NotificationBatch(BaseModel):
    recipient_id: str
    team_id: str
    batch_type: str  # daily_digest, weekly_summary
    notifications: List[TeamNotification]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    sent_at: Optional[datetime] = None

# Request/Response Models for API endpoints
class AddCommentRequest(BaseModel):
    content_id: str
    team_id: str
    comment_text: str
    parent_comment_id: Optional[str] = None
    mentions: List[str] = []

class CreateReviewRequest(BaseModel):
    content_id: str
    team_id: str
    review_type: str = "general"
    feedback_areas: Dict[str, str] = {}
    action_items: List[str] = []

class UpdateBrandAssetRequest(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    usage_guidelines: Optional[str] = None
    tags: Optional[List[str]] = None

class CreateBrandGuidelineRequest(BaseModel):
    team_id: str
    title: str
    category: str
    content: str
    examples: List[Dict[str, Any]] = []
    rules: List[str] = []
    created_by: str