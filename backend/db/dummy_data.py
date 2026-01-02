from db import security

# ===================== HOSPITALS =====================
HOSPITALS = [
    {
        "id": 1,
        "name": "SRM Hospital",
        "specialties": ["general", "cardiology", "pediatrics", "emergency"],
        "address": "SRM Nagar, Kattankulathur, Chennai",
        "lat": 12.8230,
        "lng": 80.0444,
        "eta_minutes": 10,
        "reviews": 4.3,
        "phone": "+914427400000"
    },
    {
        "id": 2,
        "name": "Apollo Clinic Guduvancheri",
        "specialties": ["general", "orthopedics", "dermatology"],
        "address": "GST Road, Guduvancheri, Chennai",
        "lat": 12.8451,
        "lng": 80.0625,
        "eta_minutes": 15,
        "reviews": 4.1,
        "phone": "+914427220000"
    },
    {
        "id": 3,
        "name": "Government Primary Health Centre",
        "specialties": ["general", "maternal", "child-care"],
        "address": "Kattankulathur PHC",
        "lat": 12.8205,
        "lng": 80.0401,
        "eta_minutes": 8,
        "reviews": 3.9,
        "phone": "+914427300111"
    },
    {
        "id": 4,
        "name": "Global Hospitals",
        "specialties": ["cardiology", "neurology", "emergency"],
        "address": "Perumbakkam, Chennai",
        "lat": 12.8902,
        "lng": 80.2279,
        "eta_minutes": 25,
        "reviews": 4.5,
        "phone": "+914447770000"
    },
    {
        "id": 5,
        "name": "Chettinad Health City",
        "specialties": ["general", "orthopedics", "emergency"],
        "address": "Kelambakkam, Chennai",
        "lat": 12.7905,
        "lng": 80.2167,
        "eta_minutes": 20,
        "reviews": 4.2,
        "phone": "+914447450000"
    },
    {
        "id": 6,
        "name": "Hindu Mission Hospital",
        "specialties": ["general", "pediatrics", "gynecology"],
        "address": "Tambaram West, Chennai",
        "lat": 12.9249,
        "lng": 80.1136,
        "eta_minutes": 30,
        "reviews": 4.0,
        "phone": "+914422420000"
    },
    {
        "id": 7,
        "name": "MIOT International",
        "specialties": ["orthopedics", "cardiology", "critical-care"],
        "address": "Manapakkam, Chennai",
        "lat": 13.0213,
        "lng": 80.1766,
        "eta_minutes": 35,
        "reviews": 4.6,
        "phone": "+914442000000"
    },
    {
        "id": 8,
        "name": "Fortis Malar Hospital",
        "specialties": ["cardiology", "emergency", "general"],
        "address": "Adyar, Chennai",
        "lat": 13.0067,
        "lng": 80.2570,
        "eta_minutes": 40,
        "reviews": 4.4,
        "phone": "+914424900000"
    },
    {
        "id": 9,
        "name": "Government General Hospital",
        "specialties": ["emergency", "trauma", "general"],
        "address": "Park Town, Chennai",
        "lat": 13.0827,
        "lng": 80.2707,
        "eta_minutes": 45,
        "reviews": 3.8,
        "phone": "+914425350000"
    },
    {
        "id": 10,
        "name": "Kauvery Hospital",
        "specialties": ["cardiology", "nephrology", "general"],
        "address": "Alwarpet, Chennai",
        "lat": 13.0339,
        "lng": 80.2505,
        "eta_minutes": 38,
        "reviews": 4.3,
        "phone": "+914440000000"
    }
]

