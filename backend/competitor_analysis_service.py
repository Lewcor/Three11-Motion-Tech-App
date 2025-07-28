"""
AI-Powered Competitor Analysis Service
Provides intelligent competitor analysis and strategic insights for content creators
"""

import asyncio
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import re
import json
from urllib.parse import urlparse

from ai_service import AIService
from database import get_database
from models import CompetitorProfile, CompetitorAnalysis, AnalysisInsight


class CompetitorAnalysisService:
    """Service for AI-powered competitor analysis and strategic insights"""
    
    def __init__(self):
        self.ai_service = AIService()
        
    @property
    def db(self):
        """Get database instance dynamically"""
        return get_database()
        
    async def discover_competitor(self, query: str, user_id: str) -> Dict[str, Any]:
        """
        Discover competitor from name, handle, or URL
        Creates initial competitor profile
        """
        try:
            # Extract platform and handle information
            competitor_info = self._parse_competitor_query(query)
            
            # Generate comprehensive competitor profile using AI
            profile_prompt = f"""
            Analyze the competitor: {competitor_info['name']}
            
            Based on the provided information, create a comprehensive competitor profile including:
            1. Brand overview and positioning
            2. Target audience analysis  
            3. Content themes and categories
            4. Estimated platform presence
            5. Industry vertical and niche
            6. Brand personality and tone
            
            Provide detailed insights that would help a content creator understand this competitor.
            
            Format as JSON with clear sections for each analysis area.
            """
            
            # Use multiple AI providers for comprehensive analysis
            ai_analysis = await self._multi_ai_analysis(profile_prompt, "competitor_discovery")
            
            # Create competitor profile
            competitor_id = str(uuid.uuid4())
            profile_data = {
                "competitor_id": competitor_id,
                "name": competitor_info['name'],
                "original_query": query,
                "platforms": competitor_info.get('platforms', {}),
                "analysis_data": ai_analysis,
                "created_at": datetime.utcnow(),
                "last_updated": datetime.utcnow(),
                "created_by": user_id
            }
            
            # Store in database
            await self.db.competitor_profiles.insert_one(profile_data)
            
            return {
                "success": True,
                "competitor_id": competitor_id,
                "profile": profile_data,
                "message": f"Successfully discovered and analyzed competitor: {competitor_info['name']}"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to discover competitor: {str(e)}"
            }
    
    async def analyze_content_strategy(self, competitor_id: str, user_id: str) -> Dict[str, Any]:
        """
        Analyze competitor's content strategy across platforms
        """
        try:
            # Get competitor profile
            profile = await self.db.competitor_profiles.find_one({"competitor_id": competitor_id})
            if not profile:
                return {"success": False, "error": "Competitor not found"}
            
            # Content strategy analysis prompt
            strategy_prompt = f"""
            Perform a comprehensive content strategy analysis for competitor: {profile['name']}
            
            Based on typical social media content strategies, analyze and provide insights on:
            
            1. **Content Pillars**: What are their main content themes and pillars?
            2. **Posting Patterns**: Estimated posting frequency and timing strategies
            3. **Content Mix**: Balance between educational, entertaining, promotional content
            4. **Engagement Strategy**: How they likely drive engagement and interaction
            5. **Platform Adaptation**: How they might adapt content across different platforms
            6. **Trend Utilization**: How they likely capitalize on trending topics
            7. **Audience Targeting**: Who their content appears to target
            8. **Content Formats**: Types of content they likely use (videos, carousels, stories, etc.)
            
            For each insight, provide:
            - Detailed analysis
            - Strategic reasoning
            - Actionable recommendations for competing against this strategy
            - Specific content ideas to outperform them
            
            Focus on providing strategic intelligence that would help a competitor create superior content.
            
            Format as detailed JSON with clear sections and actionable insights.
            """
            
            # Get AI analysis
            strategy_analysis = await self._multi_ai_analysis(strategy_prompt, "content_strategy")
            
            # Store analysis
            analysis_id = str(uuid.uuid4())
            analysis_data = {
                "analysis_id": analysis_id,
                "competitor_id": competitor_id,
                "user_id": user_id,
                "analysis_type": "content_strategy",
                "insights": strategy_analysis,
                "created_at": datetime.utcnow()
            }
            
            await self.db.competitor_analyses.insert_one(analysis_data)
            
            return {
                "success": True,
                "analysis_id": analysis_id,
                "insights": strategy_analysis,
                "competitor_name": profile['name']
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to analyze content strategy: {str(e)}"
            }
    
    async def generate_competitive_content(self, competitor_id: str, content_type: str, user_id: str) -> Dict[str, Any]:
        """
        Generate content designed to outperform competitor
        """
        try:
            # Get competitor profile and recent analysis
            profile = await self.db.competitor_profiles.find_one({"competitor_id": competitor_id})
            if not profile:
                return {"success": False, "error": "Competitor not found"}
            
            # Get latest strategy analysis
            latest_analysis = await self.db.competitor_analyses.find_one(
                {"competitor_id": competitor_id, "analysis_type": "content_strategy"},
                sort=[("created_at", -1)]
            )
            
            competitive_prompt = f"""
            Create superior content to outperform competitor: {profile['name']}
            
            Content Type Requested: {content_type}
            
            Competitor Analysis Context:
            {json.dumps(latest_analysis.get('insights', {}) if latest_analysis else {}, indent=2)}
            
            Generate content that:
            1. **Directly Competes**: Addresses the same topics but with superior value
            2. **Exploits Gaps**: Covers areas they're missing or doing poorly
            3. **Differentiated Approach**: Takes a unique angle they haven't used
            4. **Higher Engagement**: Designed to generate more engagement than their content
            5. **Trend-Forward**: Incorporates latest trends they might be missing
            
            For each content suggestion, provide:
            - Compelling caption/script
            - Strategic hashtags
            - Visual/format recommendations
            - Engagement optimization tips
            - Why this will outperform competitor
            - Platform-specific adaptations
            
            Generate 5 high-quality content ideas with complete execution details.
            
            Format as JSON with detailed content specifications.
            """
            
            # Generate competitive content using AI
            competitive_content = await self._multi_ai_analysis(competitive_prompt, "competitive_content")
            
            # Store generated content
            generation_id = str(uuid.uuid4())
            content_data = {
                "generation_id": generation_id,
                "competitor_id": competitor_id,
                "user_id": user_id,
                "content_type": content_type,
                "generated_content": competitive_content,
                "created_at": datetime.utcnow()
            }
            
            await self.db.competitive_content.insert_one(content_data)
            
            return {
                "success": True,
                "generation_id": generation_id,
                "content": competitive_content,
                "competitor_name": profile['name']
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to generate competitive content: {str(e)}"
            }
    
    async def get_gap_analysis(self, competitor_id: str, user_id: str) -> Dict[str, Any]:
        """
        Identify opportunities and gaps in competitor strategy
        """
        try:
            profile = await self.db.competitor_profiles.find_one({"competitor_id": competitor_id})
            if not profile:
                return {"success": False, "error": "Competitor not found"}
            
            gap_analysis_prompt = f"""
            Perform a comprehensive gap analysis for competitor: {profile['name']}
            
            Identify strategic opportunities and gaps in their approach:
            
            1. **Content Gaps**: Topics or themes they're not covering
            2. **Platform Gaps**: Platforms they're underutilizing  
            3. **Audience Gaps**: Audience segments they're missing
            4. **Trend Gaps**: Trending topics they're not capitalizing on
            5. **Engagement Gaps**: Interaction opportunities they're missing
            6. **Format Gaps**: Content formats they're not using effectively
            7. **Timing Gaps**: Posting times or frequency opportunities
            8. **Community Gaps**: Community building opportunities they're missing
            
            For each gap identified, provide:
            - Detailed explanation of the opportunity
            - Why the competitor is missing this
            - Specific strategies to exploit this gap
            - Expected impact and competitive advantage
            - Implementation difficulty and timeline
            - Content ideas to capitalize on the gap
            
            Focus on actionable opportunities that could give a significant competitive advantage.
            
            Format as comprehensive JSON with prioritized opportunities.
            """
            
            gap_analysis = await self._multi_ai_analysis(gap_analysis_prompt, "gap_analysis")
            
            # Store gap analysis
            analysis_id = str(uuid.uuid4())
            analysis_data = {
                "analysis_id": analysis_id,
                "competitor_id": competitor_id,
                "user_id": user_id,
                "analysis_type": "gap_analysis",
                "insights": gap_analysis,
                "created_at": datetime.utcnow()
            }
            
            await self.db.competitor_analyses.insert_one(analysis_data)
            
            return {
                "success": True,
                "analysis_id": analysis_id,
                "gaps": gap_analysis,
                "competitor_name": profile['name']
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to perform gap analysis: {str(e)}"
            }
    
    async def get_user_competitors(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all competitors analyzed by user"""
        try:
            competitors = await self.db.competitor_profiles.find(
                {"created_by": user_id}
            ).sort("created_at", -1).to_list(100)
            
            # Convert ObjectId to string for JSON serialization
            for competitor in competitors:
                if '_id' in competitor:
                    competitor['_id'] = str(competitor['_id'])
                # Convert datetime objects to ISO format strings
                if 'created_at' in competitor and hasattr(competitor['created_at'], 'isoformat'):
                    competitor['created_at'] = competitor['created_at'].isoformat()
                if 'last_updated' in competitor and hasattr(competitor['last_updated'], 'isoformat'):
                    competitor['last_updated'] = competitor['last_updated'].isoformat()
            
            return competitors
            
        except Exception as e:
            return []
    
    def _parse_competitor_query(self, query: str) -> Dict[str, Any]:
        """Parse competitor query to extract name and platform info"""
        competitor_info = {
            "name": query.strip(),
            "platforms": {}
        }
        
        # Check if it's a URL
        if query.startswith(('http://', 'https://')):
            parsed = urlparse(query)
            domain = parsed.netloc.lower()
            
            if 'tiktok.com' in domain:
                competitor_info['platforms']['tiktok'] = query
                # Extract username from TikTok URL
                path_parts = parsed.path.strip('/').split('/')
                if path_parts and path_parts[0].startswith('@'):
                    competitor_info['name'] = path_parts[0][1:]  # Remove @
            elif 'instagram.com' in domain:
                competitor_info['platforms']['instagram'] = query
                path_parts = parsed.path.strip('/').split('/')
                if path_parts:
                    competitor_info['name'] = path_parts[0]
            elif 'youtube.com' in domain:
                competitor_info['platforms']['youtube'] = query
            elif 'facebook.com' in domain:
                competitor_info['platforms']['facebook'] = query
        
        # Check if it's a handle (starts with @)
        elif query.startswith('@'):
            competitor_info['name'] = query[1:]  # Remove @
        
        return competitor_info
    
    async def _multi_ai_analysis(self, prompt: str, analysis_type: str) -> Dict[str, Any]:
        """Use multiple AI providers for comprehensive analysis"""
        try:
            # Use all three AI providers for different perspectives
            providers = ['openai', 'anthropic', 'gemini']
            results = {}
            
            for provider in providers:
                try:
                    result = await self.ai_service.generate_content(
                        prompt=prompt,
                        provider=provider,
                        max_tokens=2000
                    )
                    results[f"{provider}_analysis"] = result
                except Exception as e:
                    print(f"Error with {provider}: {e}")
                    continue
            
            # Combine insights from all providers
            if results:
                synthesis_prompt = f"""
                Synthesize the following AI analyses into a comprehensive, actionable report:
                
                {json.dumps(results, indent=2)}
                
                Create a unified analysis that:
                1. Combines the best insights from all analyses
                2. Removes redundancy and contradictions
                3. Provides clear, actionable recommendations
                4. Maintains strategic depth and specificity
                5. Formats as clear, structured JSON
                
                Focus on delivering maximum value and actionability.
                """
                
                # Use the best available provider for synthesis
                final_result = await self.ai_service.generate_content(
                    prompt=synthesis_prompt,
                    provider='anthropic',  # Claude is great for synthesis
                    max_tokens=2500
                )
                
                return {
                    "synthesized_analysis": final_result,
                    "individual_analyses": results,
                    "analysis_type": analysis_type,
                    "providers_used": list(results.keys()),
                    "timestamp": datetime.utcnow().isoformat()
                }
            else:
                return {
                    "error": "No AI providers available",
                    "analysis_type": analysis_type,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            return {
                "error": f"Multi-AI analysis failed: {str(e)}",
                "analysis_type": analysis_type,
                "timestamp": datetime.utcnow().isoformat()
            }


# Initialize service instance
competitor_service = CompetitorAnalysisService()