from typing import List, Dict, Any, Optional
import uuid
import logging
from datetime import datetime
from models import *
from ai_service import ai_service
from database import get_database

logger = logging.getLogger(__name__)

class EmailMarketingService:
    def __init__(self):
        self.db = None
    
    async def initialize(self):
        """Initialize database connection"""
        if not self.db:
            self.db = get_database()
    
    async def generate_email_content(self, request: EmailContentRequest) -> EmailContentResult:
        """Generate email marketing content"""
        await self.initialize()
        
        # Create email campaign record
        email_campaign = EmailCampaign(
            user_id=request.user_id,
            campaign_name=request.campaign_name,
            campaign_type=request.email_type,
            target_audience=request.target_audience,
            campaign_goal=request.campaign_goal,
            brand_voice=request.brand_voice
        )
        
        await self.db.email_campaigns.insert_one(email_campaign.dict())
        
        # Generate email content
        subject_lines = []
        email_content = ""
        preview_text = ""
        personalization_tags = []
        a_b_variations = []
        
        for provider in request.ai_providers:
            try:
                # Generate subject lines
                subjects = await self._generate_subject_lines(request, provider.value)
                subject_lines.extend(subjects)
                
                # Generate main email content
                content_data = await self._generate_email_body(request, provider.value)
                if not email_content:  # Use first provider's content as primary
                    email_content = content_data.get("content", "")
                    preview_text = content_data.get("preview", "")
                    personalization_tags = content_data.get("personalization", [])
                
                # Generate A/B variations
                if request.email_type == ContentType.EMAIL_MARKETING:
                    variation = await self._generate_ab_variation(request, provider.value)
                    a_b_variations.append(variation)
                
            except Exception as e:
                logger.error(f"Error generating email content with {provider.value}: {e}")
        
        # Estimate read time
        word_count = len(email_content.split())
        estimated_read_time = max(1, word_count // 200)  # 200 words per minute
        
        # Create result
        result = EmailContentResult(
            user_id=request.user_id,
            campaign_id=email_campaign.id,
            email_type=request.email_type,
            subject_lines=list(set(subject_lines))[:10],  # Remove duplicates, limit to 10
            email_content=email_content,
            preview_text=preview_text,
            personalization_tags=personalization_tags,
            a_b_variations=a_b_variations,
            estimated_read_time=estimated_read_time
        )
        
        await self.db.email_content_results.insert_one(result.dict())
        return result
    
    async def _generate_subject_lines(self, request: EmailContentRequest, provider: str) -> List[str]:
        """Generate compelling email subject lines"""
        prompt = f"""
        Create {request.subject_line_ideas} compelling email subject lines:
        
        Campaign Details:
        - Type: {request.email_type.value}
        - Target Audience: {request.target_audience}
        - Campaign Goal: {request.campaign_goal}
        - Key Message: {request.key_message}
        - Brand Voice: {request.brand_voice}
        - Call to Action: {request.call_to_action}
        
        Requirements:
        1. Create subject lines that maximize open rates
        2. Use {request.brand_voice} tone
        3. Focus on {request.campaign_goal} goal
        4. Keep under 60 characters for mobile optimization
        5. Create urgency and curiosity where appropriate
        6. Avoid spam trigger words
        7. Include personalization suggestions where relevant
        
        Subject Line Types to Include:
        - Curiosity-driven
        - Benefit-focused
        - Urgency/scarcity
        - Question-based
        - Direct value proposition
        
        Return only the subject lines, one per line.
        """
        
        response = await ai_service.generate_content(prompt, provider, 600)
        
        # Parse subject lines
        lines = [line.strip() for line in response.split('\n') if line.strip()]
        subject_lines = []
        
        for line in lines:
            # Remove numbering, bullets, or quotes
            cleaned = line.strip('1234567890.- "\'')
            if cleaned and len(cleaned) > 10:  # Valid subject line
                subject_lines.append(cleaned)
        
        return subject_lines[:request.subject_line_ideas]
    
    async def _generate_email_body(self, request: EmailContentRequest, provider: str) -> Dict[str, Any]:
        """Generate email body content"""
        length_guidelines = {
            "short": "100-200 words, focused and direct",
            "medium": "200-400 words, balanced detail and brevity", 
            "long": "400-800 words, comprehensive and detailed"
        }
        
        prompt = f"""
        Create a compelling email for this campaign:
        
        Campaign Details:
        - Type: {request.email_type.value}
        - Campaign: {request.campaign_name}
        - Target Audience: {request.target_audience}
        - Goal: {request.campaign_goal}
        - Key Message: {request.key_message}
        - Call to Action: {request.call_to_action}
        - Brand Voice: {request.brand_voice}
        - Length: {request.email_length} ({length_guidelines.get(request.email_length, 'medium length')})
        - Include Personalization: {request.include_personalization}
        
        Create email content including:
        
        1. **PREVIEW TEXT** (50-90 characters that appear after subject line)
        
        2. **EMAIL CONTENT**:
        - Engaging opening that hooks the reader
        - Clear value proposition
        - Main message delivered in {request.brand_voice} tone
        - Social proof or testimonials if appropriate
        - Strong call-to-action: {request.call_to_action}
        - Professional closing
        
        3. **PERSONALIZATION TAGS** (if include_personalization=True):
        List personalization variables like {{first_name}}, {{company}}, etc.
        
        Email Type Guidelines:
        - EMAIL_MARKETING: Sales-focused, conversion-driven
        - EMAIL_NEWSLETTER: Informative, value-driven, relationship building
        - EMAIL_SEQUENCE: Part of nurture series, educational progression
        
        Format the response clearly with headers for each section.
        Make it mobile-friendly with short paragraphs and clear structure.
        """
        
        response = await ai_service.generate_content(prompt, provider, 1200)
        
        # Parse the response
        return self._parse_email_response(response, request)
    
    def _parse_email_response(self, response: str, request: EmailContentRequest) -> Dict[str, Any]:
        """Parse AI response into structured email data"""
        lines = response.split('\n')
        
        content = ""
        preview = ""
        personalization = []
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect sections
            if "PREVIEW" in line.upper():
                current_section = "preview"
            elif "EMAIL CONTENT" in line.upper() or "CONTENT" in line.upper():
                current_section = "content"
            elif "PERSONALIZATION" in line.upper():
                current_section = "personalization"
            elif line.startswith('#') or line.startswith('**'):
                current_section = None
            else:
                # Add content to appropriate section
                if current_section == "preview" and not preview:
                    preview = line
                elif current_section == "content":
                    content += line + "\n"
                elif current_section == "personalization":
                    # Extract personalization tags
                    if "{{" in line and "}}" in line:
                        import re
                        tags = re.findall(r'\{\{([^}]+)\}\}', line)
                        personalization.extend(tags)
        
        # If no structured content found, use entire response
        if not content:
            content = response
            
        # Generate preview text if not found
        if not preview and content:
            # Use first sentence or first 90 characters
            first_sentence = content.split('.')[0]
            preview = first_sentence[:90] + "..." if len(first_sentence) > 90 else first_sentence
        
        return {
            "content": content.strip(),
            "preview": preview.strip(),
            "personalization": list(set(personalization))  # Remove duplicates
        }
    
    async def _generate_ab_variation(self, request: EmailContentRequest, provider: str) -> Dict[str, str]:
        """Generate A/B test variation"""
        prompt = f"""
        Create an A/B test variation for this email campaign:
        
        Original Campaign:
        - Key Message: {request.key_message}
        - Call to Action: {request.call_to_action}
        - Brand Voice: {request.brand_voice}
        - Goal: {request.campaign_goal}
        
        Create a variation that tests a different approach:
        1. Different subject line approach
        2. Alternative opening hook
        3. Different value proposition angle
        4. Varied call-to-action phrasing
        
        Keep the core message the same but present it differently.
        Make it a meaningful test variation, not just cosmetic changes.
        
        Format:
        Subject: [Alternative subject line]
        Content: [Alternative email content]
        """
        
        response = await ai_service.generate_content(prompt, provider, 800)
        
        # Parse variation
        lines = response.split('\n')
        variation_subject = ""
        variation_content = ""
        
        for line in lines:
            if line.startswith("Subject:"):
                variation_subject = line.replace("Subject:", "").strip()
            elif variation_subject and line.strip():  # Content after subject
                variation_content += line + "\n"
        
        return {
            "version": f"Variation_{provider}",
            "subject": variation_subject,
            "content": variation_content.strip()
        }
    
    async def get_user_email_campaigns(self, user_id: str, limit: int = 20) -> List[EmailContentResult]:
        """Get user's email campaign history"""
        await self.initialize()
        
        cursor = self.db.email_content_results.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit)
        
        results = []
        async for doc in cursor:
            results.append(EmailContentResult(**doc))
        
        return results
    
    async def get_email_analytics(self, user_id: str) -> Dict[str, Any]:
        """Get email marketing analytics"""
        await self.initialize()
        
        # Count campaigns by type and goal
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": {
                    "email_type": "$email_type",
                    "campaign_goal": "$campaign_goal"
                },
                "count": {"$sum": 1},
                "avg_read_time": {"$avg": "$estimated_read_time"}
            }}
        ]
        
        cursor = self.db.email_content_results.aggregate(pipeline)
        analytics = {
            "total_campaigns": 0,
            "campaigns_by_type": {},
            "campaigns_by_goal": {},
            "avg_read_time": 0
        }
        
        total_read_time = 0
        async for doc in cursor:
            email_type = doc["_id"]["email_type"]
            campaign_goal = doc["_id"]["campaign_goal"]
            count = doc["count"]
            
            analytics["campaigns_by_type"][email_type] = analytics["campaigns_by_type"].get(email_type, 0) + count
            analytics["campaigns_by_goal"][campaign_goal] = analytics["campaigns_by_goal"].get(campaign_goal, 0) + count
            analytics["total_campaigns"] += count
            total_read_time += doc.get("avg_read_time", 0) * count
        
        if analytics["total_campaigns"] > 0:
            analytics["avg_read_time"] = total_read_time / analytics["total_campaigns"]
        
        return analytics

# Global service instance
email_marketing_service = EmailMarketingService()