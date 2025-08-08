from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
import re
import math
from models import (
    EngagementPredictionRequest, EngagementPrediction, PredictionAccuracyTracker,
    Platform, ContentCategory, ContentType, AIProvider
)
from ai_service import AIService
import uuid

router = APIRouter()

class EngagementPredictionService:
    def __init__(self):
        self.ai_service = AIService()
        
        # Platform engagement benchmarks (industry averages)
        self.platform_benchmarks = {
            Platform.INSTAGRAM: {"avg_engagement": 4.2, "reach_multiplier": 0.15},
            Platform.TIKTOK: {"avg_engagement": 6.8, "reach_multiplier": 0.25},
            Platform.YOUTUBE: {"avg_engagement": 3.1, "reach_multiplier": 0.08},
            Platform.FACEBOOK: {"avg_engagement": 2.3, "reach_multiplier": 0.12}
        }
        
        # Category performance modifiers
        self.category_modifiers = {
            ContentCategory.FASHION: 1.2,
            ContentCategory.FITNESS: 1.1,
            ContentCategory.FOOD: 1.3,
            ContentCategory.TRAVEL: 1.15,
            ContentCategory.BUSINESS: 0.8,
            ContentCategory.GAMING: 1.4,
            ContentCategory.MUSIC: 1.25,
            ContentCategory.IDEAS: 0.9,
            ContentCategory.EVENT_SPACE: 0.85
        }
    
    async def predict_engagement(self, request: EngagementPredictionRequest) -> EngagementPrediction:
        """Generate hybrid AI-powered engagement prediction"""
        try:
            # Step 1: Analyze content using AI
            ai_analysis = await self._ai_content_analysis(request)
            
            # Step 2: Calculate base metrics using ML-style algorithm
            base_metrics = await self._calculate_base_metrics(request)
            
            # Step 3: Apply AI insights to adjust predictions
            adjusted_predictions = await self._apply_ai_adjustments(base_metrics, ai_analysis, request)
            
            # Step 4: Generate optimization suggestions
            suggestions = await self._generate_optimization_suggestions(ai_analysis, request)
            
            # Step 5: Determine best posting time
            best_time = await self._predict_best_posting_time(request)
            
            return EngagementPrediction(
                user_id=request.user_id,
                content_preview=request.content_preview,
                platform=request.platform,
                category=request.category,
                predicted_likes=adjusted_predictions["likes"],
                predicted_shares=adjusted_predictions["shares"],
                predicted_comments=adjusted_predictions["comments"],
                predicted_reach=adjusted_predictions["reach"],
                predicted_engagement_rate=adjusted_predictions["engagement_rate"],
                confidence_score=adjusted_predictions["confidence"],
                positive_factors=ai_analysis["positive_factors"],
                negative_factors=ai_analysis["negative_factors"],
                optimization_suggestions=suggestions,
                best_posting_time=best_time,
                ai_sentiment_score=ai_analysis["sentiment_score"],
                trend_alignment_score=ai_analysis["trend_alignment"],
                audience_match_score=ai_analysis["audience_match"]
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error predicting engagement: {str(e)}")
    
    async def _ai_content_analysis(self, request: EngagementPredictionRequest) -> Dict[str, Any]:
        """Use AI to analyze content quality and engagement factors"""
        try:
            # Create analysis prompt
            analysis_prompt = f"""
            Analyze this {request.platform.value} {request.category.value} content for engagement potential:
            
            Content: "{request.content_preview}"
            Content Type: {request.content_type.value}
            Hashtags: {', '.join(request.hashtags) if request.hashtags else 'None'}
            Has Visual: {request.has_visual}
            Content Length: {request.content_length or 'Unknown'} characters
            
            Provide analysis in this format:
            SENTIMENT: [score from -1 to 1]
            HOOK_STRENGTH: [score from 0 to 10]
            CLARITY: [score from 0 to 10]
            VALUE_PROPOSITION: [score from 0 to 10]
            TREND_ALIGNMENT: [score from 0 to 1]
            AUDIENCE_MATCH: [score from 0 to 1]
            POSITIVE_FACTORS: [list of strengths]
            NEGATIVE_FACTORS: [list of weaknesses]
            ENGAGEMENT_MULTIPLIER: [suggested multiplier from 0.5 to 2.0]
            """
            
            # Get AI analysis
            ai_response = await self.ai_service.generate_content(
                [AIProvider.ANTHROPIC],  # Use Claude for analysis
                analysis_prompt,
                request.category,
                request.platform,
                "engagement_analysis",
                request.user_id
            )
            
            # Parse AI response (simplified parsing)
            analysis = self._parse_ai_analysis(ai_response)
            
            return analysis
            
        except Exception as e:
            # Fallback to rule-based analysis if AI fails
            return await self._fallback_content_analysis(request)
    
    def _parse_ai_analysis(self, ai_response: str) -> Dict[str, Any]:
        """Parse AI analysis response into structured data"""
        try:
            # Extract values using regex (simplified)
            patterns = {
                "sentiment_score": r"SENTIMENT:\s*([-+]?\d*\.?\d+)",
                "hook_strength": r"HOOK_STRENGTH:\s*(\d+)",
                "clarity": r"CLARITY:\s*(\d+)",
                "value_proposition": r"VALUE_PROPOSITION:\s*(\d+)",
                "trend_alignment": r"TREND_ALIGNMENT:\s*([\d.]+)",
                "audience_match": r"AUDIENCE_MATCH:\s*([\d.]+)",
                "engagement_multiplier": r"ENGAGEMENT_MULTIPLIER:\s*([\d.]+)"
            }
            
            extracted = {}
            for key, pattern in patterns.items():
                match = re.search(pattern, ai_response, re.IGNORECASE)
                if match:
                    extracted[key] = float(match.group(1))
                else:
                    # Provide defaults
                    defaults = {
                        "sentiment_score": 0.3,
                        "hook_strength": 6,
                        "clarity": 7,
                        "value_proposition": 6,
                        "trend_alignment": 0.6,
                        "audience_match": 0.7,
                        "engagement_multiplier": 1.0
                    }
                    extracted[key] = defaults.get(key, 0.5)
            
            # Extract positive and negative factors
            positive_factors = []
            negative_factors = []
            
            if "POSITIVE_FACTORS:" in ai_response:
                positive_section = ai_response.split("POSITIVE_FACTORS:")[1].split("NEGATIVE_FACTORS:")[0]
                positive_factors = [f.strip() for f in positive_section.split("-") if f.strip()][:3]
            
            if "NEGATIVE_FACTORS:" in ai_response:
                negative_section = ai_response.split("NEGATIVE_FACTORS:")[1].split("ENGAGEMENT_MULTIPLIER:")[0]
                negative_factors = [f.strip() for f in negative_section.split("-") if f.strip()][:3]
            
            # Fallback factors if parsing fails
            if not positive_factors:
                positive_factors = ["Clear messaging", "Relevant hashtags", "Good content structure"]
            if not negative_factors:
                negative_factors = ["Could use stronger hook", "Consider adding trending elements"]
            
            return {
                "sentiment_score": max(-1, min(1, extracted["sentiment_score"])),
                "hook_strength": max(0, min(10, extracted["hook_strength"])),
                "clarity": max(0, min(10, extracted["clarity"])),
                "value_proposition": max(0, min(10, extracted["value_proposition"])),
                "trend_alignment": max(0, min(1, extracted["trend_alignment"])),
                "audience_match": max(0, min(1, extracted["audience_match"])),
                "engagement_multiplier": max(0.5, min(2.0, extracted["engagement_multiplier"])),
                "positive_factors": positive_factors,
                "negative_factors": negative_factors
            }
            
        except Exception as e:
            # Return safe defaults
            return {
                "sentiment_score": 0.3,
                "hook_strength": 6,
                "clarity": 7,
                "value_proposition": 6,
                "trend_alignment": 0.6,
                "audience_match": 0.7,
                "engagement_multiplier": 1.0,
                "positive_factors": ["Relevant content", "Clear messaging"],
                "negative_factors": ["Could improve hook strength"]
            }
    
    async def _fallback_content_analysis(self, request: EngagementPredictionRequest) -> Dict[str, Any]:
        """Fallback rule-based content analysis"""
        content = request.content_preview.lower()
        
        # Analyze content characteristics
        sentiment_score = 0.0
        hook_strength = 5
        trend_alignment = 0.5
        audience_match = 0.6
        
        # Positive sentiment words
        positive_words = ["amazing", "love", "best", "awesome", "incredible", "perfect", "beautiful"]
        negative_words = ["hate", "worst", "terrible", "awful", "bad"]
        
        positive_count = sum(1 for word in positive_words if word in content)
        negative_count = sum(1 for word in negative_words if word in content)
        sentiment_score = (positive_count - negative_count) / max(1, len(content.split()))
        
        # Hook strength based on first few words
        first_words = content.split()[:5]
        hook_words = ["discover", "secret", "revealed", "ultimate", "proven", "shocking"]
        if any(word in " ".join(first_words) for word in hook_words):
            hook_strength += 2
        
        # Question marks and exclamation points boost engagement
        if "?" in content:
            hook_strength += 1
        if "!" in content:
            hook_strength += 1
            
        # Hashtag analysis
        if request.hashtags:
            if len(request.hashtags) >= 5:
                trend_alignment += 0.2
            if any("#trending" in tag.lower() or "#viral" in tag.lower() for tag in request.hashtags):
                trend_alignment += 0.1
        
        return {
            "sentiment_score": max(-1, min(1, sentiment_score)),
            "hook_strength": max(0, min(10, hook_strength)),
            "clarity": 7,
            "value_proposition": 6,
            "trend_alignment": max(0, min(1, trend_alignment)),
            "audience_match": audience_match,
            "engagement_multiplier": 1.0,
            "positive_factors": ["Content structure", "Platform appropriate"],
            "negative_factors": ["Could improve engagement hooks"]
        }
    
    async def _calculate_base_metrics(self, request: EngagementPredictionRequest) -> Dict[str, Any]:
        """Calculate base engagement metrics using algorithm"""
        
        # Get platform baseline
        platform_data = self.platform_benchmarks.get(request.platform)
        base_engagement_rate = platform_data["avg_engagement"]
        reach_multiplier = platform_data["reach_multiplier"]
        
        # Apply category modifier
        category_modifier = self.category_modifiers.get(request.category, 1.0)
        adjusted_engagement_rate = base_engagement_rate * category_modifier
        
        # Estimate reach based on user's typical performance (simulated)
        follower_estimate = random.randint(1000, 50000)  # Simulated follower count
        estimated_reach = int(follower_estimate * reach_multiplier)
        
        # Calculate engagement metrics
        predicted_likes = int(estimated_reach * (adjusted_engagement_rate / 100) * 0.7)  # 70% of engagement is likes
        predicted_shares = int(predicted_likes * 0.1)  # 10% of likes become shares
        predicted_comments = int(predicted_likes * 0.05)  # 5% of likes become comments
        
        # Add some randomness for realism
        variance = 0.2  # 20% variance
        predicted_likes = int(predicted_likes * random.uniform(1-variance, 1+variance))
        predicted_shares = int(predicted_shares * random.uniform(1-variance, 1+variance))
        predicted_comments = int(predicted_comments * random.uniform(1-variance, 1+variance))
        
        # Calculate actual engagement rate
        total_engagement = predicted_likes + predicted_shares + predicted_comments
        final_engagement_rate = (total_engagement / estimated_reach) * 100 if estimated_reach > 0 else 0
        
        return {
            "likes": max(1, predicted_likes),
            "shares": max(0, predicted_shares),
            "comments": max(0, predicted_comments),
            "reach": max(100, estimated_reach),
            "engagement_rate": round(final_engagement_rate, 2),
            "confidence": 0.75  # Base confidence
        }
    
    async def _apply_ai_adjustments(self, base_metrics: Dict[str, Any], 
                                  ai_analysis: Dict[str, Any], request: EngagementPredictionRequest) -> Dict[str, Any]:
        """Apply AI insights to adjust base predictions"""
        
        multiplier = ai_analysis.get("engagement_multiplier", 1.0)
        
        # Adjust metrics based on AI analysis
        adjusted_likes = int(base_metrics["likes"] * multiplier)
        adjusted_shares = int(base_metrics["shares"] * multiplier)
        adjusted_comments = int(base_metrics["comments"] * multiplier)
        adjusted_reach = base_metrics["reach"]  # Reach less affected by content quality
        
        # Recalculate engagement rate
        total_engagement = adjusted_likes + adjusted_shares + adjusted_comments
        adjusted_engagement_rate = (total_engagement / adjusted_reach) * 100 if adjusted_reach > 0 else 0
        
        # Adjust confidence based on AI analysis quality
        confidence_factors = [
            ai_analysis.get("clarity", 5) / 10,
            ai_analysis.get("trend_alignment", 0.5),
            ai_analysis.get("audience_match", 0.5),
            abs(ai_analysis.get("sentiment_score", 0)) + 0.5  # Stronger sentiment = higher confidence
        ]
        confidence = sum(confidence_factors) / len(confidence_factors)
        
        return {
            "likes": max(1, adjusted_likes),
            "shares": max(0, adjusted_shares),
            "comments": max(0, adjusted_comments),
            "reach": adjusted_reach,
            "engagement_rate": round(adjusted_engagement_rate, 2),
            "confidence": round(min(0.95, max(0.3, confidence)), 2)
        }
    
    async def _generate_optimization_suggestions(self, ai_analysis: Dict[str, Any], 
                                               request: EngagementPredictionRequest) -> List[str]:
        """Generate AI-powered optimization suggestions"""
        suggestions = []
        
        # Hook strength suggestions
        if ai_analysis.get("hook_strength", 5) < 6:
            suggestions.append("Start with a stronger hook - try a question or surprising statement")
        
        # Sentiment suggestions
        sentiment = ai_analysis.get("sentiment_score", 0)
        if sentiment < 0.2:
            suggestions.append("Add more positive language to boost engagement")
        
        # Trend alignment suggestions
        if ai_analysis.get("trend_alignment", 0.5) < 0.6:
            suggestions.append("Incorporate more trending hashtags or topics")
        
        # Platform-specific suggestions
        platform_suggestions = {
            Platform.INSTAGRAM: "Consider using Instagram Reels format for higher reach",
            Platform.TIKTOK: "Add trending sounds or participate in viral challenges",
            Platform.YOUTUBE: "Optimize your thumbnail and title for better click-through rate",
            Platform.FACEBOOK: "Ask questions to encourage comments and discussions"
        }
        
        if request.platform in platform_suggestions:
            suggestions.append(platform_suggestions[request.platform])
        
        # Content length suggestions
        if request.content_length and request.content_length > 200:
            suggestions.append("Consider shortening your caption for better mobile readability")
        
        # Visual content suggestions
        if not request.has_visual:
            suggestions.append("Add compelling visuals to significantly boost engagement")
        
        # Hashtag suggestions
        if not request.hashtags or len(request.hashtags) < 3:
            suggestions.append("Use 5-10 relevant hashtags to improve discoverability")
        
        return suggestions[:4]  # Return top 4 suggestions
    
    async def _predict_best_posting_time(self, request: EngagementPredictionRequest) -> datetime:
        """Predict best posting time based on platform and category"""
        
        # Platform-specific optimal times (simplified)
        platform_times = {
            Platform.INSTAGRAM: [9, 11, 13, 17, 19],  # Peak hours
            Platform.TIKTOK: [6, 10, 14, 19, 22],
            Platform.YOUTUBE: [14, 16, 20, 21],
            Platform.FACEBOOK: [9, 13, 15, 18]
        }
        
        # Category-specific adjustments
        category_adjustments = {
            ContentCategory.FITNESS: [-2, -1],  # Earlier for fitness content
            ContentCategory.FOOD: [1, 2],       # Later for food content
            ContentCategory.BUSINESS: [-3, -2], # Business hours
            ContentCategory.GAMING: [2, 3, 4]   # Evening/night
        }
        
        base_times = platform_times.get(request.platform, [12, 15, 18])
        adjustments = category_adjustments.get(request.category, [0])
        
        # Pick a random optimal time
        base_hour = random.choice(base_times)
        adjustment = random.choice(adjustments)
        optimal_hour = max(6, min(23, base_hour + adjustment))
        
        # Calculate next optimal posting time
        now = datetime.utcnow()
        next_optimal = now.replace(hour=optimal_hour, minute=0, second=0, microsecond=0)
        
        # If the time has passed today, schedule for tomorrow
        if next_optimal <= now:
            next_optimal += timedelta(days=1)
        
        return next_optimal
    
    async def track_prediction_accuracy(self, prediction_id: str, actual_metrics: Dict[str, int]) -> PredictionAccuracyTracker:
        """Track accuracy of predictions for model improvement"""
        try:
            # In a real app, fetch the original prediction from database
            # For now, simulate accuracy calculation
            
            # Calculate accuracy scores for each metric
            accuracy_scores = {}
            metrics = ["likes", "shares", "comments", "reach"]
            
            for metric in metrics:
                if metric in actual_metrics:
                    # Simulate predicted value for calculation
                    predicted_value = random.randint(50, 1000)  # This would come from stored prediction
                    actual_value = actual_metrics[metric]
                    
                    # Calculate accuracy (1 - normalized absolute error)
                    if predicted_value > 0:
                        error = abs(predicted_value - actual_value) / predicted_value
                        accuracy = max(0, 1 - error)
                    else:
                        accuracy = 0.0
                    
                    accuracy_scores[metric] = round(accuracy, 3)
            
            # Calculate overall accuracy
            overall_accuracy = sum(accuracy_scores.values()) / len(accuracy_scores) if accuracy_scores else 0
            
            tracker = PredictionAccuracyTracker(
                prediction_id=prediction_id,
                actual_metrics=actual_metrics,
                accuracy_scores=accuracy_scores,
                overall_accuracy=round(overall_accuracy, 3)
            )
            
            # In a real app, save to database for model training
            # await database.prediction_accuracy.insert_one(tracker.dict())
            
            return tracker
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error tracking accuracy: {str(e)}")

# Create service instance
engagement_service = EngagementPredictionService()

# API Endpoints
@router.post("/predict", response_model=EngagementPrediction)
async def predict_engagement_endpoint(request: EngagementPredictionRequest):
    """Predict engagement for content"""
    return await engagement_service.predict_engagement(request)

@router.post("/track-accuracy")
async def track_prediction_accuracy(prediction_id: str, actual_metrics: Dict[str, int]):
    """Track prediction accuracy for model improvement"""
    return await engagement_service.track_prediction_accuracy(prediction_id, actual_metrics)

@router.get("/best-posting-time")
async def get_best_posting_time(
    user_id: str,
    platform: Platform,
    category: ContentCategory
):
    """Get predicted best posting time"""
    request = EngagementPredictionRequest(
        user_id=user_id,
        content_type=ContentType.CAPTION,
        category=category,
        platform=platform,
        content_preview="Sample content"
    )
    
    best_time = await engagement_service._predict_best_posting_time(request)
    
    return {
        "best_posting_time": best_time,
        "timezone_note": "Times shown in UTC",
        "confidence": "medium",
        "alternative_times": [
            best_time + timedelta(hours=2),
            best_time + timedelta(hours=4),
            best_time - timedelta(hours=1)
        ]
    }

@router.get("/engagement-insights/{user_id}")
async def get_engagement_insights(user_id: str, platform: Platform, category: ContentCategory):
    """Get AI-powered engagement insights for user"""
    
    # Simulate user's historical performance
    mock_request = EngagementPredictionRequest(
        user_id=user_id,
        content_type=ContentType.CAPTION,
        category=category,
        platform=platform,
        content_preview="Your typical content style"
    )
    
    prediction = await engagement_service.predict_engagement(mock_request)
    
    return {
        "platform_benchmark": engagement_service.platform_benchmarks[platform],
        "category_performance": engagement_service.category_modifiers[category],
        "your_predicted_performance": {
            "engagement_rate": prediction.predicted_engagement_rate,
            "confidence": prediction.confidence_score
        },
        "optimization_opportunities": prediction.optimization_suggestions,
        "best_practices": [
            f"Post during peak hours for {platform.value}",
            f"Optimize content for {category.value} audience",
            "Use engaging hooks in first 3 seconds",
            "Include relevant trending hashtags"
        ]
    }