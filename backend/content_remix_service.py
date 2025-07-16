"""
Smart Content Remix Engine for THREE11 MOTION TECH
Transforms content across platforms and creates multiple variations
"""

import os
import asyncio
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
import openai
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor
import re
from ai_service import AIService
from models import Platform, ContentCategory
from database import get_database
import uuid

@dataclass
class ContentRemix:
    original_content: str
    original_platform: Platform
    target_platform: Platform
    remix_type: str
    remixed_content: str
    adaptation_notes: str
    engagement_prediction: float
    created_at: datetime

@dataclass
class ContentVariation:
    original_content: str
    variation_type: str
    variation_content: str
    tone: str
    target_audience: str
    engagement_score: float
    created_at: datetime

class ContentRemixEngine:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.ai_service = AIService()
        self.executor = ThreadPoolExecutor(max_workers=4)
        
    async def remix_content_for_platform(self, content: str, source_platform: Platform, target_platform: Platform, category: ContentCategory) -> ContentRemix:
        """
        Remix content for a different platform
        """
        try:
            # Generate platform-specific remix
            remixed_content = await self._generate_platform_remix(content, source_platform, target_platform, category)
            
            # Analyze adaptation
            adaptation_notes = await self._analyze_adaptation(content, remixed_content, source_platform, target_platform)
            
            # Predict engagement
            engagement_prediction = await self._predict_engagement(remixed_content, target_platform, category)
            
            remix = ContentRemix(
                original_content=content,
                original_platform=source_platform,
                target_platform=target_platform,
                remix_type=f"{source_platform.value}_to_{target_platform.value}",
                remixed_content=remixed_content,
                adaptation_notes=adaptation_notes,
                engagement_prediction=engagement_prediction,
                created_at=datetime.utcnow()
            )
            
            # Store in database
            await self._store_remix(remix)
            
            return remix
            
        except Exception as e:
            print(f"Error remixing content: {e}")
            raise Exception(f"Content remix failed: {str(e)}")
    
    async def _generate_platform_remix(self, content: str, source_platform: Platform, target_platform: Platform, category: ContentCategory) -> str:
        """
        Generate platform-specific remix using AI
        """
        try:
            # Get platform-specific guidelines
            source_guidelines = self._get_platform_guidelines(source_platform)
            target_guidelines = self._get_platform_guidelines(target_platform)
            
            prompt = f"""
            Transform this content from {source_platform.value} to {target_platform.value}:
            
            Original Content: "{content}"
            
            Source Platform Context ({source_platform.value}):
            {source_guidelines}
            
            Target Platform Context ({target_platform.value}):
            {target_guidelines}
            
            Category: {category.value}
            
            Instructions:
            1. Adapt the content to fit {target_platform.value}'s format and audience
            2. Maintain the core message while optimizing for {target_platform.value}
            3. Adjust tone, length, and style appropriately
            4. Include platform-specific elements (hashtags, mentions, etc.)
            5. Ensure the content feels native to {target_platform.value}
            
            Return only the adapted content, no explanations.
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._call_openai_for_remix,
                prompt
            )
            
            return response.strip()
            
        except Exception as e:
            print(f"Error generating platform remix: {e}")
            return content  # Return original if remix fails
    
    def _get_platform_guidelines(self, platform: Platform) -> str:
        """
        Get platform-specific content guidelines
        """
        guidelines = {
            Platform.TIKTOK: """
            - Short, punchy content (15-60 seconds worth)
            - Use trending sounds and hashtags
            - Hook viewers in first 3 seconds
            - Vertical video format focus
            - Casual, energetic tone
            - Include trending challenges or dances
            - Use popular music references
            - Engage with comments and trends
            """,
            Platform.INSTAGRAM: """
            - Visual-first content
            - Stories vs Feed vs Reels optimization
            - Aesthetic and lifestyle focus
            - Use relevant hashtags (10-20)
            - Instagram-specific features (#storytime, polls)
            - Influencer collaboration style
            - High-quality visuals emphasis
            - Community engagement focus
            """,
            Platform.YOUTUBE: """
            - Long-form content focus
            - Educational or entertaining value
            - Strong title and thumbnail strategy
            - Detailed descriptions
            - Structured content with chapters
            - SEO optimization
            - Subscribe and notification calls
            - Community tab engagement
            """,
            Platform.FACEBOOK: """
            - Community-focused content
            - Longer text posts acceptable
            - Family-friendly tone
            - Local and group engagement
            - Share-worthy content
            - Discussion starters
            - Event and page promotion
            - Cross-generational appeal
            """
        }
        
        return guidelines.get(platform, "General social media guidelines")
    
    def _call_openai_for_remix(self, prompt: str) -> str:
        """
        Call OpenAI API for content remix
        """
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a social media content expert who specializes in adapting content across different platforms while maintaining engagement and authenticity."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=800
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI remix API error: {e}")
            return ""
    
    async def _analyze_adaptation(self, original: str, remixed: str, source_platform: Platform, target_platform: Platform) -> str:
        """
        Analyze how content was adapted between platforms
        """
        try:
            prompt = f"""
            Analyze how this content was adapted from {source_platform.value} to {target_platform.value}:
            
            Original ({source_platform.value}): "{original}"
            Adapted ({target_platform.value}): "{remixed}"
            
            Provide a brief analysis of:
            1. Key changes made
            2. Platform-specific optimizations
            3. Audience adaptation
            4. Engagement improvements
            
            Keep it concise (2-3 sentences).
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._call_openai_for_analysis,
                prompt
            )
            
            return response.strip()
            
        except Exception as e:
            print(f"Error analyzing adaptation: {e}")
            return "Content adapted for target platform with platform-specific optimizations."
    
    def _call_openai_for_analysis(self, prompt: str) -> str:
        """
        Call OpenAI API for adaptation analysis
        """
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a content analysis expert who provides concise insights on content adaptation across social media platforms."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI analysis API error: {e}")
            return ""
    
    async def _predict_engagement(self, content: str, platform: Platform, category: ContentCategory) -> float:
        """
        Predict engagement score for content
        """
        try:
            # Simple engagement prediction based on content characteristics
            score = 5.0  # Base score
            
            # Platform-specific scoring
            if platform == Platform.TIKTOK:
                if len(content) < 100:
                    score += 1.5  # Short content performs better
                if any(word in content.lower() for word in ['trending', 'viral', 'challenge']):
                    score += 1.0
            elif platform == Platform.INSTAGRAM:
                if '#' in content:
                    score += 1.0  # Hashtags help
                if any(word in content.lower() for word in ['aesthetic', 'lifestyle', 'inspiration']):
                    score += 0.8
            elif platform == Platform.YOUTUBE:
                if len(content) > 200:
                    score += 1.2  # Longer content can perform well
                if any(word in content.lower() for word in ['tutorial', 'how to', 'guide']):
                    score += 1.0
            elif platform == Platform.FACEBOOK:
                if any(word in content.lower() for word in ['community', 'share', 'discuss']):
                    score += 0.8
            
            # Category-specific scoring
            if category in [ContentCategory.FITNESS, ContentCategory.FOOD]:
                score += 0.5  # Popular categories
            
            # Content quality indicators
            if len(content.split()) > 10:
                score += 0.3  # Substantial content
            if '?' in content:
                score += 0.2  # Questions engage audience
            if '!' in content:
                score += 0.1  # Excitement
            
            return min(10.0, max(0.0, score))
            
        except Exception as e:
            print(f"Error predicting engagement: {e}")
            return 5.0
    
    async def _store_remix(self, remix: ContentRemix):
        """
        Store remix in database
        """
        try:
            db = get_database()
            
            remix_doc = {
                "id": str(uuid.uuid4()),
                "original_content": remix.original_content,
                "original_platform": remix.original_platform.value,
                "target_platform": remix.target_platform.value,
                "remix_type": remix.remix_type,
                "remixed_content": remix.remixed_content,
                "adaptation_notes": remix.adaptation_notes,
                "engagement_prediction": remix.engagement_prediction,
                "created_at": remix.created_at
            }
            
            await db.content_remixes.insert_one(remix_doc)
            
        except Exception as e:
            print(f"Error storing remix: {e}")
    
    async def generate_content_variations(self, content: str, platform: Platform, category: ContentCategory, variation_count: int = 5) -> List[ContentVariation]:
        """
        Generate multiple variations of the same content
        """
        try:
            variations = []
            
            variation_types = [
                {"type": "casual", "tone": "friendly and casual", "audience": "general audience"},
                {"type": "professional", "tone": "professional and authoritative", "audience": "business audience"},
                {"type": "humorous", "tone": "funny and entertaining", "audience": "entertainment seekers"},
                {"type": "inspirational", "tone": "motivational and uplifting", "audience": "motivation seekers"},
                {"type": "educational", "tone": "informative and helpful", "audience": "learners"},
                {"type": "trendy", "tone": "trendy and current", "audience": "trend followers"},
                {"type": "emotional", "tone": "emotional and heartfelt", "audience": "emotionally engaged users"}
            ]
            
            # Generate variations
            for i in range(min(variation_count, len(variation_types))):
                variation_config = variation_types[i]
                
                variation_content = await self._generate_content_variation(
                    content, 
                    platform, 
                    category, 
                    variation_config
                )
                
                engagement_score = await self._predict_engagement(variation_content, platform, category)
                
                variation = ContentVariation(
                    original_content=content,
                    variation_type=variation_config["type"],
                    variation_content=variation_content,
                    tone=variation_config["tone"],
                    target_audience=variation_config["audience"],
                    engagement_score=engagement_score,
                    created_at=datetime.utcnow()
                )
                
                variations.append(variation)
            
            # Store variations
            await self._store_variations(variations)
            
            return variations
            
        except Exception as e:
            print(f"Error generating content variations: {e}")
            return []
    
    async def _generate_content_variation(self, content: str, platform: Platform, category: ContentCategory, variation_config: Dict) -> str:
        """
        Generate a single content variation
        """
        try:
            prompt = f"""
            Create a variation of this content for {platform.value}:
            
            Original Content: "{content}"
            
            Variation Requirements:
            - Type: {variation_config['type']}
            - Tone: {variation_config['tone']}
            - Target Audience: {variation_config['audience']}
            - Platform: {platform.value}
            - Category: {category.value}
            
            Instructions:
            1. Maintain the core message
            2. Adapt the tone to be {variation_config['tone']}
            3. Target {variation_config['audience']}
            4. Optimize for {platform.value}
            5. Make it feel natural and engaging
            
            Return only the variation content, no explanations.
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._call_openai_for_variation,
                prompt
            )
            
            return response.strip()
            
        except Exception as e:
            print(f"Error generating content variation: {e}")
            return content
    
    def _call_openai_for_variation(self, prompt: str) -> str:
        """
        Call OpenAI API for content variation
        """
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a creative content writer who specializes in creating engaging variations of social media content for different audiences and tones."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.9,
                max_tokens=600
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI variation API error: {e}")
            return ""
    
    async def _store_variations(self, variations: List[ContentVariation]):
        """
        Store content variations in database
        """
        try:
            db = get_database()
            
            for variation in variations:
                variation_doc = {
                    "id": str(uuid.uuid4()),
                    "original_content": variation.original_content,
                    "variation_type": variation.variation_type,
                    "variation_content": variation.variation_content,
                    "tone": variation.tone,
                    "target_audience": variation.target_audience,
                    "engagement_score": variation.engagement_score,
                    "created_at": variation.created_at
                }
                
                await db.content_variations.insert_one(variation_doc)
                
        except Exception as e:
            print(f"Error storing variations: {e}")
    
    async def cross_platform_content_suite(self, content: str, category: ContentCategory, user_id: str) -> Dict[str, Any]:
        """
        Generate a complete cross-platform content suite
        """
        try:
            platforms = [Platform.TIKTOK, Platform.INSTAGRAM, Platform.YOUTUBE, Platform.FACEBOOK]
            source_platform = Platform.INSTAGRAM  # Default source
            
            suite = {
                "original_content": content,
                "category": category.value,
                "created_at": datetime.utcnow().isoformat(),
                "platform_adaptations": {},
                "content_variations": [],
                "optimization_suggestions": [],
                "engagement_predictions": {}
            }
            
            # Generate platform adaptations
            for platform in platforms:
                if platform != source_platform:
                    remix = await self.remix_content_for_platform(content, source_platform, platform, category)
                    suite["platform_adaptations"][platform.value] = {
                        "content": remix.remixed_content,
                        "adaptation_notes": remix.adaptation_notes,
                        "engagement_prediction": remix.engagement_prediction
                    }
            
            # Generate variations for the best performing platform
            best_platform = max(platforms, key=lambda p: suite["platform_adaptations"].get(p.value, {}).get("engagement_prediction", 0))
            best_content = suite["platform_adaptations"].get(best_platform.value, {}).get("content", content)
            
            variations = await self.generate_content_variations(best_content, best_platform, category, 3)
            suite["content_variations"] = [
                {
                    "type": var.variation_type,
                    "content": var.variation_content,
                    "tone": var.tone,
                    "audience": var.target_audience,
                    "engagement_score": var.engagement_score
                }
                for var in variations
            ]
            
            # Generate optimization suggestions
            suite["optimization_suggestions"] = await self._generate_optimization_suggestions(content, category, platforms)
            
            # Store the suite
            await self._store_content_suite(suite, user_id)
            
            return suite
            
        except Exception as e:
            print(f"Error generating cross-platform suite: {e}")
            return {"error": str(e)}
    
    async def _generate_optimization_suggestions(self, content: str, category: ContentCategory, platforms: List[Platform]) -> List[str]:
        """
        Generate optimization suggestions for content
        """
        try:
            prompt = f"""
            Provide 5 optimization suggestions for this content across multiple platforms:
            
            Content: "{content}"
            Category: {category.value}
            Platforms: {', '.join([p.value for p in platforms])}
            
            Suggestions should cover:
            1. Engagement optimization
            2. Platform-specific improvements
            3. Audience targeting
            4. Content structure
            5. Timing and posting strategy
            
            Return as a numbered list.
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._call_openai_for_suggestions,
                prompt
            )
            
            # Parse suggestions
            suggestions = []
            for line in response.split('\n'):
                line = line.strip()
                if line and (line[0].isdigit() or line.startswith('-')):
                    suggestions.append(line)
            
            return suggestions[:5]
            
        except Exception as e:
            print(f"Error generating optimization suggestions: {e}")
            return []
    
    def _call_openai_for_suggestions(self, prompt: str) -> str:
        """
        Call OpenAI API for optimization suggestions
        """
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a social media optimization expert who provides actionable suggestions for improving content performance across platforms."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI suggestions API error: {e}")
            return ""
    
    async def _store_content_suite(self, suite: Dict[str, Any], user_id: str):
        """
        Store complete content suite in database
        """
        try:
            db = get_database()
            
            suite_doc = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "suite_data": suite,
                "created_at": datetime.utcnow()
            }
            
            await db.content_suites.insert_one(suite_doc)
            
        except Exception as e:
            print(f"Error storing content suite: {e}")
    
    async def get_user_remixes(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get user's content remixes
        """
        try:
            db = get_database()
            
            # Get from content_suites
            cursor = db.content_suites.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
            suites = []
            
            async for doc in cursor:
                suites.append({
                    "id": doc["id"],
                    "original_content": doc["suite_data"]["original_content"],
                    "category": doc["suite_data"]["category"],
                    "platform_count": len(doc["suite_data"]["platform_adaptations"]),
                    "variation_count": len(doc["suite_data"]["content_variations"]),
                    "created_at": doc["created_at"].isoformat()
                })
            
            return suites
            
        except Exception as e:
            print(f"Error getting user remixes: {e}")
            return []
    
    async def get_remix_analytics(self, user_id: str) -> Dict[str, Any]:
        """
        Get remix analytics for user
        """
        try:
            db = get_database()
            
            # Get user's content suites
            cursor = db.content_suites.find({"user_id": user_id})
            suites = []
            
            async for doc in cursor:
                suites.append(doc)
            
            if not suites:
                return {"total_remixes": 0, "platforms": {}, "categories": {}}
            
            analytics = {
                "total_remixes": len(suites),
                "platforms": {},
                "categories": {},
                "avg_engagement_prediction": 0.0,
                "most_popular_platform": None,
                "most_popular_category": None
            }
            
            # Analyze platforms
            platform_counts = {}
            engagement_sum = 0
            engagement_count = 0
            
            for suite in suites:
                suite_data = suite["suite_data"]
                
                # Count platforms
                for platform in suite_data["platform_adaptations"]:
                    platform_counts[platform] = platform_counts.get(platform, 0) + 1
                    
                    # Sum engagement predictions
                    engagement = suite_data["platform_adaptations"][platform].get("engagement_prediction", 0)
                    engagement_sum += engagement
                    engagement_count += 1
                
                # Count categories
                category = suite_data["category"]
                analytics["categories"][category] = analytics["categories"].get(category, 0) + 1
            
            analytics["platforms"] = platform_counts
            analytics["avg_engagement_prediction"] = engagement_sum / max(engagement_count, 1)
            
            # Find most popular
            if platform_counts:
                analytics["most_popular_platform"] = max(platform_counts, key=platform_counts.get)
            if analytics["categories"]:
                analytics["most_popular_category"] = max(analytics["categories"], key=analytics["categories"].get)
            
            return analytics
            
        except Exception as e:
            print(f"Error getting remix analytics: {e}")
            return {"error": str(e)}