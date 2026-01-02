from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from db import crud, security

router = APIRouter()

class DoctorLogin(BaseModel):
    doctor_id: str
    password: str

@router.post("/login")
async def login_doctor(data: DoctorLogin, request: Request):
    # Find doctor from the CRUD list
    doctor = next((d for d in crud.list_doctors() if d["id"] == int(data.doctor_id)), None)
    
    if not doctor:
        security.log_event(data.doctor_id, "login_attempt", "FAILED")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not doctor.get("verified", False):
        security.log_event(data.doctor_id, "login_attempt", "FAILED_NOT_VERIFIED")
        raise HTTPException(status_code=403, detail="Doctor not verified")

    # Password check using hashed password (replace dummy check)
    # Example: security.verify_password(data.password, doctor["hashed_password"])
    if data.password != "secure123":  
        security.log_event(data.doctor_id, "login_attempt", "FAILED_WRONG_PASSWORD")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    token = security.create_access_token({"sub": f"doctor:{doctor['id']}", "role": "doctor"})
    
    # Log successful login
    security.log_event(data.doctor_id, "login_attempt", "SUCCESS")

    return {
        "access_token": token,
        "doctor_name": doctor["name"],
        "specialty": doctor["specialty"]
    }

