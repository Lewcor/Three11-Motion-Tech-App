"""
Real-Time Social Media Trends Service for THREE11 MOTION TECH
Analyzes and predicts social media trends across platforms
"""

import os
import asyncio
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import requests
import openai
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor
import re
import hashlib
from database import get_database
from models import Platform, ContentCategory

@dataclass
class TrendData:
    keyword: str
    platform: Platform
    volume: int
    growth_rate: float
    engagement_score: float
    predicted_duration: int  # days
    related_hashtags: List[str]
    sentiment: str
    category: ContentCategory
    created_at: datetime

@dataclass
class TrendPrediction:
    keyword: str
    platform: Platform
    likelihood: float
    estimated_peak_date: datetime
    recommended_action: str
    content_suggestions: List[str]

class TrendsService:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.executor = ThreadPoolExecutor(max_workers=4)
        
        # Cache for trends data
        self.trends_cache = {}
        self.cache_duration = 300  # 5 minutes
        
    async def get_trending_topics(self, platform: Platform, category: Optional[ContentCategory] = None, limit: int = 20) -> List[TrendData]:
        """
        Get real-time trending topics for a specific platform
        """
        try:
            # Check cache first
            cache_key = f"{platform.value}_{category.value if category else 'all'}_{limit}"
            cached_data = self._get_cached_trends(cache_key)
            if cached_data:
                return cached_data
            
            # Fetch trends from multiple sources
            trends = await self._fetch_platform_trends(platform, category, limit)
            
            # Cache the results
            self._cache_trends(cache_key, trends)
            
            return trends
            
        except Exception as e:
            print(f"Error getting trending topics: {e}")
            return await self._get_fallback_trends(platform, category, limit)
    
    async def _fetch_platform_trends(self, platform: Platform, category: Optional[ContentCategory], limit: int) -> List[TrendData]:
        """
        Fetch trends from multiple sources and combine with AI analysis
        """
        try:
            # Simulate real-time trends analysis using AI
            # In production, this would integrate with real APIs
            platform_specific_trends = await self._generate_ai_trends(platform, category, limit)
            
            # Combine with historical data analysis
            historical_context = await self._analyze_historical_trends(platform, category)
            
            # Enhance with AI predictions
            enhanced_trends = await self._enhance_trends_with_ai(platform_specific_trends, historical_context)
            
            return enhanced_trends
            
        except Exception as e:
            print(f"Error fetching platform trends: {e}")
            return []
    
    async def _generate_ai_trends(self, platform: Platform, category: Optional[ContentCategory], limit: int) -> List[TrendData]:
        """
        Generate trending topics using AI analysis
        """
        try:
            # Create contextual prompt for AI trend generation
            category_filter = f" focused on {category.value}" if category else ""
            platform_context = self._get_platform_context(platform)
            
            prompt = f"""
            Analyze current social media trends for {platform.value}{category_filter}. 
            
            Platform Context: {platform_context}
            
            Generate {limit} trending topics with detailed analysis including:
            - Keyword/topic
            - Estimated volume (1-100)
            - Growth rate percentage
            - Engagement score (1-10)
            - Predicted duration in days
            - Related hashtags
            - Sentiment (positive/negative/neutral)
            - Category classification
            
            Return as JSON array with this structure:
            {{
                "keyword": "topic name",
                "volume": 85,
                "growth_rate": 25.5,
                "engagement_score": 8.2,
                "predicted_duration": 7,
                "related_hashtags": ["#hashtag1", "#hashtag2"],
                "sentiment": "positive",
                "category": "fitness"
            }}
            
            Focus on realistic, current trends that would be popular on {platform.value} right now.
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._call_openai_for_trends,
                prompt
            )
            
            # Parse AI response
            trends_data = self._parse_ai_trends_response(response, platform)
            return trends_data
            
        except Exception as e:
            print(f"Error generating AI trends: {e}")
            return []
    
    def _call_openai_for_trends(self, prompt: str) -> str:
        """
        Call OpenAI API for trend analysis
        """
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a social media trends expert who analyzes real-time data and predicts viral content. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return "[]"
    
    def _parse_ai_trends_response(self, response: str, platform: Platform) -> List[TrendData]:
        """
        Parse AI response into TrendData objects
        """
        try:
            # Extract JSON from response
            json_match = re.search(r'\[.*\]', response, re.DOTALL)
            if not json_match:
                return []
            
            trends_json = json.loads(json_match.group())
            trends = []
            
            for item in trends_json:
                try:
                    trend = TrendData(
                        keyword=item.get('keyword', ''),
                        platform=platform,
                        volume=item.get('volume', 0),
                        growth_rate=item.get('growth_rate', 0.0),
                        engagement_score=item.get('engagement_score', 0.0),
                        predicted_duration=item.get('predicted_duration', 1),
                        related_hashtags=item.get('related_hashtags', []),
                        sentiment=item.get('sentiment', 'neutral'),
                        category=ContentCategory(item.get('category', 'business')),
                        created_at=datetime.utcnow()
                    )
                    trends.append(trend)
                except Exception as e:
                    print(f"Error parsing trend item: {e}")
                    continue
            
            return trends
            
        except Exception as e:
            print(f"Error parsing AI trends response: {e}")
            return []
    
    def _get_platform_context(self, platform: Platform) -> str:
        """
        Get platform-specific context for trend analysis
        """
        contexts = {
            Platform.TIKTOK: "Short-form video content, Gen Z audience, viral challenges, music trends, dance moves, comedy skits",
            Platform.INSTAGRAM: "Visual storytelling, lifestyle content, influencer marketing, Stories, Reels, aesthetic posts",
            Platform.YOUTUBE: "Long-form video content, educational content, entertainment, tutorials, product reviews",
            Platform.FACEBOOK: "Community engagement, news sharing, life updates, family content, local events"
        }
        
        return contexts.get(platform, "General social media content")
    
    async def _analyze_historical_trends(self, platform: Platform, category: Optional[ContentCategory]) -> Dict[str, Any]:
        """
        Analyze historical trend patterns
        """
        try:
            db = get_database()
            
            # Query historical trends data
            query = {"platform": platform.value}
            if category:
                query["category"] = category.value
            
            # Get trends from last 30 days
            start_date = datetime.utcnow() - timedelta(days=30)
            query["created_at"] = {"$gte": start_date}
            
            cursor = db.trends.find(query).sort("created_at", -1)
            historical_trends = []
            
            async for trend in cursor:
                historical_trends.append(trend)
            
            # Analyze patterns
            analysis = {
                "total_trends": len(historical_trends),
                "avg_duration": sum(t.get("predicted_duration", 1) for t in historical_trends) / max(len(historical_trends), 1),
                "popular_categories": self._analyze_popular_categories(historical_trends),
                "recurring_keywords": self._find_recurring_keywords(historical_trends),
                "sentiment_distribution": self._analyze_sentiment_distribution(historical_trends)
            }
            
            return analysis
            
        except Exception as e:
            print(f"Error analyzing historical trends: {e}")
            return {}
    
    def _analyze_popular_categories(self, trends: List[Dict]) -> List[str]:
        """
        Analyze which categories are most popular
        """
        category_counts = {}
        for trend in trends:
            category = trend.get("category", "business")
            category_counts[category] = category_counts.get(category, 0) + 1
        
        return sorted(category_counts.keys(), key=lambda x: category_counts[x], reverse=True)[:5]
    
    def _find_recurring_keywords(self, trends: List[Dict]) -> List[str]:
        """
        Find keywords that appear frequently
        """
        keyword_counts = {}
        for trend in trends:
            keyword = trend.get("keyword", "").lower()
            if keyword:
                keyword_counts[keyword] = keyword_counts.get(keyword, 0) + 1
        
        return [k for k, v in keyword_counts.items() if v > 1]
    
    def _analyze_sentiment_distribution(self, trends: List[Dict]) -> Dict[str, int]:
        """
        Analyze sentiment distribution
        """
        sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
        for trend in trends:
            sentiment = trend.get("sentiment", "neutral")
            sentiment_counts[sentiment] = sentiment_counts.get(sentiment, 0) + 1
        
        return sentiment_counts
    
    async def _enhance_trends_with_ai(self, trends: List[TrendData], historical_context: Dict[str, Any]) -> List[TrendData]:
        """
        Enhance trends with AI predictions and analysis
        """
        try:
            for trend in trends:
                # Add AI-powered enhancements
                trend.volume = max(1, min(100, trend.volume + self._calculate_volume_adjustment(trend, historical_context)))
                trend.growth_rate = max(0, trend.growth_rate + self._calculate_growth_adjustment(trend, historical_context))
                trend.engagement_score = max(0, min(10, trend.engagement_score + self._calculate_engagement_adjustment(trend)))
                
                # Enhance hashtags
                trend.related_hashtags = await self._enhance_hashtags(trend)
            
            return trends
            
        except Exception as e:
            print(f"Error enhancing trends: {e}")
            return trends
    
    def _calculate_volume_adjustment(self, trend: TrendData, historical_context: Dict[str, Any]) -> int:
        """
        Calculate volume adjustment based on historical data
        """
        if trend.category.value in historical_context.get("popular_categories", []):
            return 10  # Boost for popular categories
        return 0
    
    def _calculate_growth_adjustment(self, trend: TrendData, historical_context: Dict[str, Any]) -> float:
        """
        Calculate growth rate adjustment
        """
        if trend.keyword.lower() in historical_context.get("recurring_keywords", []):
            return 5.0  # Boost for recurring keywords
        return 0.0
    
    def _calculate_engagement_adjustment(self, trend: TrendData) -> float:
        """
        Calculate engagement score adjustment
        """
        if trend.sentiment == "positive":
            return 1.0
        elif trend.sentiment == "negative":
            return -0.5
        return 0.0
    
    async def _enhance_hashtags(self, trend: TrendData) -> List[str]:
        """
        Enhance hashtags with AI suggestions
        """
        try:
            # Generate additional relevant hashtags
            prompt = f"""
            Generate 5 relevant hashtags for the trending topic: "{trend.keyword}" on {trend.platform.value}.
            
            Context:
            - Platform: {trend.platform.value}
            - Category: {trend.category.value}
            - Sentiment: {trend.sentiment}
            - Current hashtags: {trend.related_hashtags}
            
            Return only the hashtags as a comma-separated list, each starting with #.
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._call_openai_for_hashtags,
                prompt
            )
            
            # Parse hashtags
            new_hashtags = [tag.strip() for tag in response.split(',') if tag.strip().startswith('#')]
            
            # Combine with existing hashtags
            all_hashtags = list(set(trend.related_hashtags + new_hashtags))
            
            return all_hashtags[:10]  # Limit to 10 hashtags
            
        except Exception as e:
            print(f"Error enhancing hashtags: {e}")
            return trend.related_hashtags
    
    def _call_openai_for_hashtags(self, prompt: str) -> str:
        """
        Call OpenAI API for hashtag generation
        """
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a social media hashtag expert. Generate relevant hashtags for trending topics."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=200
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI hashtag API error: {e}")
            return ""
    
    async def predict_future_trends(self, platform: Platform, days_ahead: int = 7) -> List[TrendPrediction]:
        """
        Predict trends that will be popular in the future
        """
        try:
            # Analyze current trends
            current_trends = await self.get_trending_topics(platform, limit=50)
            
            # Use AI to predict future trends
            predictions = await self._generate_trend_predictions(platform, current_trends, days_ahead)
            
            # Store predictions in database
            await self._store_trend_predictions(predictions)
            
            return predictions
            
        except Exception as e:
            print(f"Error predicting future trends: {e}")
            return []
    
    async def _generate_trend_predictions(self, platform: Platform, current_trends: List[TrendData], days_ahead: int) -> List[TrendPrediction]:
        """
        Generate trend predictions using AI
        """
        try:
            # Create context from current trends
            current_context = self._create_current_trends_context(current_trends)
            
            prompt = f"""
            Based on current trending topics on {platform.value}, predict 10 topics that will trend in the next {days_ahead} days.
            
            Current trends context:
            {current_context}
            
            Consider:
            - Seasonal patterns
            - Cultural events
            - Technology developments
            - Social movements
            - Entertainment releases
            - Sports events
            
            Return predictions as JSON array:
            {{
                "keyword": "predicted topic",
                "likelihood": 0.85,
                "estimated_peak_date": "2025-01-20",
                "recommended_action": "Create content now",
                "content_suggestions": ["suggestion1", "suggestion2"]
            }}
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._call_openai_for_predictions,
                prompt
            )
            
            predictions = self._parse_predictions_response(response, platform)
            return predictions
            
        except Exception as e:
            print(f"Error generating trend predictions: {e}")
            return []
    
    def _create_current_trends_context(self, trends: List[TrendData]) -> str:
        """
        Create context string from current trends
        """
        context_lines = []
        for trend in trends[:10]:  # Top 10 trends
            context_lines.append(f"- {trend.keyword} ({trend.category.value}): Volume {trend.volume}, Growth {trend.growth_rate}%")
        
        return "\n".join(context_lines)
    
    def _call_openai_for_predictions(self, prompt: str) -> str:
        """
        Call OpenAI API for trend predictions
        """
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a trend prediction expert who analyzes social media patterns to forecast future viral content. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI prediction API error: {e}")
            return "[]"
    
    def _parse_predictions_response(self, response: str, platform: Platform) -> List[TrendPrediction]:
        """
        Parse AI predictions response
        """
        try:
            # Extract JSON from response
            json_match = re.search(r'\[.*\]', response, re.DOTALL)
            if not json_match:
                return []
            
            predictions_json = json.loads(json_match.group())
            predictions = []
            
            for item in predictions_json:
                try:
                    prediction = TrendPrediction(
                        keyword=item.get('keyword', ''),
                        platform=platform,
                        likelihood=item.get('likelihood', 0.0),
                        estimated_peak_date=datetime.fromisoformat(item.get('estimated_peak_date', datetime.utcnow().isoformat())),
                        recommended_action=item.get('recommended_action', ''),
                        content_suggestions=item.get('content_suggestions', [])
                    )
                    predictions.append(prediction)
                except Exception as e:
                    print(f"Error parsing prediction item: {e}")
                    continue
            
            return predictions
            
        except Exception as e:
            print(f"Error parsing predictions response: {e}")
            return []
    
    async def _store_trend_predictions(self, predictions: List[TrendPrediction]):
        """
        Store trend predictions in database
        """
        try:
            db = get_database()
            
            for prediction in predictions:
                prediction_doc = {
                    "keyword": prediction.keyword,
                    "platform": prediction.platform.value,
                    "likelihood": prediction.likelihood,
                    "estimated_peak_date": prediction.estimated_peak_date,
                    "recommended_action": prediction.recommended_action,
                    "content_suggestions": prediction.content_suggestions,
                    "created_at": datetime.utcnow()
                }
                
                await db.trend_predictions.insert_one(prediction_doc)
                
        except Exception as e:
            print(f"Error storing trend predictions: {e}")
    
    def _get_cached_trends(self, cache_key: str) -> Optional[List[TrendData]]:
        """
        Get trends from cache if available and not expired
        """
        if cache_key in self.trends_cache:
            cached_data, timestamp = self.trends_cache[cache_key]
            if datetime.utcnow() - timestamp < timedelta(seconds=self.cache_duration):
                return cached_data
        return None
    
    def _cache_trends(self, cache_key: str, trends: List[TrendData]):
        """
        Cache trends data
        """
        self.trends_cache[cache_key] = (trends, datetime.utcnow())
    
    async def _get_fallback_trends(self, platform: Platform, category: Optional[ContentCategory], limit: int) -> List[TrendData]:
        """
        Get fallback trends when main service fails
        """
        try:
            # Generate basic trending topics as fallback
            fallback_keywords = [
                "viral challenge", "trending dance", "life hack", "motivational quote",
                "funny meme", "productivity tip", "healthy recipe", "workout routine",
                "travel destination", "fashion trend", "tech review", "gaming update"
            ]
            
            trends = []
            for i, keyword in enumerate(fallback_keywords[:limit]):
                trend = TrendData(
                    keyword=keyword,
                    platform=platform,
                    volume=70 - i * 2,
                    growth_rate=15.0 - i * 0.5,
                    engagement_score=8.0 - i * 0.2,
                    predicted_duration=5,
                    related_hashtags=[f"#{keyword.replace(' ', '')}", f"#{platform.value}"],
                    sentiment="positive",
                    category=category or ContentCategory.BUSINESS,
                    created_at=datetime.utcnow()
                )
                trends.append(trend)
            
            return trends
            
        except Exception as e:
            print(f"Error getting fallback trends: {e}")
            return []
    
    async def get_trend_analysis(self, keyword: str, platform: Platform) -> Dict[str, Any]:
        """
        Get detailed analysis for a specific trend
        """
        try:
            # Get trend data
            trends = await self.get_trending_topics(platform, limit=100)
            matching_trend = next((t for t in trends if keyword.lower() in t.keyword.lower()), None)
            
            if not matching_trend:
                return {"error": "Trend not found"}
            
            # Generate detailed analysis
            analysis = await self._generate_detailed_trend_analysis(matching_trend)
            
            return {
                "trend": matching_trend.__dict__,
                "analysis": analysis,
                "content_suggestions": await self._generate_content_suggestions(matching_trend),
                "optimal_timing": await self._calculate_optimal_timing(matching_trend)
            }
            
        except Exception as e:
            print(f"Error getting trend analysis: {e}")
            return {"error": str(e)}
    
    async def _generate_detailed_trend_analysis(self, trend: TrendData) -> Dict[str, Any]:
        """
        Generate detailed analysis for a trend
        """
        try:
            prompt = f"""
            Analyze this trending topic in detail:
            
            Keyword: {trend.keyword}
            Platform: {trend.platform.value}
            Volume: {trend.volume}
            Growth Rate: {trend.growth_rate}%
            Engagement Score: {trend.engagement_score}
            Sentiment: {trend.sentiment}
            Category: {trend.category.value}
            
            Provide detailed analysis including:
            - Why this is trending
            - Target audience
            - Content opportunities
            - Potential risks
            - Monetization possibilities
            - Competitor analysis
            
            Return as detailed JSON object.
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._call_openai_for_analysis,
                prompt
            )
            
            try:
                return json.loads(response)
            except:
                return {"analysis": response}
                
        except Exception as e:
            print(f"Error generating detailed analysis: {e}")
            return {}
    
    def _call_openai_for_analysis(self, prompt: str) -> str:
        """
        Call OpenAI API for trend analysis
        """
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a social media trend analyst who provides detailed insights on trending topics. Return detailed analysis in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI analysis API error: {e}")
            return "{}"
    
    async def _generate_content_suggestions(self, trend: TrendData) -> List[str]:
        """
        Generate content suggestions for a trend
        """
        try:
            prompt = f"""
            Generate 5 specific content ideas for the trending topic: "{trend.keyword}" on {trend.platform.value}.
            
            Consider:
            - Platform: {trend.platform.value}
            - Category: {trend.category.value}
            - Sentiment: {trend.sentiment}
            - Engagement Score: {trend.engagement_score}
            
            Return as a simple list of content ideas.
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._call_openai_for_content_suggestions,
                prompt
            )
            
            # Parse suggestions
            suggestions = [line.strip() for line in response.split('\n') if line.strip() and not line.strip().startswith('-')]
            return suggestions[:5]
            
        except Exception as e:
            print(f"Error generating content suggestions: {e}")
            return []
    
    def _call_openai_for_content_suggestions(self, prompt: str) -> str:
        """
        Call OpenAI API for content suggestions
        """
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a content creator who generates specific, actionable content ideas for trending topics."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=800
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI content suggestions API error: {e}")
            return ""
    
    async def _calculate_optimal_timing(self, trend: TrendData) -> Dict[str, Any]:
        """
        Calculate optimal timing for content creation
        """
        try:
            # Calculate based on trend data
            peak_time = datetime.utcnow() + timedelta(days=trend.predicted_duration // 2)
            
            return {
                "best_time_to_post": peak_time.isoformat(),
                "urgency_level": "high" if trend.growth_rate > 20 else "medium" if trend.growth_rate > 10 else "low",
                "recommendation": f"Create content within {trend.predicted_duration // 2} days for maximum impact",
                "predicted_peak": peak_time.strftime("%Y-%m-%d"),
                "estimated_decline": (peak_time + timedelta(days=trend.predicted_duration // 2)).strftime("%Y-%m-%d")
            }
            
        except Exception as e:
            print(f"Error calculating optimal timing: {e}")
            return {}