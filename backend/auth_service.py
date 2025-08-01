import os
import jwt
import bcrypt
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, List
from motor.motor_asyncio import AsyncIOMotorClient
from models import User, UserCreate, LoginRequest, SignupRequest, TeamSignupRequest, GoogleLoginRequest, TeamCode, UserTier, AuthProvider
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self):
        self.mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        self.db_name = os.environ.get('DB_NAME', 'ai_caption_generator')
        self.jwt_secret = os.environ.get('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production')
        self.jwt_algorithm = 'HS256'
        self.jwt_expiration_hours = 24 * 7  # 7 days
        self.client = None
        self.db = None
        
        # Master team code for THREE11 MOTION TECH team
        self.master_team_code = "THREE11-UNLIMITED-2025"
        
    async def get_database(self):
        if not self.client:
            self.client = AsyncIOMotorClient(self.mongo_url)
            self.db = self.client[self.db_name]
        return self.db
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def generate_jwt_token(self, user_id: str, email: str) -> str:
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            'email': email,
            'exp': datetime.utcnow() + timedelta(hours=self.jwt_expiration_hours),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, self.jwt_secret, algorithm=self.jwt_algorithm)
    
    def verify_jwt_token(self, token: str) -> Optional[Dict]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=[self.jwt_algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    async def create_admin_account(self):
        """Create the main admin account for lewcor311@gmail.com"""
        db = await self.get_database()
        
        # Check if admin already exists
        existing_admin = await db.users.find_one({"email": "lewcor311@gmail.com"})
        if existing_admin:
            logger.info("Admin account already exists")
            return existing_admin
        
        # Create admin account
        admin_user = User(
            email="lewcor311@gmail.com",
            name="THREE11 MOTION TECH Admin",
            tier=UserTier.UNLIMITED,
            auth_provider=AuthProvider.EMAIL,
            password_hash=self.hash_password("THREE11admin2025!"),  # Temporary password
            is_active=True,
            is_verified=True,
            created_at=datetime.utcnow()
        )
        
        result = await db.users.insert_one(admin_user.dict())
        admin_user.id = str(result.inserted_id)
        
        # Create master team code
        await self.create_master_team_code(admin_user.id)
        
        logger.info(f"Admin account created for lewcor311@gmail.com with temporary password: THREE11admin2025!")
        return admin_user.dict()
    
    async def create_master_team_code(self, admin_id: str):
        """Create the master team code for THREE11 team"""
        db = await self.get_database()
        
        # Check if team code already exists
        existing_code = await db.team_codes.find_one({"code": self.master_team_code})
        if existing_code:
            return existing_code
        
        team_code = TeamCode(
            code=self.master_team_code,
            created_by=admin_id,
            max_uses=10,  # Allow 10 team members
            current_uses=0,
            is_active=True
        )
        
        await db.team_codes.insert_one(team_code.dict())
        logger.info(f"Master team code created: {self.master_team_code}")
        return team_code.dict()
    
    async def signup_user(self, signup_data: SignupRequest) -> Dict:
        """Register new user"""
        db = await self.get_database()
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email": signup_data.email})
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Determine user tier based on team code
        user_tier = UserTier.FREE
        team_code_used = None
        
        if signup_data.team_code:
            # Verify team code
            team_code = await db.team_codes.find_one({
                "code": signup_data.team_code,
                "is_active": True
            })
            
            if not team_code:
                raise ValueError("Invalid team code")
            
            if team_code.get('max_uses') and team_code.get('current_uses', 0) >= team_code.get('max_uses'):
                raise ValueError("Team code has reached maximum uses")
            
            # Grant unlimited access for team members
            user_tier = UserTier.UNLIMITED
            team_code_used = signup_data.team_code
            
            # Update team code usage
            await db.team_codes.update_one(
                {"code": signup_data.team_code},
                {"$inc": {"current_uses": 1}}
            )
        
        # Create user
        user = User(
            email=signup_data.email,
            name=signup_data.name,
            tier=user_tier,
            auth_provider=AuthProvider.EMAIL,
            password_hash=self.hash_password(signup_data.password),
            is_active=True,
            is_verified=True,
            team_code_used=team_code_used,
            created_at=datetime.utcnow()
        )
        
        result = await db.users.insert_one(user.dict())
        user.id = str(result.inserted_id)
        
        # Generate JWT token
        token = self.generate_jwt_token(user.id, user.email)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "expires_in": self.jwt_expiration_hours * 3600,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "tier": user.tier,
                "is_unlimited": user.tier == UserTier.UNLIMITED
            }
        }
    
    async def login_user(self, login_data: LoginRequest) -> Dict:
        """Login user with email and password"""
        db = await self.get_database()
        
        # Find user
        user = await db.users.find_one({"email": login_data.email})
        if not user:
            raise ValueError("Invalid email or password")
        
        # Verify password
        if not user.get('password_hash') or not self.verify_password(login_data.password, user['password_hash']):
            raise ValueError("Invalid email or password")
        
        # Check if user is active
        if not user.get('is_active', True):
            raise ValueError("Account is deactivated")
        
        # Update last login
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Generate JWT token
        token = self.generate_jwt_token(str(user["_id"]), user["email"])
        
        return {
            "access_token": token,
            "token_type": "bearer", 
            "expires_in": self.jwt_expiration_hours * 3600,
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "tier": user.get("tier", UserTier.FREE),
                "is_unlimited": user.get("tier") == UserTier.UNLIMITED
            }
        }
    
    async def google_login(self, google_data: GoogleLoginRequest) -> Dict:
        """Login/signup user with Google OAuth"""
        # This would typically verify the Google token with Google's API
        # For now, we'll create a placeholder implementation
        
        # In a real implementation, you would:
        # 1. Verify the Google token with Google's OAuth2 API
        # 2. Extract user info (email, name, google_id) from the verified token
        # 3. Create or login the user
        
        # Placeholder response for now
        raise NotImplementedError("Google OAuth integration requires Google API setup")
    
    async def get_user_by_token(self, token: str) -> Optional[Dict]:
        """Get user by JWT token"""
        payload = self.verify_jwt_token(token)
        if not payload:
            return None
        
        db = await self.get_database()
        from bson import ObjectId
        try:
            user_id = ObjectId(payload["user_id"])
            user = await db.users.find_one({"_id": user_id})
        except:
            # Fallback to string ID if ObjectId conversion fails
            user = await db.users.find_one({"id": payload["user_id"]})
        
        if not user or not user.get('is_active', True):
            return None
        
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "tier": user.get("tier", UserTier.FREE),
            "is_unlimited": user.get("tier") == UserTier.UNLIMITED,
            "auth_provider": user.get("auth_provider", AuthProvider.EMAIL)
        }
    
    async def change_password(self, user_id: str, old_password: str, new_password: str) -> bool:
        """Change user password"""
        db = await self.get_database()
        
        user = await db.users.find_one({"_id": user_id})
        if not user:
            return False
        
        # Verify old password
        if not self.verify_password(old_password, user['password_hash']):
            return False
        
        # Update password
        new_hash = self.hash_password(new_password)
        await db.users.update_one(
            {"_id": user_id},
            {"$set": {"password_hash": new_hash, "updated_at": datetime.utcnow()}}
        )
        
        return True
    
    async def get_team_code_info(self, code: str) -> Optional[Dict]:
        """Get team code information"""
        db = await self.get_database()
        
        team_code = await db.team_codes.find_one({"code": code, "is_active": True})
        if not team_code:
            return None
        
        return {
            "code": team_code["code"],
            "max_uses": team_code.get("max_uses"),
            "current_uses": team_code.get("current_uses", 0),
            "remaining_uses": team_code.get("max_uses", 0) - team_code.get("current_uses", 0) if team_code.get("max_uses") else None,
            "is_active": team_code["is_active"]
        }
    
    async def get_team_members(self, admin_user_id: str) -> List[Dict]:
        """Get all team members who used the team code"""
        db = await self.get_database()
        
        # Find team codes created by this admin
        team_codes = await db.team_codes.find({"created_by": admin_user_id}).to_list(None)
        code_strings = [tc["code"] for tc in team_codes]
        
        # Find users who used these team codes
        team_members = await db.users.find({
            "team_code_used": {"$in": code_strings}
        }).to_list(None)
        
        return [
            {
                "id": str(member["_id"]),
                "email": member["email"],
                "name": member["name"],
                "tier": member.get("tier"),
                "created_at": member.get("created_at"),
                "last_login": member.get("last_login"),
                "team_code_used": member.get("team_code_used")
            }
            for member in team_members
        ]

# Create global auth service instance
auth_service = AuthService()