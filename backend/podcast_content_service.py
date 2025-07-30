from typing import List, Dict, Any, Optional
import uuid
import logging
from datetime import datetime
from models import *
from ai_service import ai_service
from database import get_database

logger = logging.getLogger(__name__)

class PodcastContentService:
    def __init__(self):
        self.db = None
    
    async def initialize(self):
        """Initialize database connection"""
        if not self.db:
            self.db = get_database()
    
    async def generate_podcast_content(self, request: PodcastContentRequest) -> PodcastContentResult:
        """Generate podcast descriptions and show notes"""
        await self.initialize()
        
        # Create podcast content record
        podcast_content = PodcastContent(
            user_id=request.user_id,
            podcast_title=request.podcast_title,
            episode_number=request.episode_number,
            duration=request.duration,
            topics=request.topics,
            guests=request.guests,
            key_points=request.key_points
        )
        
        await self.db.podcast_content.insert_one(podcast_content.dict())
        
        # Generate content based on type
        description = None
        show_notes = None
        chapters = []
        key_quotes = []
        resources_mentioned = []
        
        for provider in request.ai_providers:
            try:
                if request.content_type == ContentType.PODCAST_DESCRIPTION:
                    description = await self._generate_podcast_description(request, provider.value)
                elif request.content_type == ContentType.PODCAST_SHOW_NOTES:
                    show_notes_data = await self._generate_podcast_show_notes(request, provider.value)
                    show_notes = show_notes_data.get("notes", "")
                    chapters.extend(show_notes_data.get("chapters", []))
                    key_quotes.extend(show_notes_data.get("quotes", []))
                    resources_mentioned.extend(show_notes_data.get("resources", []))
                
            except Exception as e:
                logger.error(f"Error generating podcast content with {provider.value}: {e}")
        
        # Create result
        result = PodcastContentResult(
            user_id=request.user_id,
            podcast_content_id=podcast_content.id,
            content_type=request.content_type,
            description=description,
            show_notes=show_notes,
            chapters=chapters,
            key_quotes=key_quotes,
            resources_mentioned=resources_mentioned
        )
        
        await self.db.podcast_content_results.insert_one(result.dict())
        return result
    
    async def _generate_podcast_description(self, request: PodcastContentRequest, provider: str) -> str:
        """Generate podcast episode description"""
        guest_info = f" featuring {', '.join(request.guests)}" if request.guests else ""
        episode_info = f"Episode {request.episode_number}: " if request.episode_number else ""
        
        prompt = f"""
        Create an engaging podcast episode description:
        
        Podcast: "{request.podcast_title}"
        {episode_info}Duration: {request.duration} minutes{guest_info}
        
        Topics Covered:
        {chr(10).join(f"• {topic}" for topic in request.topics)}
        
        Key Points:
        {chr(10).join(f"• {point}" for point in request.key_points)}
        
        Tone: {request.tone}
        
        Requirements:
        1. Write a compelling episode description that hooks listeners
        2. Highlight the main value proposition and key takeaways
        3. Include relevant keywords for discoverability
        4. Mention guests and their expertise if applicable
        5. Use {request.tone} tone throughout
        6. Include a clear call-to-action
        7. Keep it between 150-300 words
        8. Format for podcast platforms (Apple Podcasts, Spotify, etc.)
        
        Create a description that makes people want to listen immediately.
        """
        
        return await ai_service.generate_content(prompt, provider, 800)
    
    async def _generate_podcast_show_notes(self, request: PodcastContentRequest, provider: str) -> Dict[str, Any]:
        """Generate comprehensive podcast show notes"""
        guest_info = f" with {', '.join(request.guests)}" if request.guests else ""
        episode_info = f"Episode {request.episode_number}: " if request.episode_number else ""
        
        prompt = f"""
        Create comprehensive podcast show notes:
        
        Podcast: "{request.podcast_title}"
        {episode_info}Duration: {request.duration} minutes{guest_info}
        
        Topics Covered:
        {chr(10).join(f"• {topic}" for topic in request.topics)}
        
        Key Points Discussed:
        {chr(10).join(f"• {point}" for point in request.key_points)}
        
        Tone: {request.tone}
        Include Timestamps: {request.include_timestamps}
        
        Create detailed show notes including:
        
        1. **EPISODE SUMMARY** (2-3 sentences)
        
        2. **TIMESTAMPS & CHAPTERS** (if include_timestamps=True):
        [MM:SS] Chapter Title - Brief description
        [MM:SS] Chapter Title - Brief description
        
        3. **KEY TAKEAWAYS** (3-5 bullet points)
        
        4. **NOTABLE QUOTES** (2-3 memorable quotes from the episode)
        
        5. **RESOURCES MENTIONED** (books, tools, websites, etc.)
        
        6. **GUEST INFORMATION** (if applicable):
        - Bio and expertise
        - Where to find them online
        
        7. **NEXT STEPS** (calls-to-action for listeners)
        
        Format everything clearly with headers and bullet points.
        Make it easy to scan and highly valuable for listeners.
        """
        
        response = await ai_service.generate_content(prompt, provider, 1500)
        
        # Parse the response to extract structured data
        return self._parse_show_notes_response(response, request)
    
    def _parse_show_notes_response(self, response: str, request: PodcastContentRequest) -> Dict[str, Any]:
        """Parse AI response into structured show notes data"""
        chapters = []
        quotes = []
        resources = []
        
        lines = response.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect sections
            if "TIMESTAMPS" in line.upper() or "CHAPTERS" in line.upper():
                current_section = "chapters"
            elif "QUOTES" in line.upper():
                current_section = "quotes"
            elif "RESOURCES" in line.upper():
                current_section = "resources"
            elif line.startswith('#') or line.startswith('**'):
                current_section = None
            
            # Extract data based on current section
            if current_section == "chapters" and '[' in line and ']' in line:
                try:
                    timestamp_part = line.split(']')[0].replace('[', '').strip()
                    content_part = line.split(']')[1].strip()
                    
                    if ' - ' in content_part:
                        title, summary = content_part.split(' - ', 1)
                        chapters.append({
                            "timestamp": timestamp_part,
                            "title": title.strip(),
                            "summary": summary.strip()
                        })
                except:
                    continue
            
            elif current_section == "quotes" and (line.startswith('"') or line.startswith("'")):
                quotes.append(line.strip(' "\''))
            
            elif current_section == "resources" and (line.startswith('•') or line.startswith('-')):
                resource = line.lstrip('•- ').strip()
                if resource:
                    resources.append(resource)
        
        return {
            "notes": response,
            "chapters": chapters,
            "quotes": quotes,
            "resources": resources
        }
    
    async def get_user_podcast_content(self, user_id: str, limit: int = 20) -> List[PodcastContentResult]:
        """Get user's podcast content history"""
        await self.initialize()
        
        cursor = self.db.podcast_content_results.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit)
        
        results = []
        async for doc in cursor:
            results.append(PodcastContentResult(**doc))
        
        return results
    
    async def get_podcast_analytics(self, user_id: str) -> Dict[str, Any]:
        """Get podcast content analytics"""
        await self.initialize()
        
        # Count content by type
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": "$content_type",
                "count": {"$sum": 1},
                "avg_duration": {"$avg": "$duration"}
            }}
        ]
        
        cursor = self.db.podcast_content_results.aggregate(pipeline)
        analytics = {"total_episodes": 0, "content_types": {}, "avg_duration": 0}
        
        async for doc in cursor:
            content_type = doc["_id"]
            analytics["content_types"][content_type] = {
                "count": doc["count"],
                "avg_duration": doc.get("avg_duration", 0)
            }
            analytics["total_episodes"] += doc["count"]
        
        return analytics

# Global service instance
podcast_content_service = PodcastContentService()