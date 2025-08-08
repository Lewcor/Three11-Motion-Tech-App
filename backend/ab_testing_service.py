from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
import statistics
import math
from models import (
    ABTestExperiment, ABTestRequest, ABTestResult,
    Platform, ContentCategory, AIProvider
)
from ai_service import AIService
import uuid

router = APIRouter()

class ABTestingService:
    def __init__(self):
        self.ai_service = AIService()
    
    async def create_ab_test(self, request: ABTestRequest) -> ABTestExperiment:
        """Create a new A/B test experiment"""
        try:
            experiment = ABTestExperiment(
                user_id=request.user_id,
                test_name=request.test_name,
                test_type=request.test_type,
                category=request.category,
                platform=request.platform,
                variant_a=request.variant_a,
                variant_b=request.variant_b,
                success_metric=request.success_metric,
                test_duration_days=request.test_duration_days,
                status="draft"
            )
            
            # In a real app, save to database
            # await database.ab_experiments.insert_one(experiment.dict())
            
            return experiment
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating A/B test: {str(e)}")
    
    async def start_ab_test(self, experiment_id: str) -> Dict[str, Any]:
        """Start an A/B test experiment"""
        try:
            # In a real app, fetch from database and update status
            started_at = datetime.utcnow()
            
            # Simulate starting the test
            result = {
                "experiment_id": experiment_id,
                "status": "running",
                "started_at": started_at,
                "estimated_end_date": started_at + timedelta(days=7),
                "variant_a_url": f"https://test-variant-a-{experiment_id}.com",
                "variant_b_url": f"https://test-variant-b-{experiment_id}.com",
                "tracking_enabled": True,
                "message": "A/B test started successfully. Traffic will be split 50/50 between variants."
            }
            
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error starting A/B test: {str(e)}")
    
    async def get_ab_test_results(self, experiment_id: str) -> ABTestResult:
        """Get results of an A/B test"""
        try:
            # Simulate test results
            mock_results = await self._generate_mock_ab_results(experiment_id)
            
            # Determine winner
            winner = await self._determine_winner(mock_results)
            
            # Calculate improvement percentage
            improvement = await self._calculate_improvement(mock_results, winner)
            
            # Generate recommendations
            recommendations = await self._generate_ab_recommendations(mock_results, winner)
            
            return ABTestResult(
                experiment_id=experiment_id,
                winner=winner,
                improvement_percentage=improvement,
                confidence_level=mock_results["confidence_level"],
                sample_size=mock_results["sample_size"],
                detailed_results=mock_results,
                recommendations=recommendations
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting A/B test results: {str(e)}")
    
    async def stop_ab_test(self, experiment_id: str) -> Dict[str, Any]:
        """Stop an A/B test experiment"""
        try:
            ended_at = datetime.utcnow()
            
            # Get final results
            results = await self.get_ab_test_results(experiment_id)
            
            return {
                "experiment_id": experiment_id,
                "status": "completed",
                "ended_at": ended_at,
                "final_results": results,
                "winner": results.winner,
                "improvement": results.improvement_percentage,
                "message": f"A/B test completed. Variant {results.winner.upper()} performed better with {results.improvement_percentage:.1f}% improvement."
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error stopping A/B test: {str(e)}")
    
    async def get_user_experiments(self, user_id: str, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all A/B test experiments for a user"""
        try:
            # Simulate fetching user's experiments
            mock_experiments = []
            
            statuses = [status] if status else ["draft", "running", "completed", "paused"]
            
            for i in range(random.randint(2, 6)):
                experiment_status = random.choice(statuses)
                
                mock_experiments.append({
                    "id": str(uuid.uuid4()),
                    "test_name": f"Test #{i+1}: {random.choice(['Caption', 'Hashtag', 'Visual', 'Timing'])} Optimization",
                    "test_type": random.choice(["caption_ab", "hashtag_ab", "visual_ab", "posting_time_ab"]),
                    "platform": random.choice(["instagram", "tiktok", "youtube"]),
                    "category": random.choice(["fashion", "fitness", "food"]),
                    "status": experiment_status,
                    "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                    "success_metric": random.choice(["engagement_rate", "reach", "conversions"]),
                    "sample_size": random.randint(50, 500) if experiment_status != "draft" else 0,
                    "current_winner": random.choice(["a", "b", "tie"]) if experiment_status == "completed" else None,
                    "improvement": round(random.uniform(-5.0, 25.0), 1) if experiment_status == "completed" else None
                })
            
            return mock_experiments
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting user experiments: {str(e)}")
    
    async def analyze_ab_test_performance(self, experiment_id: str) -> Dict[str, Any]:
        """Analyze A/B test performance in detail"""
        try:
            # Get test results
            results = await self.get_ab_test_results(experiment_id)
            
            # Generate detailed analysis
            analysis = {
                "experiment_id": experiment_id,
                "statistical_analysis": {
                    "confidence_level": results.confidence_level,
                    "sample_size": results.sample_size,
                    "statistical_significance": results.confidence_level > 0.95,
                    "p_value": round(1 - results.confidence_level, 4)
                },
                "performance_breakdown": results.detailed_results,
                "winner_analysis": {
                    "winning_variant": results.winner,
                    "improvement_percentage": results.improvement_percentage,
                    "performance_lift": f"+{results.improvement_percentage:.1f}%" if results.improvement_percentage > 0 else f"{results.improvement_percentage:.1f}%"
                },
                "insights": await self._generate_detailed_insights(results),
                "next_steps": await self._suggest_next_steps(results),
                "learnings": await self._extract_learnings(results)
            }
            
            return analysis
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error analyzing A/B test: {str(e)}")
    
    async def suggest_ab_tests(self, user_id: str, platform: Platform, category: ContentCategory) -> List[Dict[str, Any]]:
        """Suggest A/B tests based on user's content performance"""
        try:
            suggestions = []
            
            # Caption A/B test suggestions
            suggestions.append({
                "test_type": "caption_ab",
                "title": "Hook Effectiveness Test",
                "description": "Test different opening hooks to see which generates more engagement",
                "variant_a": {"hook": "Question-based hook", "example": "Did you know that...?"},
                "variant_b": {"hook": "Statement-based hook", "example": "Here's why everyone is talking about..."},
                "expected_improvement": "15-30%",
                "duration_days": 7,
                "priority": "high"
            })
            
            # Hashtag A/B test
            suggestions.append({
                "test_type": "hashtag_ab",
                "title": "Hashtag Strategy Test",
                "description": "Compare broad vs. niche hashtag strategies",
                "variant_a": {"strategy": "Broad hashtags", "example": "#fashion #style #ootd"},
                "variant_b": {"strategy": "Niche hashtags", "example": "#sustainablefashion #ethicalclothing #slowfashion"},
                "expected_improvement": "10-25%",
                "duration_days": 10,
                "priority": "medium"
            })
            
            # Posting time A/B test
            suggestions.append({
                "test_type": "posting_time_ab",
                "title": "Optimal Posting Time Test",
                "description": "Find the best posting time for your audience",
                "variant_a": {"time": "Morning (9 AM)", "rationale": "Catch commuters and early scrollers"},
                "variant_b": {"time": "Evening (7 PM)", "rationale": "Target after-work social media usage"},
                "expected_improvement": "20-40%",
                "duration_days": 14,
                "priority": "high"
            })
            
            # Visual A/B test (if applicable)
            if platform in [Platform.INSTAGRAM, Platform.TIKTOK]:
                suggestions.append({
                    "test_type": "visual_ab",
                    "title": "Visual Style Test",
                    "description": "Test different visual approaches for better engagement",
                    "variant_a": {"style": "Bright, colorful visuals", "appeal": "Eye-catching and vibrant"},
                    "variant_b": {"style": "Minimal, clean visuals", "appeal": "Professional and modern"},
                    "expected_improvement": "12-28%",
                    "duration_days": 7,
                    "priority": "medium"
                })
            
            # Content format A/B test
            suggestions.append({
                "test_type": "format_ab",
                "title": "Content Format Test",
                "description": "Compare different content formats for engagement",
                "variant_a": {"format": "Educational carousel", "benefit": "Informative and shareable"},
                "variant_b": {"format": "Behind-the-scenes video", "benefit": "Authentic and personal"},
                "expected_improvement": "18-35%",
                "duration_days": 10,
                "priority": "high"
            })
            
            return suggestions[:3]  # Return top 3 suggestions
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error suggesting A/B tests: {str(e)}")
    
    async def _generate_mock_ab_results(self, experiment_id: str) -> Dict[str, Any]:
        """Generate realistic mock A/B test results"""
        
        # Simulate sample sizes
        variant_a_size = random.randint(100, 1000)
        variant_b_size = random.randint(100, 1000)
        total_size = variant_a_size + variant_b_size
        
        # Simulate performance metrics
        base_engagement = random.uniform(2.0, 6.0)
        
        # One variant performs better (70% chance variant B wins, 30% variant A)
        if random.random() < 0.7:
            variant_a_engagement = base_engagement
            variant_b_engagement = base_engagement * random.uniform(1.1, 1.4)  # 10-40% better
        else:
            variant_a_engagement = base_engagement * random.uniform(1.1, 1.3)  # 10-30% better
            variant_b_engagement = base_engagement
        
        # Calculate other metrics
        variant_a_reach = int(variant_a_size * random.uniform(2.0, 5.0))
        variant_b_reach = int(variant_b_size * random.uniform(2.0, 5.0))
        
        variant_a_likes = int(variant_a_reach * (variant_a_engagement / 100) * 0.7)
        variant_b_likes = int(variant_b_reach * (variant_b_engagement / 100) * 0.7)
        
        variant_a_shares = int(variant_a_likes * 0.1)
        variant_b_shares = int(variant_b_likes * 0.1)
        
        variant_a_comments = int(variant_a_likes * 0.05)
        variant_b_comments = int(variant_b_likes * 0.05)
        
        # Calculate confidence level
        difference = abs(variant_a_engagement - variant_b_engagement)
        confidence_level = min(0.99, 0.7 + (difference / 10))  # Higher difference = higher confidence
        
        return {
            "variant_a": {
                "sample_size": variant_a_size,
                "engagement_rate": round(variant_a_engagement, 2),
                "reach": variant_a_reach,
                "likes": variant_a_likes,
                "shares": variant_a_shares,
                "comments": variant_a_comments,
                "conversion_rate": round(random.uniform(1.0, 4.0), 2)
            },
            "variant_b": {
                "sample_size": variant_b_size,
                "engagement_rate": round(variant_b_engagement, 2),
                "reach": variant_b_reach,
                "likes": variant_b_likes,
                "shares": variant_b_shares,
                "comments": variant_b_comments,
                "conversion_rate": round(random.uniform(1.0, 4.0), 2)
            },
            "sample_size": total_size,
            "confidence_level": round(confidence_level, 3),
            "test_duration": random.randint(7, 14),
            "statistical_significance": confidence_level > 0.95
        }
    
    async def _determine_winner(self, results: Dict[str, Any]) -> str:
        """Determine the winning variant"""
        variant_a_performance = results["variant_a"]["engagement_rate"]
        variant_b_performance = results["variant_b"]["engagement_rate"]
        
        # Check if difference is statistically significant
        if not results["statistical_significance"]:
            return "tie"
        
        # Determine winner based on primary metric
        if variant_b_performance > variant_a_performance * 1.05:  # At least 5% improvement
            return "b"
        elif variant_a_performance > variant_b_performance * 1.05:
            return "a"
        else:
            return "tie"
    
    async def _calculate_improvement(self, results: Dict[str, Any], winner: str) -> float:
        """Calculate improvement percentage"""
        if winner == "tie":
            return 0.0
        
        variant_a_performance = results["variant_a"]["engagement_rate"]
        variant_b_performance = results["variant_b"]["engagement_rate"]
        
        if winner == "b":
            improvement = ((variant_b_performance - variant_a_performance) / variant_a_performance) * 100
        else:
            improvement = ((variant_a_performance - variant_b_performance) / variant_b_performance) * 100
        
        return round(improvement, 1)
    
    async def _generate_ab_recommendations(self, results: Dict[str, Any], winner: str) -> List[str]:
        """Generate recommendations based on A/B test results"""
        recommendations = []
        
        if winner == "tie":
            recommendations.extend([
                "No significant difference found between variants",
                "Consider running test longer for more data",
                "Test larger changes to see meaningful differences",
                "Both variants can be used interchangeably"
            ])
        else:
            winning_variant = "B" if winner == "b" else "A"
            recommendations.extend([
                f"Implement Variant {winning_variant} as your default strategy",
                f"Variant {winning_variant} showed statistically significant improvement",
                "Scale successful elements to similar content",
                "Document learnings for future content creation"
            ])
        
        # Add specific recommendations based on performance
        winner_data = results[f"variant_{winner}"] if winner != "tie" else results["variant_a"]
        
        if winner_data["engagement_rate"] > 5.0:
            recommendations.append("High engagement rate - consider increasing posting frequency")
        
        if winner_data["shares"] > winner_data["likes"] * 0.15:
            recommendations.append("High share rate indicates viral potential - create similar content")
        
        return recommendations[:4]  # Return top 4 recommendations
    
    async def _generate_detailed_insights(self, results: ABTestResult) -> List[str]:
        """Generate detailed insights from A/B test results"""
        insights = []
        
        if results.improvement_percentage > 20:
            insights.append("Exceptional improvement - this change should be prioritized")
        elif results.improvement_percentage > 10:
            insights.append("Strong positive result - implement across similar content")
        elif results.improvement_percentage > 5:
            insights.append("Moderate improvement - worth implementing with monitoring")
        else:
            insights.append("Minimal difference - consider testing more significant changes")
        
        if results.confidence_level > 0.95:
            insights.append("High statistical confidence - results are very reliable")
        elif results.confidence_level > 0.90:
            insights.append("Good statistical confidence - results are reliable")
        else:
            insights.append("Lower confidence - consider running test longer")
        
        return insights
    
    async def _suggest_next_steps(self, results: ABTestResult) -> List[str]:
        """Suggest next steps based on A/B test results"""
        next_steps = []
        
        if results.winner != "tie":
            next_steps.extend([
                f"Roll out winning variant {results.winner.upper()} to all content",
                "Create content guidelines based on winning elements",
                "Train team on successful patterns identified"
            ])
        
        next_steps.extend([
            "Plan follow-up tests to optimize other elements",
            "Monitor performance after implementation",
            "Document learnings in content strategy playbook"
        ])
        
        return next_steps[:3]
    
    async def _extract_learnings(self, results: ABTestResult) -> List[str]:
        """Extract key learnings from A/B test"""
        learnings = []
        
        if results.improvement_percentage > 15:
            learnings.append("Small changes can have significant impact on engagement")
        
        learnings.extend([
            "Data-driven decisions outperform assumptions",
            "Audience preferences can be discovered through testing",
            "Continuous optimization leads to better performance"
        ])
        
        return learnings

# Create service instance
ab_testing_service = ABTestingService()

# API Endpoints
@router.post("/create", response_model=ABTestExperiment)
async def create_ab_test_endpoint(request: ABTestRequest):
    """Create a new A/B test experiment"""
    return await ab_testing_service.create_ab_test(request)

@router.post("/start/{experiment_id}")
async def start_ab_test_endpoint(experiment_id: str):
    """Start an A/B test experiment"""
    return await ab_testing_service.start_ab_test(experiment_id)

@router.get("/results/{experiment_id}", response_model=ABTestResult)
async def get_ab_test_results_endpoint(experiment_id: str):
    """Get A/B test results"""
    return await ab_testing_service.get_ab_test_results(experiment_id)

@router.post("/stop/{experiment_id}")
async def stop_ab_test_endpoint(experiment_id: str):
    """Stop an A/B test experiment"""
    return await ab_testing_service.stop_ab_test(experiment_id)

@router.get("/user/{user_id}")
async def get_user_experiments_endpoint(user_id: str, status: Optional[str] = None):
    """Get all A/B test experiments for a user"""
    return await ab_testing_service.get_user_experiments(user_id, status)

@router.get("/analyze/{experiment_id}")
async def analyze_ab_test_endpoint(experiment_id: str):
    """Get detailed A/B test analysis"""
    return await ab_testing_service.analyze_ab_test_performance(experiment_id)

@router.get("/suggestions")
async def suggest_ab_tests_endpoint(user_id: str, platform: Platform, category: ContentCategory):
    """Get A/B test suggestions"""
    return await ab_testing_service.suggest_ab_tests(user_id, platform, category)

@router.get("/dashboard/{user_id}")
async def get_ab_testing_dashboard(user_id: str):
    """Get A/B testing dashboard data"""
    active_tests = await ab_testing_service.get_user_experiments(user_id, "running")
    completed_tests = await ab_testing_service.get_user_experiments(user_id, "completed")
    suggestions = await ab_testing_service.suggest_ab_tests(user_id, Platform.INSTAGRAM, ContentCategory.FASHION)
    
    # Calculate summary stats
    total_tests = len(active_tests) + len(completed_tests)
    avg_improvement = statistics.mean([test.get("improvement", 0) for test in completed_tests if test.get("improvement")]) if completed_tests else 0
    
    return {
        "summary": {
            "total_tests": total_tests,
            "active_tests": len(active_tests),
            "completed_tests": len(completed_tests),
            "average_improvement": round(avg_improvement, 1)
        },
        "active_experiments": active_tests[:3],  # Show top 3 active
        "recent_results": completed_tests[:3],   # Show 3 most recent
        "suggested_tests": suggestions,
        "success_rate": round(len([t for t in completed_tests if t.get("improvement", 0) > 5]) / max(1, len(completed_tests)) * 100, 1)
    }