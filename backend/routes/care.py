from fastapi import APIRouter, Query
from db.dummy_data import HOSPITALS, NGOS

router = APIRouter()

@router.get("/recommendations")
async def get_care_recommendations(
    risk_level: str,
    lat: float = Query(...),
    lng: float = Query(...)
):
    response = {
        "hospitals": HOSPITALS,
        "ambulance": NGOS if risk_level == "high" else []
    }
    return response
