from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING, DESCENDING
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db = None

database = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        database.client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        database.db = database.client[os.environ['DB_NAME']]
        
        # Test connection
        await database.client.admin.command('ping')
        logger.info("Connected to MongoDB successfully")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if database.client:
        database.client.close()
        logger.info("Disconnected from MongoDB")

async def create_indexes():
    """Create database indexes for better performance"""
    try:
        # Users collection indexes
        await database.db.users.create_indexes([
            IndexModel([("email", ASCENDING)], unique=True),
            IndexModel([("created_at", DESCENDING)]),
            IndexModel([("tier", ASCENDING)]),
        ])
        
        # Generation results collection indexes
        await database.db.generation_results.create_indexes([
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
            IndexModel([("category", ASCENDING)]),
            IndexModel([("platform", ASCENDING)]),
            IndexModel([("user_id", ASCENDING), ("created_at", DESCENDING)]),
        ])
        
        # Usage analytics collection indexes
        await database.db.usage_analytics.create_indexes([
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
            IndexModel([("category", ASCENDING)]),
            IndexModel([("platform", ASCENDING)]),
            IndexModel([("ai_provider", ASCENDING)]),
            IndexModel([("success", ASCENDING)]),
        ])
        
        # Premium pack purchases collection indexes
        await database.db.premium_pack_purchases.create_indexes([
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("pack_id", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
        ])
        
        # Content performance collection indexes
        await database.db.content_performance.create_indexes([
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("generation_id", ASCENDING)]),
            IndexModel([("platform", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
        ])
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")
        raise

def get_database():
    """Get database instance"""
    return database.db