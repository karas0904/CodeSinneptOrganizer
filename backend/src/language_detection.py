from transformers import AutoTokenizer, RobertaForSequenceClassification
import torch

# Define model name and tokenizer/model loading
CODEBERTA_LANGUAGE_ID = "huggingface/CodeBERTa-language-id"
tokenizer = AutoTokenizer.from_pretrained(CODEBERTA_LANGUAGE_ID)
model = RobertaForSequenceClassification.from_pretrained(CODEBERTA_LANGUAGE_ID)

# Define the input text to analyze
CODE_TO_IDENTIFY = "outcome := rand.Intn(6) + 1"  # Replace with your code snippet

# Tokenize the input and convert to PyTorch tensors
inputs = tokenizer(CODE_TO_IDENTIFY, return_tensors="pt", truncation=True, padding=True)

# Pass the input through the model
outputs = model(**inputs)

# Extract logits and determine the most likely language index
logits = outputs.logits
language_idx = logits.argmax(dim=1).item()  # Index for the predicted language label

print(f"Predicted language index: {language_idx}")
