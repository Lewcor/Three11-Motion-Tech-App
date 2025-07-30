from emergentintegrations.llm.chat import LlmChat, UserMessage
from typing import Dict, List, Optional
import asyncio
import time
import os
import logging
from models import AIProvider, ContentCategory, Platform, AIResponse

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.openai_key = os.environ.get('OPENAI_API_KEY')
        self.anthropic_key = os.environ.get('ANTHROPIC_API_KEY')
        self.gemini_key = os.environ.get('GEMINI_API_KEY')
        self.perplexity_key = os.environ.get('PERPLEXITY_API_KEY')  # Will be added when ready
        
        # Advanced AI Models - Latest and Most Powerful
        self.model_versions = {
            AIProvider.OPENAI: "gpt-4o",  # Latest OpenAI multimodal model
            AIProvider.ANTHROPIC: "claude-3-5-sonnet-20241022",  # Latest Claude 3.5 Sonnet
            AIProvider.GEMINI: "gemini-2.0-flash-exp",  # Latest Gemini 2.0 Flash Experimental
            AIProvider.PERPLEXITY: "sonar-pro"  # Real-time web search model
        }
        
        # Provider capabilities
        self.provider_capabilities = {
            AIProvider.OPENAI: {
                "name": "GPT-4o",
                "description": "Advanced multimodal AI with vision, coding, and reasoning",
                "strengths": ["Creative writing", "Technical content", "Multimodal processing"],
                "best_for": ["Complex reasoning", "Code generation", "Image analysis"]
            },
            AIProvider.ANTHROPIC: {
                "name": "Claude 3.5 Sonnet",
                "description": "Most intelligent Claude model with superior reasoning",
                "strengths": ["Analysis", "Writing quality", "Complex reasoning"],
                "best_for": ["Long-form content", "Research", "Critical thinking"]
            },
            AIProvider.GEMINI: {
                "name": "Gemini 2.0 Flash",
                "description": "Fastest multimodal model with real-time capabilities",
                "strengths": ["Speed", "Multimodal", "Real-time processing"],
                "best_for": ["Quick responses", "Video analysis", "Live interactions"]
            },
            AIProvider.PERPLEXITY: {
                "name": "Sonar Pro",
                "description": "Real-time web search with current information",
                "strengths": ["Current events", "Trend analysis", "Real-time data"],
                "best_for": ["Trending topics", "Current affairs", "Market research"]
            }
        }
        
        # System messages for different content types
        self.system_messages = {
            ContentCategory.FASHION: "You are a fashion-savvy social media expert who creates engaging, trendy captions for fashion content. Write captions that inspire style confidence and encourage engagement.",
            ContentCategory.FITNESS: "You are a fitness motivator and social media expert who creates inspiring, energetic captions for fitness content. Focus on motivation, progress, and healthy lifestyle messages.",
            ContentCategory.FOOD: "You are a food enthusiast and social media expert who creates mouth-watering, engaging captions for food content. Make people crave the food and want to try it.",
            ContentCategory.TRAVEL: "You are a travel influencer and social media expert who creates wanderlust-inspiring captions for travel content. Capture the adventure and beauty of destinations.",
            ContentCategory.BUSINESS: "You are a business expert and social media strategist who creates professional, engaging captions for business content. Focus on value, insights, and professional growth.",
            ContentCategory.GAMING: "You are a gaming enthusiast and social media expert who creates exciting, community-focused captions for gaming content. Engage with gaming culture and trends.",
            ContentCategory.MUSIC: "You are a music lover and social media expert who creates emotionally resonant captions for music content. Connect with the universal language of music.",
            ContentCategory.IDEAS: "You are a creative writing mentor and social media expert who creates inspiring captions for creative content. Focus on creativity, storytelling, and artistic expression.",
            ContentCategory.EVENT_SPACE: "You are an event planning expert and social media strategist who creates compelling captions for event venue and space rental content. Focus on atmosphere, unique features, and memorable experiences."
        }
        
        # Platform-specific guidelines
        self.platform_guidelines = {
            Platform.TIKTOK: "Keep it short, trendy, and engaging. Use hashtags that TikTok users love. Include emojis and make it fun.",
            Platform.INSTAGRAM: "Make it visually appealing with emojis. Can be longer but keep it engaging. Perfect for storytelling.",
            Platform.YOUTUBE: "Can be longer and more descriptive. Focus on compelling hooks and clear value propositions.",
            Platform.FACEBOOK: "Focus on community engagement and conversations. Great for longer-form content and storytelling. Encourage comments and shares."
        }

    async def create_ai_chat(self, provider: AIProvider, category: ContentCategory) -> LlmChat:
        """Create a new AI chat instance for the given provider and category"""
        session_id = f"{provider.value}_{category.value}_{int(time.time())}"
        system_message = self.system_messages.get(category, "You are a helpful social media expert.")
        
        if provider == AIProvider.OPENAI:
            chat = LlmChat(
                api_key=self.openai_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4o").with_max_tokens(400)  # Latest GPT-4o
            
        elif provider == AIProvider.ANTHROPIC:
            chat = LlmChat(
                api_key=self.anthropic_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("anthropic", "claude-3-5-sonnet-20241022").with_max_tokens(400)  # Latest Claude 3.5 Sonnet
            
        elif provider == AIProvider.GEMINI:
            chat = LlmChat(
                api_key=self.gemini_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("gemini", "gemini-2.0-flash-exp").with_max_tokens(400)  # Latest Gemini 2.0 Flash Experimental
            
        elif provider == AIProvider.PERPLEXITY:
            if not self.perplexity_key:
                raise ValueError("Perplexity API key not configured")
            chat = LlmChat(
                api_key=self.perplexity_key,
                session_id=session_id,
                system_message=system_message + " Use current web data for trending and relevant content."
            ).with_model("perplexity", "sonar-pro").with_max_tokens(400)  # Real-time web search
            
        else:
            raise ValueError(f"Unsupported AI provider: {provider}")
        
        return chat

    async def generate_caption(self, provider: AIProvider, category: ContentCategory, 
                             platform: Platform, content_description: str) -> AIResponse:
        """Generate a caption using the specified AI provider"""
        start_time = time.time()
        
        try:
            chat = await self.create_ai_chat(provider, category)
            
            # Create platform-specific prompt
            platform_guide = self.platform_guidelines.get(platform, "")
            prompt = f"""
Create an engaging social media caption for {platform.value} based on this content:

Content Description: {content_description}

Platform Guidelines: {platform_guide}

Requirements:
- Make it engaging and shareable
- Include appropriate emojis
- Write in a conversational tone
- Focus on the {category.value} niche
- Make it feel authentic and relatable
- Keep it appropriate for {platform.value}

Caption:"""

            message = UserMessage(text=prompt)
            response = await chat.send_message(message)
            
            generation_time = time.time() - start_time
            
            return AIResponse(
                provider=provider,
                caption=response.strip(),
                generation_time=generation_time,
                success=True
            )
            
        except Exception as e:
            generation_time = time.time() - start_time
            logger.error(f"Error generating caption with {provider.value}: {e}")
            
            return AIResponse(
                provider=provider,
                caption="",
                generation_time=generation_time,
                success=False,
                error=str(e)
            )

    async def generate_hashtags(self, category: ContentCategory, platform: Platform, 
                              content_description: str) -> List[str]:
        """Generate relevant hashtags for the content"""
        try:
            # Use OpenAI for hashtag generation
            chat = await self.create_ai_chat(AIProvider.OPENAI, category)
            
            prompt = f"""
Generate 15 relevant hashtags for this {category.value} content on {platform.value}:

Content: {content_description}

Requirements:
- Mix of popular and niche hashtags
- Relevant to {category.value} and {platform.value}
- Include trending hashtags when appropriate
- Format: #hashtag (one per line)
- Make them discoverable and engaging

Hashtags:"""

            message = UserMessage(text=prompt)
            response = await chat.send_message(message)
            
            # Parse hashtags from response
            hashtags = []
            for line in response.strip().split('\n'):
                line = line.strip()
                if line.startswith('#'):
                    hashtags.append(line)
                elif line and not line.startswith('#'):
                    hashtags.append(f"#{line}")
            
            return hashtags[:15]  # Limit to 15 hashtags
            
        except Exception as e:
            logger.error(f"Error generating hashtags: {e}")
            # Return default hashtags based on category
            return self.get_default_hashtags(category, platform)

    def get_default_hashtags(self, category: ContentCategory, platform: Platform) -> List[str]:
        """Get default hashtags when AI generation fails"""
        base_hashtags = {
            ContentCategory.FASHION: ["#fashion", "#style", "#ootd", "#fashionista", "#trendy"],
            ContentCategory.FITNESS: ["#fitness", "#workout", "#healthy", "#gym", "#motivation"],
            ContentCategory.FOOD: ["#food", "#foodie", "#delicious", "#recipe", "#yummy"],
            ContentCategory.TRAVEL: ["#travel", "#adventure", "#wanderlust", "#explore", "#vacation"],
            ContentCategory.BUSINESS: ["#business", "#entrepreneur", "#success", "#motivation", "#leadership"],
            ContentCategory.GAMING: ["#gaming", "#gamer", "#game", "#esports", "#gameplay"],
            ContentCategory.MUSIC: ["#music", "#musician", "#song", "#artist", "#audio"],
            ContentCategory.IDEAS: ["#creative", "#ideas", "#inspiration", "#writing", "#art"],
            ContentCategory.EVENT_SPACE: ["#eventspace", "#venue", "#rental", "#events", "#celebration"]
        }
        
        platform_hashtags = {
            Platform.TIKTOK: ["#tiktok", "#viral", "#fyp", "#trending"],
            Platform.INSTAGRAM: ["#instagram", "#insta", "#photo", "#instagood"],
            Platform.YOUTUBE: ["#youtube", "#video", "#subscribe", "#content"],
            Platform.FACEBOOK: ["#facebook", "#community", "#share", "#engage"]
        }
        
        hashtags = base_hashtags.get(category, ["#content", "#creative", "#social"])
        hashtags.extend(platform_hashtags.get(platform, []))
        
        return hashtags[:15]

    async def generate_combined_content(self, category: ContentCategory, platform: Platform,
                                      content_description: str, selected_providers: List[str]) -> Dict[str, AIResponse]:
        """Generate content using multiple AI providers and return all responses"""
        results = {}
        
        for provider_name in selected_providers:
            try:
                provider = AIProvider(provider_name)
                response = await self.generate_caption(provider, category, platform, content_description)
                results[provider_name] = response
            except Exception as e:
                logger.error(f"Error generating content with {provider_name}: {e}")
                results[provider_name] = AIResponse(
                    content=f"Error: {str(e)}",
                    provider=provider_name,
                    generation_time=0,
                    metadata={"error": True}
                )
        
        return results
    
    def get_provider_info(self, provider: AIProvider = None) -> Dict:
        """Get information about AI providers"""
        if provider:
            return self.provider_capabilities.get(provider, {})
        return self.provider_capabilities
    
    def get_available_providers(self) -> List[Dict]:
        """Get list of available AI providers with their capabilities"""
        available = []
        
        for provider in AIProvider:
            # Check if API key is available
            is_available = True
            if provider == AIProvider.OPENAI and not self.openai_key:
                is_available = False
            elif provider == AIProvider.ANTHROPIC and not self.anthropic_key:
                is_available = False
            elif provider == AIProvider.GEMINI and not self.gemini_key:
                is_available = False
            elif provider == AIProvider.PERPLEXITY and not self.perplexity_key:
                is_available = False
            
            provider_info = self.provider_capabilities.get(provider, {})
            available.append({
                "provider": provider.value,
                "available": is_available,
                "model": self.model_versions.get(provider, ""),
                **provider_info
            })
        
        return available
    
    async def generate_content(self, prompt: str, provider: str = "openai", max_tokens: int = 2000) -> str:
        """Generic content generation method for competitor analysis and other services"""
        try:
            # Map provider names to AIProvider enum
            provider_map = {
                "openai": AIProvider.OPENAI,
                "anthropic": AIProvider.ANTHROPIC,
                "gemini": AIProvider.GEMINI,
                "perplexity": AIProvider.PERPLEXITY
            }
            
            if provider not in provider_map:
                raise ValueError(f"Unsupported provider: {provider}")
            
            ai_provider = provider_map[provider]
            
            # Create a generic chat instance
            session_id = f"{provider}_generic_{int(time.time())}"
            system_message = "You are a helpful AI assistant that provides detailed, accurate, and actionable insights."
            
            if ai_provider == AIProvider.OPENAI:
                chat = LlmChat(
                    api_key=self.openai_key,
                    session_id=session_id,
                    system_message=system_message
                ).with_model("openai", "gpt-4o").with_max_tokens(max_tokens)  # Latest GPT-4o
                
            elif ai_provider == AIProvider.ANTHROPIC:
                chat = LlmChat(
                    api_key=self.anthropic_key,
                    session_id=session_id,
                    system_message=system_message
                ).with_model("anthropic", "claude-3-5-sonnet-20241022").with_max_tokens(max_tokens)  # Latest Claude 3.5 Sonnet
                
            elif ai_provider == AIProvider.GEMINI:
                chat = LlmChat(
                    api_key=self.gemini_key,
                    session_id=session_id,
                    system_message=system_message
                ).with_model("gemini", "gemini-2.0-flash-exp").with_max_tokens(max_tokens)  # Latest Gemini 2.0 Flash Experimental
                
            elif ai_provider == AIProvider.PERPLEXITY:
                if not self.perplexity_key:
                    raise ValueError("Perplexity API key not configured")
                chat = LlmChat(
                    api_key=self.perplexity_key,
                    session_id=session_id,
                    system_message=system_message + " Use current web data and real-time information for accurate insights."
                ).with_model("perplexity", "sonar-pro").with_max_tokens(max_tokens)  # Real-time web search
            
            message = UserMessage(text=prompt)
            response = await chat.send_message(message)
            
            # Handle different response types
            if hasattr(response, 'text'):
                return response.text
            elif isinstance(response, str):
                return response
            else:
                return str(response)
            
        except Exception as e:
            logger.error(f"Error generating content with {provider}: {e}")
            return f"Error generating content: {str(e)}"

# Create global AI service instance
ai_service = AIService()