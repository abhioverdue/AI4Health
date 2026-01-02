import json
from pathlib import Path
import requests

OFFLINE_DIR = Path("offline_data")
OFFLINE_DIR.mkdir(exist_ok=True)

# File paths
EMERGENCY_FILE = OFFLINE_DIR / "emergency_requests.json"
HISTORY_FILE = OFFLINE_DIR / "medical_history.json"

# Ensure files exist
for f in [EMERGENCY_FILE, HISTORY_FILE]:
    if not f.exists():
        f.write_text("[]")

def save_offline(file_path: Path, data: dict):
    """
    Append a new record to offline storage.
    """
    records = json.loads(file_path.read_text())
    records.append(data)
    file_path.write_text(json.dumps(records, indent=2))

def load_offline(file_path: Path):
    """
    Load all offline records from storage.
    """
    return json.loads(file_path.read_text())

def sync_emergency(server_url: str):
    """
    Sync offline emergency requests with server.
    """
    records = load_offline(EMERGENCY_FILE)
    if not records:
        return {"status": "nothing to sync"}

    successful = []
    failed = []

    for rec in records:
        try:
            resp = requests.post(f"{server_url}/emergency", json=rec, timeout=5)
            if resp.status_code == 200:
                successful.append(rec)
            else:
                failed.append(rec)
        except Exception:
            failed.append(rec)

    # Save failed records back
    EMERGENCY_FILE.write_text(json.dumps(failed, indent=2))
    return {
        "synced": len(successful),
        "failed": len(failed)
    }

def sync_history(server_url: str):
    """
    Sync offline medical history records.
    """
    records = load_offline(HISTORY_FILE)
    if not records:
        return {"status": "nothing to sync"}

    successful = []
    failed = []

    for rec in records:
        try:
            resp = requests.post(f"{server_url}/history/add", json=rec, timeout=5)
            if resp.status_code == 200:
                successful.append(rec)
            else:
                failed.append(rec)
        except Exception:
            failed.append(rec)

    HISTORY_FILE.write_text(json.dumps(failed, indent=2))
    return {
        "synced": len(successful),
        "failed": len(failed)
    }

# --- Optional quick test ---
if __name__ == "__main__":
    save_offline(EMERGENCY_FILE, {"symptoms": ["fever"], "severity_level": 3})
    print("Emergency saved offline.")
    result = sync_emergency("http://localhost:8000")
    print("Sync result:", result)
