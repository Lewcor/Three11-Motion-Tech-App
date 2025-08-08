from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
import statistics
from models import (
    ContentPerformanceMetrics, PerformanceTrackingRequest, PerformanceAnalysisResult,
    Platform, ContentCategory, IntelligenceInsight
)
from ai_service import AIService
import uuid

router = APIRouter()

class PerformanceTrackingService:
    def __init__(self):
        self.ai_service = AIService()
    
    async def track_content_performance(self, user_id: str, content_id: str, platform: Platform, 
                                       category: ContentCategory, metrics_data: Dict[str, Any]) -> ContentPerformanceMetrics:
        """Track performance metrics for a piece of content"""
        try:
            performance = ContentPerformanceMetrics(
                user_id=user_id,
                content_id=content_id,
                platform=platform,
                category=category,
                **metrics_data
            )
            
            # In a real app, save to database
            # await database.performance_metrics.insert_one(performance.dict())
            
            return performance
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error tracking performance: {str(e)}")
    
    async def get_performance_analysis(self, request: PerformanceTrackingRequest) -> PerformanceAnalysisResult:
        """Generate comprehensive performance analysis"""
        try:
            # Simulate fetching user's content performance data
            mock_performance_data = await self._generate_mock_performance_data(
                request.user_id, request.platform, request.category, request.date_range
            )
            
            # Generate AI-powered insights
            insights = await self._generate_performance_insights(mock_performance_data, request)
            
            return PerformanceAnalysisResult(
                user_id=request.user_id,
                analysis_period=request.date_range,
                total_content_pieces=mock_performance_data["total_pieces"],
                avg_engagement_rate=mock_performance_data["avg_engagement"],
                best_performing_content=mock_performance_data["best_content"],
                worst_performing_content=mock_performance_data["worst_content"],
                platform_performance=mock_performance_data["platform_breakdown"],
                category_performance=mock_performance_data["category_breakdown"],
                growth_insights=insights["growth_insights"],
                optimization_recommendations=insights["recommendations"],
                predicted_trends=insights["predicted_trends"]
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating performance analysis: {str(e)}")
    
    async def get_real_time_metrics(self, user_id: str, content_id: str) -> Dict[str, Any]:
        """Get real-time performance metrics for specific content"""
        try:
            # Simulate real-time data fetching
            current_time = datetime.utcnow()
            
            # Mock real-time metrics
            metrics = {
                "content_id": content_id,
                "current_metrics": {
                    "views": random.randint(100, 10000),
                    "likes": random.randint(10, 1000),
                    "shares": random.randint(1, 100),
                    "comments": random.randint(0, 50),
                    "engagement_rate": round(random.uniform(1.5, 8.5), 2)
                },
                "hourly_growth": {
                    "views_per_hour": random.randint(5, 200),
                    "engagement_per_hour": round(random.uniform(0.1, 2.0), 2)
                },
                "performance_status": random.choice(["excellent", "good", "average", "below_average"]),
                "last_updated": current_time,
                "next_update": current_time + timedelta(minutes=15)
            }
            
            return metrics
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching real-time metrics: {str(e)}")
    
    async def generate_performance_insights(self, user_id: str, metrics_data: List[Dict[str, Any]]) -> List[IntelligenceInsight]:
        """Generate AI-powered performance insights"""
        try:
            insights = []
            
            # Analyze engagement patterns
            engagement_rates = [m.get("engagement_rate", 0) for m in metrics_data if m.get("engagement_rate")]
            if engagement_rates:
                avg_engagement = statistics.mean(engagement_rates)
                
                if avg_engagement < 2.0:
                    insights.append(IntelligenceInsight(
                        user_id=user_id,
                        insight_type="performance",
                        title="Low Engagement Alert",
                        description=f"Your average engagement rate ({avg_engagement:.1f}%) is below the recommended 3-5% range.",
                        impact_level="high",
                        action_required=True,
                        data_points={"avg_engagement": avg_engagement, "target_range": "3-5%"},
                        recommendations=[
                            "Experiment with different posting times",
                            "Use more engaging hooks in your captions",
                            "Incorporate trending hashtags",
                            "Try video content format"
                        ]
                    ))
                elif avg_engagement > 6.0:
                    insights.append(IntelligenceInsight(
                        user_id=user_id,
                        insight_type="performance",
                        title="Excellent Engagement Performance",
                        description=f"Your engagement rate ({avg_engagement:.1f}%) is well above average. Keep up the great work!",
                        impact_level="medium",
                        action_required=False,
                        data_points={"avg_engagement": avg_engagement, "industry_avg": "3.2%"},
                        recommendations=[
                            "Document your successful content patterns",
                            "Scale successful content formats",
                            "Consider increasing posting frequency"
                        ]
                    ))
            
            # Platform-specific insights
            platform_performance = {}
            for metric in metrics_data:
                platform = metric.get("platform")
                if platform:
                    if platform not in platform_performance:
                        platform_performance[platform] = []
                    platform_performance[platform].append(metric.get("engagement_rate", 0))
            
            for platform, rates in platform_performance.items():
                if rates:
                    avg_rate = statistics.mean(rates)
                    
                    # Platform-specific benchmarks
                    benchmarks = {
                        "instagram": 4.2,
                        "tiktok": 6.8,
                        "youtube": 3.1,
                        "facebook": 2.3
                    }
                    
                    benchmark = benchmarks.get(platform.lower(), 3.5)
                    
                    if avg_rate < benchmark * 0.7:  # 30% below benchmark
                        insights.append(IntelligenceInsight(
                            user_id=user_id,
                            insight_type="platform",
                            title=f"{platform.title()} Performance Below Benchmark",
                            description=f"Your {platform} content ({avg_rate:.1f}%) is underperforming compared to platform average ({benchmark}%).",
                            impact_level="medium",
                            action_required=True,
                            data_points={"platform": platform, "your_rate": avg_rate, "benchmark": benchmark},
                            recommendations=self._get_platform_specific_recommendations(platform)
                        ))
            
            return insights
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")
    
    async def _generate_mock_performance_data(self, user_id: str, platform: Optional[Platform], 
                                            category: Optional[ContentCategory], date_range: str) -> Dict[str, Any]:
        """Generate realistic mock performance data"""
        
        # Determine number of content pieces based on date range
        content_counts = {
            "7_days": random.randint(5, 15),
            "30_days": random.randint(20, 50),
            "90_days": random.randint(60, 150), 
            "1_year": random.randint(250, 500)
        }
        
        total_pieces = content_counts.get(date_range, 30)
        
        # Generate mock content performance
        best_content = []
        worst_content = []
        all_engagement_rates = []
        
        for i in range(min(5, total_pieces)):
            # Best performing content
            engagement_rate = round(random.uniform(6.0, 15.0), 2)
            all_engagement_rates.append(engagement_rate)
            best_content.append({
                "content_id": str(uuid.uuid4()),
                "title": f"High-performing {category.value if category else 'content'} post #{i+1}",
                "engagement_rate": engagement_rate,
                "views": random.randint(5000, 50000),
                "likes": random.randint(300, 5000),
                "platform": platform.value if platform else random.choice(["instagram", "tiktok"])
            })
            
            # Worst performing content
            engagement_rate = round(random.uniform(0.5, 2.5), 2)
            all_engagement_rates.append(engagement_rate)
            worst_content.append({
                "content_id": str(uuid.uuid4()),
                "title": f"Low-performing {category.value if category else 'content'} post #{i+1}",
                "engagement_rate": engagement_rate,
                "views": random.randint(50, 500),
                "likes": random.randint(2, 50),
                "platform": platform.value if platform else random.choice(["instagram", "tiktok"])
            })
        
        # Add more engagement rates for realistic average
        for _ in range(total_pieces - 10):
            all_engagement_rates.append(round(random.uniform(2.0, 6.0), 2))
        
        avg_engagement = round(statistics.mean(all_engagement_rates), 2)
        
        # Platform breakdown
        platforms = ["instagram", "tiktok", "youtube", "facebook"]
        platform_performance = {}
        for p in platforms:
            platform_performance[p] = {
                "avg_engagement_rate": round(random.uniform(2.0, 7.0), 2),
                "total_posts": random.randint(5, total_pieces // 2),
                "total_views": random.randint(1000, 100000)
            }
        
        # Category breakdown
        categories = ["fashion", "fitness", "food", "travel", "business"]
        category_performance = {}
        for c in categories:
            category_performance[c] = {
                "avg_engagement_rate": round(random.uniform(1.5, 8.0), 2),
                "total_posts": random.randint(3, total_pieces // 3),
                "best_performing_metric": random.choice(["likes", "shares", "comments"])
            }
        
        return {
            "total_pieces": total_pieces,
            "avg_engagement": avg_engagement,
            "best_content": best_content,
            "worst_content": worst_content,
            "platform_breakdown": platform_performance,
            "category_breakdown": category_performance
        }
    
    async def _generate_performance_insights(self, performance_data: Dict[str, Any], 
                                           request: PerformanceTrackingRequest) -> Dict[str, List[str]]:
        """Generate AI-powered insights from performance data"""
        
        avg_engagement = performance_data["avg_engagement"]
        total_pieces = performance_data["total_pieces"]
        
        # Growth insights
        growth_insights = []
        if avg_engagement < 3.0:
            growth_insights.extend([
                "Your engagement rate is below industry average (3-5%)",
                "Consider experimenting with different content formats",
                "Peak posting times analysis shows room for improvement"
            ])
        else:
            growth_insights.extend([
                f"Strong engagement rate of {avg_engagement}% indicates good audience connection",
                "Consistent posting frequency showing positive impact",
                "Content quality metrics trending upward"
            ])
        
        # Optimization recommendations
        recommendations = [
            "Use A/B testing to optimize caption styles",
            "Incorporate more video content (higher engagement)",
            "Post during peak audience activity hours",
            "Engage with comments within first 2 hours of posting",
            "Use trending hashtags relevant to your niche"
        ]
        
        # Predicted trends
        predicted_trends = [
            "Video content will continue outperforming static posts",
            "Authentic, behind-the-scenes content gaining popularity",
            "Interactive content (polls, Q&A) showing increased engagement",
            "Cross-platform consistency becoming more important"
        ]
        
        return {
            "growth_insights": growth_insights,
            "recommendations": recommendations[:3],  # Top 3 recommendations
            "predicted_trends": predicted_trends[:2]  # Top 2 trends
        }
    
    def _get_platform_specific_recommendations(self, platform: str) -> List[str]:
        """Get platform-specific optimization recommendations"""
        recommendations = {
            "instagram": [
                "Use Instagram Reels for higher reach",
                "Post Stories consistently to maintain visibility",
                "Optimize hashtags (mix of popular and niche)",
                "Use carousel posts for higher engagement"
            ],
            "tiktok": [
                "Jump on trending sounds and hashtags quickly",
                "Create hook-heavy content in first 3 seconds",
                "Post 1-3 times daily for algorithm favor",
                "Engage with comments to boost video performance"
            ],
            "youtube": [
                "Optimize thumbnails for higher click-through rates",
                "Create compelling titles with target keywords",
                "Use end screens and cards for better retention",
                "Post consistently on same days/times"
            ],
            "facebook": [
                "Share content in relevant Facebook groups",
                "Use Facebook Live for higher organic reach",
                "Create shareable, value-driven content",
                "Respond quickly to comments and messages"
            ]
        }
        
        return recommendations.get(platform.lower(), [
            "Research platform-specific best practices",
            "Study top performers in your niche",
            "Test different content types and formats"
        ])

# Create service instance
performance_service = PerformanceTrackingService()

# API Endpoints
@router.post("/track-performance")
async def track_performance_endpoint(
    user_id: str,
    content_id: str,
    platform: Platform,
    category: ContentCategory,
    metrics_data: Dict[str, Any]
):
    """Track performance metrics for content"""
    return await performance_service.track_content_performance(
        user_id, content_id, platform, category, metrics_data
    )

@router.post("/analyze", response_model=PerformanceAnalysisResult)
async def get_performance_analysis(request: PerformanceTrackingRequest):
    """Get comprehensive performance analysis"""
    return await performance_service.get_performance_analysis(request)

@router.get("/real-time/{content_id}")
async def get_real_time_metrics(user_id: str, content_id: str):
    """Get real-time performance metrics"""
    return await performance_service.get_real_time_metrics(user_id, content_id)

@router.get("/insights/{user_id}")
async def get_performance_insights(user_id: str):
    """Get AI-powered performance insights"""
    # Mock metrics data for insight generation
    mock_metrics = [
        {"engagement_rate": 3.2, "platform": "instagram", "category": "fitness"},
        {"engagement_rate": 5.8, "platform": "tiktok", "category": "fashion"},
        {"engagement_rate": 1.9, "platform": "facebook", "category": "business"}
    ]
    return await performance_service.generate_performance_insights(user_id, mock_metrics)

@router.get("/dashboard/{user_id}")
async def get_performance_dashboard(user_id: str, date_range: str = "30_days"):
    """Get comprehensive performance dashboard data"""
    request = PerformanceTrackingRequest(user_id=user_id, date_range=date_range)
    analysis = await performance_service.get_performance_analysis(request)
    insights = await performance_service.generate_performance_insights(user_id, [])
    
    return {
        "performance_analysis": analysis,
        "key_insights": insights[:3],  # Top 3 insights
        "real_time_summary": {
            "active_content_pieces": random.randint(10, 50),
            "total_views_today": random.randint(1000, 10000),
            "trending_content_count": random.randint(1, 5)
        }
    }