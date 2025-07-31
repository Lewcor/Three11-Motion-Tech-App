from typing import List, Dict, Any, Optional
import uuid
import logging
from models import *
from database import get_database
from ai_service import ai_service

logger = logging.getLogger(__name__)

class TemplateLibraryService:
    def __init__(self):
        self.db = None
        self.default_templates = self._create_default_templates()
    
    async def initialize(self):
        """Initialize database connection and seed default templates"""
        if not self.db:
            self.db = get_database()
            await self._seed_default_templates()
    
    def _create_default_templates(self) -> List[ContentTemplate]:
        """Create default templates for different categories and platforms"""
        templates = []
        
        # Fashion Templates
        templates.extend([
            ContentTemplate(
                name="Fashion OOTD Hook",
                description="Perfect hook for outfit of the day posts",
                category=ContentCategory.FASHION,
                platform=Platform.INSTAGRAM,
                template_type="hooks",
                template_content="POV: You found the perfect {occasion} outfit that makes you feel {emotion} ✨\n\n{outfit_description}\n\nWho else is obsessed with {key_piece}? 👇",
                placeholders=["occasion", "emotion", "outfit_description", "key_piece"],
                example_output="POV: You found the perfect date night outfit that makes you feel confident ✨\n\nThis little black dress + gold accessories combo is giving main character energy!\n\nWho else is obsessed with statement jewelry? 👇",
                is_premium=False,
                tags=["ootd", "fashion", "style", "outfit"]
            ),
            ContentTemplate(
                name="Fashion Trend Alert",
                description="Trending fashion item showcase",
                category=ContentCategory.FASHION,
                platform=Platform.TIKTOK,
                template_type="caption",
                template_content="🚨 TREND ALERT: {trend_name} is everywhere!\n\nHow to style it:\n✅ {styling_tip_1}\n✅ {styling_tip_2}\n✅ {styling_tip_3}\n\nSave this for your next shopping trip! 🛍️",
                placeholders=["trend_name", "styling_tip_1", "styling_tip_2", "styling_tip_3"],
                example_output="🚨 TREND ALERT: Oversized blazers are everywhere!\n\nHow to style it:\n✅ Belt it for a cinched waist\n✅ Roll the sleeves for casual vibes\n✅ Layer over a slip dress\n\nSave this for your next shopping trip! 🛍️",
                is_premium=False,
                tags=["trend", "styling", "fashion"]
            )
        ])
        
        # Fitness Templates
        templates.extend([
            ContentTemplate(
                name="Workout Motivation",
                description="Motivational fitness content",
                category=ContentCategory.FITNESS,
                platform=Platform.INSTAGRAM,
                template_type="caption",
                template_content="💪 {workout_type} COMPLETE!\n\nToday's focus: {muscle_group}\n\nFeeling: {emotion}\nBurn: {calories} calories\nTime: {duration} minutes\n\nRemember: {motivational_message}\n\nWhat's your favorite {workout_type} exercise? 👇",
                placeholders=["workout_type", "muscle_group", "emotion", "calories", "duration", "motivational_message"],
                example_output="💪 LEG DAY COMPLETE!\n\nToday's focus: Glutes & Quads\n\nFeeling: Accomplished\nBurn: 350 calories\nTime: 45 minutes\n\nRemember: Strong women lift each other up!\n\nWhat's your favorite leg day exercise? 👇",
                is_premium=False,
                tags=["workout", "motivation", "fitness"]
            ),
            ContentTemplate(
                name="Transformation Tuesday",
                description="Progress and transformation posts",
                category=ContentCategory.FITNESS,
                platform=Platform.INSTAGRAM,
                template_type="story_arc",
                template_content="#TransformationTuesday\n\n{time_period} ago vs. today 📸\n\nThe difference isn't just physical:\n\n🔸 {mental_change}\n🔸 {habit_change}\n🔸 {confidence_change}\n\nProgress isn't always linear, but it's always worth it ✨\n\nWhat transformation are you most proud of? 💭",
                placeholders=["time_period", "mental_change", "habit_change", "confidence_change"],
                example_output="#TransformationTuesday\n\n6 months ago vs. today 📸\n\nThe difference isn't just physical:\n\n🔸 I prioritize my mental health daily\n🔸 I meal prep every Sunday without fail\n🔸 I speak to myself with kindness\n\nProgress isn't always linear, but it's always worth it ✨\n\nWhat transformation are you most proud of? 💭",
                is_premium=True,
                tags=["transformation", "progress", "motivation"]
            )
        ])
        
        # Food Templates
        templates.extend([
            ContentTemplate(
                name="Recipe Reveal",
                description="Recipe sharing template",
                category=ContentCategory.FOOD,
                platform=Platform.TIKTOK,
                template_type="caption",
                template_content="🍽️ {dish_name} Recipe!\n\nIngredients:\n{ingredients_list}\n\nSteps:\n{cooking_steps}\n\n⏰ Prep time: {prep_time}\n👨‍🍳 Difficulty: {difficulty}\n\nTry this and let me know how it turns out! 👇",
                placeholders=["dish_name", "ingredients_list", "cooking_steps", "prep_time", "difficulty"],
                example_output="🍽️ Viral Pasta Recipe!\n\nIngredients:\n• 2 cups pasta\n• 1 cup cherry tomatoes\n• 3 cloves garlic\n• Fresh basil\n\nSteps:\n1. Boil pasta al dente\n2. Sauté garlic and tomatoes\n3. Toss with pasta and basil\n\n⏰ Prep time: 15 minutes\n👨‍🍳 Difficulty: Easy\n\nTry this and let me know how it turns out! 👇",
                is_premium=False,
                tags=["recipe", "cooking", "food"]
            )
        ])
        
        # Business Templates
        templates.extend([
            ContentTemplate(
                name="Business Tip Monday",
                description="Weekly business advice",
                category=ContentCategory.BUSINESS,
                platform=Platform.FACEBOOK,
                template_type="caption",
                template_content="💡 #BusinessTipMonday\n\n{tip_title}\n\nThe challenge: {problem_description}\n\nThe solution: {solution_description}\n\nReal example: {case_study_example}\n\nKey takeaway: {main_insight}\n\nWhat business challenge are you currently facing? Let's discuss in the comments! 👇",
                placeholders=["tip_title", "problem_description", "solution_description", "case_study_example", "main_insight"],
                example_output="💡 #BusinessTipMonday\n\nStop competing on price alone\n\nThe challenge: Many businesses think the lowest price wins\n\nThe solution: Compete on value, service, and unique benefits\n\nReal example: Starbucks charges 5x more than convenience store coffee by creating an experience\n\nKey takeaway: Premium pricing requires premium value delivery\n\nWhat business challenge are you currently facing? Let's discuss in the comments! 👇",
                is_premium=True,
                tags=["business", "tips", "strategy"]
            )
        ])
        
        # Event Space Templates
        templates.extend([
            ContentTemplate(
                name="Venue Showcase",
                description="Event space promotion",
                category=ContentCategory.EVENT_SPACE,
                platform=Platform.INSTAGRAM,
                template_type="caption",
                template_content="✨ {venue_name} is perfect for your {event_type}!\n\n🏛️ Space highlights:\n{space_features}\n\n👥 Capacity: {capacity} guests\n📍 Location: {location}\n🎉 Perfect for: {event_types}\n\n{special_offer}\n\nBook your tour today! 📞 {contact_info}",
                placeholders=["venue_name", "event_type", "space_features", "capacity", "location", "event_types", "special_offer", "contact_info"],
                example_output="✨ The Grand Ballroom is perfect for your wedding!\n\n🏛️ Space highlights:\n• Crystal chandeliers\n• 20-foot ceilings\n• Marble dance floor\n• Floor-to-ceiling windows\n\n👥 Capacity: 200 guests\n📍 Location: Downtown Arts District\n🎉 Perfect for: Weddings, galas, corporate events\n\n🎊 Book this month and save 15% on your reception package!\n\nBook your tour today! 📞 (555) 123-4567",
                is_premium=False,
                tags=["venue", "wedding", "events"]
            )
        ])
        
        return templates
    
    async def _seed_default_templates(self):
        """Seed database with default templates if they don't exist"""
        try:
            # Check if templates already exist
            count = await self.db.content_templates.count_documents({"created_by": "system"})
            if count > 0:
                return  # Templates already seeded
            
            # Insert default templates
            template_docs = [template.dict() for template in self.default_templates]
            await self.db.content_templates.insert_many(template_docs)
            logger.info(f"Seeded {len(template_docs)} default templates")
            
        except Exception as e:
            logger.error(f"Error seeding default templates: {e}")
    
    async def get_templates(self, category: Optional[ContentCategory] = None,
                          platform: Optional[Platform] = None,
                          template_type: Optional[str] = None,
                          user_id: Optional[str] = None,
                          include_premium: bool = True) -> List[ContentTemplate]:
        """Get templates with optional filters"""
        await self.initialize()
        
        query = {}
        
        if category:
            query["category"] = category.value
        if platform:
            query["platform"] = platform.value
        if template_type:
            query["template_type"] = template_type
        if user_id:
            query["$or"] = [
                {"created_by": "system"},
                {"created_by": user_id}
            ]
        else:
            query["created_by"] = "system"
        
        if not include_premium:
            query["is_premium"] = False
        
        cursor = self.db.content_templates.find(query).sort("usage_count", -1)
        
        templates = []
        async for doc in cursor:
            templates.append(ContentTemplate(**doc))
        
        return templates
    
    async def get_template_by_id(self, template_id: str) -> Optional[ContentTemplate]:
        """Get a specific template by ID"""
        await self.initialize()
        
        doc = await self.db.content_templates.find_one({"id": template_id})
        if doc:
            return ContentTemplate(**doc)
        return None
    
    async def create_custom_template(self, user_id: str, template: ContentTemplate) -> ContentTemplate:
        """Create a custom template for a user"""
        await self.initialize()
        
        template.created_by = user_id
        template.usage_count = 0
        
        await self.db.content_templates.insert_one(template.dict())
        return template
    
    async def use_template(self, template_id: str, placeholders: Dict[str, str]) -> str:
        """Use a template by filling in placeholders"""
        await self.initialize()
        
        template = await self.get_template_by_id(template_id)
        if not template:
            raise ValueError("Template not found")
        
        # Increment usage count
        await self.db.content_templates.update_one(
            {"id": template_id},
            {"$inc": {"usage_count": 1}}
        )
        
        # Fill in placeholders
        content = template.template_content
        for placeholder, value in placeholders.items():
            content = content.replace(f"{{{placeholder}}}", value)
        
        return content
    
    async def generate_template_suggestions(self, category: ContentCategory, 
                                          platform: Platform, 
                                          content_description: str) -> List[Dict[str, Any]]:
        """Generate template suggestions using AI based on content description"""
        await self.initialize()
        
        # Get relevant templates
        templates = await self.get_templates(category=category, platform=platform)
        
        if not templates:
            return []
        
        # Use AI to suggest best templates
        template_descriptions = []
        for template in templates[:5]:  # Limit to top 5 templates
            template_descriptions.append({
                "id": template.id,
                "name": template.name,
                "description": template.description,
                "example": template.example_output
            })
        
        prompt = f"""
        Based on this content description: "{content_description}"
        
        Suggest the best templates from this list and explain why they would work well:
        
        {template_descriptions}
        
        Provide suggestions in this format:
        1. Template Name - Why it's perfect for this content
        2. Template Name - Why it's perfect for this content
        
        Focus on relevance and engagement potential.
        """
        
        try:
            suggestions_text = await ai_service.generate_content(prompt, "anthropic", 500)
            
            # Parse AI response and match with templates
            suggestions = []
            for template in templates[:3]:  # Return top 3 suggestions
                suggestions.append({
                    "template": template,
                    "relevance_score": 0.8,  # Could be calculated based on AI analysis
                    "suggested_placeholders": self._suggest_placeholders(template, content_description)
                })
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Error generating template suggestions: {e}")
            return [{"template": template, "relevance_score": 0.5, "suggested_placeholders": {}} 
                   for template in templates[:3]]
    
    def _suggest_placeholders(self, template: ContentTemplate, content_description: str) -> Dict[str, str]:
        """Suggest placeholder values based on content description"""
        suggestions = {}
        
        # Simple keyword matching for placeholder suggestions
        description_lower = content_description.lower()
        
        for placeholder in template.placeholders:
            if "emotion" in placeholder:
                if any(word in description_lower for word in ["happy", "excited", "confident"]):
                    suggestions[placeholder] = "confident"
                else:
                    suggestions[placeholder] = "amazing"
            elif "time" in placeholder or "duration" in placeholder:
                suggestions[placeholder] = "30 minutes"
            elif "occasion" in placeholder:
                if "work" in description_lower:
                    suggestions[placeholder] = "work"
                elif "date" in description_lower:
                    suggestions[placeholder] = "date night"
                else:
                    suggestions[placeholder] = "casual day"
        
        return suggestions

# Global service instance
template_library_service = TemplateLibraryService()