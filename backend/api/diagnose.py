from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional
from backend.audio_pipeline.normalize import normalize_text
from backend.audio_pipeline.whisper_asr import transcribe_audio
from backend.ai_models.symptom_nlp.inference import predict_top_diseases
from backend.ai_models.computer_vision.inference import predict_image
from backend.ai_models.severity_engine import compute_severity

router = APIRouter()

@router.post("/")
async def diagnose(
    text: str = Form(""),
    audio: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    dataset_type: Optional[str] = Form("skin"),  # specify 'chest', 'skin', 'wound'
    vitals: Optional[dict] = Form(None),
    age: Optional[int] = Form(None),
    comorbidities: Optional[List[str]] = Form(None)
):
    # ------------------- Audio transcription -------------------
    if audio:
        text = transcribe_audio(audio.file)

    # ------------------- Normalize text -------------------
    normalized_text = normalize_text(text)

    # ------------------- Symptom NLP prediction -------------------
    nlp_predictions = predict_top_diseases(normalized_text)
    top_symptoms = [d["disease"].lower() for d in nlp_predictions]

    # ------------------- Computer vision prediction -------------------
    vision_result = None
    if image:
        # dataset_type must be 'chest', 'skin', or 'wound'
        vision_result = predict_image(image.file, dataset_type)
        # Add vision-predicted findings as symptoms for severity
        vision_symptom = f"{dataset_type}_finding_{vision_result['pred_class']}"
        top_symptoms.append(vision_symptom)

    # ------------------- Compute severity -------------------
    severity = compute_severity(
        symptoms=top_symptoms,
        vitals=vitals,
        age=age,
        comorbidities=comorbidities or []
    )

    # ------------------- Prepare response -------------------
    response = {
        "normalized_input": normalized_text,
        "top_5_diseases": nlp_predictions[:5],
        "vision_result": vision_result,
        "severity_score": severity["severity_score"],
        "severity_level": severity["severity_level"],
        "emergency": severity["severity_level"] == "severe"
    }

    return response

