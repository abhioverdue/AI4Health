import torch
from torchvision import transforms
from PIL import Image
from backend.ai_models.computer_vision.multihead_model import MultiHeadFusionHybrid

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model (assuming already trained weights saved)
MODEL_PATH = "hybrid_multitask_model.pth"
chest_classes, skin_classes, wound_classes = 3, 22, 10  

model = MultiHeadFusionHybrid(chest_classes, skin_classes, wound_classes)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()

TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Lambda(lambda x: x.repeat(3, 1, 1)),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

def predict_image(img_path, dataset_type):
    """
    img_path: path to image
    dataset_type: 'chest', 'skin', 'wound'
    """
    img = Image.open(img_path).convert("RGB")
    img = TRANSFORM(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = model(img, dataset_type)
        probs = torch.softmax(logits, dim=1)
        pred_idx = probs.argmax().item()
        confidence = probs.max().item()
    return {"pred_class": pred_idx, "confidence": confidence}
