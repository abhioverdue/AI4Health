from fastapi import APIRouter
from db import security

router = APIRouter()

# In-memory storage (replace with a real database in production)
MEDICAL_HISTORY = {}

# ======================= Routes =======================
@router.post("/add")
def add_record(user_id: str, record: dict):
    """
    Add a medical record for a user, encrypt it before storing.
    """
    # Encrypt record before storing
    encrypted_record = security.encrypt_data(str(record))
    MEDICAL_HISTORY.setdefault(user_id, []).append(encrypted_record)

    # Audit log
    security.log_event(
        user_id=user_id,
        action="add_medical_record",
        status="SUCCESS"
    )
    return {"status": "record added"}

@router.get("/get")
def get_history(user_id: str):
    """
    Retrieve and decrypt all medical records for a user.
    """
    records = MEDICAL_HISTORY.get(user_id, [])

    # Decrypt records safely
    decrypted_records = []
    for r in records:
        try:
            decrypted = eval(security.decrypt_data(r))
            decrypted_records.append(decrypted)
        except Exception as e:
            security.log_event(
                user_id=user_id,
                action="decrypt_medical_record",
                status=f"FAILED: {str(e)}"
            )

    # Audit log
    security.log_event(
        user_id=user_id,
        action="get_medical_history",
        status="SUCCESS"
    )
    return decrypted_records
