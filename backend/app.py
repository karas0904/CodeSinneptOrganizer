from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

# Dummy endpoint for ML analysis
@app.post("/analyze-snippet/")
async def analyze_snippet(snippet: CodeSnippet):
    if not snippet.code.strip():
        raise HTTPException(status_code=400, detail="Code snippet cannot be empty")
    
    # Dummy response (to be replaced with actual ML analysis later)
    return {
        "language": "Python",  # Placeholder value
        "description": "This is a sample description for the code."  # Placeholder value
    }
