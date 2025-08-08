from typing import List, Dict, Any, Optional
import asyncio
from datetime import datetime, timedelta
import uuid
import logging
from models import *
from ai_service import ai_service
from database import get_database

logger = logging.getLogger(__name__)

class BatchContentService:
    def __init__(self):
        self.db = None
    
    async def initialize(self):
        """Initialize database connection"""
        if not self.db:
            self.db = get_database()
    
    async def create_batch_generation(self, request: BatchGenerationRequest) -> BatchGenerationResult:
        """Create a new batch generation job"""
        await self.initialize()
        
        # Estimate completion time (roughly 5 seconds per item per provider)
        estimated_time = len(request.content_descriptions) * len(request.ai_providers) * 5
        estimated_completion = datetime.utcnow() + timedelta(seconds=estimated_time)
        
        batch_result = BatchGenerationResult(
            user_id=request.user_id,
            batch_name=request.batch_name or f"Batch {datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            category=request.category,
            platform=request.platform,
            total_items=len(request.content_descriptions),
            estimated_completion=estimated_completion,
            status="pending"
        )
        
        # Save to database
        await self.db.batch_generation_results.insert_one(batch_result.dict())
        
        # Start batch processing in background
        asyncio.create_task(self._process_batch(request, batch_result.id))
        
        return batch_result
    
    async def _process_batch(self, request: BatchGenerationRequest, batch_id: str):
        """Process batch generation in background"""
        try:
            await self.initialize()
            
            # Update status to processing
            await self.db.batch_generation_results.update_one(
                {"id": batch_id},
                {"$set": {"status": "processing"}}
            )
            
            results = []
            completed_count = 0
            failed_count = 0
            
            for i, content_description in enumerate(request.content_descriptions):
                try:
                    # Generate content for this item
                    content_result = await ai_service.generate_combined_content(
                        category=request.category,
                        platform=request.platform,
                        content_description=content_description,
                        selected_providers=[p.value for p in request.ai_providers]
                    )
                    
                    # Create generation result
                    generation_result = GenerationResult(
                        user_id=request.user_id,
                        category=request.category,
                        platform=request.platform,
                        content_description=content_description,
                        ai_responses=content_result["ai_responses"],
                        hashtags=content_result["hashtags"],
                        combined_result=content_result["combined_result"]
                    )
                    
                    # Save individual result
                    await self.db.generation_results.insert_one(generation_result.dict())
                    results.append(generation_result)
                    completed_count += 1
                    
                    # Update batch progress
                    await self.db.batch_generation_results.update_one(
                        {"id": batch_id},
                        {
                            "$set": {
                                "completed_items": completed_count,
                                "failed_items": failed_count
                            }
                        }
                    )
                    
                    logger.info(f"Batch {batch_id}: Completed item {i+1}/{len(request.content_descriptions)}")
                    
                except Exception as e:
                    logger.error(f"Error processing batch item {i}: {e}")
                    failed_count += 1
                    
                    # Update batch progress
                    await self.db.batch_generation_results.update_one(
                        {"id": batch_id},
                        {
                            "$set": {
                                "completed_items": completed_count,
                                "failed_items": failed_count
                            }
                        }
                    )
            
            # Update final batch status
            final_status = "completed" if failed_count == 0 else "partially_completed"
            if failed_count == len(request.content_descriptions):
                final_status = "failed"
            
            await self.db.batch_generation_results.update_one(
                {"id": batch_id},
                {
                    "$set": {
                        "status": final_status,
                        "completed_at": datetime.utcnow(),
                        "completed_items": completed_count,
                        "failed_items": failed_count,
                        "results": [r.dict() for r in results]
                    }
                }
            )
            
            logger.info(f"Batch {batch_id} completed: {completed_count} success, {failed_count} failed")
            
        except Exception as e:
            logger.error(f"Error processing batch {batch_id}: {e}")
            await self.db.batch_generation_results.update_one(
                {"id": batch_id},
                {
                    "$set": {
                        "status": "failed",
                        "completed_at": datetime.utcnow()
                    }
                }
            )
    
    async def get_batch_status(self, batch_id: str, user_id: str) -> Optional[BatchGenerationResult]:
        """Get batch generation status"""
        await self.initialize()
        
        batch_doc = await self.db.batch_generation_results.find_one({
            "id": batch_id,
            "user_id": user_id
        })
        
        if batch_doc:
            return BatchGenerationResult(**batch_doc)
        return None
    
    async def get_user_batches(self, user_id: str, limit: int = 20, skip: int = 0) -> List[BatchGenerationResult]:
        """Get user's batch generation history"""
        await self.initialize()
        
        cursor = self.db.batch_generation_results.find(
            {"user_id": user_id}
        ).sort("created_at", -1).skip(skip).limit(limit)
        
        batches = []
        async for doc in cursor:
            batches.append(BatchGenerationResult(**doc))
        
        return batches
    
    async def cancel_batch(self, batch_id: str, user_id: str) -> bool:
        """Cancel a pending or processing batch"""
        await self.initialize()
        
        result = await self.db.batch_generation_results.update_one(
            {
                "id": batch_id,
                "user_id": user_id,
                "status": {"$in": ["pending", "processing"]}
            },
            {
                "$set": {
                    "status": "cancelled",
                    "completed_at": datetime.utcnow()
                }
            }
        )
        
        return result.modified_count > 0

# Global service instance
batch_content_service = BatchContentService()