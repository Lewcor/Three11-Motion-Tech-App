from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
from models import (
    CompetitorMonitoringAlert, CompetitorInsightUpdate, CompetitorBenchmark,
    Platform, ContentCategory, AIProvider
)
from ai_service import AIService
import uuid

router = APIRouter()

class CompetitorMonitoringService:
    def __init__(self):
        self.ai_service = AIService()
    
    async def create_monitoring_alert(self, user_id: str, competitor_id: str, 
                                    alert_type: str, content_data: Dict[str, Any]) -> CompetitorMonitoringAlert:
        """Create a new competitor monitoring alert"""
        try:
            # Analyze performance metrics
            performance_metrics = await self._analyze_competitor_performance(content_data)
            
            # Determine alert priority
            priority = await self._determine_alert_priority(alert_type, performance_metrics)
            
            # Generate action recommendations
            recommendations = await self._generate_action_recommendations(alert_type, content_data, performance_metrics)
            
            alert = CompetitorMonitoringAlert(
                user_id=user_id,
                competitor_id=competitor_id,
                alert_type=alert_type,
                content_data=content_data,
                performance_metrics=performance_metrics,
                alert_priority=priority,
                action_recommendations=recommendations
            )
            
            # In a real app, save to database
            # await database.competitor_alerts.insert_one(alert.dict())
            
            return alert
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating monitoring alert: {str(e)}")
    
    async def get_competitor_alerts(self, user_id: str, priority: Optional[str] = None, 
                                  limit: int = 10) -> List[CompetitorMonitoringAlert]:
        """Get competitor monitoring alerts for user"""
        try:
            # Generate mock alerts
            alerts = []
            
            alert_types = ["new_content", "viral_content", "strategy_change", "trend_adoption"]
            priorities = ["low", "medium", "high", "critical"]
            
            for i in range(min(limit, random.randint(3, 8))):
                alert_type = random.choice(alert_types)
                alert_priority = priority if priority else random.choice(priorities)
                
                # Generate mock content data based on alert type
                content_data = await self._generate_mock_content_data(alert_type)
                performance_metrics = await self._generate_mock_performance_metrics(alert_type)
                recommendations = await self._generate_action_recommendations(alert_type, content_data, performance_metrics)
                
                alert = CompetitorMonitoringAlert(
                    user_id=user_id,
                    competitor_id=str(uuid.uuid4()),
                    alert_type=alert_type,
                    content_data=content_data,
                    performance_metrics=performance_metrics,
                    alert_priority=alert_priority,
                    action_recommendations=recommendations,
                    is_read=random.choice([True, False])
                )
                
                alerts.append(alert)
            
            # Sort by priority and creation date
            priority_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
            alerts.sort(key=lambda x: (priority_order.get(x.alert_priority, 0), x.created_at), reverse=True)
            
            return alerts
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting competitor alerts: {str(e)}")
    
    async def create_insight_update(self, competitor_id: str, user_id: str, 
                                  insight_type: str, previous_data: Dict[str, Any], 
                                  current_data: Dict[str, Any]) -> CompetitorInsightUpdate:
        """Create competitor insight update"""
        try:
            # Calculate change percentage
            change_percentage = await self._calculate_change_percentage(previous_data, current_data, insight_type)
            
            # Assess impact
            impact_assessment = await self._assess_impact(change_percentage, insight_type)
            
            # Generate strategic implications
            implications = await self._generate_strategic_implications(insight_type, change_percentage, current_data)
            
            update = CompetitorInsightUpdate(
                competitor_id=competitor_id,
                user_id=user_id,
                insight_type=insight_type,
                previous_data=previous_data,
                current_data=current_data,
                change_percentage=change_percentage,
                impact_assessment=impact_assessment,
                strategic_implications=implications
            )
            
            # In a real app, save to database
            # await database.competitor_insights.insert_one(update.dict())
            
            return update
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating insight update: {str(e)}")
    
    async def generate_competitor_benchmark(self, user_id: str, category: ContentCategory, 
                                          platform: Platform) -> CompetitorBenchmark:
        """Generate competitor benchmark analysis"""
        try:
            # Simulate industry data
            industry_avg_engagement = random.uniform(2.5, 4.5)
            top_performer_engagement = random.uniform(6.0, 12.0)
            user_current_performance = random.uniform(1.5, 8.0)
            
            # Calculate percentile ranking
            performance_percentile = min(95, max(5, 
                ((user_current_performance - 1.0) / (top_performer_engagement - 1.0)) * 100
            ))
            
            # Calculate gaps
            gap_to_average = industry_avg_engagement - user_current_performance
            gap_to_top_performer = top_performer_engagement - user_current_performance
            improvement_potential = max(0, gap_to_top_performer / user_current_performance * 100) if user_current_performance > 0 else 0
            
            # Generate recommendations
            quick_wins = await self._generate_quick_wins(user_current_performance, industry_avg_engagement, platform)
            long_term_strategies = await self._generate_long_term_strategies(category, platform)
            competitor_tactics = await self._generate_competitor_tactics(category, platform)
            
            benchmark = CompetitorBenchmark(
                user_id=user_id,
                category=category,
                platform=platform,
                industry_avg_engagement=round(industry_avg_engagement, 2),
                top_performer_engagement=round(top_performer_engagement, 2),
                user_current_performance=round(user_current_performance, 2),
                performance_percentile=round(performance_percentile, 1),
                gap_to_average=round(gap_to_average, 2),
                gap_to_top_performer=round(gap_to_top_performer, 2),
                improvement_potential=round(improvement_potential, 1),
                quick_wins=quick_wins,
                long_term_strategies=long_term_strategies,
                competitor_tactics_to_adopt=competitor_tactics
            )
            
            return benchmark
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating benchmark: {str(e)}")
    
    async def monitor_competitor_trends(self, user_id: str, competitor_ids: List[str]) -> Dict[str, Any]:
        """Monitor trends across competitors"""
        try:
            trend_analysis = {
                "trending_topics": [],
                "content_formats": {},
                "posting_patterns": {},
                "engagement_trends": {},
                "emerging_strategies": [],
                "analysis_timestamp": datetime.utcnow()
            }
            
            # Simulate trending topics analysis
            trending_topics = [
                {"topic": "Sustainable Fashion", "adoption_rate": 78, "engagement_lift": 25},
                {"topic": "Behind-the-Scenes", "adoption_rate": 65, "engagement_lift": 18},
                {"topic": "User-Generated Content", "adoption_rate": 82, "engagement_lift": 32},
                {"topic": "Educational Content", "adoption_rate": 71, "engagement_lift": 15}
            ]
            trend_analysis["trending_topics"] = random.sample(trending_topics, 3)
            
            # Content format analysis
            trend_analysis["content_formats"] = {
                "reels": {"popularity": 85, "growth": 12},
                "carousels": {"popularity": 68, "growth": 8},
                "stories": {"popularity": 92, "growth": 5},
                "live_videos": {"popularity": 34, "growth": 22}
            }
            
            # Posting pattern analysis
            trend_analysis["posting_patterns"] = {
                "optimal_times": ["9:00 AM", "1:00 PM", "7:00 PM"],
                "frequency_trend": "Daily posting increasing",
                "consistency_score": 78
            }
            
            # Engagement trends
            trend_analysis["engagement_trends"] = {
                "average_growth": 15.2,
                "top_performing_content_type": "educational_carousel",
                "declining_formats": ["static_posts"]
            }
            
            # Emerging strategies
            trend_analysis["emerging_strategies"] = [
                "Cross-platform content repurposing",
                "Micro-influencer collaborations",
                "Interactive content (polls, Q&A)",
                "Authentic storytelling approach"
            ]
            
            return trend_analysis
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error monitoring competitor trends: {str(e)}")
    
    async def get_competitive_intelligence_report(self, user_id: str, category: ContentCategory, 
                                                platform: Platform) -> Dict[str, Any]:
        """Generate comprehensive competitive intelligence report"""
        try:
            # Get benchmark data
            benchmark = await self.generate_competitor_benchmark(user_id, category, platform)
            
            # Get recent alerts
            alerts = await self.get_competitor_alerts(user_id, limit=5)
            
            # Get trend analysis
            competitor_ids = [str(uuid.uuid4()) for _ in range(3)]  # Mock competitor IDs
            trends = await self.monitor_competitor_trends(user_id, competitor_ids)
            
            # Generate key insights
            key_insights = await self._generate_key_insights(benchmark, alerts, trends)
            
            # Create action plan
            action_plan = await self._create_action_plan(benchmark, trends)
            
            report = {
                "report_id": str(uuid.uuid4()),
                "user_id": user_id,
                "category": category.value,
                "platform": platform.value,
                "generated_at": datetime.utcnow(),
                "benchmark_analysis": benchmark,
                "recent_alerts": alerts[:3],  # Top 3 alerts
                "trend_analysis": trends,
                "key_insights": key_insights,
                "action_plan": action_plan,
                "competitive_score": random.randint(65, 85),  # Overall competitive position score
                "next_review_date": datetime.utcnow() + timedelta(days=7)
            }
            
            return report
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating intelligence report: {str(e)}")
    
    # Helper methods
    async def _analyze_competitor_performance(self, content_data: Dict[str, Any]) -> Dict[str, float]:
        """Analyze competitor content performance"""
        return {
            "engagement_rate": random.uniform(3.0, 12.0),
            "reach_rate": random.uniform(15.0, 45.0),
            "virality_score": random.uniform(1.0, 10.0),
            "growth_velocity": random.uniform(-5.0, 25.0)
        }
    
    async def _determine_alert_priority(self, alert_type: str, performance_metrics: Dict[str, float]) -> str:
        """Determine alert priority based on type and performance"""
        if alert_type == "viral_content" and performance_metrics.get("virality_score", 0) > 8:
            return "critical"
        elif alert_type == "strategy_change":
            return "high"
        elif performance_metrics.get("engagement_rate", 0) > 10:
            return "high"
        elif performance_metrics.get("growth_velocity", 0) > 20:
            return "medium"
        else:
            return "low"
    
    async def _generate_action_recommendations(self, alert_type: str, content_data: Dict[str, Any], 
                                             performance_metrics: Dict[str, float]) -> List[str]:
        """Generate action recommendations based on alert"""
        recommendations = []
        
        if alert_type == "viral_content":
            recommendations.extend([
                "Analyze viral content elements for replication",
                "Create similar content quickly while trend is hot",
                "Study audience engagement patterns",
                "Consider paid promotion for similar content"
            ])
        elif alert_type == "new_content":
            recommendations.extend([
                "Monitor content performance closely",
                "Adapt successful elements to your content",
                "Engage with the content if appropriate"
            ])
        elif alert_type == "strategy_change":
            recommendations.extend([
                "Analyze new strategy implications",
                "Assess if strategy fits your brand",
                "Plan counter-strategy if necessary",
                "Monitor strategy effectiveness"
            ])
        elif alert_type == "trend_adoption":
            recommendations.extend([
                "Evaluate trend relevance for your audience",
                "Plan your own trend adoption strategy",
                "Act quickly if trend shows potential"
            ])
        
        return recommendations[:3]  # Return top 3 recommendations
    
    async def _generate_mock_content_data(self, alert_type: str) -> Dict[str, Any]:
        """Generate mock content data for alerts"""
        base_data = {
            "content_id": str(uuid.uuid4()),
            "posted_at": datetime.utcnow() - timedelta(hours=random.randint(1, 48)),
            "platform": random.choice(["instagram", "tiktok", "youtube"]),
            "content_type": random.choice(["reel", "post", "story", "video"])
        }
        
        if alert_type == "viral_content":
            base_data.update({
                "title": "This fitness hack changed everything!",
                "description": "Viral fitness content gaining massive traction",
                "hashtags": ["#fitness", "#viral", "#transformation"],
                "view_count": random.randint(50000, 500000)
            })
        elif alert_type == "new_content":
            base_data.update({
                "title": "New product launch announcement",
                "description": "Competitor launched new content series",
                "hashtags": ["#newlaunch", "#product", "#innovation"]
            })
        elif alert_type == "strategy_change":
            base_data.update({
                "strategy_type": "content_format_shift",
                "description": "Shifted from static posts to video content",
                "impact_estimate": "high"
            })
        
        return base_data
    
    async def _generate_mock_performance_metrics(self, alert_type: str) -> Dict[str, float]:
        """Generate mock performance metrics"""
        if alert_type == "viral_content":
            return {
                "engagement_rate": random.uniform(8.0, 15.0),
                "reach_rate": random.uniform(30.0, 60.0),
                "virality_score": random.uniform(7.0, 10.0),
                "growth_velocity": random.uniform(50.0, 200.0)
            }
        else:
            return {
                "engagement_rate": random.uniform(2.0, 8.0),
                "reach_rate": random.uniform(10.0, 30.0),
                "virality_score": random.uniform(1.0, 6.0),
                "growth_velocity": random.uniform(-5.0, 25.0)
            }
    
    async def _calculate_change_percentage(self, previous_data: Dict[str, Any], 
                                         current_data: Dict[str, Any], insight_type: str) -> float:
        """Calculate percentage change between data points"""
        # Simplified calculation
        if insight_type == "engagement_trend":
            prev_engagement = previous_data.get("engagement_rate", 3.0)
            curr_engagement = current_data.get("engagement_rate", 3.5)
            return ((curr_engagement - prev_engagement) / prev_engagement) * 100 if prev_engagement != 0 else 0
        
        return random.uniform(-20.0, 40.0)  # Mock change percentage
    
    async def _assess_impact(self, change_percentage: float, insight_type: str) -> str:
        """Assess impact level of changes"""
        abs_change = abs(change_percentage)
        
        if abs_change > 30:
            return "high"
        elif abs_change > 15:
            return "medium"
        else:
            return "low"
    
    async def _generate_strategic_implications(self, insight_type: str, change_percentage: float, 
                                             current_data: Dict[str, Any]) -> List[str]:
        """Generate strategic implications"""
        implications = []
        
        if change_percentage > 20:
            implications.append("Competitor gaining significant momentum")
            implications.append("May need to accelerate your content strategy")
        elif change_percentage < -10:
            implications.append("Competitor strategy may be failing")
            implications.append("Opportunity to capture market share")
        
        implications.append("Monitor closely for pattern confirmation")
        return implications
    
    async def _generate_quick_wins(self, user_performance: float, industry_avg: float, platform: Platform) -> List[str]:
        """Generate quick win recommendations"""
        quick_wins = []
        
        if user_performance < industry_avg:
            quick_wins.extend([
                "Optimize posting times for better reach",
                "Use trending hashtags in your niche",
                "Increase engagement with your audience"
            ])
        
        platform_wins = {
            Platform.INSTAGRAM: "Use Instagram Reels for higher visibility",
            Platform.TIKTOK: "Jump on trending sounds quickly",
            Platform.YOUTUBE: "Improve thumbnails for better CTR",
            Platform.FACEBOOK: "Post in relevant Facebook groups"
        }
        
        if platform in platform_wins:
            quick_wins.append(platform_wins[platform])
        
        return quick_wins[:3]
    
    async def _generate_long_term_strategies(self, category: ContentCategory, platform: Platform) -> List[str]:
        """Generate long-term strategic recommendations"""
        return [
            "Develop signature content series",
            "Build strategic partnerships with influencers",
            "Invest in professional content production",
            "Create comprehensive content calendar system"
        ]
    
    async def _generate_competitor_tactics(self, category: ContentCategory, platform: Platform) -> List[str]:
        """Generate competitor tactics to consider adopting"""
        return [
            "Behind-the-scenes content strategy",
            "User-generated content campaigns",
            "Educational carousel posts",
            "Cross-platform content repurposing"
        ]
    
    async def _generate_key_insights(self, benchmark: CompetitorBenchmark, alerts: List[CompetitorMonitoringAlert], 
                                   trends: Dict[str, Any]) -> List[str]:
        """Generate key insights from competitive analysis"""
        insights = []
        
        if benchmark.performance_percentile < 50:
            insights.append("Your performance is below industry median - focus on fundamental improvements")
        elif benchmark.performance_percentile > 80:
            insights.append("Strong competitive position - focus on maintaining and expanding lead")
        
        high_priority_alerts = [a for a in alerts if a.alert_priority in ["high", "critical"]]
        if len(high_priority_alerts) > 2:
            insights.append("Multiple competitors showing strong activity - increased competitive pressure")
        
        insights.append("Content format trends favor video-first approach")
        return insights[:3]
    
    async def _create_action_plan(self, benchmark: CompetitorBenchmark, trends: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create actionable plan based on competitive analysis"""
        actions = []
        
        if benchmark.gap_to_average > 1.0:
            actions.append({
                "action": "Improve content quality and consistency",
                "priority": "high",
                "timeline": "immediate",
                "expected_impact": "15-25% engagement improvement"
            })
        
        actions.append({
            "action": "Adopt trending content formats",
            "priority": "medium",
            "timeline": "1-2 weeks",
            "expected_impact": "10-20% reach improvement"
        })
        
        actions.append({
            "action": "Optimize posting schedule",
            "priority": "medium",
            "timeline": "immediate",
            "expected_impact": "5-15% engagement improvement"
        })
        
        return actions

# Create service instance
competitor_monitoring_service = CompetitorMonitoringService()

# API Endpoints
@router.post("/alert", response_model=CompetitorMonitoringAlert)
async def create_monitoring_alert_endpoint(
    user_id: str,
    competitor_id: str,
    alert_type: str,
    content_data: Dict[str, Any]
):
    """Create competitor monitoring alert"""
    return await competitor_monitoring_service.create_monitoring_alert(
        user_id, competitor_id, alert_type, content_data
    )

@router.get("/alerts/{user_id}")
async def get_competitor_alerts_endpoint(
    user_id: str,
    priority: Optional[str] = None,
    limit: int = 10
):
    """Get competitor monitoring alerts"""
    return await competitor_monitoring_service.get_competitor_alerts(user_id, priority, limit)

@router.post("/insight-update", response_model=CompetitorInsightUpdate)
async def create_insight_update_endpoint(
    competitor_id: str,
    user_id: str,
    insight_type: str,
    previous_data: Dict[str, Any],
    current_data: Dict[str, Any]
):
    """Create competitor insight update"""
    return await competitor_monitoring_service.create_insight_update(
        competitor_id, user_id, insight_type, previous_data, current_data
    )

@router.get("/benchmark", response_model=CompetitorBenchmark)
async def generate_benchmark_endpoint(
    user_id: str,
    category: ContentCategory,
    platform: Platform
):
    """Generate competitor benchmark analysis"""
    return await competitor_monitoring_service.generate_competitor_benchmark(user_id, category, platform)

@router.get("/trends/{user_id}")
async def monitor_trends_endpoint(user_id: str, competitor_ids: str):
    """Monitor competitor trends"""
    competitor_list = competitor_ids.split(",") if competitor_ids else []
    return await competitor_monitoring_service.monitor_competitor_trends(user_id, competitor_list)

@router.get("/intelligence-report")
async def get_intelligence_report_endpoint(
    user_id: str,
    category: ContentCategory,
    platform: Platform
):
    """Get comprehensive competitive intelligence report"""
    return await competitor_monitoring_service.get_competitive_intelligence_report(user_id, category, platform)

@router.get("/dashboard/{user_id}")
async def get_monitoring_dashboard(user_id: str):
    """Get competitor monitoring dashboard"""
    alerts = await competitor_monitoring_service.get_competitor_alerts(user_id, limit=5)
    benchmark = await competitor_monitoring_service.generate_competitor_benchmark(
        user_id, ContentCategory.FASHION, Platform.INSTAGRAM
    )
    
    # Calculate dashboard metrics
    high_priority_alerts = len([a for a in alerts if a.alert_priority in ["high", "critical"]])
    unread_alerts = len([a for a in alerts if not a.is_read])
    
    return {
        "summary": {
            "total_alerts": len(alerts),
            "high_priority_alerts": high_priority_alerts,
            "unread_alerts": unread_alerts,
            "competitive_score": random.randint(65, 85)
        },
        "recent_alerts": alerts[:3],
        "benchmark_summary": {
            "your_percentile": benchmark.performance_percentile,
            "improvement_potential": benchmark.improvement_potential,
            "quick_wins_available": len(benchmark.quick_wins)
        },
        "trending_opportunities": [
            "Video content showing 25% higher engagement",
            "Educational carousels gaining popularity",
            "Behind-the-scenes content trending up"
        ]
    }