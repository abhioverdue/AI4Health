import random
from datetime import datetime, timedelta

# Dummy on-call doctors database
DOCTORS = [
    {"name": "Dr. Ravi Kumar", "specialty": "General Medicine", "contact": "+91-9000000001"},
    {"name": "Dr. Anjali Mehta", "specialty": "Pediatrics", "contact": "+91-9000000002"},
    {"name": "Dr. Suresh Reddy", "specialty": "Cardiology", "contact": "+91-9000000003"},
    {"name": "Dr. Priya Sharma", "specialty": "Dermatology", "contact": "+91-9000000004"},
]

def dispatch_doctor(symptoms, severity_level):
    """
    Dispatch a doctor for teleconsultation or in-person.
    severity_level: 1-5 (5 = critical)
    """
    if severity_level < 2:
        # Mild symptoms: just teleconsult
        doctor = random.choice(DOCTORS)
        return {
            "consult_type": "teleconsult",
            "doctor_name": doctor["name"],
            "specialty": doctor["specialty"],
            "contact": doctor["contact"]
        }

    # Moderate/severe: dispatch doctor and/or ambulance
    doctor = random.choice(DOCTORS)
    eta = random.randint(10, 30)  # minutes
    arrival_time = datetime.now() + timedelta(minutes=eta)

    return {
        "consult_type": "emergency",
        "doctor_name": doctor["name"],
        "specialty": doctor["specialty"],
        "contact": doctor["contact"],
        "eta_min": eta,
        "expected_arrival": arrival_time.strftime("%H:%M:%S")
    }

if __name__ == "__main__":
    # Test
    print(dispatch_doctor(symptoms=["fever","cough"], severity_level=3))
