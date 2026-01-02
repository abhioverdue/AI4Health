"""
Realistic rule-based severity scoring engine
Inputs:
    - symptoms: list of strings
    - vitals: dict with keys 'temp', 'bp', 'spo2', 'hr'
    - age: int
    - comorbidities: list of strings
Outputs:
    - severity_score: 0-100
    - severity_level: mild / moderate / severe
"""

def compute_severity(symptoms=[], vitals=None, age=None, comorbidities=[]):
    score = 0

    # ---------------- Critical symptoms ----------------
    critical_symptoms = {
        "cardiac arrest": 40,
        "blood in stool": 30,
        "blood in vomit": 30,
        "blood cough": 30,
        "fainting": 25,
        "fracture": 20,
        "chest pain": 25,
        "severe shortness of breath": 30,
        "unconsciousness": 40
    }
    for s in symptoms:
        score += critical_symptoms.get(s.lower(), 0)

    # ---------------- Moderate symptoms ----------------
    moderate_symptoms = {
        "high fever": 15,
        "severe headache": 10,
        "significant swelling": 10,
        "large bruises": 10,
        "persistent vomiting": 15,
        "persistent diarrhea": 15,
        "moderate shortness of breath": 15,
        "moderate chest pain": 15
    }
    for s in symptoms:
        score += moderate_symptoms.get(s.lower(), 0)

    # ---------------- Mild symptoms ----------------
    mild_symptoms = {
        "cough": 5,
        "fatigue": 5,
        "headache": 5,
        "stomach ache": 5,
        "minor bruises": 3,
        "mild fever": 5,
        "sore throat": 3
    }
    for s in symptoms:
        score += mild_symptoms.get(s.lower(), 0)

    # ---------------- Vitals scoring ----------------
    if vitals:
        temp = vitals.get("temp")
        if temp:
            if temp >= 40:
                score += 15
            elif temp >= 38:
                score += 10

        spo2 = vitals.get("spo2")
        if spo2:
            if spo2 < 90:
                score += 25
            elif spo2 < 94:
                score += 15

        bp = vitals.get("bp")
        if bp:
            if bp > 180 or bp < 80:
                score += 15
            elif bp > 140 or bp < 90:
                score += 5

        hr = vitals.get("hr")
        if hr:
            if hr > 120 or hr < 50:
                score += 10

    # ---------------- Age scoring ----------------
    if age:
        if age >= 70:
            score += 10
        elif age >= 60:
            score += 5

    # ---------------- Comorbidities scoring ----------------
    # Heart, lung, kidney, diabetes etc. add more risk
    high_risk_conditions = {"heart disease", "lung disease", "kidney disease", "diabetes", "hypertension"}
    score += sum(5 for c in comorbidities if c.lower() in high_risk_conditions)

    # Cap at 100
    score = min(score, 100)

    # ---------------- Severity level ----------------
    if score >= 60:
        level = "severe"
    elif score >= 30:
        level = "moderate"
    else:
        level = "mild"

    return {"severity_score": score, "severity_level": level}


# ---------------- Quick test ----------------
if __name__ == "__main__":
    sample = compute_severity(
        symptoms=["blood cough", "fainting", "cough"],
        vitals={"temp": 39, "spo2": 85, "bp": 160, "hr": 130},
        age=68,
        comorbidities=["heart disease", "diabetes"]
    )
    print(sample)
