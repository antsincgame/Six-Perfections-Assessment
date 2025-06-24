"""
Six Perfections Assessment - Authentication Service
A FastAPI-based authentication service integrated with Supabase
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, validator
from supabase import create_client, Client
import os
import jwt
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import asyncio
import uvicorn
from passlib.context import CryptContext
import json
import uuid
import structlog

# Buddhist blessing for the service 🙏
"""
ॐ गते गते पारगते पारसंगते बोधि स्वाहा
Gate gate pāragate pārasaṃgate bodhi svāhā
May this service help all beings cross to the other shore of enlightenment
"""

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Six Perfections Auth Service",
    description="Authentication service for Six Perfections Assessment (षट्पारमिता)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "six_perfections_diamond_mind_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7
DATA_DIR = os.getenv("DATA_DIR", "./data")
USERS_DIR = os.path.join(DATA_DIR, "users")

# Ensure data directories exist
os.makedirs(USERS_DIR, exist_ok=True)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT bearer security
security = HTTPBearer()

# Pydantic models
class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    language_preference: str = "en"
    spiritual_background: Optional[Dict[str, Any]] = {}
    practice_experience: Optional[int] = 0
    
    @validator('password')
    def password_validation(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('language_preference')
    def language_validation(cls, v):
        allowed_languages = ['en', 'ru', 'zh', 'ja', 'bo', 'sa']
        if v not in allowed_languages:
            raise ValueError(f'Language must be one of: {allowed_languages}')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    language_preference: str
    spiritual_level: Optional[str]
    created_at: datetime
    last_login_at: Optional[datetime]

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_at: datetime
    user: UserResponse

class TokenRefresh(BaseModel):
    refresh_token: str

# Helper functions
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def save_user(user_data: dict) -> None:
    """Save user data to JSON file"""
    user_file = os.path.join(USERS_DIR, f"{user_data['id']}.json")
    with open(user_file, 'w', encoding='utf-8') as f:
        json.dump(user_data, f, indent=2, ensure_ascii=False)

def load_user(user_id: str) -> Optional[dict]:
    """Load user data from JSON file"""
    try:
        user_file = os.path.join(USERS_DIR, f"{user_id}.json")
        with open(user_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None

def find_user_by_email(email: str) -> Optional[dict]:
    """Find user by email address"""
    try:
        for filename in os.listdir(USERS_DIR):
            if filename.endswith('.json'):
                user_file = os.path.join(USERS_DIR, filename)
                with open(user_file, 'r', encoding='utf-8') as f:
                    user_data = json.load(f)
                    if user_data.get('email') == email:
                        return user_data
        return None
    except Exception:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = load_user(user_id)
    if user is None:
        raise credentials_exception
    return user

# Routes

@app.get("/health")
async def health_check():
    """Health check endpoint blessed by Medicine Buddha 💊"""
    try:
        # Test JSON storage
        test_file = os.path.join(DATA_DIR, "health_test.json")
        test_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "test": "health_check",
            "paramita": "प्रज्ञा (Prajna) - Testing wisdom"
        }
        
        with open(test_file, 'w') as f:
            json.dump(test_data, f)
        
        # Read test
        with open(test_file, 'r') as f:
            json.load(f)
        
        # Cleanup
        os.remove(test_file)
        
        return {
            "success": True,
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "service": "auth-service",
            "version": "1.0.0",
            "storage": "json",
            "users_directory": os.path.exists(USERS_DIR),
            "buddhist_wisdom": "🙏 All systems flow with the wisdom of the Six Perfections"
        }
        
    except Exception as e:
        return {
            "success": False,
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat(),
            "buddhist_wisdom": "🛠️ May wisdom guide us through technical difficulties"
        }

@app.post("/register", response_model=dict)
async def register_user(user_data: UserRegistration):
    """
    Register a new user account
    Protected by Green Tara's swift action 💚
    """
    logger.info(f"🌱 New user registration attempt", email=user_data.email)
    
    # Check if user already exists
    existing_user = find_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=409,
            detail={
                "error": "User already exists",
                "message": "Account with this email already exists",
                "buddhist_wisdom": "♻️ All beings return to the path in their own time"
            }
        )
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    user_data = {
        "id": user_id,
        "email": user_data.email,
        "password": hashed_password,
        "firstName": user_data.first_name,
        "lastName": user_data.last_name,
        "spiritualLevel": "beginner",
        "languagePreference": user_data.language_preference,
        "status": "active",
        "joinedAt": datetime.utcnow().isoformat(),
        "lastLogin": datetime.utcnow().isoformat(),
        "paramitaProgress": {
            "dana": 0,
            "sila": 0,
            "ksanti": 0,
            "virya": 0,
            "dhyana": 0,
            "prajna": 0
        },
        "assessmentHistory": []
    }
    
    save_user(user_data)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    # Remove password from response
    user_response = {k: v for k, v in user_data.items() if k != 'password'}
    
    logger.info("🎉 User registration successful", user_id=user_id, email=user_data["email"])
    
    return {
        "success": True,
        "message": "Registration successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response,
        "buddhist_wisdom": "🌱 A new journey on the path to enlightenment begins"
    }

@app.post("/login", response_model=dict)
async def login_user(login_data: UserLogin):
    """
    Authenticate user login
    Guided by Amitabha's infinite light 🌟
    """
    logger.info("🔑 Login attempt", email=login_data.email)
    
    # Find user by email
    user_data = find_user_by_email(login_data.email)
    if not user_data:
        raise HTTPException(
            status_code=401,
            detail={
                "error": "Invalid credentials",
                "message": "No account found with this email",
                "buddhist_wisdom": "🧭 May you find the right path to enlightenment"
            }
        )
    
    # Verify password
    if not verify_password(login_data.password, user_data["password"]):
        raise HTTPException(
            status_code=401,
            detail={
                "error": "Invalid credentials", 
                "message": "Incorrect password",
                "buddhist_wisdom": "🗝️ Wisdom comes through right understanding"
            }
        )
    
    # Check account status
    if user_data.get("status") != "active":
        raise HTTPException(
            status_code=401,
            detail={
                "error": "Account inactive",
                "message": "Your account has been deactivated",
                "buddhist_wisdom": "🌱 May your path to enlightenment be renewed"
            }
        )
    
    # Update last login
    user_data["lastLogin"] = datetime.utcnow().isoformat()
    save_user(user_data)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data["id"]})
    
    # Remove password from response
    user_response = {k: v for k, v in user_data.items() if k != 'password'}
    
    logger.info("🙏 Login successful", user_id=user_data["id"], email=login_data.email)
    
    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response,
        "buddhist_wisdom": "🙏 Welcome back to your path of spiritual development"
    }

@app.post("/refresh")
async def refresh_token(token_data: TokenRefresh):
    """
    Refresh access token
    Renewed by Akshobhya's unwavering nature ⚡
    """
    try:
        auth_response = supabase.auth.refresh_session(token_data.refresh_token)
        
        if auth_response.session is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer",
            "expires_at": datetime.fromtimestamp(auth_response.session.expires_at)
        }
        
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token refresh failed"
        )

@app.post("/logout", response_model=dict)
async def logout_user(current_user: dict = Depends(get_current_user)):
    """
    Logout current user
    Released with Vairochana's all-illuminating wisdom ☀️
    """
    logger.info("👋 User logout", user_id=current_user["id"], email=current_user["email"])
    
    return {
        "success": True,
        "message": "Logout successful",
        "buddhist_wisdom": "🙏 May your practice continue with mindfulness"
    }

@app.get("/me", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current user profile
    Revealed by Samantabhadra's universal compassion 🌍
    """
    # Remove password from response
    user_response = {k: v for k, v in current_user.items() if k != 'password'}
    
    return {
        "success": True,
        "user": user_response
    }

