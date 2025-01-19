from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models.language_detection import detect_language  # Import the language detection function
from models.description_generator import generate_description


app = FastAPI()

# Add CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://fchnciecbkgonikbdlljckihlkgghcnm"],  # Allows all origins, change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Define the structure of the data received
class CodeSnippet(BaseModel):
    code: str

# Endpoint for ML analysis
@app.post("/analyze-snippet/")
async def analyze_snippet(snippet: CodeSnippet):
    if not snippet.code.strip():
        raise HTTPException(status_code=400, detail="Code snippet cannot be empty")
    
    # Debug: Check the code received by the backend
    print(f"Received code: {snippet.code}")

    # Use the language detection model
    detected_language = detect_language(snippet.code)
    description = generate_description(snippet.code)
    
    # Debug: Check the detected language
    print(f"Detected language: {detected_language}")

    # Respond with the detected language and placeholder description
    return {
        "language": detected_language,
        "description": description
    }