# ===================== DOCTORS =====================
DOCTORS = [
    {
        "id": 1,
        "name": "Dr. Arjun Kumar",
        "specialty": "general",
        "phone": "+919900000001",
        "hospital_id": 1,
        "verified": True,
        "password": security.hash_password("secure123")
    },
    {
        "id": 2,
        "name": "Dr. Meera Iyer",
        "specialty": "dermatology",
        "phone": "+919900000002",
        "hospital_id": 2,
        "verified": True,
        "password": security.hash_password("secure123")
    },
    {
        "id": 3,
        "name": "Dr. S. Lakshmi",
        "specialty": "pediatrics",
        "phone": "+919900000003",
        "hospital_id": 1,
        "verified": True,
        "password": security.hash_password("secure123")
    },
    {
        "id": 4,
        "name": "Dr. Raghav Menon",
        "specialty": "cardiology",
        "phone": "+919900000004",
        "hospital_id": 4,
        "verified": True,
        "password": security.hash_password("secure123")
    },
    {
        "id": 5,
        "name": "Dr. Anitha Rao",
        "specialty": "gynecology",
        "phone": "+919900000005",
        "hospital_id": 6,
        "verified": True,
        "password": security.hash_password("secure123")
    },
    {
        "id": 6,
        "name": "Dr. Prakash N",
        "specialty": "orthopedics",
        "phone": "+919900000006",
        "hospital_id": 5,
        "verified": True,
        "password": security.hash_password("secure123")
    },
    {
        "id": 7,
        "name": "Dr. Kavita Shah",
        "specialty": "neurology",
        "phone": "+919900000007",
        "hospital_id": 4,
        "verified": True,
        "password": security.hash_password("secure123")
    },
    {
        "id": 8,
        "name": "Dr. Manoj Iyer",
        "specialty": "emergency",
        "phone": "+919900000008",
        "hospital_id": 8,
        "verified": True,
        "password": security.hash_password("secure123")
    },
    {
        "id": 9,
        "name": "Dr. Shalini Gupta",
        "specialty": "nephrology",
        "phone": "+919900000009",
        "hospital_id": 10,
        "verified": True,
        "password": security.hash_password("secure123")
    },
    {
        "id": 10,
        "name": "Dr. Vinod Krishnan",
        "specialty": "trauma",
        "phone": "+919900000010",
        "hospital_id": 9,
        "verified": True,
        "password": security.hash_password("secure123")
    }
]

# ===================== NGOs / AMBULANCE =====================
NGOS = [
    {
        "id": 1,
        "name": "RapidMed Ambulance Service",
        "phone": "+919900000010",
        "coverage_area": "Kattankulathur",
        "lat": 12.8250,
        "lng": 80.0450
    },
    {
        "id": 2,
        "name": "Chennai Emergency Response",
        "phone": "+919900000011",
        "coverage_area": "Chennai",
        "lat": 12.8400,
        "lng": 80.0600
    },
    {
        "id": 3,
        "name": "108 Government Ambulance",
        "phone": "108",
        "coverage_area": "Tamil Nadu",
        "lat": 12.9000,
        "lng": 80.2000
    },
    {
        "id": 4,
        "name": "Apollo Emergency Transport",
        "phone": "+919900000012",
        "coverage_area": "South Chennai",
        "lat": 12.9500,
        "lng": 80.2400
    },
    {
        "id": 5,
        "name": "Red Cross Ambulance",
        "phone": "+919900000013",
        "coverage_area": "Chengalpattu",
        "lat": 12.7000,
        "lng": 80.0000
    },
    {
        "id": 6,
        "name": "LifeLine Emergency Services",
        "phone": "+919900000014",
        "coverage_area": "Tambaram",
        "lat": 12.9300,
        "lng": 80.1200
    },
    {
        "id": 7,
        "name": "CARE Ambulance Network",
        "phone": "+919900000015",
        "coverage_area": "OMR",
        "lat": 12.8600,
        "lng": 80.2300
    },
    {
        "id": 8,
        "name": "MedRescue Services",
        "phone": "+919900000016",
        "coverage_area": "Adyar",
        "lat": 13.0000,
        "lng": 80.2600
    },
    {
        "id": 9,
        "name": "Emergency One",
        "phone": "+919900000017",
        "coverage_area": "Velachery",
        "lat": 12.9800,
        "lng": 80.2200
    },
    {
        "id": 10,
        "name": "Rapid Response Unit",
        "phone": "+919900000018",
        "coverage_area": "Chennai Metro",
        "lat": 13.0500,
        "lng": 80.2800
    }
]

