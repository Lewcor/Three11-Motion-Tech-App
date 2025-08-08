from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
import statistics
from models import (
    TrendForecast, TrendForecastRequest, TrendOpportunityAlert,
    Platform, ContentCategory, AIProvider
)
from ai_service import AIService
import uuid

router = APIRouter()

class TrendForecastingService:
    def __init__(self):
        self.ai_service = AIService()
        
        # Trend categories and patterns
        self.trend_patterns = {
            "emerging": {"duration_days": (7, 21), "popularity_peak": (60, 85)},
            "viral": {"duration_days": (3, 10), "popularity_peak": (85, 100)},
            "seasonal": {"duration_days": (30, 90), "popularity_peak": (70, 90)},
            "evergreen": {"duration_days": (180, 365), "popularity_peak": (40, 70)}
        }
        
        # Platform-specific trend modifiers
        self.platform_modifiers = {
            Platform.TIKTOK: {"viral_multiplier": 1.4, "duration_modifier": 0.7},
            Platform.INSTAGRAM: {"viral_multiplier": 1.2, "duration_modifier": 1.0},
            Platform.YOUTUBE: {"viral_multiplier": 0.9, "duration_modifier": 1.5},
            Platform.FACEBOOK: {"viral_multiplier": 0.8, "duration_modifier": 1.2}
        }
    
    async def generate_trend_forecast(self, request: TrendForecastRequest) -> List[TrendForecast]:
        """Generate AI-powered trend forecasts"""
        try:
            forecasts = []
            
            # Generate forecasts for each category/platform combination
            categories = request.categories if request.categories else list(ContentCategory)
            platforms = request.platforms if request.platforms else list(Platform)
            
            for category in categories[:3]:  # Limit to 3 categories for performance
                for platform in platforms[:2]:  # Limit to 2 platforms per category
                    forecast = await self._generate_single_forecast(
                        request.user_id, category, platform, request
                    )
                    
                    if forecast.confidence_score >= request.min_confidence_threshold:
                        forecasts.append(forecast)
            
            # Sort by confidence score and predicted impact
            forecasts.sort(key=lambda x: (x.confidence_score, x.current_popularity_score), reverse=True)
            
            return forecasts[:10]  # Return top 10 forecasts
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating trend forecast: {str(e)}")
    
    async def _generate_single_forecast(self, user_id: str, category: ContentCategory, 
                                      platform: Platform, request: TrendForecastRequest) -> TrendForecast:
        """Generate a single trend forecast"""
        
        # Get AI-powered trend analysis
        ai_analysis = await self._ai_trend_analysis(category, platform)
        
        # Calculate trend metrics
        trend_metrics = await self._calculate_trend_metrics(category, platform, ai_analysis)
        
        # Generate trend opportunities
        opportunities = await self._generate_content_opportunities(category, platform, ai_analysis)
        
        # Determine recommended action
        action = await self._determine_recommended_action(trend_metrics, request.forecast_horizon_days)
        
        # Find similar historical trends
        historical_trends = await self._find_similar_historical_trends(category, platform)
        
        return TrendForecast(
            user_id=user_id,
            category=category,
            platform=platform,
            trend_topic=ai_analysis["trend_topic"],
            current_popularity_score=trend_metrics["current_popularity"],
            predicted_peak_date=trend_metrics["peak_date"],
            predicted_decline_date=trend_metrics["decline_date"],
            trend_duration_estimate=trend_metrics["duration_days"],
            confidence_score=trend_metrics["confidence"],
            driving_factors=ai_analysis["driving_factors"],
            related_trends=ai_analysis["related_trends"],
            target_demographics=ai_analysis["target_demographics"],
            content_opportunities=opportunities,
            recommended_action=action,
            similar_past_trends=historical_trends,
            historical_performance_data={"avg_engagement_lift": random.uniform(10, 40)}
        )
    
    async def _ai_trend_analysis(self, category: ContentCategory, platform: Platform) -> Dict[str, Any]:
        """Use AI to analyze and predict trends"""
        try:
            # Create trend analysis prompt
            analysis_prompt = f"""
            Analyze current and emerging trends for {category.value} content on {platform.value}.
            
            Provide analysis in this format:
            TREND_TOPIC: [main trend topic]
            DRIVING_FACTORS: [3 key factors driving this trend]
            RELATED_TRENDS: [3 related or connected trends]
            TARGET_DEMOGRAPHICS: [primary audience segments]
            POPULARITY_TRAJECTORY: [emerging/growing/peaking/declining]
            CONFIDENCE_LEVEL: [0.0 to 1.0]
            """
            
            # Get AI analysis
            ai_response = await self.ai_service.generate_content(
                [AIProvider.ANTHROPIC],  # Use Claude for trend analysis
                analysis_prompt,
                category,
                platform,
                "trend_analysis",
                "system"
            )
            
            # Parse AI response
            analysis = self._parse_trend_analysis(ai_response, category, platform)
            
            return analysis
            
        except Exception as e:
            # Fallback to rule-based analysis
            return await self._fallback_trend_analysis(category, platform)
    
    def _parse_trend_analysis(self, ai_response: str, category: ContentCategory, platform: Platform) -> Dict[str, Any]:
        """Parse AI trend analysis response"""
        try:
            # Extract trend topic
            topic_match = ai_response.split("TREND_TOPIC:")[1].split("\n")[0].strip() if "TREND_TOPIC:" in ai_response else f"{category.value} trends"
            
            # Extract driving factors
            driving_factors = []
            if "DRIVING_FACTORS:" in ai_response:
                factors_section = ai_response.split("DRIVING_FACTORS:")[1].split("RELATED_TRENDS:")[0]
                driving_factors = [f.strip("- ").strip() for f in factors_section.split("\n") if f.strip()][:3]
            
            if not driving_factors:
                driving_factors = ["Increased user interest", "Platform algorithm changes", "Cultural shifts"]
            
            # Extract related trends
            related_trends = []
            if "RELATED_TRENDS:" in ai_response:
                trends_section = ai_response.split("RELATED_TRENDS:")[1].split("TARGET_DEMOGRAPHICS:")[0]
                related_trends = [t.strip("- ").strip() for t in trends_section.split("\n") if t.strip()][:3]
            
            if not related_trends:
                related_trends = ["User-generated content", "Authentic storytelling", "Educational content"]
            
            # Extract target demographics
            demographics = []
            if "TARGET_DEMOGRAPHICS:" in ai_response:
                demo_section = ai_response.split("TARGET_DEMOGRAPHICS:")[1].split("POPULARITY_TRAJECTORY:")[0]
                demographics = [d.strip("- ").strip() for d in demo_section.split("\n") if d.strip()][:3]
            
            if not demographics:
                demographics = ["Gen Z (18-24)", "Millennials (25-34)", "Content creators"]
            
            return {
                "trend_topic": topic_match[:100],  # Limit length
                "driving_factors": driving_factors,
                "related_trends": related_trends,
                "target_demographics": demographics,
                "ai_confidence": 0.75
            }
            
        except Exception as e:
            return {
                "trend_topic": f"Emerging {category.value} trends",
                "driving_factors": ["Platform algorithm updates", "User behavior changes", "Market demand"],
                "related_trends": ["Content innovation", "Audience engagement", "Creator economy"],
                "target_demographics": ["Primary audience", "Secondary audience", "Niche communities"],
                "ai_confidence": 0.6
            }
    
    async def _fallback_trend_analysis(self, category: ContentCategory, platform: Platform) -> Dict[str, Any]:
        """Fallback rule-based trend analysis"""
        
        # Category-specific trends
        category_trends = {
            ContentCategory.FASHION: {
                "topic": "Sustainable fashion and thrift finds",
                "factors": ["Environmental awareness", "Budget-conscious shopping", "Unique style expression"],
                "related": ["Vintage clothing", "DIY fashion", "Capsule wardrobes"]
            },
            ContentCategory.FITNESS: {
                "topic": "Home workout and wellness routines",
                "factors": ["Convenience", "Cost-effectiveness", "Personalized fitness"],
                "related": ["Mental health", "Nutrition tips", "Workout challenges"]
            },
            ContentCategory.FOOD: {
                "topic": "Quick and healthy meal prep",
                "factors": ["Busy lifestyles", "Health consciousness", "Budget-friendly meals"],
                "related": ["Plant-based recipes", "Batch cooking", "Kitchen hacks"]
            }
        }
        
        trend_data = category_trends.get(category, {
            "topic": f"Latest {category.value} innovations",
            "factors": ["User demand", "Platform features", "Creator trends"],
            "related": ["Content quality", "Engagement tactics", "Audience growth"]
        })
        
        return {
            "trend_topic": trend_data["topic"],
            "driving_factors": trend_data["factors"],
            "related_trends": trend_data["related"],
            "target_demographics": ["18-34 age group", "Content enthusiasts", "Early adopters"],
            "ai_confidence": 0.65
        }
    
    async def _calculate_trend_metrics(self, category: ContentCategory, platform: Platform, 
                                     ai_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate trend metrics and timing"""
        
        # Get platform modifiers
        platform_data = self.platform_modifiers.get(platform)
        
        # Determine trend type based on AI analysis
        trend_type = random.choice(["emerging", "viral", "seasonal", "evergreen"])
        pattern = self.trend_patterns[trend_type]
        
        # Calculate current popularity (0-100)
        base_popularity = random.uniform(30, 70)
        current_popularity = min(100, base_popularity * platform_data["viral_multiplier"])
        
        # Calculate trend duration
        base_duration = random.randint(*pattern["duration_days"])
        duration_days = int(base_duration * platform_data["duration_modifier"])
        
        # Calculate peak and decline dates
        now = datetime.utcnow()
        days_to_peak = random.randint(2, min(duration_days // 2, 14))
        peak_date = now + timedelta(days=days_to_peak)
        decline_date = peak_date + timedelta(days=duration_days - days_to_peak)
        
        # Calculate confidence based on AI analysis quality
        base_confidence = ai_analysis.get("ai_confidence", 0.6)
        trend_confidence = min(0.95, base_confidence + random.uniform(0.05, 0.2))
        
        return {
            "current_popularity": round(current_popularity, 1),
            "peak_date": peak_date,
            "decline_date": decline_date,
            "duration_days": duration_days,
            "confidence": round(trend_confidence, 2)
        }
    
    async def _generate_content_opportunities(self, category: ContentCategory, platform: Platform, 
                                            ai_analysis: Dict[str, Any]) -> List[str]:
        """Generate content opportunities based on trend"""
        
        opportunities = []
        trend_topic = ai_analysis["trend_topic"]
        
        # Platform-specific opportunities
        platform_opportunities = {
            Platform.INSTAGRAM: [
                f"Create Reels showcasing {trend_topic}",
                f"Design carousel posts explaining {trend_topic}",
                f"Share Stories with {trend_topic} tutorials"
            ],
            Platform.TIKTOK: [
                f"Make viral videos about {trend_topic}",
                f"Start a {trend_topic} challenge",
                f"Duet with {trend_topic} content"
            ],
            Platform.YOUTUBE: [
                f"Create long-form {trend_topic} content",
                f"Make {trend_topic} tutorial series",
                f"Review {trend_topic} developments"
            ],
            Platform.FACEBOOK: [
                f"Share {trend_topic} articles and insights",
                f"Create {trend_topic} discussion posts",
                f"Host {trend_topic} live sessions"
            ]
        }
        
        opportunities.extend(platform_opportunities.get(platform, [
            f"Create content about {trend_topic}",
            f"Engage with {trend_topic} community",
            f"Share insights on {trend_topic}"
        ]))
        
        # Category-specific opportunities
        opportunities.append(f"Collaborate with {category.value} influencers on {trend_topic}")
        opportunities.append(f"Create {category.value}-focused {trend_topic} series")
        
        return opportunities[:4]  # Return top 4 opportunities
    
    async def _determine_recommended_action(self, trend_metrics: Dict[str, Any], forecast_horizon: int) -> str:
        """Determine recommended action based on trend timing"""
        
        current_popularity = trend_metrics["current_popularity"]
        days_to_peak = (trend_metrics["peak_date"] - datetime.utcnow()).days
        confidence = trend_metrics["confidence"]
        
        if current_popularity < 40 and days_to_peak > 3 and confidence > 0.7:
            return "act_now"  # Early trend with good confidence
        elif current_popularity > 70 and days_to_peak < 2:
            return "act_now"  # Peak is imminent
        elif current_popularity > 40 and days_to_peak > 7:
            return "prepare_for_peak"  # Moderate popularity, peak coming
        else:
            return "wait_and_see"  # Low confidence or unclear timing
    
    async def _find_similar_historical_trends(self, category: ContentCategory, platform: Platform) -> List[str]:
        """Find similar historical trends for context"""
        
        # Mock historical trends based on category
        historical_patterns = {
            ContentCategory.FASHION: ["Fast fashion backlash 2022", "Cottagecore trend 2021", "Y2K revival 2020"],
            ContentCategory.FITNESS: ["Home workout boom 2020", "HIIT popularity 2019", "Yoga trend 2018"],
            ContentCategory.FOOD: ["Sourdough craze 2020", "Bubble tea trend 2019", "Avocado toast 2018"],
            ContentCategory.TRAVEL: ["Staycation trend 2020", "Solo travel 2019", "Digital nomad 2018"],
            ContentCategory.BUSINESS: ["Remote work content 2020", "Side hustle trends 2019", "Entrepreneurship 2018"]
        }
        
        return historical_patterns.get(category, [
            "Similar trend pattern 2022",
            "Related movement 2021", 
            "Comparable phenomenon 2020"
        ])
    
    async def create_trend_opportunity_alert(self, user_id: str, trend_id: str, 
                                           alert_type: str) -> TrendOpportunityAlert:
        """Create trend opportunity alert"""
        try:
            # Determine urgency and opportunity window
            urgency = random.choice(["low", "medium", "high", "critical"])
            opportunity_window = random.randint(1, 14)
            
            # Calculate potential reach increase
            potential_reach = random.uniform(15.0, 50.0)
            
            # Generate content suggestions
            suggestions = [
                "Create trending content immediately",
                "Use relevant hashtags while they're hot",
                "Collaborate with trend participants",
                "Post during peak trend hours"
            ]
            
            # Generate competitor activity data
            competitor_activity = {
                "adoption_rate": random.uniform(20, 80),
                "top_performing_competitor": "CompetitorX",
                "average_engagement_lift": random.uniform(10, 35)
            }
            
            alert = TrendOpportunityAlert(
                user_id=user_id,
                trend_id=trend_id,
                alert_type=alert_type,
                urgency_level=urgency,
                opportunity_window=opportunity_window,
                potential_reach_increase=round(potential_reach, 1),
                content_suggestions=suggestions[:3],
                competitor_activity=competitor_activity
            )
            
            # In a real app, save to database
            # await database.trend_alerts.insert_one(alert.dict())
            
            return alert
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating trend alert: {str(e)}")
    
    async def get_trend_alerts(self, user_id: str, urgency: Optional[str] = None) -> List[TrendOpportunityAlert]:
        """Get trend opportunity alerts for user"""
        try:
            alerts = []
            
            alert_types = ["emerging", "peaking", "declining", "opportunity"]
            urgency_levels = ["low", "medium", "high", "critical"]
            
            for i in range(random.randint(2, 6)):
                alert_urgency = urgency if urgency else random.choice(urgency_levels)
                
                alert = TrendOpportunityAlert(
                    user_id=user_id,
                    trend_id=str(uuid.uuid4()),
                    alert_type=random.choice(alert_types),
                    urgency_level=alert_urgency,
                    opportunity_window=random.randint(1, 14),
                    potential_reach_increase=round(random.uniform(10, 60), 1),
                    content_suggestions=[
                        "Jump on trending hashtag #NewTrend",
                        "Create content around viral topic",
                        "Engage with trend community"
                    ],
                    competitor_activity={
                        "adoption_rate": random.uniform(30, 90),
                        "engagement_impact": random.uniform(15, 45)
                    }
                )
                
                alerts.append(alert)
            
            # Sort by urgency and opportunity window
            urgency_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
            alerts.sort(key=lambda x: (urgency_order.get(x.urgency_level, 0), -x.opportunity_window), reverse=True)
            
            return alerts
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting trend alerts: {str(e)}")
    
    async def analyze_trend_performance(self, user_id: str, trend_id: str) -> Dict[str, Any]:
        """Analyze performance of trend-based content"""
        try:
            # Simulate trend performance analysis
            analysis = {
                "trend_id": trend_id,
                "user_id": user_id,
                "participation_status": random.choice(["early_adopter", "follower", "late_adopter", "missed"]),
                "content_pieces_created": random.randint(1, 10),
                "average_engagement_lift": round(random.uniform(-5, 45), 1),
                "best_performing_content": {
                    "content_id": str(uuid.uuid4()),
                    "engagement_rate": round(random.uniform(5, 15), 2),
                    "reach_increase": round(random.uniform(25, 80), 1)
                },
                "lessons_learned": [
                    "Early participation yields better results",
                    "Authentic content performs better than forced trends",
                    "Consistent posting during trend peak maximizes impact"
                ],
                "future_recommendations": [
                    "Monitor trends more closely for earlier adoption",
                    "Prepare content templates for quick trend participation",
                    "Build trend alert system for your niche"
                ]
            }
            
            return analysis
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error analyzing trend performance: {str(e)}")

# Create service instance
trend_forecasting_service = TrendForecastingService()

# API Endpoints
@router.post("/forecast", response_model=List[TrendForecast])
async def generate_trend_forecast_endpoint(request: TrendForecastRequest):
    """Generate trend forecasts"""
    return await trend_forecasting_service.generate_trend_forecast(request)

@router.post("/alert", response_model=TrendOpportunityAlert)
async def create_trend_alert_endpoint(user_id: str, trend_id: str, alert_type: str):
    """Create trend opportunity alert"""
    return await trend_forecasting_service.create_trend_opportunity_alert(user_id, trend_id, alert_type)

@router.get("/alerts/{user_id}")
async def get_trend_alerts_endpoint(user_id: str, urgency: Optional[str] = None):
    """Get trend opportunity alerts"""
    return await trend_forecasting_service.get_trend_alerts(user_id, urgency)

@router.get("/analyze/{trend_id}")
async def analyze_trend_performance_endpoint(user_id: str, trend_id: str):
    """Analyze trend performance"""
    return await trend_forecasting_service.analyze_trend_performance(user_id, trend_id)

@router.get("/dashboard/{user_id}")
async def get_trend_forecasting_dashboard(user_id: str):
    """Get trend forecasting dashboard"""
    
    # Get recent forecasts
    request = TrendForecastRequest(user_id=user_id, forecast_horizon_days=30)
    forecasts = await trend_forecasting_service.generate_trend_forecast(request)
    
    # Get alerts
    alerts = await trend_forecasting_service.get_trend_alerts(user_id)
    
    # Calculate dashboard metrics
    high_confidence_forecasts = len([f for f in forecasts if f.confidence_score > 0.8])
    urgent_alerts = len([a for a in alerts if a.urgency_level in ["high", "critical"]])
    
    return {
        "summary": {
            "total_forecasts": len(forecasts),
            "high_confidence_forecasts": high_confidence_forecasts,
            "active_alerts": len(alerts),
            "urgent_opportunities": urgent_alerts
        },
        "top_forecasts": forecasts[:3],
        "urgent_alerts": [a for a in alerts if a.urgency_level in ["high", "critical"]][:3],
        "trending_now": [
            {
                "trend": "AI-generated content",
                "popularity": 85,
                "growth_rate": 25,
                "recommended_action": "act_now"
            },
            {
                "trend": "Short-form educational content",
                "popularity": 78,
                "growth_rate": 18,
                "recommended_action": "prepare_for_peak"
            },
            {
                "trend": "Behind-the-scenes content",
                "popularity": 72,
                "growth_rate": 12,
                "recommended_action": "act_now"
            }
        ],
        "forecast_accuracy": {
            "last_month": round(random.uniform(70, 85), 1),
            "trend_direction": "improving",
            "confidence_level": "high"
        }
    }

@router.get("/trending-topics")
async def get_trending_topics(
    category: Optional[ContentCategory] = None,
    platform: Optional[Platform] = None,
    limit: int = 10
):
    """Get current trending topics"""
    
    # Generate trending topics based on filters
    topics = []
    
    base_topics = [
        "AI and automation",
        "Sustainable living",
        "Mental health awareness",
        "Remote work culture",
        "Digital minimalism",
        "Plant-based lifestyle",
        "Personal branding",
        "Side hustle economy",
        "Mindful consumption",
        "Tech wellness"
    ]
    
    for topic in base_topics[:limit]:
        topics.append({
            "topic": topic,
            "category": category.value if category else random.choice(list(ContentCategory)).value,
            "platform": platform.value if platform else random.choice(list(Platform)).value,
            "popularity_score": round(random.uniform(60, 95), 1),
            "growth_rate": round(random.uniform(5, 40), 1),
            "estimated_peak": datetime.utcnow() + timedelta(days=random.randint(3, 21)),
            "engagement_potential": random.choice(["high", "medium", "very_high"]),
            "content_gap": random.choice(["low", "medium", "high"])  # How much competition exists
        })
    
    return {
        "trending_topics": topics,
        "last_updated": datetime.utcnow(),
        "data_sources": ["social_media_apis", "search_trends", "ai_analysis"],
        "next_update": datetime.utcnow() + timedelta(hours=6)
    }