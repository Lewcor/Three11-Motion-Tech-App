from emergentintegrations.llm.chat import LlmChat, UserMessage
from typing import Dict, List, Optional
import asyncio
import time
import os
import logging
from datetime import datetime, timedelta
from models import (
    AIProvider, ContentCategory, Platform, ContentType, ContentTemplate, 
    PostTiming, ContentIdeaRequest, ContentIdeaResponse, VideoScriptRequest,
    VideoScriptResponse, ContentStrategyRequest, ContentStrategyResponse,
    TrendingTopic, ContentCalendar, BrandVoice
)

logger = logging.getLogger(__name__)

class ContentCreationService:
    def __init__(self):
        self.openai_key = os.environ.get('OPENAI_API_KEY')
        self.anthropic_key = os.environ.get('ANTHROPIC_API_KEY')
        self.gemini_key = os.environ.get('GEMINI_API_KEY')
        
        # Content creation system messages
        self.content_creation_messages = {
            ContentType.CONTENT_IDEA: "You are a creative content strategist who generates engaging, viral content ideas. Focus on trending topics, audience engagement, and platform-specific best practices.",
            ContentType.VIDEO_SCRIPT: "You are a skilled video scriptwriter who creates compelling scripts for social media videos. Include hooks, main content, and strong calls-to-action.",
            ContentType.BLOG_OUTLINE: "You are an expert content writer who creates detailed blog outlines. Structure content for maximum engagement and SEO optimization.",
            ContentType.STORY_ARC: "You are a storytelling expert who creates compelling narrative arcs for content series. Focus on character development, conflict, and resolution.",
            ContentType.HOOK: "You are a copywriting expert who creates irresistible hooks that grab attention instantly. Make them curiosity-driven and platform-optimized.",
            ContentType.CTA: "You are a conversion optimization expert who creates compelling calls-to-action that drive engagement and conversions.",
            ContentType.TRENDING_TOPIC: "You are a trend analyst who identifies and explains current trending topics. Focus on relevance, engagement potential, and timing.",
            ContentType.CONTENT_STRATEGY: "You are a content strategy consultant who creates comprehensive content plans. Focus on audience growth, engagement optimization, and platform algorithms."
        }
        
        # Platform-specific content guidelines
        self.platform_content_guidelines = {
            Platform.TIKTOK: {
                "video_length": "15-60 seconds",
                "style": "Fast-paced, trendy, viral",
                "hooks": "First 3 seconds are crucial",
                "cta": "Follow for more, Like if you agree",
                "best_times": [PostTiming.EVENING, PostTiming.LATE_NIGHT]
            },
            Platform.INSTAGRAM: {
                "video_length": "15-90 seconds",
                "style": "Aesthetic, story-driven, engaging",
                "hooks": "Visual and text hooks",
                "cta": "Save this post, Share your thoughts",
                "best_times": [PostTiming.MORNING, PostTiming.EVENING]
            },
            Platform.YOUTUBE: {
                "video_length": "3-15 minutes",
                "style": "Educational, entertaining, value-driven",
                "hooks": "Problem-solution focused",
                "cta": "Subscribe and hit the bell",
                "best_times": [PostTiming.AFTERNOON, PostTiming.EVENING]
            },
            Platform.FACEBOOK: {
                "video_length": "1-5 minutes",
                "style": "Community-focused, conversational, engaging",
                "hooks": "Question-based, relatable",
                "cta": "Share your experience, Tag a friend",
                "best_times": [PostTiming.MORNING, PostTiming.AFTERNOON]
            }
        }
        
        # Content templates
        self.content_templates = {
            ContentTemplate.EDUCATIONAL: "Focus on teaching, explaining, and providing value. Use step-by-step formats and actionable insights.",
            ContentTemplate.ENTERTAINING: "Focus on humor, storytelling, and emotional engagement. Make it fun and shareable.",
            ContentTemplate.PROMOTIONAL: "Focus on products, services, or personal brand. Balance value with promotion.",
            ContentTemplate.INSPIRATIONAL: "Focus on motivation, success stories, and personal growth. Inspire action and positive change.",
            ContentTemplate.TUTORIAL: "Focus on how-to content with clear steps and demonstrations. Make it easy to follow.",
            ContentTemplate.BEHIND_SCENES: "Focus on process, authenticity, and personal connection. Show the human side.",
            ContentTemplate.USER_GENERATED: "Focus on community, testimonials, and user experiences. Encourage participation.",
            ContentTemplate.SEASONAL: "Focus on holidays, seasons, and timely events. Create urgency and relevance."
        }

    async def create_content_chat(self, content_type: ContentType, category: ContentCategory, 
                                provider: AIProvider = AIProvider.OPENAI) -> LlmChat:
        """Create a chat instance optimized for content creation"""
        session_id = f"{provider.value}_{content_type.value}_{category.value}_{int(time.time())}"
        system_message = self.content_creation_messages.get(content_type, 
                                                          "You are a helpful content creation assistant.")
        
        if provider == AIProvider.OPENAI:
            chat = LlmChat(
                api_key=self.openai_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4o").with_max_tokens(800)
            
        elif provider == AIProvider.ANTHROPIC:
            chat = LlmChat(
                api_key=self.anthropic_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("anthropic", "claude-3-5-sonnet-20241022").with_max_tokens(800)
            
        elif provider == AIProvider.GEMINI:
            chat = LlmChat(
                api_key=self.gemini_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("gemini", "gemini-2.0-flash").with_max_tokens(800)
            
        return chat

    async def generate_content_ideas(self, request: ContentIdeaRequest) -> ContentIdeaResponse:
        """Generate content ideas based on category and platform"""
        try:
            chat = await self.create_content_chat(request.content_type, request.category)
            
            platform_guide = self.platform_content_guidelines.get(request.platform, {})
            template_guide = self.content_templates.get(request.template, "") if request.template else ""
            
            prompt = f"""
Generate {request.quantity} engaging content ideas for {request.category.value} on {request.platform.value}.

Platform Guidelines: {platform_guide}
Content Template: {template_guide}
{f"Audience Focus: {request.audience_focus}" if request.audience_focus else ""}

Requirements:
- Ideas should be viral and engaging
- Platform-specific optimization
- Include current trends when relevant
- Mix of content types (educational, entertaining, promotional)
- Each idea should be actionable and specific

Format: Return each idea as a complete, ready-to-use concept.

Content Ideas:"""

            message = UserMessage(text=prompt)
            response = await chat.send_message(message)
            
            # Parse ideas from response
            ideas = [idea.strip() for idea in response.split('\n') if idea.strip() and not idea.startswith('Content Ideas:')]
            
            # Generate trending topics
            trending_topics = await self.get_trending_topics(request.category, request.platform)
            
            return ContentIdeaResponse(
                content_type=request.content_type,
                ideas=ideas[:request.quantity],
                trending_topics=trending_topics
            )
            
        except Exception as e:
            logger.error(f"Error generating content ideas: {e}")
            raise

    async def generate_video_script(self, request: VideoScriptRequest) -> VideoScriptResponse:
        """Generate a complete video script"""
        try:
            chat = await self.create_content_chat(ContentType.VIDEO_SCRIPT, request.category)
            
            platform_guide = self.platform_content_guidelines.get(request.platform, {})
            template_guide = self.content_templates.get(request.style, "")
            
            prompt = f"""
Create a complete video script for {request.platform.value} about: {request.topic}

Platform: {request.platform.value}
Duration: {request.duration} seconds
Style: {request.style.value}
Category: {request.category.value}

Platform Guidelines: {platform_guide}
Style Guidelines: {template_guide}

Script Structure:
1. HOOK (0-3 seconds): Attention-grabbing opener
2. MAIN CONTENT: Core message with clear structure
3. CALL-TO-ACTION: Strong ending that drives engagement

Requirements:
- Include timestamp markers
- Write for spoken word (conversational tone)
- Include visual cues and transitions
- Optimize for {request.platform.value} algorithm
- Keep within {request.duration} seconds

Format:
HOOK: [0-3s] 
MAIN CONTENT: [3-{request.duration-10}s]
CALL-TO-ACTION: [{request.duration-10}-{request.duration}s]

Video Script:"""

            message = UserMessage(text=prompt)
            response = await chat.send_message(message)
            
            # Parse script components
            lines = response.split('\n')
            hook = ""
            main_content = ""
            cta = ""
            timestamps = []
            
            current_section = None
            for line in lines:
                line = line.strip()
                if line.startswith('HOOK:'):
                    current_section = 'hook'
                    hook = line.replace('HOOK:', '').strip()
                elif line.startswith('MAIN CONTENT:'):
                    current_section = 'main'
                    main_content = line.replace('MAIN CONTENT:', '').strip()
                elif line.startswith('CALL-TO-ACTION:'):
                    current_section = 'cta'
                    cta = line.replace('CALL-TO-ACTION:', '').strip()
                elif line and current_section:
                    if current_section == 'hook':
                        hook += f" {line}"
                    elif current_section == 'main':
                        main_content += f" {line}"
                    elif current_section == 'cta':
                        cta += f" {line}"
            
            # Generate timestamps
            timestamps = [
                {"time": "0-3s", "content": "Hook", "text": hook},
                {"time": f"3-{request.duration-10}s", "content": "Main Content", "text": main_content},
                {"time": f"{request.duration-10}-{request.duration}s", "content": "Call-to-Action", "text": cta}
            ]
            
            return VideoScriptResponse(
                hook=hook,
                main_content=main_content,
                call_to_action=cta,
                timestamps=timestamps,
                estimated_duration=request.duration
            )
            
        except Exception as e:
            logger.error(f"Error generating video script: {e}")
            raise

    async def generate_content_strategy(self, request: ContentStrategyRequest) -> ContentStrategyResponse:
        """Generate comprehensive content strategy"""
        try:
            chat = await self.create_content_chat(ContentType.CONTENT_STRATEGY, request.category)
            
            platform_guide = self.platform_content_guidelines.get(request.platform, {})
            
            prompt = f"""
Create a comprehensive content strategy for {request.category.value} on {request.platform.value}.

Current Situation:
- Platform: {request.platform.value}
- Category: {request.category.value}
- Audience Size: {request.audience_size or 'Starting out'}
- Posting Frequency: {request.posting_frequency} posts per week
- Goals: {', '.join(request.goals) if request.goals else 'Growth and engagement'}

Platform Guidelines: {platform_guide}

Create a strategy that includes:
1. Weekly content plan with specific post types
2. Best posting times for maximum engagement
3. Content mix percentages (educational, entertaining, promotional, etc.)
4. Current trending opportunities
5. Growth recommendations

Format your response as a structured strategy plan.

Content Strategy:"""

            message = UserMessage(text=prompt)
            response = await chat.send_message(message)
            
            # Parse strategy components (simplified for now)
            weekly_plan = [
                {"day": "Monday", "content_type": "Educational", "topic": "Industry insights"},
                {"day": "Tuesday", "content_type": "Behind-the-scenes", "topic": "Process sharing"},
                {"day": "Wednesday", "content_type": "Entertaining", "topic": "Trending content"},
                {"day": "Thursday", "content_type": "Tutorial", "topic": "How-to content"},
                {"day": "Friday", "content_type": "Community", "topic": "User engagement"},
                {"day": "Saturday", "content_type": "Inspirational", "topic": "Motivation"},
                {"day": "Sunday", "content_type": "Personal", "topic": "Authentic sharing"}
            ]
            
            best_times = platform_guide.get('best_times', [PostTiming.MORNING, PostTiming.EVENING])
            
            content_mix = {
                "educational": 30.0,
                "entertaining": 25.0,
                "promotional": 15.0,
                "inspirational": 20.0,
                "behind_scenes": 10.0
            }
            
            trending_topics = await self.get_trending_topics(request.category, request.platform)
            
            growth_recommendations = [
                "Post consistently at optimal times",
                "Engage with your audience within 1 hour of posting",
                "Use relevant hashtags and trending sounds",
                "Create content series for better retention",
                "Collaborate with other creators in your niche"
            ]
            
            return ContentStrategyResponse(
                weekly_plan=weekly_plan,
                best_posting_times=best_times,
                content_mix=content_mix,
                trending_opportunities=trending_topics,
                growth_recommendations=growth_recommendations
            )
            
        except Exception as e:
            logger.error(f"Error generating content strategy: {e}")
            raise

    async def get_trending_topics(self, category: ContentCategory, platform: Platform) -> List[str]:
        """Get trending topics for category and platform"""
        try:
            # This would typically integrate with real trending APIs
            # For now, we'll generate trending topics using AI
            
            chat = await self.create_content_chat(ContentType.TRENDING_TOPIC, category)
            
            prompt = f"""
List 5 current trending topics for {category.value} content on {platform.value}.

Focus on:
- What's actually trending right now
- Topics with high engagement potential
- Platform-specific trends
- Seasonal relevance

Format: Return as a simple list of trending topics.

Trending Topics:"""

            message = UserMessage(text=prompt)
            response = await chat.send_message(message)
            
            topics = [topic.strip().replace('- ', '') for topic in response.split('\n') 
                     if topic.strip() and not topic.startswith('Trending Topics:')]
            
            return topics[:5]
            
        except Exception as e:
            logger.error(f"Error getting trending topics: {e}")
            return [
                f"Trending in {category.value}",
                f"Latest {category.value} updates",
                f"Popular {category.value} content",
                f"{category.value} tips and tricks",
                f"Viral {category.value} trends"
            ]

    async def generate_hooks(self, topic: str, platform: Platform, quantity: int = 5) -> List[str]:
        """Generate attention-grabbing hooks"""
        try:
            chat = await self.create_content_chat(ContentType.HOOK, ContentCategory.BUSINESS)
            
            platform_guide = self.platform_content_guidelines.get(platform, {})
            
            prompt = f"""
Generate {quantity} attention-grabbing hooks for content about: {topic}

Platform: {platform.value}
Platform Guidelines: {platform_guide}

Hook Requirements:
- First 3 seconds are crucial
- Create curiosity or urgency
- Make viewers want to keep watching
- Platform-optimized
- Avoid clickbait, be authentic

Format: Return each hook on a new line.

Hooks:"""

            message = UserMessage(text=prompt)
            response = await chat.send_message(message)
            
            hooks = [hook.strip() for hook in response.split('\n') 
                    if hook.strip() and not hook.startswith('Hooks:')]
            
            return hooks[:quantity]
            
        except Exception as e:
            logger.error(f"Error generating hooks: {e}")
            return [f"Hook about {topic}" for _ in range(quantity)]

    async def generate_cta(self, goal: str, platform: Platform, quantity: int = 3) -> List[str]:
        """Generate compelling calls-to-action"""
        try:
            chat = await self.create_content_chat(ContentType.CTA, ContentCategory.BUSINESS)
            
            platform_guide = self.platform_content_guidelines.get(platform, {})
            
            prompt = f"""
Generate {quantity} compelling calls-to-action for {goal} on {platform.value}.

Platform: {platform.value}
Goal: {goal}
Platform Guidelines: {platform_guide}

CTA Requirements:
- Clear and specific action
- Create urgency when appropriate
- Platform-optimized
- Drive the desired outcome
- Feel natural and authentic

Format: Return each CTA on a new line.

CTAs:"""

            message = UserMessage(text=prompt)
            response = await chat.send_message(message)
            
            ctas = [cta.strip() for cta in response.split('\n') 
                   if cta.strip() and not cta.startswith('CTAs:')]
            
            return ctas[:quantity]
            
        except Exception as e:
            logger.error(f"Error generating CTAs: {e}")
            return [f"Call-to-action for {goal}" for _ in range(quantity)]

# Create global content creation service instance
content_creation_service = ContentCreationService()