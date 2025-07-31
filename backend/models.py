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