from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid
import secrets
from models import *
import asyncio
import json

router = APIRouter()

class CRMIntegrationService:
    def __init__(self):
        # Mock CRM API clients
        self.crm_clients = {
            CRMPlatform.HUBSPOT: self._mock_hubspot_client,
            CRMPlatform.SALESFORCE: self._mock_salesforce_client,
            CRMPlatform.PIPEDRIVE: self._mock_pipedrive_client,
            CRMPlatform.ZOHO: self._mock_zoho_client,
            CRMPlatform.MONDAY: self._mock_monday_client,
            CRMPlatform.AIRTABLE: self._mock_airtable_client
        }
    
    async def connect_crm_integration(self, platform: CRMPlatform, api_key: str, user_id: str, settings: Dict[str, Any] = {}) -> CRMIntegration:
        """Connect a CRM platform integration"""
        try:
            # Validate CRM connection
            connection_test = await self._test_crm_connection(platform, api_key, settings)
            
            if not connection_test["success"]:
                raise HTTPException(status_code=400, detail=f"Failed to connect to {platform.value}: {connection_test['error']}")
            
            integration = CRMIntegration(
                id=str(uuid.uuid4()),
                user_id=user_id,
                platform=platform,
                api_key=api_key,
                base_url=settings.get("base_url"),
                organization_id=settings.get("organization_id"),
                status="active",
                sync_frequency=settings.get("sync_frequency", "daily"),
                settings=settings
            )
            
            # In real app, save to database
            # await database.crm_integrations.insert_one(integration.dict())
            
            # Initial sync
            await self.sync_crm_data(integration.id, user_id, "contacts")
            
            return integration
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error connecting CRM integration: {str(e)}")
    
    async def sync_crm_data(self, integration_id: str, user_id: str, sync_type: str = "contacts") -> Dict[str, Any]:
        """Sync data from CRM platform"""
        try:
            # Get integration details
            integration = await self._get_mock_integration(integration_id, user_id)
            
            if not integration:
                raise HTTPException(status_code=404, detail="CRM integration not found")
            
            client = self.crm_clients.get(integration.platform)
            if not client:
                raise HTTPException(status_code=400, detail=f"Unsupported CRM platform: {integration.platform.value}")
            
            sync_results = {"synced_records": 0, "errors": []}
            
            if sync_type == "contacts" or sync_type == "all":
                contacts_result = await client("contacts", integration)
                
                # Process and save contacts
                for contact_data in contacts_result["data"]:
                    try:
                        contact = CRMContact(
                            id=str(uuid.uuid4()),
                            user_id=user_id,
                            crm_integration_id=integration_id,
                            crm_contact_id=contact_data["id"],
                            email=contact_data["email"],
                            first_name=contact_data.get("first_name"),
                            last_name=contact_data.get("last_name"),
                            company=contact_data.get("company"),
                            phone=contact_data.get("phone"),
                            social_profiles=contact_data.get("social_profiles", {}),
                            engagement_score=contact_data.get("engagement_score", 0.0),
                            content_preferences=contact_data.get("content_preferences", []),
                            deal_stage=contact_data.get("deal_stage"),
                            lead_score=contact_data.get("lead_score"),
                            tags=contact_data.get("tags", []),
                            custom_fields=contact_data.get("custom_fields", {}),
                            last_interaction=contact_data.get("last_interaction")
                        )
                        
                        # In real app, save to database
                        # await database.crm_contacts.insert_one(contact.dict())
                        sync_results["synced_records"] += 1
                        
                    except Exception as contact_error:
                        sync_results["errors"].append(f"Contact {contact_data.get('id', 'unknown')}: {str(contact_error)}")
            
            # Update integration last sync time
            integration.last_sync = datetime.utcnow()
            # In real app, update database
            # await database.crm_integrations.update_one({"id": integration_id}, {"$set": {"last_sync": integration.last_sync}})
            
            return {
                "success": True,
                "integration_id": integration_id,
                "sync_type": sync_type,
                "synced_records": sync_results["synced_records"],
                "errors": sync_results["errors"],
                "synced_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error syncing CRM data: {str(e)}")
    
    async def get_crm_contacts(self, user_id: str, integration_id: Optional[str] = None, filters: Dict[str, Any] = {}) -> List[CRMContact]:
        """Get CRM contacts with optional filtering"""
        try:
            # Mock CRM contacts data
            contacts = [
                CRMContact(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    crm_integration_id=integration_id or "mock_integration",
                    crm_contact_id="contact_001",
                    email="sarah.martinez@fashionco.com",
                    first_name="Sarah",
                    last_name="Martinez",
                    company="Fashion Co",
                    phone="+1-555-0123",
                    social_profiles={
                        "instagram": "@sarahstyle",
                        "linkedin": "sarah-martinez-fashion"
                    },
                    engagement_score=8.5,
                    content_preferences=["fashion", "lifestyle", "trends"],
                    deal_stage="qualified_lead",
                    lead_score=85,
                    tags=["vip_customer", "fashion_influencer"],
                    custom_fields={"annual_budget": 25000, "preferred_brands": ["Gucci", "Prada"]},
                    last_interaction=datetime.utcnow() - timedelta(days=3)
                ),
                CRMContact(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    crm_integration_id=integration_id or "mock_integration",
                    crm_contact_id="contact_002",
                    email="michael.chen@retailbrand.com",
                    first_name="Michael",
                    last_name="Chen",
                    company="Retail Brand",
                    phone="+1-555-0456",
                    social_profiles={
                        "twitter": "@michaelchen",
                        "linkedin": "michael-chen-retail"
                    },
                    engagement_score=7.2,
                    content_preferences=["business", "retail", "marketing"],
                    deal_stage="opportunity",
                    lead_score=72,
                    tags=["enterprise_client", "retail_expert"],
                    custom_fields={"company_size": "500-1000", "industry": "retail"},
                    last_interaction=datetime.utcnow() - timedelta(days=1)
                ),
                CRMContact(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    crm_integration_id=integration_id or "mock_integration",
                    crm_contact_id="contact_003",
                    email="emma.johnson@startupfashion.com",
                    first_name="Emma",
                    last_name="Johnson",
                    company="Startup Fashion",
                    phone="+1-555-0789",
                    social_profiles={
                        "instagram": "@emmajfashion",
                        "tiktok": "@emmastyle"
                    },
                    engagement_score=9.1,
                    content_preferences=["startups", "fashion", "entrepreneurship"],
                    deal_stage="closed_won",
                    lead_score=91,
                    tags=["startup_founder", "high_engagement"],
                    custom_fields={"funding_stage": "series_a", "employee_count": "10-50"},
                    last_interaction=datetime.utcnow() - timedelta(hours=6)
                )
            ]
            
            # Apply filters
            filtered_contacts = contacts
            
            if filters.get("deal_stage"):
                filtered_contacts = [c for c in filtered_contacts if c.deal_stage == filters["deal_stage"]]
            
            if filters.get("min_engagement_score"):
                filtered_contacts = [c for c in filtered_contacts if c.engagement_score >= filters["min_engagement_score"]]
            
            if filters.get("tags"):
                filter_tags = filters["tags"] if isinstance(filters["tags"], list) else [filters["tags"]]
                filtered_contacts = [c for c in filtered_contacts if any(tag in c.tags for tag in filter_tags)]
            
            if filters.get("content_preferences"):
                prefs = filters["content_preferences"] if isinstance(filters["content_preferences"], list) else [filters["content_preferences"]]
                filtered_contacts = [c for c in filtered_contacts if any(pref in c.content_preferences for pref in prefs)]
            
            return filtered_contacts
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting CRM contacts: {str(e)}")
    
    async def update_contact_engagement(self, contact_id: str, user_id: str, engagement_data: Dict[str, Any]) -> CRMContact:
        """Update contact engagement based on social media activity"""
        try:
            # Get contact
            contact = await self._get_mock_contact(contact_id, user_id)
            
            if not contact:
                raise HTTPException(status_code=404, detail="Contact not found")
            
            # Update engagement score based on social media interactions
            social_engagement = engagement_data.get("social_engagement", {})
            
            # Calculate new engagement score
            likes_weight = social_engagement.get("likes", 0) * 0.1
            comments_weight = social_engagement.get("comments", 0) * 0.3
            shares_weight = social_engagement.get("shares", 0) * 0.5
            direct_messages_weight = social_engagement.get("direct_messages", 0) * 0.8
            
            new_engagement_boost = likes_weight + comments_weight + shares_weight + direct_messages_weight
            contact.engagement_score = min(10.0, contact.engagement_score + new_engagement_boost)
            
            # Update content preferences based on interaction types
            if engagement_data.get("content_categories"):
                for category in engagement_data["content_categories"]:
                    if category not in contact.content_preferences:
                        contact.content_preferences.append(category)
            
            # Update last interaction
            contact.last_interaction = datetime.utcnow()
            contact.updated_at = datetime.utcnow()
            
            # In real app, update database
            # await database.crm_contacts.update_one({"id": contact_id}, {"$set": contact.dict()})
            
            # Sync back to CRM platform
            await self._sync_contact_to_crm(contact)
            
            return contact
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating contact engagement: {str(e)}")
    
    async def get_engagement_insights(self, user_id: str, date_range: str = "30_days") -> Dict[str, Any]:
        """Get CRM engagement insights and social media correlation"""
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            if date_range == "7_days":
                start_date = end_date - timedelta(days=7)
            elif date_range == "30_days":
                start_date = end_date - timedelta(days=30)
            elif date_range == "90_days":
                start_date = end_date - timedelta(days=90)
            else:
                start_date = end_date - timedelta(days=365)
            
            # Mock engagement insights
            insights = {
                "date_range": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat(),
                    "period": date_range
                },
                "contact_engagement": {
                    "total_contacts": 156,
                    "active_contacts": 98,
                    "high_engagement_contacts": 34,
                    "avg_engagement_score": 6.8,
                    "engagement_growth": 12.5  # percentage
                },
                "social_crm_correlation": {
                    "contacts_with_social_profiles": 87,
                    "social_engagement_conversion_rate": 23.4,
                    "avg_deal_size_with_social": 15000,
                    "avg_deal_size_without_social": 8500
                },
                "content_performance_by_audience": [
                    {
                        "audience_segment": "VIP Customers",
                        "preferred_content": ["exclusive_previews", "behind_the_scenes"],
                        "engagement_rate": 8.9,
                        "conversion_rate": 34.2
                    },
                    {
                        "audience_segment": "Enterprise Clients",
                        "preferred_content": ["case_studies", "industry_insights"],
                        "engagement_rate": 6.4,
                        "conversion_rate": 28.7
                    },
                    {
                        "audience_segment": "Startup Founders",
                        "preferred_content": ["growth_tips", "success_stories"],
                        "engagement_rate": 9.3,
                        "conversion_rate": 31.8
                    }
                ],
                "top_performing_content_categories": [
                    {"category": "fashion", "contact_engagement": 145, "avg_score_boost": 1.2},
                    {"category": "lifestyle", "contact_engagement": 112, "avg_score_boost": 0.9},
                    {"category": "trends", "contact_engagement": 89, "avg_score_boost": 1.1}
                ],
                "contact_journey_insights": {
                    "avg_touchpoints_to_conversion": 7.3,
                    "most_effective_touchpoint": "personalized_dm",
                    "optimal_follow_up_timing": "2-3_days",
                    "best_performing_platforms": ["instagram", "linkedin"]
                }
            }
            
            return insights
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting engagement insights: {str(e)}")
    
    async def create_automated_campaign(self, user_id: str, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create automated marketing campaign based on CRM segments"""
        try:
            campaign_id = str(uuid.uuid4())
            
            # Process campaign parameters
            target_segment = campaign_data.get("target_segment", "all")
            content_preferences = campaign_data.get("content_preferences", [])
            platforms = campaign_data.get("platforms", ["instagram", "facebook"])
            
            # Get relevant contacts
            contacts = await self.get_crm_contacts(
                user_id=user_id,
                filters={
                    "deal_stage": campaign_data.get("deal_stage"),
                    "min_engagement_score": campaign_data.get("min_engagement_score", 5.0),
                    "content_preferences": content_preferences
                }
            )
            
            # Create campaign strategy
            campaign = {
                "id": campaign_id,
                "name": campaign_data.get("name", "Automated CRM Campaign"),
                "description": campaign_data.get("description"),
                "target_contacts": len(contacts),
                "platforms": platforms,
                "content_strategy": {
                    "personalization_level": campaign_data.get("personalization_level", "medium"),
                    "content_types": campaign_data.get("content_types", ["educational", "promotional"]),
                    "posting_frequency": campaign_data.get("posting_frequency", "3_per_week")
                },
                "automation_rules": [
                    {
                        "trigger": "high_engagement",
                        "action": "send_personalized_dm",
                        "threshold": 8.0
                    },
                    {
                        "trigger": "deal_stage_change",
                        "action": "update_content_preferences",
                        "platforms": platforms
                    },
                    {
                        "trigger": "no_recent_interaction",
                        "action": "re_engagement_sequence",
                        "days_threshold": 14
                    }
                ],
                "expected_outcomes": {
                    "estimated_reach": len(contacts) * 3.5,  # Assuming 3.5x reach multiplier
                    "estimated_engagement_boost": 25.0,
                    "estimated_conversion_lift": 15.0
                },
                "created_at": datetime.utcnow().isoformat(),
                "status": "active"
            }
            
            # In real app, save campaign and set up automation
            # await database.automated_campaigns.insert_one(campaign)
            # await automation_service.setup_campaign_automation(campaign)
            
            return {
                "success": True,
                "campaign": campaign,
                "message": f"Automated campaign created successfully targeting {len(contacts)} contacts"
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating automated campaign: {str(e)}")
    
    async def get_crm_integrations(self, user_id: str) -> List[CRMIntegration]:
        """Get all CRM integrations for a user"""
        try:
            # Mock integrations
            integrations = [
                CRMIntegration(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    platform=CRMPlatform.HUBSPOT,
                    api_key="mock_hubspot_key",
                    organization_id="hubspot_org_123",
                    status="active",
                    sync_frequency="daily",
                    last_sync=datetime.utcnow() - timedelta(hours=2),
                    settings={
                        "sync_contacts": True,
                        "sync_deals": True,
                        "sync_activities": False
                    }
                ),
                CRMIntegration(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    platform=CRMPlatform.SALESFORCE,
                    api_key="mock_salesforce_key",
                    base_url="https://mycompany.salesforce.com",
                    status="active",
                    sync_frequency="hourly",
                    last_sync=datetime.utcnow() - timedelta(minutes=30),
                    settings={
                        "sync_contacts": True,
                        "sync_opportunities": True,
                        "custom_fields": ["Social_Media_Score__c", "Content_Preferences__c"]
                    }
                )
            ]
            
            return integrations
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting CRM integrations: {str(e)}")
    
    # Helper methods
    async def _test_crm_connection(self, platform: CRMPlatform, api_key: str, settings: Dict[str, Any]) -> Dict[str, Any]:
        """Test CRM platform connection"""
        try:
            # Mock connection test
            await asyncio.sleep(0.1)
            
            # Simulate occasional connection failures
            if secrets.randbelow(10) < 1:  # 10% failure rate
                return {"success": False, "error": "Invalid API key or insufficient permissions"}
            
            return {"success": True, "message": f"Successfully connected to {platform.value}"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def _get_mock_integration(self, integration_id: str, user_id: str) -> CRMIntegration:
        """Get mock integration data"""
        return CRMIntegration(
            id=integration_id,
            user_id=user_id,
            platform=CRMPlatform.HUBSPOT,
            api_key="mock_api_key",
            status="active"
        )
    
    async def _get_mock_contact(self, contact_id: str, user_id: str) -> CRMContact:
        """Get mock contact data"""
        return CRMContact(
            id=contact_id,
            user_id=user_id,
            crm_integration_id="mock_integration",
            crm_contact_id="mock_crm_id",
            email="mock@example.com",
            engagement_score=7.5
        )
    
    async def _sync_contact_to_crm(self, contact: CRMContact):
        """Sync updated contact data back to CRM platform"""
        # Mock CRM sync
        await asyncio.sleep(0.1)
        return True
    
    # Mock CRM clients
    async def _mock_hubspot_client(self, operation: str, integration: CRMIntegration):
        """Mock HubSpot API client"""
        await asyncio.sleep(0.1)
        
        if operation == "contacts":
            return {
                "data": [
                    {
                        "id": "hubspot_001",
                        "email": "contact1@hubspot.com",
                        "first_name": "John",
                        "last_name": "Doe",
                        "company": "HubSpot Customer",
                        "deal_stage": "qualified_lead",
                        "lead_score": 75,
                        "social_profiles": {"linkedin": "john-doe-hubspot"},
                        "engagement_score": 7.2
                    }
                ]
            }
    
    async def _mock_salesforce_client(self, operation: str, integration: CRMIntegration):
        """Mock Salesforce API client"""
        await asyncio.sleep(0.1)
        
        if operation == "contacts":
            return {
                "data": [
                    {
                        "id": "sf_001",
                        "email": "contact1@salesforce.com",
                        "first_name": "Jane",
                        "last_name": "Smith",
                        "company": "Salesforce Customer",
                        "deal_stage": "opportunity",
                        "lead_score": 82,
                        "social_profiles": {"twitter": "@janesmith"},
                        "engagement_score": 8.1
                    }
                ]
            }
    
    async def _mock_pipedrive_client(self, operation: str, integration: CRMIntegration):
        """Mock Pipedrive API client"""
        await asyncio.sleep(0.1)
        return {"data": []}
    
    async def _mock_zoho_client(self, operation: str, integration: CRMIntegration):
        """Mock Zoho API client"""
        await asyncio.sleep(0.1)
        return {"data": []}
    
    async def _mock_monday_client(self, operation: str, integration: CRMIntegration):
        """Mock Monday.com API client"""
        await asyncio.sleep(0.1)
        return {"data": []}
    
    async def _mock_airtable_client(self, operation: str, integration: CRMIntegration):
        """Mock Airtable API client"""
        await asyncio.sleep(0.1)
        return {"data": []}

# Create service instance
crm_integration_service = CRMIntegrationService()