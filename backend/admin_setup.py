"""
THREE11 MOTION TECH - Admin Account Setup
This script creates admin accounts with unlimited access to all features.
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from models import User, UserTier
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

async def create_admin_accounts():
    """Create admin accounts with unlimited access"""
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    
    # Super Admin (CEO) Account
    super_admin = User(
        email="ceo@three11motiontech.com",
        name="THREE11 MOTION TECH CEO",
        tier=UserTier.SUPER_ADMIN,
        daily_generations_used=0,
        total_generations=0,
        subscription_expires_at=datetime.utcnow() + timedelta(days=36500),  # 100 years
        preferred_categories=["fashion", "fitness", "food", "travel", "business", "gaming", "music", "ideas", "event_space"],
        preferred_platforms=["tiktok", "instagram", "youtube", "facebook"]
    )
    
    # Admin Team Accounts
    admin_accounts = [
        {
            "email": "admin1@three11motiontech.com",
            "name": "THREE11 Admin Team Member 1",
            "tier": UserTier.ADMIN
        },
        {
            "email": "admin2@three11motiontech.com", 
            "name": "THREE11 Admin Team Member 2",
            "tier": UserTier.ADMIN
        },
        {
            "email": "admin3@three11motiontech.com",
            "name": "THREE11 Admin Team Member 3", 
            "tier": UserTier.ADMIN
        },
        {
            "email": "admin4@three11motiontech.com",
            "name": "THREE11 Admin Team Member 4",
            "tier": UserTier.ADMIN
        },
        {
            "email": "admin5@three11motiontech.com",
            "name": "THREE11 Admin Team Member 5",
            "tier": UserTier.ADMIN
        },
        {
            "email": "admin6@three11motiontech.com",
            "name": "THREE11 Admin Team Member 6",
            "tier": UserTier.ADMIN
        },
        {
            "email": "admin7@three11motiontech.com",
            "name": "THREE11 Admin Team Member 7",
            "tier": UserTier.ADMIN
        },
        {
            "email": "admin8@three11motiontech.com",
            "name": "THREE11 Admin Team Member 8",
            "tier": UserTier.ADMIN
        },
        {
            "email": "admin9@three11motiontech.com",
            "name": "THREE11 Admin Team Member 9",
            "tier": UserTier.ADMIN
        }
    ]
    
    # Create super admin account
    try:
        existing_super_admin = await db.users.find_one({"email": super_admin.email})
        if not existing_super_admin:
            await db.users.insert_one(super_admin.dict())
            print(f"✅ Super Admin account created: {super_admin.email}")
        else:
            print(f"⚠️  Super Admin account already exists: {super_admin.email}")
    except Exception as e:
        print(f"❌ Error creating super admin: {e}")
    
    # Create admin team accounts
    for admin_data in admin_accounts:
        admin_user = User(
            email=admin_data["email"],
            name=admin_data["name"],
            tier=admin_data["tier"],
            daily_generations_used=0,
            total_generations=0,
            subscription_expires_at=datetime.utcnow() + timedelta(days=36500),  # 100 years
            preferred_categories=["fashion", "fitness", "food", "travel", "business", "gaming", "music", "ideas", "event_space"],
            preferred_platforms=["tiktok", "instagram", "youtube", "facebook"]
        )
        
        try:
            existing_admin = await db.users.find_one({"email": admin_user.email})
            if not existing_admin:
                await db.users.insert_one(admin_user.dict())
                print(f"✅ Admin account created: {admin_user.email}")
            else:
                print(f"⚠️  Admin account already exists: {admin_user.email}")
        except Exception as e:
            print(f"❌ Error creating admin {admin_user.email}: {e}")
    
    print("\n🎉 Admin setup complete!")
    print("\n📧 Admin Account Details:")
    print(f"Super Admin (CEO): {super_admin.email}")
    for admin_data in admin_accounts:
        print(f"Team Admin: {admin_data['email']}")
    
    print("\n🔐 Admin Login Instructions:")
    print("1. Use the signup endpoint with these email addresses")
    print("2. Any password will work (accounts are pre-created)")
    print("3. Admin accounts have unlimited access to all features")
    print("4. No daily generation limits")
    print("5. All premium features unlocked")
    print("6. 100-year subscription (essentially unlimited)")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin_accounts())