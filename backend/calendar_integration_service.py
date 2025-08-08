from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid
import secrets
from models import *
import asyncio
import json

router = APIRouter()

class CalendarIntegrationService:
    def __init__(self):
        # Mock calendar API clients
        self.calendar_clients = {
            CalendarProvider.GOOGLE_CALENDAR: self._mock_google_calendar_client,
            CalendarProvider.OUTLOOK: self._mock_outlook_client,
            CalendarProvider.APPLE_CALENDAR: self._mock_apple_calendar_client,
            CalendarProvider.CALENDLY: self._mock_calendly_client
        }
    
    async def connect_calendar_integration(self, provider: CalendarProvider, access_token: str, user_id: str, settings: Dict[str, Any] = {}) -> CalendarIntegration:
        """Connect a calendar integration"""
        try:
            # Test calendar connection
            connection_test = await self._test_calendar_connection(provider, access_token, settings)
            
            if not connection_test["success"]:
                raise HTTPException(status_code=400, detail=f"Failed to connect to {provider.value}: {connection_test['error']}")
            
            integration = CalendarIntegration(
                id=str(uuid.uuid4()),
                user_id=user_id,
                provider=provider,
                account_email=settings.get("account_email", "user@example.com"),
                access_token=access_token,
                refresh_token=settings.get("refresh_token"),
                calendar_ids=settings.get("calendar_ids", []),
                status="active",
                sync_settings=settings
            )
            
            # In real app, save to database
            # await database.calendar_integrations.insert_one(integration.dict())
            
            # Initial sync
            await self.sync_calendar_events(integration.id, user_id)
            
            return integration
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error connecting calendar integration: {str(e)}")
    
    async def sync_calendar_events(self, integration_id: str, user_id: str, date_range_days: int = 30) -> Dict[str, Any]:
        """Sync calendar events for content planning"""
        try:
            # Get integration details
            integration = await self._get_mock_integration(integration_id, user_id)
            
            if not integration:
                raise HTTPException(status_code=404, detail="Calendar integration not found")
            
            client = self.calendar_clients.get(integration.provider)
            if not client:
                raise HTTPException(status_code=400, detail=f"Unsupported calendar provider: {integration.provider.value}")
            
            # Sync events
            start_date = datetime.utcnow()
            end_date = start_date + timedelta(days=date_range_days)
            
            events_result = await client("get_events", integration, {
                "start_date": start_date,
                "end_date": end_date,
                "calendar_ids": integration.calendar_ids
            })
            
            synced_events = []
            
            # Process and save events
            for event_data in events_result["events"]:
                try:
                    # Check if event is content-related
                    is_content_event = await self._is_content_related_event(event_data)
                    
                    if is_content_event:
                        event = ContentCalendarEvent(
                            id=str(uuid.uuid4()),
                            user_id=user_id,
                            calendar_integration_id=integration_id,
                            event_id=event_data["id"],
                            title=event_data["title"],
                            description=event_data.get("description"),
                            start_time=event_data["start_time"],
                            end_time=event_data["end_time"],
                            content_type=self._detect_content_type(event_data),
                            platforms=self._extract_platforms(event_data),
                            content_status="planned",
                            assigned_to=event_data.get("assigned_to")
                        )
                        
                        # In real app, save to database
                        # await database.content_calendar_events.insert_one(event.dict())
                        synced_events.append(event)
                        
                except Exception as event_error:
                    print(f"Error processing event {event_data.get('id', 'unknown')}: {str(event_error)}")
            
            # Update integration last sync time
            integration.last_sync = datetime.utcnow()
            # In real app, update database
            # await database.calendar_integrations.update_one({"id": integration_id}, {"$set": {"last_sync": integration.last_sync}})
            
            return {
                "success": True,
                "integration_id": integration_id,
                "synced_events": len(synced_events),
                "date_range": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat()
                },
                "synced_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error syncing calendar events: {str(e)}")
    
    async def create_content_event(self, user_id: str, event_data: Dict[str, Any]) -> ContentCalendarEvent:
        """Create a new content planning event"""
        try:
            # Create calendar event
            event = ContentCalendarEvent(
                id=str(uuid.uuid4()),
                user_id=user_id,
                calendar_integration_id=event_data.get("calendar_integration_id"),
                event_id=str(uuid.uuid4()),  # Will be updated after calendar creation
                title=event_data["title"],
                description=event_data.get("description"),
                start_time=datetime.fromisoformat(event_data["start_time"]),
                end_time=datetime.fromisoformat(event_data["end_time"]),
                content_type=ContentType(event_data.get("content_type", "social_media_post")),
                platforms=[SocialPlatform(p) for p in event_data.get("platforms", [])],
                content_status="planned",
                assigned_to=event_data.get("assigned_to")
            )
            
            # Create event in calendar provider if integration exists
            if event_data.get("calendar_integration_id"):
                integration = await self._get_mock_integration(event_data["calendar_integration_id"], user_id)
                if integration:
                    client = self.calendar_clients.get(integration.provider)
                    if client:
                        calendar_result = await client("create_event", integration, {
                            "title": event.title,
                            "description": event.description,
                            "start_time": event.start_time,
                            "end_time": event.end_time
                        })
                        event.event_id = calendar_result["event_id"]
            
            # In real app, save to database
            # await database.content_calendar_events.insert_one(event.dict())
            
            return event
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating content event: {str(e)}")
    
    async def get_content_calendar(self, user_id: str, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[ContentCalendarEvent]:
        """Get content calendar events"""
        try:
            # Set default date range if not provided
            if not start_date:
                start_date = datetime.utcnow()
            if not end_date:
                end_date = start_date + timedelta(days=30)
            
            # Mock content calendar events
            events = [
                ContentCalendarEvent(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    calendar_integration_id="google_integration_1",
                    event_id="gcal_event_001",
                    title="Instagram Fashion Post - Fall Collection",
                    description="Create and publish Instagram post showcasing new fall collection pieces",
                    start_time=datetime.utcnow() + timedelta(days=1, hours=10),
                    end_time=datetime.utcnow() + timedelta(days=1, hours=11),
                    content_type=ContentType.SOCIAL_MEDIA_POST,
                    platforms=[SocialPlatform.INSTAGRAM, SocialPlatform.FACEBOOK],
                    content_status="planned",
                    assigned_to="content_team@example.com"
                ),
                ContentCalendarEvent(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    calendar_integration_id="google_integration_1",
                    event_id="gcal_event_002",
                    title="TikTok Video - Styling Tips",
                    description="Film TikTok video showing 3 ways to style the same outfit",
                    start_time=datetime.utcnow() + timedelta(days=3, hours=14),
                    end_time=datetime.utcnow() + timedelta(days=3, hours=16),
                    content_type=ContentType.VIDEO_CAPTION,
                    platforms=[SocialPlatform.TIKTOK, SocialPlatform.INSTAGRAM],
                    content_status="in_progress",
                    assigned_to="video_team@example.com"
                ),
                ContentCalendarEvent(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    calendar_integration_id="outlook_integration_1",
                    event_id="outlook_event_001",
                    title="LinkedIn Article - Fashion Industry Trends",
                    description="Write and publish LinkedIn article about upcoming fashion industry trends",
                    start_time=datetime.utcnow() + timedelta(days=5, hours=9),
                    end_time=datetime.utcnow() + timedelta(days=5, hours=12),
                    content_type=ContentType.BLOG_POST,
                    platforms=[SocialPlatform.LINKEDIN],
                    content_status="planned",
                    assigned_to="content_writer@example.com"
                ),
                ContentCalendarEvent(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    calendar_integration_id="google_integration_1",
                    event_id="gcal_event_003",
                    title="Email Newsletter - Weekly Fashion Updates",
                    description="Create and send weekly fashion newsletter to subscribers",
                    start_time=datetime.utcnow() + timedelta(days=7, hours=8),
                    end_time=datetime.utcnow() + timedelta(days=7, hours=10),
                    content_type=ContentType.EMAIL_MARKETING,
                    platforms=[],
                    content_status="planned",
                    assigned_to="marketing_team@example.com"
                ),
                ContentCalendarEvent(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    calendar_integration_id="google_integration_1",
                    event_id="gcal_event_004",
                    title="Product Photography Session",
                    description="Photography session for new product line - will be used for social media and website",
                    start_time=datetime.utcnow() + timedelta(days=10, hours=13),
                    end_time=datetime.utcnow() + timedelta(days=10, hours=17),
                    content_type=ContentType.SOCIAL_MEDIA_POST,
                    platforms=[SocialPlatform.INSTAGRAM, SocialPlatform.FACEBOOK, SocialPlatform.PINTEREST],
                    content_status="planned",
                    assigned_to="photo_team@example.com"
                )
            ]
            
            # Filter events by date range
            filtered_events = [
                event for event in events
                if start_date <= event.start_time <= end_date
            ]
            
            return filtered_events
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting content calendar: {str(e)}")
    
    async def update_event_status(self, event_id: str, user_id: str, status: str, post_id: Optional[str] = None) -> ContentCalendarEvent:
        """Update content event status"""
        try:
            # Get event
            event = await self._get_mock_event(event_id, user_id)
            
            if not event:
                raise HTTPException(status_code=404, detail="Content event not found")
            
            # Update status
            event.content_status = status
            event.updated_at = datetime.utcnow()
            
            # Link to post if provided
            if post_id:
                event.post_id = post_id
            
            # In real app, update database
            # await database.content_calendar_events.update_one({"id": event_id}, {"$set": event.dict()})
            
            return event
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating event status: {str(e)}")
    
    async def get_calendar_analytics(self, user_id: str, date_range: str = "30_days") -> Dict[str, Any]:
        """Get calendar and content planning analytics"""
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
            
            # Mock calendar analytics
            analytics = {
                "date_range": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat(),
                    "period": date_range
                },
                "content_planning_stats": {
                    "total_events": 28,
                    "completed_events": 22,
                    "in_progress_events": 4,
                    "planned_events": 2,
                    "completion_rate": 78.6
                },
                "content_type_breakdown": {
                    "social_media_post": 15,
                    "video_caption": 6,
                    "blog_post": 3,
                    "email_marketing": 2,
                    "product_description": 2
                },
                "platform_distribution": {
                    "instagram": 18,
                    "facebook": 12,
                    "tiktok": 8,
                    "linkedin": 5,
                    "twitter": 3,
                    "pinterest": 2
                },
                "team_productivity": {
                    "content_team@example.com": {
                        "assigned_events": 12,
                        "completed_events": 10,
                        "completion_rate": 83.3
                    },
                    "video_team@example.com": {
                        "assigned_events": 8,
                        "completed_events": 6,
                        "completion_rate": 75.0
                    },
                    "marketing_team@example.com": {
                        "assigned_events": 8,
                        "completed_events": 6,
                        "completion_rate": 75.0
                    }
                },
                "optimal_scheduling_insights": {
                    "best_posting_days": ["Tuesday", "Wednesday", "Thursday"],
                    "best_posting_times": ["10:00", "14:00", "18:00"],
                    "avg_planning_lead_time": "5_days",
                    "content_creation_duration": {
                        "social_media_post": "1_hour",
                        "video_caption": "2_hours",
                        "blog_post": "4_hours"
                    }
                },
                "integration_health": {
                    "connected_calendars": 2,
                    "sync_success_rate": 98.5,
                    "last_sync_issues": 0,
                    "avg_sync_time": "15_seconds"
                }
            }
            
            return analytics
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting calendar analytics: {str(e)}")
    
    async def suggest_optimal_times(self, user_id: str, content_type: ContentType, platforms: List[SocialPlatform]) -> Dict[str, Any]:
        """Get AI-powered optimal posting time suggestions"""
        try:
            # Mock optimal time suggestions based on content type and platforms
            base_suggestions = {
                SocialPlatform.INSTAGRAM: {
                    "weekdays": ["11:00", "14:00", "17:00", "19:00"],
                    "weekends": ["10:00", "13:00", "16:00"]
                },
                SocialPlatform.FACEBOOK: {
                    "weekdays": ["09:00", "13:00", "15:00"],
                    "weekends": ["12:00", "14:00", "16:00"]
                },
                SocialPlatform.TWITTER: {
                    "weekdays": ["08:00", "12:00", "17:00", "19:00"],
                    "weekends": ["10:00", "14:00"]
                },
                SocialPlatform.LINKEDIN: {
                    "weekdays": ["08:00", "12:00", "17:00"],
                    "weekends": []  # Business platform, minimal weekend activity
                },
                SocialPlatform.TIKTOK: {
                    "weekdays": ["18:00", "19:00", "20:00", "21:00"],
                    "weekends": ["19:00", "20:00", "21:00"]
                }
            }
            
            # Content type adjustments
            content_adjustments = {
                ContentType.VIDEO_CAPTION: {"shift_hours": 2},  # Videos perform better in evening
                ContentType.BLOG_POST: {"shift_hours": -2},     # Articles better in morning
                ContentType.EMAIL_MARKETING: {"shift_hours": -4} # Emails better early morning
            }
            
            suggestions = {}
            
            for platform in platforms:
                if platform in base_suggestions:
                    platform_times = base_suggestions[platform].copy()
                    
                    # Apply content type adjustments
                    if content_type in content_adjustments:
                        shift = content_adjustments[content_type]["shift_hours"]
                        # Apply time shifts (simplified for mock)
                        platform_times["adjusted"] = True
                        platform_times["shift_applied"] = f"{shift}_hours"
                    
                    suggestions[platform.value] = platform_times
            
            return {
                "content_type": content_type.value,
                "platforms": [p.value for p in platforms],
                "optimal_times": suggestions,
                "next_7_days": [
                    {
                        "date": (datetime.utcnow() + timedelta(days=i)).strftime("%Y-%m-%d"),
                        "day_of_week": (datetime.utcnow() + timedelta(days=i)).strftime("%A"),
                        "recommended_times": ["10:00", "14:00", "18:00"],
                        "engagement_score": 8.5 - (i * 0.1)  # Decreasing engagement prediction
                    }
                    for i in range(7)
                ],
                "timezone": "UTC",
                "confidence_score": 0.85
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting optimal time suggestions: {str(e)}")
    
    async def get_calendar_integrations(self, user_id: str) -> List[CalendarIntegration]:
        """Get all calendar integrations for a user"""
        try:
            # Mock integrations
            integrations = [
                CalendarIntegration(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    provider=CalendarProvider.GOOGLE_CALENDAR,
                    account_email="user@gmail.com",
                    access_token="mock_google_token",
                    calendar_ids=["primary", "content_calendar@gmail.com"],
                    status="active",
                    last_sync=datetime.utcnow() - timedelta(minutes=15),
                    sync_settings={
                        "sync_frequency": "15_minutes",
                        "auto_create_content_events": True,
                        "sync_bidirectional": True
                    }
                ),
                CalendarIntegration(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    provider=CalendarProvider.OUTLOOK,
                    account_email="user@outlook.com",
                    access_token="mock_outlook_token",
                    calendar_ids=["Calendar", "Content Planning"],
                    status="active",
                    last_sync=datetime.utcnow() - timedelta(hours=1),
                    sync_settings={
                        "sync_frequency": "hourly",
                        "auto_create_content_events": False,
                        "sync_bidirectional": False
                    }
                )
            ]
            
            return integrations
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting calendar integrations: {str(e)}")
    
    # Helper methods
    async def _test_calendar_connection(self, provider: CalendarProvider, access_token: str, settings: Dict[str, Any]) -> Dict[str, Any]:
        """Test calendar connection"""
        try:
            await asyncio.sleep(0.1)
            
            # Simulate occasional connection failures
            if secrets.randbelow(10) < 1:  # 10% failure rate
                return {"success": False, "error": "Invalid access token or expired credentials"}
            
            return {"success": True, "message": f"Successfully connected to {provider.value}"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def _get_mock_integration(self, integration_id: str, user_id: str) -> CalendarIntegration:
        """Get mock integration data"""
        return CalendarIntegration(
            id=integration_id,
            user_id=user_id,
            provider=CalendarProvider.GOOGLE_CALENDAR,
            account_email="user@gmail.com",
            access_token="mock_token",
            status="active"
        )
    
    async def _get_mock_event(self, event_id: str, user_id: str) -> ContentCalendarEvent:
        """Get mock event data"""
        return ContentCalendarEvent(
            id=event_id,
            user_id=user_id,
            calendar_integration_id="mock_integration",
            event_id="mock_calendar_event",
            title="Mock Event",
            start_time=datetime.utcnow(),
            end_time=datetime.utcnow() + timedelta(hours=1),
            content_status="planned"
        )
    
    async def _is_content_related_event(self, event_data: Dict[str, Any]) -> bool:
        """Check if calendar event is content-related"""
        content_keywords = [
            "content", "post", "video", "blog", "email", "marketing", 
            "social", "instagram", "facebook", "twitter", "linkedin",
            "tiktok", "youtube", "campaign", "photoshoot"
        ]
        
        title = event_data.get("title", "").lower()
        description = event_data.get("description", "").lower()
        
        return any(keyword in title or keyword in description for keyword in content_keywords)
    
    def _detect_content_type(self, event_data: Dict[str, Any]) -> Optional[ContentType]:
        """Detect content type from event data"""
        title = event_data.get("title", "").lower()
        description = event_data.get("description", "").lower()
        
        if any(word in title or word in description for word in ["video", "tiktok", "reel"]):
            return ContentType.VIDEO_CAPTION
        elif any(word in title or word in description for word in ["blog", "article", "linkedin"]):
            return ContentType.BLOG_POST
        elif any(word in title or word in description for word in ["email", "newsletter"]):
            return ContentType.EMAIL_MARKETING
        elif any(word in title or word in description for word in ["product", "description"]):
            return ContentType.PRODUCT_DESCRIPTION
        else:
            return ContentType.SOCIAL_MEDIA_POST
    
    def _extract_platforms(self, event_data: Dict[str, Any]) -> List[SocialPlatform]:
        """Extract platforms from event data"""
        platforms = []
        text = f"{event_data.get('title', '')} {event_data.get('description', '')}".lower()
        
        platform_keywords = {
            SocialPlatform.INSTAGRAM: ["instagram", "ig", "insta"],
            SocialPlatform.FACEBOOK: ["facebook", "fb"],
            SocialPlatform.TWITTER: ["twitter", "tweet"],
            SocialPlatform.LINKEDIN: ["linkedin"],
            SocialPlatform.TIKTOK: ["tiktok", "tt"],
            SocialPlatform.YOUTUBE: ["youtube", "yt"],
            SocialPlatform.PINTEREST: ["pinterest"]
        }
        
        for platform, keywords in platform_keywords.items():
            if any(keyword in text for keyword in keywords):
                platforms.append(platform)
        
        return platforms if platforms else [SocialPlatform.INSTAGRAM]  # Default platform
    
    # Mock calendar clients
    async def _mock_google_calendar_client(self, operation: str, integration: CalendarIntegration, params: Dict[str, Any] = {}):
        """Mock Google Calendar API client"""
        await asyncio.sleep(0.1)
        
        if operation == "get_events":
            return {
                "events": [
                    {
                        "id": f"gcal_{secrets.token_hex(8)}",
                        "title": "Instagram Post - Fashion Tips",
                        "description": "Create Instagram post about fashion tips for fall season",
                        "start_time": datetime.utcnow() + timedelta(days=1),
                        "end_time": datetime.utcnow() + timedelta(days=1, hours=1),
                        "assigned_to": "content@example.com"
                    }
                ]
            }
        elif operation == "create_event":
            return {"event_id": f"gcal_{secrets.token_hex(8)}"}
    
    async def _mock_outlook_client(self, operation: str, integration: CalendarIntegration, params: Dict[str, Any] = {}):
        """Mock Outlook Calendar API client"""
        await asyncio.sleep(0.1)
        
        if operation == "get_events":
            return {"events": []}
        elif operation == "create_event":
            return {"event_id": f"outlook_{secrets.token_hex(8)}"}
    
    async def _mock_apple_calendar_client(self, operation: str, integration: CalendarIntegration, params: Dict[str, Any] = {}):
        """Mock Apple Calendar API client"""
        await asyncio.sleep(0.1)
        return {"events": []}
    
    async def _mock_calendly_client(self, operation: str, integration: CalendarIntegration, params: Dict[str, Any] = {}):
        """Mock Calendly API client"""
        await asyncio.sleep(0.1)
        return {"events": []}

# Create service instance
calendar_integration_service = CalendarIntegrationService()