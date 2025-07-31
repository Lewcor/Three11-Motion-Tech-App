from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid
import secrets
from models import *
from ai_service import AIService
import asyncio
import json

router = APIRouter()

class SocialMediaPublishingService:
    def __init__(self):
        self.ai_service = AIService()
        
        # Mock social platform API clients
        self.platform_clients = {
            SocialPlatform.FACEBOOK: self._mock_facebook_client,
            SocialPlatform.INSTAGRAM: self._mock_instagram_client,
            SocialPlatform.TWITTER: self._mock_twitter_client,
            SocialPlatform.LINKEDIN: self._mock_linkedin_client,
            SocialPlatform.TIKTOK: self._mock_tiktok_client,
            SocialPlatform.YOUTUBE: self._mock_youtube_client,
            SocialPlatform.PINTEREST: self._mock_pinterest_client
        }
    
    async def connect_social_account(self, request: ConnectSocialAccountRequest, user_id: str) -> SocialAccount:
        """Connect a social media account"""
        try:
            # In real app, this would use OAuth flow with actual platform APIs
            account_data = await self._mock_oauth_exchange(request.platform, request.auth_code)
            
            account = SocialAccount(
                id=str(uuid.uuid4()),
                user_id=user_id,
                platform=request.platform,
                account_id=account_data["account_id"],
                account_name=account_data["account_name"],
                username=account_data["username"],
                access_token=account_data["access_token"],
                refresh_token=account_data.get("refresh_token"),
                token_expires_at=account_data.get("expires_at"),
                status=SocialAccountStatus.CONNECTED,
                followers_count=account_data.get("followers_count", 0),
                profile_picture_url=account_data.get("profile_picture"),
                account_type=account_data.get("account_type", "personal"),
                permissions=account_data.get("permissions", [])
            )
            
            # In real app, save to database
            # await database.social_accounts.insert_one(account.dict())
            
            return account
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error connecting social account: {str(e)}")
    
    async def create_social_post(self, request: CreatePostRequest, user_id: str) -> SocialMediaPost:
        """Create a new social media post"""
        try:
            # Process media assets
            media_assets = []
            for media_url in request.media_urls:
                asset = MediaAsset(
                    id=str(uuid.uuid4()),
                    url=media_url,
                    type=self._detect_media_type(media_url),
                    uploaded_at=datetime.utcnow()
                )
                media_assets.append(asset)
            
            # Create the post
            post = SocialMediaPost(
                id=str(uuid.uuid4()),
                user_id=user_id,
                title=request.title,
                content=request.content,
                platforms=request.platforms,
                post_type=request.post_type,
                media_assets=media_assets,
                hashtags=request.hashtags,
                scheduled_time=request.scheduled_time,
                publish_immediately=request.publish_immediately,
                platform_content=request.platform_customizations,
                created_by=user_id
            )
            
            # Auto-optimize content for each platform
            await self._optimize_for_platforms(post)
            
            # If publish immediately, start publishing process
            if post.publish_immediately:
                publishing_results = await self.publish_post(post.id, user_id)
                post.status = PostStatus.PUBLISHING
            elif post.scheduled_time:
                post.status = PostStatus.SCHEDULED
            else:
                post.status = PostStatus.DRAFT
            
            # In real app, save to database
            # await database.social_posts.insert_one(post.dict())
            
            return post
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating social post: {str(e)}")
    
    async def publish_post(self, post_id: str, user_id: str) -> List[PublishingResult]:
        """Publish a post to selected platforms"""
        try:
            # In real app, get post from database
            post = await self._get_mock_post(post_id, user_id)
            
            if not post:
                raise HTTPException(status_code=404, detail="Post not found")
            
            # Get connected accounts for platforms
            connected_accounts = await self._get_connected_accounts(user_id, post.platforms)
            
            publishing_results = []
            
            # Publish to each platform
            for platform in post.platforms:
                account = connected_accounts.get(platform)
                if not account:
                    # Create failed result
                    result = PublishingResult(
                        post_id=post_id,
                        platform=platform,
                        status=PostStatus.FAILED,
                        error_message=f"No connected {platform.value} account found"
                    )
                    publishing_results.append(result)
                    continue
                
                try:
                    # Get platform-specific content
                    platform_content = post.platform_content.get(platform.value, {})
                    content = platform_content.get("content", post.content)
                    hashtags = platform_content.get("hashtags", post.hashtags)
                    
                    # Publish to platform
                    platform_result = await self._publish_to_platform(
                        platform, account, content, hashtags, post.media_assets
                    )
                    
                    result = PublishingResult(
                        post_id=post_id,
                        platform=platform,
                        platform_post_id=platform_result["post_id"],
                        status=PostStatus.PUBLISHED,
                        post_url=platform_result["post_url"],
                        published_at=datetime.utcnow()
                    )
                    
                except Exception as platform_error:
                    result = PublishingResult(
                        post_id=post_id,
                        platform=platform,
                        status=PostStatus.FAILED,
                        error_message=str(platform_error)
                    )
                
                publishing_results.append(result)
            
            # Update post status
            successful_publishes = [r for r in publishing_results if r.status == PostStatus.PUBLISHED]
            if successful_publishes:
                post.status = PostStatus.PUBLISHED if len(successful_publishes) == len(post.platforms) else PostStatus.PUBLISHING
                post.published_at = datetime.utcnow()
            
            # In real app, save results to database
            # await database.publishing_results.insert_many([r.dict() for r in publishing_results])
            
            return publishing_results
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error publishing post: {str(e)}")
    
    async def schedule_posts(self, request: SchedulePostsRequest, user_id: str) -> Dict[str, Any]:
        """Schedule multiple posts for future publishing"""
        try:
            scheduled_posts = []
            
            for post_id, schedule_time in request.schedule_times.items():
                # Get post
                post = await self._get_mock_post(post_id, user_id)
                if not post:
                    continue
                
                # Update schedule time and status
                post.scheduled_time = schedule_time
                post.status = PostStatus.SCHEDULED
                
                # In real app, add to scheduling queue
                # await scheduling_service.schedule_post(post_id, schedule_time)
                
                scheduled_posts.append({
                    "post_id": post_id,
                    "scheduled_time": schedule_time.isoformat(),
                    "platforms": [p.value for p in post.platforms]
                })
            
            return {
                "success": True,
                "scheduled_posts": scheduled_posts,
                "total_scheduled": len(scheduled_posts)
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error scheduling posts: {str(e)}")
    
    async def get_connected_accounts(self, user_id: str) -> List[SocialAccount]:
        """Get all connected social media accounts for a user"""
        try:
            # Mock connected accounts
            accounts = [
                SocialAccount(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    platform=SocialPlatform.INSTAGRAM,
                    account_id="ig_12345",
                    account_name="Fashion Creator",
                    username="@fashioncreator",
                    access_token="mock_ig_token",
                    status=SocialAccountStatus.CONNECTED,
                    followers_count=15420,
                    account_type="business",
                    permissions=["publish_content", "read_insights"]
                ),
                SocialAccount(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    platform=SocialPlatform.FACEBOOK,
                    account_id="fb_67890",
                    account_name="Fashion Brand Page",
                    username="fashionbrand",
                    access_token="mock_fb_token",
                    status=SocialAccountStatus.CONNECTED,
                    followers_count=8750,
                    account_type="business",
                    permissions=["manage_pages", "publish_content"]
                ),
                SocialAccount(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    platform=SocialPlatform.TWITTER,
                    account_id="tw_54321",
                    account_name="Fashion Trends",
                    username="@fashiontrends",
                    access_token="mock_tw_token",
                    status=SocialAccountStatus.CONNECTED,
                    followers_count=12300,
                    account_type="personal",
                    permissions=["read", "write"]
                ),
                SocialAccount(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    platform=SocialPlatform.LINKEDIN,
                    account_id="li_98765",
                    account_name="Professional Profile",
                    username="fashion-expert",
                    access_token="mock_li_token",
                    status=SocialAccountStatus.CONNECTED,
                    followers_count=3450,
                    account_type="personal",
                    permissions=["w_member_social"]
                )
            ]
            
            return accounts
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting connected accounts: {str(e)}")
    
    async def get_user_posts(self, user_id: str, status: Optional[PostStatus] = None, limit: int = 50) -> List[SocialMediaPost]:
        """Get user's social media posts"""
        try:
            # Mock posts data
            posts = [
                SocialMediaPost(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    title="Fall Fashion Trends 2024",
                    content="🍂 Fall is here and these are the trends taking over! From cozy cardigans to statement boots, here's what you need in your wardrobe this season. #FallFashion #Trends2024 #OOTD",
                    platforms=[SocialPlatform.INSTAGRAM, SocialPlatform.FACEBOOK],
                    post_type=PostType.IMAGE,
                    hashtags=["#FallFashion", "#Trends2024", "#OOTD", "#StyleInspo"],
                    status=PostStatus.PUBLISHED,
                    created_by=user_id,
                    published_at=datetime.utcnow() - timedelta(hours=2)
                ),
                SocialMediaPost(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    title="Behind the Scenes - Photoshoot",
                    content="Take a peek behind the scenes of our latest photoshoot! The creative process is just as beautiful as the final result ✨",
                    platforms=[SocialPlatform.INSTAGRAM, SocialPlatform.TWITTER],
                    post_type=PostType.VIDEO,
                    hashtags=["#BehindTheScenes", "#Photoshoot", "#Creative"],
                    status=PostStatus.SCHEDULED,
                    scheduled_time=datetime.utcnow() + timedelta(hours=4),
                    created_by=user_id
                ),
                SocialMediaPost(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    title="Weekend Style Guide",
                    content="Weekend vibes call for comfortable yet chic outfits. Here are 5 easy looks that transition from brunch to shopping effortlessly!",
                    platforms=[SocialPlatform.FACEBOOK, SocialPlatform.LINKEDIN],
                    post_type=PostType.CAROUSEL,
                    hashtags=["#WeekendStyle", "#ChicAndComfy", "#StyleGuide"],
                    status=PostStatus.DRAFT,
                    created_by=user_id
                )
            ]
            
            # Filter by status if provided
            if status:
                posts = [p for p in posts if p.status == status]
            
            return posts[:limit]
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting user posts: {str(e)}")
    
    async def get_publishing_analytics(self, user_id: str, date_range: str = "30_days") -> Dict[str, Any]:
        """Get publishing analytics and insights"""
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            if date_range == "7_days":
                start_date = end_date - timedelta(days=7)
            elif date_range == "30_days":
                start_date = end_date - timedelta(days=30)
            elif date_range == "90_days":
                start_date = end_date - timedelta(days=90)
            else:
                start_date = end_date - timedelta(days=365)
            
            # Mock analytics data
            analytics = {
                "date_range": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat(),
                    "period": date_range
                },
                "publishing_stats": {
                    "total_posts": 45,
                    "published_posts": 38,
                    "scheduled_posts": 5,
                    "draft_posts": 2,
                    "failed_posts": 0
                },
                "platform_breakdown": {
                    "instagram": {"posts": 18, "avg_engagement": 4.2},
                    "facebook": {"posts": 12, "avg_engagement": 2.8},
                    "twitter": {"posts": 8, "avg_engagement": 1.9},
                    "linkedin": {"posts": 7, "avg_engagement": 3.5}
                },
                "content_performance": {
                    "top_performing_post": {
                        "title": "Fall Fashion Trends 2024",
                        "engagement_rate": 8.5,
                        "platforms": ["instagram", "facebook"]
                    },
                    "avg_engagement_rate": 3.8,
                    "total_reach": 125000,
                    "total_impressions": 450000
                },
                "optimal_posting_times": {
                    "instagram": ["18:00", "20:00", "12:00"],
                    "facebook": ["13:00", "15:00", "19:00"],
                    "twitter": ["09:00", "12:00", "17:00"],
                    "linkedin": ["08:00", "12:00", "17:00"]
                },
                "hashtag_performance": [
                    {"hashtag": "#FallFashion", "reach": 25000, "engagement": 1200},
                    {"hashtag": "#OOTD", "reach": 18000, "engagement": 950},
                    {"hashtag": "#StyleInspo", "reach": 15000, "engagement": 780}
                ]
            }
            
            return analytics
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting publishing analytics: {str(e)}")
    
    # Helper methods
    async def _optimize_for_platforms(self, post: SocialMediaPost):
        """Auto-optimize content for different platforms"""
        for platform in post.platforms:
            if platform not in post.platform_content:
                post.platform_content[platform.value] = {}
            
            # Platform-specific optimizations
            if platform == SocialPlatform.TWITTER:
                # Truncate content if too long
                if len(post.content) > 280:
                    optimized_content = post.content[:250] + "..."
                    post.platform_content[platform.value]["content"] = optimized_content
                
                # Optimize hashtags (max 2-3 for Twitter)
                if len(post.hashtags) > 3:
                    post.platform_content[platform.value]["hashtags"] = post.hashtags[:2]
            
            elif platform == SocialPlatform.LINKEDIN:
                # More professional tone
                if "professional" not in post.content.lower():
                    post.platform_content[platform.value]["content"] = post.content
                
                # LinkedIn-specific hashtags
                linkedin_hashtags = [tag for tag in post.hashtags if any(word in tag.lower() for word in ["professional", "career", "business", "industry"])]
                if linkedin_hashtags:
                    post.platform_content[platform.value]["hashtags"] = linkedin_hashtags
            
            elif platform == SocialPlatform.INSTAGRAM:
                # Optimize for visual content
                if post.post_type == PostType.IMAGE and len(post.hashtags) < 10:
                    # Add trending Instagram hashtags
                    ig_hashtags = post.hashtags + ["#InstaGood", "#PhotoOfTheDay"]
                    post.platform_content[platform.value]["hashtags"] = ig_hashtags[:30]  # Max 30 hashtags
    
    async def _publish_to_platform(self, platform, account, content, hashtags, media_assets):
        """Publish content to specific platform"""
        client = self.platform_clients.get(platform)
        if not client:
            raise Exception(f"No client available for {platform.value}")
        
        return await client(account, content, hashtags, media_assets)
    
    async def _mock_oauth_exchange(self, platform: SocialPlatform, auth_code: str):
        """Mock OAuth token exchange"""
        return {
            "account_id": f"{platform.value}_12345",
            "account_name": f"Mock {platform.value.title()} Account",
            "username": f"@mock_{platform.value}",
            "access_token": f"mock_token_{secrets.token_hex(16)}",
            "refresh_token": f"refresh_{secrets.token_hex(16)}",
            "expires_at": datetime.utcnow() + timedelta(days=60),
            "followers_count": 10000 + secrets.randbelow(50000),
            "profile_picture": f"https://example.com/profile_{platform.value}.jpg",
            "account_type": "business",
            "permissions": ["publish_content", "read_insights"]
        }
    
    async def _get_mock_post(self, post_id: str, user_id: str) -> SocialMediaPost:
        """Get mock post data"""
        return SocialMediaPost(
            id=post_id,
            user_id=user_id,
            title="Mock Post",
            content="This is a mock social media post",
            platforms=[SocialPlatform.INSTAGRAM, SocialPlatform.FACEBOOK],
            created_by=user_id
        )
    
    async def _get_connected_accounts(self, user_id: str, platforms: List[SocialPlatform]) -> Dict[SocialPlatform, SocialAccount]:
        """Get connected accounts for specific platforms"""
        all_accounts = await self.get_connected_accounts(user_id)
        return {acc.platform: acc for acc in all_accounts if acc.platform in platforms}
    
    def _detect_media_type(self, url: str) -> str:
        """Detect media type from URL"""
        if any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
            return "image"
        elif any(ext in url.lower() for ext in ['.mp4', '.mov', '.avi', '.webm']):
            return "video"
        return "unknown"
    
    # Mock platform clients
    async def _mock_facebook_client(self, account, content, hashtags, media_assets):
        await asyncio.sleep(0.1)  # Simulate API call
        return {
            "post_id": f"fb_{secrets.token_hex(8)}",
            "post_url": f"https://facebook.com/posts/{secrets.token_hex(8)}"
        }
    
    async def _mock_instagram_client(self, account, content, hashtags, media_assets):
        await asyncio.sleep(0.1)
        return {
            "post_id": f"ig_{secrets.token_hex(8)}",
            "post_url": f"https://instagram.com/p/{secrets.token_hex(8)}"
        }
    
    async def _mock_twitter_client(self, account, content, hashtags, media_assets):
        await asyncio.sleep(0.1)
        return {
            "post_id": f"tw_{secrets.token_hex(8)}",
            "post_url": f"https://twitter.com/status/{secrets.token_hex(8)}"
        }
    
    async def _mock_linkedin_client(self, account, content, hashtags, media_assets):
        await asyncio.sleep(0.1)
        return {
            "post_id": f"li_{secrets.token_hex(8)}",
            "post_url": f"https://linkedin.com/posts/{secrets.token_hex(8)}"
        }
    
    async def _mock_tiktok_client(self, account, content, hashtags, media_assets):
        await asyncio.sleep(0.1)
        return {
            "post_id": f"tt_{secrets.token_hex(8)}",
            "post_url": f"https://tiktok.com/@user/video/{secrets.token_hex(8)}"
        }
    
    async def _mock_youtube_client(self, account, content, hashtags, media_assets):
        await asyncio.sleep(0.1)
        return {
            "post_id": f"yt_{secrets.token_hex(8)}",
            "post_url": f"https://youtube.com/watch?v={secrets.token_hex(8)}"
        }
    
    async def _mock_pinterest_client(self, account, content, hashtags, media_assets):
        await asyncio.sleep(0.1)
        return {
            "post_id": f"pin_{secrets.token_hex(8)}",
            "post_url": f"https://pinterest.com/pin/{secrets.token_hex(8)}"
        }

# Create service instance
social_publishing_service = SocialMediaPublishingService()