from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from models.language_detection import detect_language  # Import the language detection function

# Load the pre-trained CodeT5 model and tokenizer
model_name = "Salesforce/codet5-base-multi-sum"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

def generate_description(code_snippet):
    """
    This function takes a code snippet as input, detects its language, and generates a description
    of what the code does using the CodeT5 model. If the detected language is 'unknown',
    it returns a custom message.

    Args:
    - code_snippet (str): The input code snippet for which the description is generated.

    Returns:
    - str: The generated description of the code snippet or a custom message if the language is unknown.
    """
    # Detect the language of the code snippet
    detected_language = detect_language(code_snippet)

    if detected_language.lower() == "unknown":
        return "Please input some code, not simple text."
    
    # Tokenize the input code snippet
    inputs = tokenizer(code_snippet, return_tensors="pt", truncation=True, padding=True, max_length=512)

    # Generate description (without gradient tracking)
    with torch.no_grad():
        summary_ids = model.generate(inputs["input_ids"], num_beams=4, max_length=150, early_stopping=True)

    # Decode the generated summary and return it
    description = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return description