@app.get("/version")
async def get_version():
    """Service version and Buddhist wisdom"""
    return {
        "service": "six-perfections-auth",
        "version": "1.0.0",
        "supabase_url": SUPABASE_URL,
        "paramitas": [
            "दान (Dana) - Generosity",
            "शील (Sila) - Ethics", 
            "क्षान्ति (Ksanti) - Patience",
            "वीर्य (Virya) - Energy",
            "ध्यान (Dhyana) - Meditation",
            "प्रज्ञा (Prajna) - Wisdom"
        ],
        "blessing": "सर्वे सत्त्वाः सुखिनो भवन्तु - May all beings be happy 🙏"
    }

# Root endpoint with Buddhist blessing
@app.get("/", response_model=dict)
async def root():
    """Root endpoint with Six Perfections blessing"""
    return {
        "service": "Six Perfections Authentication Service",
        "version": "1.0.0",
        "architecture": "Pure JSON",
        "paramitas": [
            {"sanskrit": "दान", "tibetan": "སྦྱིན་པ་", "english": "Generosity"},
            {"sanskrit": "शील", "tibetan": "ཚུལ་ཁྲིམས་", "english": "Ethics"},
            {"sanskrit": "क्षान्ति", "tibetan": "བཟོད་པ་", "english": "Patience"},
            {"sanskrit": "वीर्य", "tibetan": "བརྩོན་འགྲུས་", "english": "Energy"},
            {"sanskrit": "ध्यान", "tibetan": "བསམ་གཏན་", "english": "Meditation"},
            {"sanskrit": "प्रज्ञा", "tibetan": "ཤེས་རབ་", "english": "Wisdom"}
        ],
        "blessing": "ॐ मणि पद्मे हूँ - May all beings achieve enlightenment through the Six Perfections",
        "mahakala_protection": "💎 Protected by Diamond Mind Clarity"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    ) 