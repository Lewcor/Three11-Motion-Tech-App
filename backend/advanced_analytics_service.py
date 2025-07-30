from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid
import logging
from models import *
from database import get_database
from ai_service import ai_service

logger = logging.getLogger(__name__)

class AdvancedAnalyticsService:
    def __init__(self):
        self.db = None
    
    async def initialize(self):
        """Initialize database connection"""
        if not self.db:
            self.db = get_database()
    
    async def create_performance_record(self, user_id: str, generation_result_id: str,
                                      platform: Platform, post_url: Optional[str] = None) -> ContentPerformance:
        """Create a new performance tracking record"""
        await self.initialize()
        
        performance = ContentPerformance(
            user_id=user_id,
            generation_result_id=generation_result_id,
            platform=platform,
            post_url=post_url,
            posted_at=datetime.utcnow()
        )
        
        await self.db.content_performance.insert_one(performance.dict())
        return performance
    
    async def update_performance_metrics(self, performance_id: str, user_id: str,
                                       views: Optional[int] = None,
                                       likes: Optional[int] = None,
                                       comments: Optional[int] = None,
                                       shares: Optional[int] = None,
                                       reach: Optional[int] = None,
                                       impressions: Optional[int] = None) -> bool:
        """Update performance metrics for a post"""
        await self.initialize()
        
        update_data = {"last_updated": datetime.utcnow()}
        
        if views is not None:
            update_data["views"] = views
        if likes is not None:
            update_data["likes"] = likes
        if comments is not None:
            update_data["comments"] = comments
        if shares is not None:
            update_data["shares"] = shares
        if reach is not None:
            update_data["reach"] = reach
        if impressions is not None:
            update_data["impressions"] = impressions
        
        # Calculate engagement rate if we have the data
        if likes is not None and comments is not None and shares is not None and impressions is not None:
            if impressions > 0:
                engagement_rate = ((likes + comments + shares) / impressions) * 100
                update_data["engagement_rate"] = round(engagement_rate, 2)
        
        result = await self.db.content_performance.update_one(
            {"id": performance_id, "user_id": user_id},
            {"$set": update_data}
        )
        
        return result.modified_count > 0
    
    async def generate_analytics_dashboard(self, user_id: str, 
                                         start_date: Optional[datetime] = None,
                                         end_date: Optional[datetime] = None) -> AnalyticsDashboard:
        """Generate comprehensive analytics dashboard"""
        await self.initialize()
        
        if not end_date:
            end_date = datetime.utcnow()
        if not start_date:
            start_date = end_date - timedelta(days=30)  # Default to last 30 days
        
        # Get performance data
        query = {
            "user_id": user_id,
            "posted_at": {"$gte": start_date, "$lte": end_date}
        }
        
        cursor = self.db.content_performance.find(query)
        performances = []
        async for doc in cursor:
            performances.append(ContentPerformance(**doc))
        
        # Calculate metrics
        total_posts = len(performances)
        total_views = sum(p.views for p in performances)
        total_engagement = sum(p.likes + p.comments + p.shares for p in performances)
        
        # Calculate average engagement rate
        valid_engagements = [p.engagement_rate for p in performances if p.engagement_rate > 0]
        avg_engagement_rate = sum(valid_engagements) / len(valid_engagements) if valid_engagements else 0.0
        
        # Find best performing category and platform
        category_performance = {}
        platform_performance = {}
        
        # Get generation results to find categories
        for performance in performances:
            gen_result = await self.db.generation_results.find_one({"id": performance.generation_result_id})
            if gen_result:
                category = gen_result["category"]
                platform = performance.platform.value
                
                # Track category performance
                if category not in category_performance:
                    category_performance[category] = {"engagement": 0, "count": 0}
                category_performance[category]["engagement"] += performance.likes + performance.comments + performance.shares
                category_performance[category]["count"] += 1
                
                # Track platform performance
                if platform not in platform_performance:
                    platform_performance[platform] = {"engagement": 0, "count": 0}
                platform_performance[platform]["engagement"] += performance.likes + performance.comments + performance.shares
                platform_performance[platform]["count"] += 1
        
        # Find best performing category
        best_category = ContentCategory.FASHION  # Default
        best_category_score = 0
        for category, data in category_performance.items():
            avg_score = data["engagement"] / data["count"] if data["count"] > 0 else 0
            if avg_score > best_category_score:
                best_category_score = avg_score
                best_category = ContentCategory(category)
        
        # Find best performing platform
        best_platform = Platform.INSTAGRAM  # Default
        best_platform_score = 0
        for platform, data in platform_performance.items():
            avg_score = data["engagement"] / data["count"] if data["count"] > 0 else 0
            if avg_score > best_platform_score:
                best_platform_score = avg_score
                best_platform = Platform(platform)
        
        # Calculate growth metrics (compare with previous period)
        previous_start = start_date - (end_date - start_date)
        previous_query = {
            "user_id": user_id,
            "posted_at": {"$gte": previous_start, "$lte": start_date}
        }
        
        previous_cursor = self.db.content_performance.find(previous_query)
        previous_performances = []
        async for doc in previous_cursor:
            previous_performances.append(ContentPerformance(**doc))
        
        previous_engagement = sum(p.likes + p.comments + p.shares for p in previous_performances)
        previous_views = sum(p.views for p in previous_performances)
        
        # Calculate growth rates
        engagement_growth = 0.0
        views_growth = 0.0
        
        if previous_engagement > 0:
            engagement_growth = ((total_engagement - previous_engagement) / previous_engagement) * 100
        if previous_views > 0:
            views_growth = ((total_views - previous_views) / previous_views) * 100
        
        growth_metrics = {
            "engagement_growth": round(engagement_growth, 2),
            "views_growth": round(views_growth, 2),
            "posts_growth": len(performances) - len(previous_performances)
        }
        
        # AI Provider performance analysis
        ai_provider_performance = await self._analyze_ai_provider_performance(user_id, start_date, end_date)
        
        dashboard = AnalyticsDashboard(
            user_id=user_id,
            date_range_start=start_date,
            date_range_end=end_date,
            total_posts=total_posts,
            total_views=total_views,
            total_engagement=total_engagement,
            avg_engagement_rate=round(avg_engagement_rate, 2),
            best_performing_category=best_category,
            best_performing_platform=best_platform,
            growth_metrics=growth_metrics,
            ai_provider_performance=ai_provider_performance
        )
        
        # Save dashboard
        await self.db.analytics_dashboards.insert_one(dashboard.dict())
        
        return dashboard
    
    async def _analyze_ai_provider_performance(self, user_id: str, start_date: datetime, end_date: datetime) -> Dict[str, Dict[str, float]]:
        """Analyze performance by AI provider"""
        await self.initialize()
        
        # Get generation results in date range
        gen_query = {
            "user_id": user_id,
            "created_at": {"$gte": start_date, "$lte": end_date}
        }
        
        cursor = self.db.generation_results.find(gen_query)
        provider_stats = {}
        
        async for gen_doc in cursor:
            # Get performance data for this generation
            perf_doc = await self.db.content_performance.find_one({"generation_result_id": gen_doc["id"]})
            
            if perf_doc and gen_doc.get("ai_responses"):
                for ai_response in gen_doc["ai_responses"]:
                    provider = ai_response.get("provider", "unknown")
                    
                    if provider not in provider_stats:
                        provider_stats[provider] = {
                            "total_posts": 0,
                            "total_engagement": 0,
                            "total_views": 0,
                            "avg_engagement_rate": 0.0
                        }
                    
                    provider_stats[provider]["total_posts"] += 1
                    provider_stats[provider]["total_engagement"] += (perf_doc.get("likes", 0) + 
                                                                   perf_doc.get("comments", 0) + 
                                                                   perf_doc.get("shares", 0))
                    provider_stats[provider]["total_views"] += perf_doc.get("views", 0)
        
        # Calculate averages
        for provider, stats in provider_stats.items():
            if stats["total_posts"] > 0:
                stats["avg_engagement_rate"] = round(stats["total_engagement"] / stats["total_posts"], 2)
                stats["avg_views"] = round(stats["total_views"] / stats["total_posts"], 2)
        
        return provider_stats
    
    async def get_content_insights(self, user_id: str, limit: int = 10) -> Dict[str, Any]:
        """Get AI-powered content insights and recommendations"""
        await self.initialize()
        
        # Get recent performance data
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        query = {
            "user_id": user_id,
            "posted_at": {"$gte": thirty_days_ago}
        }
        
        cursor = self.db.content_performance.find(query).sort("engagement_rate", -1).limit(limit)
        top_performances = []
        async for doc in cursor:
            top_performances.append(ContentPerformance(**doc))
        
        if not top_performances:
            return {"insights": ["Start posting content to get personalized insights!"]}
        
        # Analyze patterns
        insights = []
        
        # Best posting times
        hour_performance = {}
        for perf in top_performances:
            hour = perf.posted_at.hour
            if hour not in hour_performance:
                hour_performance[hour] = {"engagement": 0, "count": 0}
            hour_performance[hour]["engagement"] += perf.likes + perf.comments + perf.shares
            hour_performance[hour]["count"] += 1
        
        if hour_performance:
            best_hour = max(hour_performance.keys(), 
                          key=lambda h: hour_performance[h]["engagement"] / hour_performance[h]["count"])
            insights.append(f"Your best posting time is around {best_hour}:00 - posts get {round(hour_performance[best_hour]['engagement'] / hour_performance[best_hour]['count'], 1)} average engagement")
        
        # Platform insights
        platform_perf = {}
        for perf in top_performances:
            platform = perf.platform.value
            if platform not in platform_perf:
                platform_perf[platform] = []
            platform_perf[platform].append(perf.engagement_rate)
        
        for platform, rates in platform_perf.items():
            avg_rate = sum(rates) / len(rates)
            insights.append(f"Your {platform.title()} content averages {avg_rate:.1f}% engagement rate")
        
        # Use AI to generate additional insights
        try:
            performance_summary = f"User has posted {len(top_performances)} pieces of content in the last 30 days. "
            performance_summary += f"Average engagement rate: {sum(p.engagement_rate for p in top_performances) / len(top_performances):.1f}%. "
            performance_summary += f"Total engagement: {sum(p.likes + p.comments + p.shares for p in top_performances)}. "
            
            ai_prompt = f"""
            Based on this social media performance data: {performance_summary}
            
            Provide 3 actionable insights to improve content performance. Focus on:
            1. Content timing optimization
            2. Engagement strategies
            3. Platform-specific recommendations
            
            Keep insights brief and actionable.
            """
            
            ai_insights = await ai_service.generate_content(ai_prompt, "anthropic", 300)
            insights.append(f"AI Recommendation: {ai_insights}")
            
        except Exception as e:
            logger.error(f"Error generating AI insights: {e}")
        
        return {
            "insights": insights,
            "total_analyzed_posts": len(top_performances),
            "date_range": "Last 30 days",
            "top_engagement_rate": max(p.engagement_rate for p in top_performances) if top_performances else 0
        }
    
    async def create_competitor_benchmark(self, user_id: str, competitor_name: str,
                                        platform: Platform, category: ContentCategory,
                                        competitor_avg_engagement: float) -> CompetitorBenchmark:
        """Create competitor benchmark analysis"""
        await self.initialize()
        
        # Get user's average engagement for comparison
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        # Get user's performance in same category/platform
        user_performances = []
        cursor = self.db.content_performance.find({
            "user_id": user_id,
            "platform": platform.value,
            "posted_at": {"$gte": thirty_days_ago}
        })
        
        async for perf_doc in cursor:
            # Check if this performance matches the category
            gen_result = await self.db.generation_results.find_one({"id": perf_doc["generation_result_id"]})
            if gen_result and gen_result.get("category") == category.value:
                user_performances.append(ContentPerformance(**perf_doc))
        
        user_avg_engagement = 0.0
        if user_performances:
            user_avg_engagement = sum(p.engagement_rate for p in user_performances) / len(user_performances)
        
        # Calculate benchmark score
        benchmark_score = 0.0
        if competitor_avg_engagement > 0:
            benchmark_score = (user_avg_engagement / competitor_avg_engagement) * 100
        
        # Generate insights
        insights = []
        if benchmark_score > 100:
            insights.append(f"Excellent! You're outperforming {competitor_name} by {benchmark_score - 100:.1f}%")
        elif benchmark_score > 80:
            insights.append(f"Good performance! You're {100 - benchmark_score:.1f}% behind {competitor_name}")
        else:
            insights.append(f"Growth opportunity: {competitor_name} gets {competitor_avg_engagement - user_avg_engagement:.1f}% higher engagement")
        
        benchmark = CompetitorBenchmark(
            user_id=user_id,
            competitor_name=competitor_name,
            platform=platform,
            category=category,
            competitor_avg_engagement=competitor_avg_engagement,
            user_avg_engagement=round(user_avg_engagement, 2),
            benchmark_score=round(benchmark_score, 2),
            insights=insights
        )
        
        await self.db.competitor_benchmarks.insert_one(benchmark.dict())
        return benchmark

# Global service instance
advanced_analytics_service = AdvancedAnalyticsService()