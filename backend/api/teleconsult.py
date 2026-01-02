from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, random, string
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant
from twilio.rest import Client
from db import security

app = FastAPI()

# Allow frontend CORS
origins = [
    "http://localhost:8000",  # Vite default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/teleconsult")

# ======================= Twilio Config =======================
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_SID")
TWILIO_API_KEY_SID = os.getenv("TWILIO_API_KEY")
TWILIO_API_KEY_SECRET = os.getenv("TWILIO_API_SECRET")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SECRET)

# ======================= Schemas =======================
class TeleconsultRequest(BaseModel):
    doctor_name: str
    patient_name: str

# ======================= Helpers =======================
def generate_room_name(length: int = 8) -> str:
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))

def create_token(identity: str, room_name: str) -> str:
    token = AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, identity=identity)
    token.add_grant(VideoGrant(room=room_name))
    return token.to_jwt().decode("utf-8")

# ======================= Routes =======================
@router.post("/video_call")
def initiate_video_call(request: TeleconsultRequest):
    room_name = generate_room_name()
    try:
        # Create Twilio room
        room = client.video.rooms.create(unique_name=room_name, type="group")

        # Generate access tokens
        doctor_token = create_token(request.doctor_name, room_name)
        patient_token = create_token(request.patient_name, room_name)

        # Audit log
        security.log_event(
            user_id=request.patient_name,
            action=f"video_call_with_{request.doctor_name}",
            status="SUCCESS"
        )

        return {
            "room_name": room_name,
            "doctor_token": doctor_token,
            "patient_token": patient_token
        }

    except Exception as e:
        security.log_event(
            user_id=request.patient_name,
            action=f"video_call_with_{request.doctor_name}",
            status=f"FAILED: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(router)