# ===================== PATIENTS =====================
PATIENTS = [
    {
        "id": 1,
        "name": "Ramesh Kumar",
        "phone": "9999999999",
        "password": security.hash_password("patient123"),
        "history": []
    },
    {
        "id": 2,
        "name": "Sita Devi",
        "phone": "9999999998",
        "password": security.hash_password("patient123"),
        "history": []
    },
    {
        "id": 3,
        "name": "Ananya Sharma",
        "phone": "9999999997",
        "password": security.hash_password("patient123"),
        "history": []
    },
    {
        "id": 4,
        "name": "Vikram Singh",
        "phone": "9999999996",
        "password": security.hash_password("patient123"),
        "history": []
    },
    {
        "id": 5,
        "name": "Lakshmi Narayan",
        "phone": "9999999995",
        "password": security.hash_password("patient123"),
        "history": []
    },
    {
        "id": 6,
        "name": "Priya Menon",
        "phone": "9999999994",
        "password": security.hash_password("patient123"),
        "history": []
    },
    {
        "id": 7,
        "name": "Karthik R",
        "phone": "9999999993",
        "password": security.hash_password("patient123"),
        "history": []
    },
    {
        "id": 8,
        "name": "Nisha Patel",
        "phone": "9999999992",
        "password": security.hash_password("patient123"),
        "history": []
    },
    {
        "id": 9,
        "name": "Arun Verma",
        "phone": "9999999991",
        "password": security.hash_password("patient123"),
        "history": []
    },
    {
        "id": 10,
        "name": "Fatima Khan",
        "phone": "9999999990",
        "password": security.hash_password("patient123"),
        "history": []
    }
]

# ===================== MEDICS =====================
MEDICS = [
    {
        "id": 1,
        "name": "Rahul Das",
        "phone": "+919900001001",
        "role": "paramedic",
        "ngo_id": 1,
        "experience_years": 5,
        "verified": True,
        "password": security.hash_password("medic123")
    },
    {
        "id": 2,
        "name": "Sneha Paul",
        "phone": "+919900001002",
        "role": "emt",
        "ngo_id": 2,
        "experience_years": 3,
        "verified": True,
        "password": security.hash_password("medic123")
    },
    {
        "id": 3,
        "name": "Mohammed Irfan",
        "phone": "+919900001003",
        "role": "paramedic",
        "ngo_id": 3,
        "experience_years": 7,
        "verified": True,
        "password": security.hash_password("medic123")
    },
    {
        "id": 4,
        "name": "Kavya Nair",
        "phone": "+919900001004",
        "role": "emt",
        "ngo_id": 4,
        "experience_years": 4,
        "verified": True,
        "password": security.hash_password("medic123")
    },
    {
        "id": 5,
        "name": "Arjun Patel",
        "phone": "+919900001005",
        "role": "advanced_paramedic",
        "ngo_id": 5,
        "experience_years": 9,
        "verified": True,
        "password": security.hash_password("medic123")
    },
    {
        "id": 6,
        "name": "Neethu Varghese",
        "phone": "+919900001006",
        "role": "emt",
        "ngo_id": 6,
        "experience_years": 2,
        "verified": True,
        "password": security.hash_password("medic123")
    },
    {
        "id": 7,
        "name": "Suresh Babu",
        "phone": "+919900001007",
        "role": "paramedic",
        "ngo_id": 7,
        "experience_years": 6,
        "verified": True,
        "password": security.hash_password("medic123")
    },
    {
        "id": 8,
        "name": "Pooja Malhotra",
        "phone": "+919900001008",
        "role": "emt",
        "ngo_id": 8,
        "experience_years": 3,
        "verified": True,
        "password": security.hash_password("medic123")
    },
    {
        "id": 9,
        "name": "Naveen Kumar",
        "phone": "+919900001009",
        "role": "paramedic",
        "ngo_id": 9,
        "experience_years": 8,
        "verified": True,
        "password": security.hash_password("medic123")
    },
    {
        "id": 10,
        "name": "Ayesha Rahman",
        "phone": "+919900001010",
        "role": "advanced_paramedic",
        "ngo_id": 10,
        "experience_years": 10,
        "verified": True,
        "password": security.hash_password("medic123")
    }
]

