import random
from datetime import datetime, timedelta

# Dummy NGO ambulance partners
NGO_AMBULANCES = [
    {"name": "Red Cross Chennai", "contact": "+91-9876543210", "eta_min": 15},
    {"name": "St. John Ambulance", "contact": "+91-9123456780", "eta_min": 20},
    {"name": "Lifeline NGO", "contact": "+91-9988776655", "eta_min": 12},
]

def dispatch_ambulance(severity_level):
    """
    Dispatch an NGO ambulance based on severity.
    severity_level: 1-5 (5 = critical)
    """
    if severity_level < 3:
        return {"status": "No ambulance needed", "eta_min": None}

    # Pick nearest or fastest available
    ambulance = random.choice(NGO_AMBULANCES)
    eta = ambulance["eta_min"] + random.randint(-3, 5)  # simulate traffic
    dispatch_time = datetime.now()
    arrival_time = dispatch_time + timedelta(minutes=eta)

    return {
        "status": "Dispatched",
        "ambulance_name": ambulance["name"],
        "contact": ambulance["contact"],
        "eta_min": eta,
        "expected_arrival": arrival_time.strftime("%H:%M:%S")
    }

if __name__ == "__main__":
    # Test
    print(dispatch_ambulance(severity_level=4))
