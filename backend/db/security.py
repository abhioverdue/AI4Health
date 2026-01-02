# backend/db/security.py

import os
import logging
from datetime import datetime, timedelta
from functools import wraps
from fastapi import Request, HTTPException
import bcrypt
import jwt
from cryptography.fernet import Fernet

# ======================= Environment / Secrets =======================
SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")
FERNET_KEY = os.getenv("FERNET_KEY", Fernet.generate_key())
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ======================= Logging / Audit ============================
LOG_FILE = "db/audit.log"
logging.basicConfig(filename=LOG_FILE, level=logging.INFO,
                    format="%(asctime)s - %(message)s")

def log_event(user_id: str, action: str, status: str = "SUCCESS"):
    """Log sensitive actions"""
    logging.info(f"user:{user_id} | action:{action} | status:{status}")

def log_error(user_id: str, action: str, error_msg: str):
    """Log errors"""
    logging.error(f"user:{user_id} | action:{action} | error:{error_msg}")

# ======================= Password Hashing ===========================
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

# ======================= JWT / Auth ================================
def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

def decode_access_token(token: str):
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def verify_token(token: str, role: str):
    """Verify JWT token and role"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if payload.get("role") != role:
            raise HTTPException(403, f"Unauthorized role: {payload.get('role')}")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")

def auth_required(role: str):
    """FastAPI decorator to protect routes"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get("request")
            token = request.headers.get("Authorization")
            if not token:
                raise HTTPException(401, "Missing token")
            token = token.replace("Bearer ", "")
            verify_token(token, role)
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# ======================= Encryption ================================
fernet = Fernet(FERNET_KEY)

def encrypt_data(data: str) -> str:
    """Encrypt sensitive data"""
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(token: str) -> str:
    """Decrypt sensitive data"""
    return fernet.decrypt(token.encode()).decode()
