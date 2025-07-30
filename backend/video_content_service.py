from typing import List, Dict, Any, Optional
import uuid
import logging
from datetime import datetime
from models import *
from ai_service import ai_service
from database import get_database

logger = logging.getLogger(__name__)

class VideoContentService:
    def __init__(self):
        self.db = None
    
    async def initialize(self):
        """Initialize database connection"""
        if not self.db:
            self.db = get_database()
    
    async def generate_video_captions(self, request: VideoCaptionRequest) -> VideoCaptionResult:
        """Generate video captions and subtitles"""
        await self.initialize()
        
        # Create video content record
        video_content = VideoContent(
            user_id=request.user_id,
            video_title=request.video_title,
            video_description=request.video_description,
            video_duration=request.video_duration,
            platform=request.platform,
            category=request.category
        )
        
        await self.db.video_content.insert_one(video_content.dict())
        
        # Generate captions using AI
        captions = []
        
        for provider in request.ai_providers:
            try:
                prompt = self._create_video_caption_prompt(request)
                
                response = await ai_service.generate_content(
                    prompt=prompt,
                    provider=provider.value,
                    max_tokens=1500
                )
                
                # Parse the response to extract timestamped captions
                parsed_captions = self._parse_caption_response(response, provider.value, request)
                captions.extend(parsed_captions)
                
            except Exception as e:
                logger.error(f"Error generating captions with {provider.value}: {e}")
        
        # Generate SRT subtitle file if requested
        subtitle_file = None
        if request.include_timestamps and captions:
            subtitle_file = self._generate_srt_file(captions)
        
        # Create result
        result = VideoCaptionResult(
            user_id=request.user_id,
            video_content_id=video_content.id,
            captions=captions,
            subtitle_file=subtitle_file,
            language=request.language,
            style=request.caption_style
        )
        
        await self.db.video_caption_results.insert_one(result.dict())
        return result
    
    def _create_video_caption_prompt(self, request: VideoCaptionRequest) -> str:
        """Create AI prompt for video caption generation"""
        duration_minutes = request.video_duration // 60
        duration_seconds = request.video_duration % 60
        
        prompt = f"""
        Create engaging video captions for a {request.platform.value} video:
        
        Video Details:
        - Title: "{request.video_title}"
        - Description: "{request.video_description}"
        - Duration: {duration_minutes}:{duration_seconds:02d}
        - Category: {request.category.value}
        - Style: {request.caption_style}
        
        Requirements:
        1. Create timestamped captions that tell a compelling story
        2. Use {request.caption_style} tone throughout
        3. Include engaging hooks and calls-to-action
        4. Format: [timestamp] caption text
        5. Create captions for key moments throughout the video
        6. Keep each caption under 50 characters for readability
        7. Use platform-appropriate language and hashtags
        
        Platform Guidelines:
        - TikTok: Use trending sounds, quick cuts, engaging hooks
        - YouTube: Longer form, educational value, clear structure
        - Instagram: Visual storytelling, lifestyle focused
        
        Generate 10-15 timestamped captions covering the full video duration.
        """
        
        return prompt
    
    def _parse_caption_response(self, response: str, provider: str, request: VideoCaptionRequest) -> List[Dict[str, Any]]:
        """Parse AI response into structured captions"""
        captions = []
        lines = response.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line or not '[' in line:
                continue
            
            try:
                # Extract timestamp and caption
                if ']' in line:
                    timestamp_part = line.split(']')[0].replace('[', '').strip()
                    caption_text = line.split(']')[1].strip()
                    
                    # Validate timestamp format
                    if ':' in timestamp_part:
                        captions.append({
                            "timestamp": timestamp_part,
                            "text": caption_text,
                            "provider": provider,
                            "style": request.caption_style,
                            "language": request.language
                        })
            except Exception as e:
                logger.warning(f"Error parsing caption line '{line}': {e}")
                continue
        
        return captions
    
    def _generate_srt_file(self, captions: List[Dict[str, Any]]) -> str:
        """Generate SRT subtitle file content"""
        srt_content = ""
        
        for i, caption in enumerate(captions, 1):
            timestamp = caption.get("timestamp", "00:00")
            text = caption.get("text", "")
            
            # Convert timestamp to SRT format
            start_time = self._convert_to_srt_timestamp(timestamp)
            # Assume 3-second duration for each caption
            end_time = self._add_seconds_to_timestamp(start_time, 3)
            
            srt_content += f"{i}\n"
            srt_content += f"{start_time} --> {end_time}\n"
            srt_content += f"{text}\n\n"
        
        return srt_content
    
    def _convert_to_srt_timestamp(self, timestamp: str) -> str:
        """Convert timestamp to SRT format (HH:MM:SS,mmm)"""
        try:
            if ':' in timestamp:
                parts = timestamp.split(':')
                if len(parts) == 2:
                    minutes, seconds = parts
                    return f"00:{minutes:0>2}:{seconds:0>2},000"
                elif len(parts) == 3:
                    hours, minutes, seconds = parts
                    return f"{hours:0>2}:{minutes:0>2}:{seconds:0>2},000"
            return "00:00:00,000"
        except:
            return "00:00:00,000"
    
    def _add_seconds_to_timestamp(self, timestamp: str, seconds: int) -> str:
        """Add seconds to SRT timestamp"""
        try:
            # Simple implementation - add 3 seconds
            parts = timestamp.replace(',000', '').split(':')
            if len(parts) == 3:
                h, m, s = map(int, parts)
                total_seconds = h * 3600 + m * 60 + s + seconds
                
                new_h = total_seconds // 3600
                new_m = (total_seconds % 3600) // 60
                new_s = total_seconds % 60
                
                return f"{new_h:02d}:{new_m:02d}:{new_s:02d},000"
        except:
            pass
        return timestamp
    
    async def get_user_video_captions(self, user_id: str, limit: int = 20) -> List[VideoCaptionResult]:
        """Get user's video caption history"""
        await self.initialize()
        
        cursor = self.db.video_caption_results.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit)
        
        results = []
        async for doc in cursor:
            results.append(VideoCaptionResult(**doc))
        
        return results

# Global service instance
video_content_service = VideoContentService()