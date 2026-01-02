from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

# --- Import Routers ---
from api import auth_doctor, auth_patient,emergency, history, teleconsult
from backend.api import auth_medic
from routes import care

# --- Import your audio/text pipeline ---
from audio_pipeline.whisper_asr import transcribe_audio
from audio_pipeline.normalize import normalize_text
from ai_models.severity_engine import compute_severity
from dispatch.doctor_dispatch import dispatch_doctor
from dispatch.ngo_dispatch import dispatch_ambulance

app = FastAPI(
    title="AI4Health Backend",
    description="Backend API for AI-driven healthcare platform",
    version="1.0.0"
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(auth_doctor.router, prefix="/auth/doctor", tags=["Doctor Auth"])
app.include_router(auth_patient.router, prefix="/auth/patient", tags=["Patient Auth"])
app.include_router(auth_medic.router, prefix="/auth/worker", tags=["Medic Auth"])
app.include_router(emergency.router, prefix="/dispatch", tags=["Emergency Dispatch"])
app.include_router(history.router, prefix="/history", tags=["Medical History"])
app.include_router(teleconsult.router, prefix="/teleconsult", tags=["Teleconsultation"])
app.include_router(care.router, prefix="/care", tags=["Care"])


# --- Root Endpoint ---
@app.get("/")
def root():
    return {"status": "running", "message": "Welcome to AI4Health Backend", "version": "1.0.0"}

# --- Audio/Text symptom processing + dispatch ---
@app.post("/process_symptoms/")
async def process_symptoms(
    symptoms_text: Optional[str] = Form(None),
    symptoms_audio: Optional[UploadFile] = File(None)
):
    """
    Accepts either:
    1. symptoms_text (any language) OR
    2. symptoms_audio (wav/mp3)
    
    Returns:
    - Normalized English symptoms
    - Severity score
    - Assigned doctor
    - Assigned ambulance (if severity >= 3)
    """
    if not symptoms_text and not symptoms_audio:
        raise HTTPException(400, "Provide either symptoms_text or symptoms_audio")

    # 1️⃣ Get raw text
    if symptoms_audio:
        try:
            raw_text = transcribe_audio(symptoms_audio.file)
        except Exception as e:
            raise HTTPException(500, f"Audio transcription failed: {str(e)}")
    else:
        raw_text = symptoms_text

    # 2️⃣ Normalize / translate to English
    normalized_text = normalize_text(raw_text)

    # 3️⃣ Compute severity
    severity_level = compute_severity(normalized_text)  # returns 1-5

    # 4️⃣ Dispatch doctor
    doctor_info = dispatch_doctor(normalized_text.split(), severity_level)

    # 5️⃣ Dispatch ambulance if severity >=3
    if severity_level >= 3:
        ngo_info = dispatch_ambulance(severity_level)
    else:
        ngo_info = {"status": "ambulance not needed"}

    return {
        "raw_text": raw_text,
        "normalized_text": normalized_text,
        "severity_level": severity_level,
        "assigned_doctor": doctor_info,
        "ambulance_service": ngo_info
    }

# --- Startup/Shutdown ---
@app.on_event("startup")
def startup_event():
    print("AI4Health Backend starting up...")

@app.on_event("shutdown")
def shutdown_event():
    print("AI4Health Backend shutting down...")

# --- Run ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
