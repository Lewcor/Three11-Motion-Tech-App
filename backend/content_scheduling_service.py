from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid
import logging
from models import *
from database import get_database

logger = logging.getLogger(__name__)

class ContentSchedulingService:
    def __init__(self):
        self.db = None
    
    async def initialize(self):
        """Initialize database connection"""
        if not self.db:
            self.db = get_database()
    
    async def schedule_content(self, user_id: str, generation_result_id: str, 
                             platform: Platform, scheduled_time: datetime,
                             auto_post: bool = False, notes: Optional[str] = None) -> ScheduledContent:
        """Schedule content for posting"""
        await self.initialize()
        
        # Verify generation result exists and belongs to user
        generation_result = await self.db.generation_results.find_one({
            "id": generation_result_id,
            "user_id": user_id
        })
        
        if not generation_result:
            raise ValueError("Generation result not found or access denied")
        
        scheduled_content = ScheduledContent(
            user_id=user_id,
            generation_result_id=generation_result_id,
            platform=platform,
            scheduled_time=scheduled_time,
            auto_post=auto_post,
            notes=notes
        )
        
        # Save to database
        await self.db.scheduled_content.insert_one(scheduled_content.dict())
        
        return scheduled_content
    
    async def get_scheduled_content(self, user_id: str, start_date: Optional[datetime] = None,
                                  end_date: Optional[datetime] = None) -> List[ScheduledContent]:
        """Get user's scheduled content within date range"""
        await self.initialize()
        
        query = {"user_id": user_id}
        
        if start_date or end_date:
            date_filter = {}
            if start_date:
                date_filter["$gte"] = start_date
            if end_date:
                date_filter["$lte"] = end_date
            query["scheduled_time"] = date_filter
        
        cursor = self.db.scheduled_content.find(query).sort("scheduled_time", 1)
        
        scheduled_items = []
        async for doc in cursor:
            scheduled_items.append(ScheduledContent(**doc))
        
        return scheduled_items
    
    async def update_scheduled_content(self, scheduled_id: str, user_id: str,
                                     scheduled_time: Optional[datetime] = None,
                                     auto_post: Optional[bool] = None,
                                     notes: Optional[str] = None) -> bool:
        """Update scheduled content"""
        await self.initialize()
        
        update_data = {}
        if scheduled_time is not None:
            update_data["scheduled_time"] = scheduled_time
        if auto_post is not None:
            update_data["auto_post"] = auto_post
        if notes is not None:
            update_data["notes"] = notes
        
        if not update_data:
            return False
        
        result = await self.db.scheduled_content.update_one(
            {"id": scheduled_id, "user_id": user_id},
            {"$set": update_data}
        )
        
        return result.modified_count > 0
    
    async def cancel_scheduled_content(self, scheduled_id: str, user_id: str) -> bool:
        """Cancel scheduled content"""
        await self.initialize()
        
        result = await self.db.scheduled_content.update_one(
            {"id": scheduled_id, "user_id": user_id, "status": "scheduled"},
            {"$set": {"status": "cancelled"}}
        )
        
        return result.modified_count > 0
    
    async def create_content_calendar(self, user_id: str, name: str, 
                                    description: Optional[str] = None) -> ContentCalendar:
        """Create a new content calendar"""
        await self.initialize()
        
        calendar = ContentCalendar(
            user_id=user_id,
            name=name,
            description=description
        )
        
        await self.db.content_calendars.insert_one(calendar.dict())
        return calendar
    
    async def get_content_calendars(self, user_id: str) -> List[ContentCalendar]:
        """Get user's content calendars"""
        await self.initialize()
        
        cursor = self.db.content_calendars.find({"user_id": user_id}).sort("created_at", -1)
        
        calendars = []
        async for doc in cursor:
            # Get scheduled posts for this calendar
            scheduled_posts = await self.get_scheduled_content(user_id)
            doc["scheduled_posts"] = [post.dict() for post in scheduled_posts]
            calendars.append(ContentCalendar(**doc))
        
        return calendars
    
    async def get_calendar_overview(self, user_id: str, days_ahead: int = 30) -> Dict[str, Any]:
        """Get calendar overview with statistics"""
        await self.initialize()
        
        end_date = datetime.utcnow() + timedelta(days=days_ahead)
        scheduled_content = await self.get_scheduled_content(
            user_id=user_id,
            start_date=datetime.utcnow(),
            end_date=end_date
        )
        
        # Calculate statistics
        total_scheduled = len(scheduled_content)
        platforms = {}
        auto_posts = 0
        
        for item in scheduled_content:
            platform_key = item.platform.value
            platforms[platform_key] = platforms.get(platform_key, 0) + 1
            if item.auto_post:
                auto_posts += 1
        
        # Group by week
        weekly_breakdown = {}
        for item in scheduled_content:
            week_start = item.scheduled_time.date() - timedelta(days=item.scheduled_time.weekday())
            week_key = week_start.isoformat()
            weekly_breakdown[week_key] = weekly_breakdown.get(week_key, 0) + 1
        
        return {
            "total_scheduled": total_scheduled,
            "auto_posts": auto_posts,
            "manual_posts": total_scheduled - auto_posts,
            "platforms": platforms,
            "weekly_breakdown": weekly_breakdown,
            "next_7_days": len([item for item in scheduled_content 
                              if item.scheduled_time <= datetime.utcnow() + timedelta(days=7)])
        }
    
    async def get_upcoming_posts(self, user_id: str, hours_ahead: int = 24) -> List[ScheduledContent]:
        """Get posts scheduled for the next N hours"""
        await self.initialize()
        
        end_time = datetime.utcnow() + timedelta(hours=hours_ahead)
        
        cursor = self.db.scheduled_content.find({
            "user_id": user_id,
            "status": "scheduled",
            "scheduled_time": {
                "$gte": datetime.utcnow(),
                "$lte": end_time
            }
        }).sort("scheduled_time", 1)
        
        posts = []
        async for doc in cursor:
            posts.append(ScheduledContent(**doc))
        
        return posts

# Global service instance
content_scheduling_service = ContentSchedulingService()