from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load the pre-trained model and tokenizer
model_name = "huggingface/CodeBERTa-language-id"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def detect_language(code_snippet, confidence_threshold=0.85):
    """
    Detects the programming language of a given code snippet using CodeBERTa.
    
    Parameters:
        code_snippet (str): The code snippet to classify.
        confidence_threshold (float): The minimum confidence required for a valid prediction.
    
    Returns:
        str: The predicted language or 'Unknown' if confidence is too low or the language is unsupported.
    """
    # Tokenize the input code snippet
    inputs = tokenizer(
        code_snippet, 
        return_tensors="pt", 
        truncation=True, 
        padding=True, 
        max_length=512
    )
    
    # Perform inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=-1)  # Convert logits to probabilities
        predicted_class_id = torch.argmax(probabilities, dim=-1).item()
        confidence = probabilities[0, predicted_class_id].item()

    print(f"Logits: {logits}")
    print(f"Predicted class ID: {predicted_class_id}, Confidence: {confidence}")
    
    # Map the predicted class ID to the corresponding language
    language_map = {
        0: "go",
        1: "Java",
        2: "JavaScript",
        3: "php",
        4: "Python",
        5: "ruby",
    }

    # Check if the prediction is above the confidence threshold
    if confidence < confidence_threshold:
        return "Unknown"
    
    # Return the detected language or 'Unknown' if not supported
    return language_map.get(predicted_class_id, "Unknown")

# Example usage
code_snippet = "def hello_world():\n    print('Hello, world!')"
detected_language = detect_language(code_snippet)
print(f"Detected Language: {detected_language}")
