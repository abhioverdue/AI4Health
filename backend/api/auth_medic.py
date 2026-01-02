from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import crud, security

router = APIRouter()

# ======================= Schemas =======================
class MedicLogin(BaseModel):
    phone: str
    password: str

# ======================= Routes =======================
@router.post("/login")
async def login_medic(data: MedicLogin):
    # Find medic in dummy data
    medic = next((m for m in crud.list_medics() if m["phone"] == data.phone), None)

    if not medic:
        security.log_event(data.phone, "login_attempt", "FAILED")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not security.verify_password(data.password, medic["password"]):
        security.log_event(data.phone, "login_attempt", "FAILED_WRONG_PASSWORD")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    token = security.create_access_token({
        "sub": f"medic:{medic['id']}",
        "role": "medic"
    })

    security.log_event(data.phone, "login_attempt", "SUCCESS")

    return {
        "access_token": token,
        "medic_name": medic["name"],
        "region": medic.get("coverage_area", "Unknown"),
        "role": "medic"
    }

