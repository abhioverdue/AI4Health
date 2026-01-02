from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from dispatch.ngo_dispatch import dispatch_ambulance
from dispatch.doctor_dispatch import dispatch_doctor
from db import security

router = APIRouter()

# ======================= Schemas =======================
class EmergencyRequest(BaseModel):
    symptoms: List[str]
    severity_level: int  # 1-5

# ======================= Routes =======================
@router.post("/emergency")
def emergency(request: EmergencyRequest):
    if request.severity_level < 1 or request.severity_level > 5:
        raise HTTPException(status_code=400, detail="severity_level must be 1-5")

    # Assign doctor based on symptoms & severity
    doctor_info = dispatch_doctor(request.symptoms, request.severity_level)

    # Assign ambulance only if severity >= 3
    if request.severity_level >= 3:
        ngo_info = dispatch_ambulance(request.severity_level)
    else:
        ngo_info = {"status": "ambulance not needed"}

    # Audit log
    security.log_event(
        user_id="system",
        action=f"emergency_dispatch_doctor_{doctor_info['id']}",
        status="SUCCESS"
    )

    return {
        "status": "dispatch_processed",
        "assigned_doctor": doctor_info,
        "ambulance_service": ngo_info
    }

# ======================= Quick Test =======================
if __name__ == "__main__":
    from fastapi import FastAPI
    from fastapi.testclient import TestClient

    app = FastAPI()
    app.include_router(router)
    client = TestClient(app)

    response = client.post("/emergency", json={
        "symptoms": ["fever", "cough"],
        "severity_level": 4
    })
    print(response.json())
