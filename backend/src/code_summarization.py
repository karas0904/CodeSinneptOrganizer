import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Model name
model_name = "Salesforce/codet5-base-multi-sum"

# Check if GPU is available and set the device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Load the model and tokenizer with trust_remote_code=True
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, trust_remote_code=True)

# Move the model to the GPU
model = model.to(device)

# Read and process the input file
with open("/kaggle/input/article/article.txt", "r", encoding="utf-8") as f:
    input_text = f.read()

# Tokenize the input and move it to the GPU
inputs = tokenizer.encode("summarize: " + input_text, return_tensors="pt", max_length=1024, truncation=True).to(device)

# Generate the summary using the GPU
outputs = model.generate(
    inputs,
    max_length=256,  # Maximum length of the summary
    min_length=50,   # Minimum length of the summary
    length_penalty=2.0,
    num_beams=4,     # Number of beams for beam search
    early_stopping=True
)

# Decode the output and print the summary
summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
print("Summary:")
print(summary)
