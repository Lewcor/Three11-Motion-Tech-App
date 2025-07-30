from typing import List, Dict, Any, Optional
import uuid
import logging
from datetime import datetime
from models import *
from ai_service import ai_service
from database import get_database

logger = logging.getLogger(__name__)

class ProductDescriptionService:
    def __init__(self):
        self.db = None
    
    async def initialize(self):
        """Initialize database connection"""
        if not self.db:
            self.db = get_database()
    
    async def generate_product_description(self, request: ProductDescriptionRequest) -> ProductDescriptionResult:
        """Generate comprehensive product descriptions"""
        await self.initialize()
        
        # Create product record
        product = Product(
            user_id=request.user_id,
            product_name=request.product_name,
            category=request.category,
            price=request.price,
            key_features=request.key_features,
            target_audience=request.target_audience,
            brand_style=request.brand_style
        )
        
        await self.db.products.insert_one(product.dict())
        
        # Generate product descriptions
        title = ""
        short_description = ""
        long_description = ""
        bullet_points = []
        specifications = {}
        usage_instructions = ""
        seo_keywords = []
        marketing_angles = []
        cross_sell_suggestions = []
        
        for provider in request.ai_providers:
            try:
                # Generate main product content
                product_data = await self._generate_product_content(request, provider.value)
                
                if not title:  # Use first provider's data as primary
                    title = product_data.get("title", request.product_name)
                    short_description = product_data.get("short_description", "")
                    long_description = product_data.get("long_description", "")
                    bullet_points = product_data.get("bullet_points", [])
                    specifications = product_data.get("specifications", {})
                    usage_instructions = product_data.get("usage_instructions", "")
                
                # Generate additional marketing content
                marketing_data = await self._generate_marketing_content(request, provider.value)
                seo_keywords.extend(marketing_data.get("seo_keywords", []))
                marketing_angles.extend(marketing_data.get("marketing_angles", []))
                cross_sell_suggestions.extend(marketing_data.get("cross_sell", []))
                
            except Exception as e:
                logger.error(f"Error generating product description with {provider.value}: {e}")
        
        # Create result
        result = ProductDescriptionResult(
            user_id=request.user_id,
            product_id=product.id,
            title=title,
            short_description=short_description,
            long_description=long_description,
            bullet_points=bullet_points,
            specifications=specifications,
            usage_instructions=usage_instructions if request.include_usage_instructions else None,
            seo_keywords=list(set(seo_keywords)),
            marketing_angles=list(set(marketing_angles)),
            cross_sell_suggestions=list(set(cross_sell_suggestions))
        )
        
        await self.db.product_description_results.insert_one(result.dict())
        return result
    
    async def _generate_product_content(self, request: ProductDescriptionRequest, provider: str) -> Dict[str, Any]:
        """Generate main product description content"""
        price_info = f" (${request.price})" if request.price else ""
        features_str = "\n".join(f"• {feature}" for feature in request.key_features)
        benefits_str = "\n".join(f"• {benefit}" for benefit in request.benefits)
        
        length_guidelines = {
            "short": "50-100 words, concise and punchy",
            "medium": "100-250 words, balanced detail",
            "long": "250-500 words, comprehensive and detailed"
        }
        
        prompt = f"""
        Create compelling product descriptions for e-commerce:
        
        Product Details:
        - Name: {request.product_name}{price_info}
        - Category: {request.category}
        - Target Audience: {request.target_audience}
        - Brand Style: {request.brand_style}
        - Description Length: {request.description_length} ({length_guidelines.get(request.description_length, 'medium')})
        - Persuasion Style: {request.persuasion_style}
        
        Key Features:
        {features_str}
        
        Key Benefits:
        {benefits_str}
        
        Create the following:
        
        1. **PRODUCT TITLE** (SEO-friendly, includes key benefits, under 150 characters)
        
        2. **SHORT DESCRIPTION** (50-100 words for product listings):
        - Catchy opening line
        - 2-3 key benefits
        - Perfect for search results and category pages
        
        3. **LONG DESCRIPTION** ({request.description_length} length):
        - Engaging story that connects with {request.target_audience}
        - Highlight how product solves their problems
        - Use {request.brand_style} brand voice
        - Include emotional triggers and rational benefits
        - Strong call-to-action
        
        4. **BULLET POINTS** (if include_bullet_points=True):
        - 5-8 key features/benefits
        - Scannable format
        - Mix features with benefits
        
        5. **SPECIFICATIONS** (if include_specifications=True):
        - Technical details
        - Dimensions, materials, etc.
        - Format as key-value pairs
        
        6. **USAGE INSTRUCTIONS** (if include_usage_instructions=True):
        - How to use the product
        - Setup or installation steps
        - Care instructions if applicable
        
        Persuasion Style Guidelines:
        - benefits_focused: Emphasize what the customer gains
        - feature_focused: Highlight technical specifications and capabilities
        - story_driven: Use narrative and emotional connection
        
        Brand Style Adaptation:
        - modern: Clean, innovative, forward-thinking language
        - classic: Timeless, traditional, reliable language
        - playful: Fun, energetic, casual language
        - luxury: Premium, exclusive, sophisticated language
        - minimalist: Simple, essential, clean language
        
        Format with clear section headers and make it conversion-focused.
        """
        
        response = await ai_service.generate_content(prompt, provider, 1500)
        
        # Parse the response
        return self._parse_product_response(response, request)
    
    def _parse_product_response(self, response: str, request: ProductDescriptionRequest) -> Dict[str, Any]:
        """Parse AI response into structured product data"""
        lines = response.split('\n')
        
        title = ""
        short_description = ""
        long_description = ""
        bullet_points = []
        specifications = {}
        usage_instructions = ""
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect sections
            if "PRODUCT TITLE" in line.upper() or "TITLE" in line.upper():
                current_section = "title"
            elif "SHORT DESCRIPTION" in line.upper():
                current_section = "short"
            elif "LONG DESCRIPTION" in line.upper():
                current_section = "long"
            elif "BULLET POINTS" in line.upper() or "BULLETS" in line.upper():
                current_section = "bullets"
            elif "SPECIFICATIONS" in line.upper() or "SPECS" in line.upper():
                current_section = "specs"
            elif "USAGE" in line.upper() or "INSTRUCTIONS" in line.upper():
                current_section = "usage"
            elif line.startswith('#') or line.startswith('**'):
                current_section = None
            else:
                # Add content to appropriate section
                if current_section == "title" and not title:
                    title = line.strip('# "\'')
                elif current_section == "short":
                    short_description += line + " "
                elif current_section == "long":
                    long_description += line + "\n"
                elif current_section == "bullets":
                    if line.startswith(('-', '•', '*')):
                        bullet_point = line.lstrip('-•* ').strip()
                        if bullet_point:
                            bullet_points.append(bullet_point)
                elif current_section == "specs":
                    if ':' in line:
                        key, value = line.split(':', 1)
                        specifications[key.strip()] = value.strip()
                elif current_section == "usage":
                    usage_instructions += line + "\n"
        
        # Clean up descriptions
        short_description = short_description.strip()
        long_description = long_description.strip()
        usage_instructions = usage_instructions.strip()
        
        # Generate title if not found
        if not title:
            title = request.product_name
        
        return {
            "title": title,
            "short_description": short_description,
            "long_description": long_description,
            "bullet_points": bullet_points,
            "specifications": specifications,
            "usage_instructions": usage_instructions
        }
    
    async def _generate_marketing_content(self, request: ProductDescriptionRequest, provider: str) -> Dict[str, List[str]]:
        """Generate SEO keywords, marketing angles, and cross-sell suggestions"""
        prompt = f"""
        Create marketing optimization content for this product:
        
        Product: {request.product_name}
        Category: {request.category}
        Target Audience: {request.target_audience}
        Key Features: {", ".join(request.key_features)}
        Key Benefits: {", ".join(request.benefits)}
        
        Generate:
        
        1. **SEO KEYWORDS** (10-15 keywords):
        - Primary keywords (2-3 words)
        - Long-tail keywords (3-5 words)
        - Related semantic keywords
        - Category-specific keywords
        - Buyer intent keywords
        
        2. **MARKETING ANGLES** (5-7 different positioning strategies):
        - Different ways to position and market this product
        - Various value propositions
        - Unique selling propositions
        - Emotional appeals
        - Rational benefits
        
        3. **CROSS-SELL SUGGESTIONS** (5-8 complementary products):
        - Products that pair well with this item
        - Accessories or add-ons
        - Related category items
        - Bundle opportunities
        
        Focus on practical, actionable suggestions that drive sales.
        Make keywords specific to the product and search intent.
        Ensure cross-sell suggestions genuinely complement the main product.
        """
        
        response = await ai_service.generate_content(prompt, provider, 800)
        
        seo_keywords = []
        marketing_angles = []
        cross_sell = []
        lines = response.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if "SEO KEYWORDS" in line.upper() or "KEYWORDS" in line.upper():
                current_section = "keywords"
            elif "MARKETING ANGLES" in line.upper() or "ANGLES" in line.upper():
                current_section = "angles"
            elif "CROSS-SELL" in line.upper() or "CROSS SELL" in line.upper():
                current_section = "cross_sell"
            elif line.startswith(('-', '•', '*')):
                # Extract item
                item = line.lstrip('-•* ').strip()
                if current_section == "keywords" and item:
                    seo_keywords.append(item)
                elif current_section == "angles" and item:
                    marketing_angles.append(item)
                elif current_section == "cross_sell" and item:
                    cross_sell.append(item)
        
        return {
            "seo_keywords": seo_keywords,
            "marketing_angles": marketing_angles,
            "cross_sell": cross_sell
        }
    
    async def get_user_products(self, user_id: str, limit: int = 20) -> List[ProductDescriptionResult]:
        """Get user's product description history"""
        await self.initialize()
        
        cursor = self.db.product_description_results.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit)
        
        results = []
        async for doc in cursor:
            results.append(ProductDescriptionResult(**doc))
        
        return results
    
    async def get_product_analytics(self, user_id: str) -> Dict[str, Any]:
        """Get product description analytics"""
        await self.initialize()
        
        # Count products by category and style
        pipeline = [
            {"$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "id",
                "as": "product_info"
            }},
            {"$unwind": "$product_info"},
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": {
                    "category": "$product_info.category",
                    "brand_style": "$product_info.brand_style"
                },
                "count": {"$sum": 1}
            }}
        ]
        
        cursor = self.db.product_description_results.aggregate(pipeline)
        analytics = {
            "total_products": 0,
            "categories": {},
            "brand_styles": {}
        }
        
        async for doc in cursor:
            category = doc["_id"]["category"]
            brand_style = doc["_id"]["brand_style"]
            count = doc["count"]
            
            analytics["categories"][category] = analytics["categories"].get(category, 0) + count
            analytics["brand_styles"][brand_style] = analytics["brand_styles"].get(brand_style, 0) + count
            analytics["total_products"] += count
        
        return analytics

# Global service instance
product_description_service = ProductDescriptionService()