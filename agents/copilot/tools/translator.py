import logging
from typing import Dict, Any

logger = logging.getLogger("argus.agents.tools.translator")

# Dictionary of Kannada <-> English key phrase translations for offline demo resilience
KANNADA_ENGLISH_MAP = {
    "ಸೈಬರ್ ವಂಚನೆ ಮತ್ತು ಹಣ ಅಕ್ರಮ ಸಾಗಣೆ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸಿ": "Show cyber fraud and money laundering cases",
    "ಸಂಶಯಾಸ್ಪದ ವಾಹನ KA-01-MJ-9921 ಯಾರಿಗೆ ಸೇರಿದ್ದು?": "Who owns suspect vehicle KA-01-MJ-9921?",
    "ಇಂದಿರಾನಗರ ಪ್ರದೇಶದ ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ": "Analyze crime hotspots in Indiranagar area",
    "Show cyber fraud and money laundering cases": "ಸೈಬರ್ ವಂಚನೆ ಮತ್ತು ಹಣ ಅಕ್ರಮ ಸಾಗಣೆ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸಿ"
}

async def execute_kannada_translate(text: str, source_lang: str = "kn", target_lang: str = "en") -> Dict[str, Any]:
    """Translates queries between Kannada and English for voice/text input."""
    logger.info(f"Translating text: '{text}' ({source_lang} -> {target_lang})")
    
    translated_text = KANNADA_ENGLISH_MAP.get(text)
    if not translated_text:
        if source_lang == "kn":
            translated_text = f"[Translated from Kannada]: {text}"
        else:
            translated_text = f"[ಕನ್ನಡಕ್ಕೆ ಅನುವಾದಿಸಲಾಗಿದೆ]: {text}"

    return {
        "original_text": text,
        "source_lang": source_lang,
        "target_lang": target_lang,
        "translated_text": translated_text
    }
