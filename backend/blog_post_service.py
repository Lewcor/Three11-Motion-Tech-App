from typing import List, Dict, Any, Optional
import uuid
import logging
import re
from datetime import datetime
from models import *
from ai_service import ai_service
from database import get_database

logger = logging.getLogger(__name__)

class BlogPostService:
    def __init__(self):
        self.db = None
    
    async def initialize(self):
        """Initialize database connection"""
        if not self.db:
            self.db = get_database()
    
    async def generate_blog_post(self, request: BlogPostRequest) -> BlogPostResult:
        """Generate SEO-optimized blog post"""
        await self.initialize()
        
        # Create blog post record
        blog_post = BlogPost(
            user_id=request.user_id,
            title=request.topic,
            target_keywords=request.target_keywords,
            word_count_target=request.word_count_target,
            audience=request.audience,
            purpose=request.purpose,
            tone=request.tone
        )
        
        await self.db.blog_posts.insert_one(blog_post.dict())
        
        # Generate blog content
        title = ""
        meta_description = ""
        outline = []
        content = ""
        social_snippets = {}
        suggested_images = []
        internal_link_suggestions = []
        
        for provider in request.ai_providers:
            try:
                # Generate comprehensive blog content
                blog_data = await self._generate_blog_content(request, provider.value)
                
                if not title:  # Use first provider's data as primary
                    title = blog_data.get("title", request.topic)
                    meta_description = blog_data.get("meta_description", "")
                    content = blog_data.get("content", "")
                    outline = blog_data.get("outline", [])
                
                # Generate additional SEO elements
                if request.include_social_snippets:
                    social_data = await self._generate_social_snippets(request, provider.value, title)
                    social_snippets.update(social_data)
                
                if request.seo_focus:
                    seo_data = await self._generate_seo_suggestions(request, provider.value)
                    suggested_images.extend(seo_data.get("images", []))
                    internal_link_suggestions.extend(seo_data.get("internal_links", []))
                
            except Exception as e:
                logger.error(f"Error generating blog content with {provider.value}: {e}")
        
        # Calculate metrics
        word_count = len(content.split()) if content else 0
        readability_score = self._calculate_readability_score(content)
        seo_score = self._calculate_seo_score(content, request.target_keywords)
        
        # Create result
        result = BlogPostResult(
            user_id=request.user_id,
            blog_post_id=blog_post.id,
            title=title,
            meta_description=meta_description,
            outline=outline,
            content=content,
            word_count=word_count,
            readability_score=readability_score,
            seo_score=seo_score,
            social_snippets=social_snippets,
            suggested_images=list(set(suggested_images)),
            internal_link_suggestions=list(set(internal_link_suggestions))
        )
        
        await self.db.blog_post_results.insert_one(result.dict())
        return result
    
    async def _generate_blog_content(self, request: BlogPostRequest, provider: str) -> Dict[str, Any]:
        """Generate comprehensive blog post content"""
        keywords_str = ", ".join(request.target_keywords)
        
        prompt = f"""
        Create a comprehensive, SEO-optimized blog post:
        
        Topic: {request.topic}
        Target Keywords: {keywords_str}
        Target Word Count: {request.word_count_target}
        Audience: {request.audience}
        Purpose: {request.purpose}
        Tone: {request.tone}
        Include Outline: {request.include_outline}
        Include Meta Description: {request.include_meta_description}
        SEO Focus: {request.seo_focus}
        
        Create the following:
        
        1. **TITLE** (SEO-optimized, includes primary keyword, under 60 characters)
        
        2. **META DESCRIPTION** (if include_meta_description=True):
        150-160 character description for search results
        
        3. **BLOG OUTLINE** (if include_outline=True):
        - Introduction
        - 3-5 main sections with subsections
        - Conclusion
        
        4. **FULL BLOG POST CONTENT**:
        - Engaging introduction that hooks readers
        - Well-structured main content with headers (H2, H3)
        - Natural keyword integration throughout
        - Value-driven content that serves the {request.purpose} purpose
        - Use {request.tone} tone throughout
        - Include bullet points and numbered lists where appropriate
        - Strong conclusion with clear takeaways
        - Target approximately {request.word_count_target} words
        
        SEO Requirements (if seo_focus=True):
        - Use target keywords naturally (1-2% density)
        - Include related semantic keywords
        - Optimize for featured snippets with Q&A format where relevant
        - Use proper header hierarchy (H1, H2, H3)
        - Include internal linking opportunities
        
        Content Guidelines:
        - Write for {request.audience} audience level
        - Ensure content is actionable and valuable
        - Include examples and case studies where relevant
        - Use transition words for better flow
        - Make it scannable with short paragraphs
        
        Format the response with clear section headers.
        """
        
        response = await ai_service.generate_content(prompt, provider, 2500)
        
        # Parse the response
        return self._parse_blog_response(response, request)
    
    def _parse_blog_response(self, response: str, request: BlogPostRequest) -> Dict[str, Any]:
        """Parse AI response into structured blog data"""
        lines = response.split('\n')
        
        title = ""
        meta_description = ""
        outline = []
        content = ""
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect sections
            if "TITLE" in line.upper() and current_section != "content":
                current_section = "title"
            elif "META DESCRIPTION" in line.upper():
                current_section = "meta"
            elif "OUTLINE" in line.upper():
                current_section = "outline"
            elif "FULL BLOG POST" in line.upper() or "CONTENT" in line.upper():
                current_section = "content"
            elif line.startswith('#') or line.startswith('**'):
                if current_section != "content":
                    current_section = None
            else:
                # Add content to appropriate section
                if current_section == "title" and not title:
                    title = line.strip('# "\'')
                elif current_section == "meta" and not meta_description:
                    meta_description = line
                elif current_section == "outline":
                    if line.startswith(('-', '•', '*')) or re.match(r'^\d+\.', line):
                        # Extract outline item
                        item_text = re.sub(r'^[-•*\d\.]\s*', '', line)
                        if item_text:
                            outline.append({"section": item_text, "points": []})
                elif current_section == "content":
                    content += line + "\n"
        
        # If no structured content found, use response as content
        if not content:
            content = response
            
        # Generate title if not found
        if not title:
            title = request.topic
            
        # Generate outline from content headers if not provided
        if not outline and request.include_outline:
            outline = self._extract_outline_from_content(content)
        
        return {
            "title": title,
            "meta_description": meta_description,
            "outline": outline,
            "content": content.strip()
        }
    
    def _extract_outline_from_content(self, content: str) -> List[Dict[str, str]]:
        """Extract outline from content headers"""
        outline = []
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith('##') and not line.startswith('###'):
                # H2 header
                section_title = line.lstrip('# ').strip()
                outline.append({"section": section_title, "points": []})
        
        return outline
    
    async def _generate_social_snippets(self, request: BlogPostRequest, provider: str, title: str) -> Dict[str, str]:
        """Generate social media snippets for blog post promotion"""
        prompt = f"""
        Create social media snippets to promote this blog post:
        
        Blog Title: {title}
        Topic: {request.topic}
        Audience: {request.audience}
        Key Message: {request.purpose}
        
        Create promotional snippets for:
        
        1. **TWITTER** (280 characters max):
        - Catchy hook
        - Key value proposition
        - Relevant hashtags
        - Link placeholder
        
        2. **LINKEDIN** (Professional, 1300 characters max):
        - Professional tone
        - Industry insights
        - Call for engagement
        - Link placeholder
        
        3. **FACEBOOK** (Conversational, engaging):
        - Conversational tone
        - Storytelling approach
        - Community engagement
        - Link placeholder
        
        Make each snippet platform-appropriate and engaging.
        Include relevant hashtags and engagement hooks.
        """
        
        response = await ai_service.generate_content(prompt, provider, 800)
        
        # Parse social snippets
        snippets = {}
        lines = response.split('\n')
        current_platform = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if "TWITTER" in line.upper():
                current_platform = "twitter"
                snippets[current_platform] = ""
            elif "LINKEDIN" in line.upper():
                current_platform = "linkedin"
                snippets[current_platform] = ""
            elif "FACEBOOK" in line.upper():
                current_platform = "facebook"
                snippets[current_platform] = ""
            elif current_platform and not line.startswith('#') and not line.startswith('**'):
                snippets[current_platform] += line + " "
        
        # Clean up snippets
        for platform in snippets:
            snippets[platform] = snippets[platform].strip()
        
        return snippets
    
    async def _generate_seo_suggestions(self, request: BlogPostRequest, provider: str) -> Dict[str, List[str]]:
        """Generate SEO suggestions for the blog post"""
        prompt = f"""
        Provide SEO optimization suggestions for this blog post:
        
        Topic: {request.topic}
        Target Keywords: {", ".join(request.target_keywords)}
        Audience: {request.audience}
        
        Suggest:
        
        1. **SUGGESTED IMAGES** (5-7 image ideas):
        - Hero image concepts
        - Supporting visual concepts
        - Infographic ideas
        - Screenshot suggestions
        
        2. **INTERNAL LINK OPPORTUNITIES** (5-7 related topics):
        - Related blog post topics to link to
        - Resource page opportunities
        - Category page connections
        
        Focus on practical, actionable suggestions.
        Make image suggestions specific and relevant to the content.
        Internal links should be topically related and valuable for readers.
        """
        
        response = await ai_service.generate_content(prompt, provider, 600)
        
        images = []
        internal_links = []
        lines = response.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if "IMAGES" in line.upper() or "IMAGE" in line.upper():
                current_section = "images"
            elif "INTERNAL" in line.upper() or "LINK" in line.upper():
                current_section = "links"
            elif line.startswith(('-', '•', '*')) or re.match(r'^\d+\.', line):
                # Extract suggestion
                suggestion = re.sub(r'^[-•*\d\.]\s*', '', line)
                if current_section == "images" and suggestion:
                    images.append(suggestion)
                elif current_section == "links" and suggestion:
                    internal_links.append(suggestion)
        
        return {
            "images": images,
            "internal_links": internal_links
        }
    
    def _calculate_readability_score(self, content: str) -> float:
        """Calculate simple readability score (Flesch Reading Ease approximation)"""
        if not content:
            return 0.0
            
        sentences = len(re.split(r'[.!?]+', content))
        words = len(content.split())
        
        if sentences == 0 or words == 0:
            return 0.0
        
        # Simplified readability calculation
        avg_sentence_length = words / sentences
        
        # Scale to 0-100 (higher is more readable)
        score = max(0, min(100, 120 - avg_sentence_length * 2))
        return round(score, 1)
    
    def _calculate_seo_score(self, content: str, target_keywords: List[str]) -> float:
        """Calculate basic SEO score based on keyword usage"""
        if not content or not target_keywords:
            return 0.0
            
        content_lower = content.lower()
        word_count = len(content.split())
        
        keyword_score = 0
        for keyword in target_keywords:
            keyword_lower = keyword.lower()
            keyword_count = content_lower.count(keyword_lower)
            
            if keyword_count > 0:
                # Optimal density is 1-2%
                density = (keyword_count / word_count) * 100
                if 0.5 <= density <= 3:  # Good density range
                    keyword_score += 20
                else:
                    keyword_score += 10  # Some usage but not optimal
        
        # Additional SEO factors
        has_headers = '##' in content or '#' in content
        has_lists = '-' in content or '*' in content or re.search(r'\d+\.', content)
        
        bonus_score = 0
        if has_headers:
            bonus_score += 20
        if has_lists:
            bonus_score += 10
        if word_count >= 1000:  # Long-form content
            bonus_score += 10
        
        total_score = min(100, keyword_score + bonus_score)
        return round(total_score, 1)
    
    async def get_user_blog_posts(self, user_id: str, limit: int = 20) -> List[BlogPostResult]:
        """Get user's blog post history"""
        await self.initialize()
        
        cursor = self.db.blog_post_results.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit)
        
        results = []
        async for doc in cursor:
            results.append(BlogPostResult(**doc))
        
        return results
    
    async def get_blog_analytics(self, user_id: str) -> Dict[str, Any]:
        """Get blog post analytics"""
        await self.initialize()
        
        # Aggregate blog post statistics
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": None,
                "total_posts": {"$sum": 1},
                "avg_word_count": {"$avg": "$word_count"},
                "avg_readability": {"$avg": "$readability_score"},
                "avg_seo_score": {"$avg": "$seo_score"}
            }}
        ]
        
        cursor = self.db.blog_post_results.aggregate(pipeline)
        analytics = {
            "total_posts": 0,
            "avg_word_count": 0,
            "avg_readability": 0,
            "avg_seo_score": 0
        }
        
        async for doc in cursor:
            analytics.update({
                "total_posts": doc.get("total_posts", 0),
                "avg_word_count": round(doc.get("avg_word_count", 0)),
                "avg_readability": round(doc.get("avg_readability", 0), 1),
                "avg_seo_score": round(doc.get("avg_seo_score", 0), 1)
            })
        
        return analytics

# Global service instance
blog_post_service = BlogPostService()