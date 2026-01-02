from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from db import crud, security

router = APIRouter()

# ======================= Schemas =======================
class PatientRegister(BaseModel):
    name: str
    phone: str
    password: str
    consent: bool

class PatientLogin(BaseModel):
    phone: str
    password: str

# ======================= Routes =======================
@router.post("/register")
async def register_patient(data: PatientRegister, request: Request):
    if not data.consent:
        raise HTTPException(status_code=400, detail="Legal consent required")

    existing_patient = crud.find_patient_by_phone(data.phone)
    if existing_patient:
        raise HTTPException(status_code=400, detail="Patient already exists")

    # Hash password before storing
    hashed_password = security.hash_password(data.password)
    patient = crud.create_patient(data.name, data.phone, hashed_password)
    
    security.log_event(data.phone, "register", "SUCCESS")
    return {"status": "registered", "patient_id": patient["id"]}

@router.post("/login")
async def login_patient(data: PatientLogin, request: Request):
    patient = crud.find_patient_by_phone(data.phone)
    
    if not patient or not security.verify_password(data.password, patient["hashed_password"]):
        security.log_event(data.phone, "login_attempt", "FAILED")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token for the patient
    token = security.create_access_token({"sub": f"patient:{patient['id']}", "role": "patient"})
    
    security.log_event(data.phone, "login_attempt", "SUCCESS")
    return {
        "access_token": token,
        "patient_name": patient["name"],
        "patient_id": patient["id"]
    }

