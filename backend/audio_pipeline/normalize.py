import torch
import whisper
import re
from pathlib import Path
import langdetect

# ------------------ Optional Google Translate ------------------
try:
    from google.cloud import translate_v2 as translate
    gclient = translate.Client()
    use_google = True
except Exception:
    use_google = False

# ------------------ HuggingFace Multilingual Translation ------------------
from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer
tokenizer = M2M100Tokenizer.from_pretrained("facebook/m2m100_418M")
hf_model = M2M100ForConditionalGeneration.from_pretrained("facebook/m2m100_418M")

# ------------------ Indic NLP transliteration ------------------
try:
    from indicnlp.transliterate.unicode_transliterate import ItransTransliterator
    use_indicnlp = True
except ImportError:
    print("[Warning] Indic NLP not installed. Install via 'pip install indic-nlp-library'")
    use_indicnlp = False

# ------------------ Device setup ------------------
device = "cuda" if torch.cuda.is_available() else "cpu"
try:
    whisper_model = whisper.load_model("small").to(device)
except Exception as e:
    print(f"[Warning] Whisper model load failed: {e}")
    whisper_model = None

# ------------------ Helpers ------------------

def transliterate_roman_to_native(text, lang_code):
    """
    Converts Romanized Hindi/Tamil (Hinglish/Tanglish) to native script
    using Indic NLP library.
    """
    if not use_indicnlp:
        return text
    try:
        return ItransTransliterator.to_script(text, lang_code)
    except:
        return text

def translate_hf(text, src_lang):
    """
    Translate text to English using HuggingFace M2M100.
    """
    hf_lang = src_lang if src_lang in ["hi", "ta", "en"] else "hi"
    tokenizer.src_lang = hf_lang
    encoded = tokenizer(text, return_tensors="pt")
    generated = hf_model.generate(
        **encoded,
        forced_bos_token_id=tokenizer.get_lang_id("en")
    )
    decoded = tokenizer.batch_decode(generated, skip_special_tokens=True)[0]
    return decoded.lower()

def normalize_text(text):
    """
    Detect language, transliterate if Romanized, and translate to English.
    Handles English, Hindi, Tamil, Hinglish, Tanglish automatically.
    """
    if not isinstance(text, str) or not text.strip():
        return ""
    
    # Clean text
    text = text.lower()
    text = re.sub(r"[^a-z\u0900-\u097F\u0B80-\u0BFF0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    
    try:
        lang = langdetect.detect(text)
    except:
        lang = "en"
    
    # If already English, pass directly
    if lang == "en":
        return text
    
    # Transliterate Romanized Hindi/Tamil to native script
    if lang in ["hi", "ta"]:
        text = transliterate_roman_to_native(text, lang)
    
    # Try Google Translate if available
    if use_google:
        try:
            translated = gclient.translate(text, target_language="en")["translatedText"]
            return translated.lower()
        except:
            pass
    
    # Fallback HuggingFace translation
    return translate_hf(text, lang)

# ------------------ Main transcription ------------------

def transcribe_audio(file_path: str) -> str:
    """
    Transcribes audio to text using Whisper and normalizes it to English.
    """
    if not Path(file_path).exists():
        raise FileNotFoundError(f"Audio file not found: {file_path}")
    
    if whisper_model is None:
        raise RuntimeError("Whisper model not loaded properly.")
    
    result = whisper_model.transcribe(str(file_path), fp16=torch.cuda.is_available())
    raw_text = result.get("text", "")
    
    normalized_text = normalize_text(raw_text)
    return normalized_text

# ------------------ Quick test ------------------
if __name__ == "__main__":
    test_files = [
        "test_hinglish.wav",
        "test_tamil.wav",
        "test_english.wav",
        "test_tanglish.wav"
    ]
    
    for f in test_files:
        print(f"File: {f}")
        try:
            text = transcribe_audio(f)
            print("Normalized:", text)
        except Exception as e:
            print("Error:", e)
        print("---")
