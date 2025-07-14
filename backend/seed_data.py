import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from models import PremiumPack, ContentCategory
from datetime import datetime

async def seed_premium_packs():
    """Seed the database with premium packs"""
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    
    premium_packs = [
        PremiumPack(
            name="Luxury Fashion Pack",
            category=ContentCategory.FASHION,
            price=4.99,
            features=[
                "High-end brand captions",
                "Designer hashtags",
                "Fashion week style content",
                "Luxury brand voice templates"
            ],
            templates=[
                "Luxury brand announcement",
                "High-end product launch",
                "Designer collaboration",
                "Fashion week highlights"
            ]
        ),
        PremiumPack(
            name="Pro Athlete Pack",
            category=ContentCategory.FITNESS,
            price=3.99,
            features=[
                "Professional training content",
                "Athlete-level captions",
                "Competition hashtags",
                "Performance tracking templates"
            ],
            templates=[
                "Training session updates",
                "Competition announcements",
                "Achievement celebrations",
                "Motivation posts"
            ]
        ),
        PremiumPack(
            name="Music Producer Pack",
            category=ContentCategory.MUSIC,
            price=5.99,
            features=[
                "Studio session captions",
                "Producer hashtags",
                "Music industry insights",
                "Beat drop announcements"
            ],
            templates=[
                "New track releases",
                "Studio behind-the-scenes",
                "Collaboration announcements",
                "Music production tips"
            ]
        ),
        PremiumPack(
            name="Professional Writer Pack",
            category=ContentCategory.IDEAS,
            price=6.99,
            features=[
                "Author-level content",
                "Publishing hashtags",
                "Creative writing prompts",
                "Storytelling templates"
            ],
            templates=[
                "Book launch announcements",
                "Writing process insights",
                "Creative inspiration",
                "Author interviews"
            ]
        ),
        PremiumPack(
            name="Food Influencer Pack",
            category=ContentCategory.FOOD,
            price=4.49,
            features=[
                "Recipe sharing templates",
                "Food photography captions",
                "Restaurant review formats",
                "Cooking tutorial guides"
            ],
            templates=[
                "Recipe reveals",
                "Restaurant experiences",
                "Cooking tutorials",
                "Food photography tips"
            ]
        ),
        PremiumPack(
            name="Travel Blogger Pack",
            category=ContentCategory.TRAVEL,
            price=5.49,
            features=[
                "Destination guides",
                "Travel tip formats",
                "Adventure story templates",
                "Cultural experience captions"
            ],
            templates=[
                "Destination reveals",
                "Travel tips",
                "Adventure stories",
                "Cultural experiences"
            ]
        ),
        PremiumPack(
            name="Gaming Creator Pack",
            category=ContentCategory.GAMING,
            price=4.99,
            features=[
                "Gaming session highlights",
                "Tournament announcements",
                "Game review templates",
                "Community engagement posts"
            ],
            templates=[
                "Gameplay highlights",
                "Tournament updates",
                "Game reviews",
                "Community posts"
            ]
        ),
        PremiumPack(
            name="Business Executive Pack",
            category=ContentCategory.BUSINESS,
            price=7.99,
            features=[
                "Executive announcements",
                "Industry insights",
                "Leadership content",
                "Corporate communication"
            ],
            templates=[
                "Company updates",
                "Industry insights",
                "Leadership thoughts",
                "Professional achievements"
            ]
        ),
        PremiumPack(
            name="Event Space Pro Pack",
            category=ContentCategory.EVENT_SPACE,
            price=8.99,
            features=[
                "Venue showcase templates",
                "Event space marketing",
                "Booking conversion captions",
                "Client testimonial formats"
            ],
            templates=[
                "Venue reveals",
                "Event success stories",
                "Space availability updates",
                "Client testimonials"
            ]
        )
    ]
    
    # Clear existing packs
    await db.premium_packs.delete_many({})
    
    # Insert new packs
    for pack in premium_packs:
        await db.premium_packs.insert_one(pack.dict())
    
    print(f"Seeded {len(premium_packs)} premium packs")
    client.close()

if __name__ == "__main__":
    import sys
    sys.path.append('/app/backend')
    from dotenv import load_dotenv
    load_dotenv()
    
    asyncio.run(seed_premium_packs())