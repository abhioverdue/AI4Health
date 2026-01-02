from db import dummy_data as db
from db import security

# --- Patients ---
def create_patient(name: str, phone: str, password: str):
    patient_id = len(db.PATIENTS) + 1
    hashed_pw = security.hash_password(password)
    patient = {
        "id": patient_id,
        "name": name,
        "phone": phone,
        "password": hashed_pw,
        "history": []
    }
    db.PATIENTS.append(patient)
    return patient

def authenticate_patient(phone: str, password: str):
    for p in db.PATIENTS:
        if p["phone"] == phone and security.verify_password(password, p["password"]):
            token = security.create_access_token({"sub": f"patient:{p['id']}"})
            return {"patient": p, "access_token": token}
    return None

def find_patient_by_phone(phone: str):
    for p in db.PATIENTS:
        if p["phone"] == phone:
            return p
    return None

# --- Doctors ---
def get_doctor_by_id(doctor_id: int):
    for d in db.DOCTORS:
        if d["id"] == doctor_id:
            return d
    return None

def list_doctors(specialty: str = None):
    if specialty:
        return [d for d in db.DOCTORS if d["specialty"] == specialty]
    return db.DOCTORS

# --- Medics ---
def list_medics():
    return db.MEDICS

def get_medic_by_id(medic_id: int):
    for m in db.MEDICS:
        if m["id"] == medic_id:
            return m
    return None

# --- Hospitals ---
def list_hospitals(specialty: str = None):
    if specialty:
        return [h for h in db.HOSPITALS if specialty in h["specialties"]]
    return db.HOSPITALS

def get_hospital_by_id(hospital_id: int):
    for h in db.HOSPITALS:
        if h["id"] == hospital_id:
            return h
    return None

# --- NGOs / Ambulances ---
def list_ngos():
    return db.NGOS

def get_ngo_by_id(ngo_id: int):
    for n in db.NGOS:
        if n["id"] == ngo_id:
            return n
    return None

# --- Patient History ---
def add_patient_history(patient_id: int, record: dict):
    for p in db.PATIENTS:
        if p["id"] == patient_id:
            p["history"].append(record)
            return p
    return None

def get_patient_history(patient_id: int):
    for p in db.PATIENTS:
        if p["id"] == patient_id:
            return p["history"]
    return []
