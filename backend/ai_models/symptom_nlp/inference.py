import torch
import pickle
from pathlib import Path
from backend.audio_pipeline.normalize import normalize_text
from torch.nn.functional import softmax
from backend.ai_models.symptom_nlp.train_symptom_nlp import SymptomClassifier, collate_batch

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load vocab and label encoder
VOCAB_PATH = Path("backend/ai_models/symptom_nlp/output/vocab.pkl")
LABEL_ENCODER_PATH = Path("backend/ai_models/symptom_nlp/output/label_encoder.pkl")
MODEL_PATH = Path("backend/ai_models/symptom_nlp/output/symptom_classifier.pth")

with open(VOCAB_PATH, "rb") as f:
    vocab = pickle.load(f)

with open(LABEL_ENCODER_PATH, "rb") as f:
    le = pickle.load(f)

# Load model
num_classes = len(le.classes_)
model = SymptomClassifier(len(vocab), embed_dim=64, hidden_dim=64, num_classes=num_classes)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()

TOP_K = 5

def predict_top_diseases(text):
    """
    Input: raw or normalized text (from audio or typed)
    Output: top-k predicted diseases
    """
    text_norm = normalize_text(text)
    ids = torch.tensor([vocab.encode(text_norm)], dtype=torch.long)
    lengths = torch.tensor([ids.size(1)], dtype=torch.long)

    ids, lengths = ids.to(DEVICE), lengths.to(DEVICE)
    with torch.no_grad():
        logits = model(ids, lengths)
        probs = softmax(logits, dim=1)
        top_probs, top_idx = torch.topk(probs, k=min(TOP_K, logits.size(1)), dim=1)

    predictions = [{"disease": le.classes_[i], "probability": float(p)} for i, p in zip(top_idx[0], top_probs[0])]
    return predictions

if __name__ == "__main__":
    test = "Mujhe bukhar aur sardi hai"
    print(predict_top_diseases(test))
