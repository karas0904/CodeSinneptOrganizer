<h1>Code Snippet Organizer</h1>

<h2>Overview</h2>
<p>The Code Snippet Organizer is a Chrome extension designed to simplify code snippet management. It allows users to save, categorize, and describe code snippets effortlessly. Leveraging machine learning, the extension automatically detects the programming language and generates a description of the code, making it an ideal tool for developers and programmers.</p>

<h2>Features</h2>
<ul>
  <li><strong>Code Snippet Storage:</strong> Save code snippets in an organized table format.</li>
  <li><strong>Language Detection:</strong> Automatically identify the programming language of the snippet using a pre-trained ML model.</li>
  <li><strong>Description Generation:</strong> Generate meaningful descriptions for code snippets using the CodeT5 model.</li>
  <li><strong>Duplicate Detection:</strong> Warns users about duplicate code snippets.</li>
  <li><strong>Intuitive UI:</strong> Simple and user-friendly interface.</li>
</ul>

<h2>Installation</h2>

<h3>Chrome Extension</h3>
<ol>
  <li><strong>Clone this repository:</strong></li>
  <pre>git clone https://github.com/your-username/CodeSnippetOrganizer.git</pre>
  <pre>cd CodeSnippetOrganizer</pre>

  <li><strong>Open Chrome and navigate to <code>chrome://extensions</code>.</strong></li>
  <li><strong>Enable Developer Mode</strong> (top-right corner).</li>
  <li><strong>Click on Load unpacked</strong> and select the <code>frontend</code> folder.</li>
  <li>The extension should now appear in your Chrome toolbar.</li>
</ol>

<h3>Backend Setup</h3>
<ol>
  <li><strong>Install Python 3.11.4 and set up a virtual environment:</strong></li>
  <pre>python3 -m venv code_snippet_venv</pre>
  <pre>source code_snippet_venv/bin/activate</pre>

  <li><strong>Install the required dependencies:</strong></li>
  <pre>pip install -r requirements.txt</pre>

  <li><strong>Run the backend:</strong></li>
  <pre>python3 backend/app.py</pre>
</ol>

<h2>Usage</h2>

<h3>Add Snippets:</h3>
<ol>
  <li>Open the extension popup.</li>
  <li>Paste your code snippet into the input field and click <strong>Save</strong>.</li>
</ol>

<h3>View Saved Snippets:</h3>
<ol>
  <li>Scroll down to view the table of saved snippets, including detected language, description, and timestamp.</li>
</ol>

<h2>File Structure</h2>
<pre>
CodeSnippetOrganizer/
│
├── frontend/               # Chrome extension files
│   ├── popup.html          # Extension UI
│   ├── popup.css           # Styling for the popup
│   └── popup.js            # Logic for UI interactions
│
├── backend/                # Backend for ML processing
│   ├── models/             # Machine learning models
│   │   ├── __init__.py
│   │   ├── description_generator.py
│   │   └── language_detection.py
│   └── app.py              # FastAPI application
│
├── requirements.txt        # Python dependencies
├── README.md               # Documentation
</pre>

<h2>Technologies Used</h2>

<h3>Frontend:</h3>
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript (Chrome Extension)</li>
</ul>

<h3>Backend:</h3>
<ul>
  <li>Python</li>
  <li>FastAPI</li>
</ul>

<h3>Machine Learning:</h3>
<ul>
  <li>CodeT5 (for description generation)</li>
  <li>Pre-trained language detection model</li>
</ul>

<h2>System Architecture</h2>

<p><strong>Frontend:</strong></p>
<p>The frontend consists of a simple Chrome Extension interface with an input field for code snippets and a save button. Upon submission, the code snippet is sent to the backend via an API request.</p>

<p><strong>Backend:</strong></p>
<p>The backend, built using FastAPI, processes incoming requests. It performs language detection and generates descriptions using machine learning models. The results are then returned to the frontend.</p>

<p><strong>Frontend UI:</strong></p>
<p>The frontend displays the language, description, and timestamp of the saved code snippets.</p>

<h3>Flowchart:</h3>
<pre>
+---------------------------+
|       Chrome Extension    |
|---------------------------|
|  Input Field + Save Button|
|     ↓                     |
| Sends code snippet to     |
| backend via API request   |
+---------------------------+
            ↓
+---------------------------+
|         Backend           |
|---------------------------|
|  FastAPI server processes |
|  incoming requests:       |
|  - Language detection     |
|  - Description generation |
|     ↓                     |
| Returns results to        |
| frontend                  |
+---------------------------+
            ↓
+---------------------------+
|       Frontend UI         |
|---------------------------|
| Displays language,        |
| description, and timestamp|
+---------------------------+
</pre>


<h2>Data Flow</h2>

<h3>Step 1: User Input (Frontend)</h3>
<p><strong>User Interaction:</strong></p>
<ul>
  <li>The user opens the Chrome extension popup.</li>
  <li>The user pastes a code snippet into the input field and clicks the Save button.</li>
  <li>Optional inputs like a manual description (if supported) can also be added.</li>
</ul>

<p><strong>Frontend Actions:</strong></p>
<ul>
  <li>The code snippet, along with the timestamp, is prepared for transmission.</li>
  <li>A duplicate check is performed in the frontend before sending data to the backend:</li>
  <ul>
    <li>If a duplicate is found, the user is notified, and the snippet is not saved.</li>
  </ul>
  <li>The frontend sends a POST request to the FastAPI backend via an API endpoint (e.g., /process_snippet).</li>
  <li>The data payload includes:</li>
  <ul>
    <li>code_snippet: The pasted code snippet.</li>
    <li>timestamp: The time when the snippet was added.</li>
  </ul>
</ul>

<h3>Step 2: Backend Processing</h3>
<p><strong>Receiving Request:</strong></p>
<ul>
  <li>The backend receives the API call containing the code_snippet.</li>
  <li>Input validation is performed to ensure the payload is not empty.</li>
</ul>

<p><strong>Language Detection:</strong></p>
<ul>
  <li>The <code>language_detection.py</code> script uses a pre-trained ML model to predict the programming language of the input.</li>
  <li><strong>Output:</strong> If the language is identified, the detected language (e.g., "Python", "JavaScript") is returned. If the language is unknown, the backend skips description generation and sends a response: "Please input some code, not simple text."</li>
</ul>

<p><strong>Description Generation:</strong></p>
<ul>
  <li>If a valid programming language is detected, the <code>description_generator.py</code> script uses the CodeT5 model to analyze the <code>code_snippet</code> and generate a description.</li>
  <li><strong>Output:</strong> A concise, meaningful description of the code snippet.</li>
</ul>

<p><strong>Data Compilation:</strong></p>
<ul>
  <li>The backend compiles the following data:</li>
  <ul>
    <li>Detected language</li>
    <li>Generated description</li>
    <li>Timestamp</li>
  </ul>
  <li>This data is sent as a JSON response back to the frontend.</li>
</ul>

<h3>Step 3: Display Results (Frontend)</h3>
<p><strong>Receive Backend Response:</strong></p>
<ul>
  <li>The frontend receives the JSON response from the backend.</li>
  <li>The data includes:</li>
  <ul>
    <li>language: Programming language of the snippet.</li>
    <li>description: Generated description (or error message).</li>
    <li>timestamp: When the snippet was saved.</li>
  </ul>
</ul>

<p><strong>Update UI:</strong></p>
<ul>
  <li>The snippet, along with the detected language, description, and timestamp, is dynamically added to a table displayed below the input field.</li>
  <li>The table is updated in real-time without requiring a page refresh.</li>
</ul>

<p><strong>Storage:</strong></p>
<ul>
  <li>Saved snippets are stored locally in the browser using Chrome Local Storage.</li>
  <li>This allows snippets to persist across sessions, even after the browser is closed and reopened.</li>
</ul>

<h4>Data structure in Local Storage:</h4>
<pre>
[
  {
    "code": "<code_snippet>",
    "language": "<detected_language>",
    "description": "<generated_description>",
    "timestamp": "<timestamp>"
  },
  ...
]
</pre>

<h4>How Chrome Local Storage Works:</h4>
<p>When a user saves a code snippet, the frontend stores the data in the browser's Local Storage.</p>
<p>The Local Storage API allows you to store key-value pairs locally, which can be accessed by the extension each time the popup is opened.</p>

<h5>Example:</h5>
<pre>
<!-- Saving data to Local Storage -->
const snippetData = {
  code: 'const x = 10;',
  language: 'JavaScript',
  description: 'This defines a constant variable.',
  timestamp: new Date().toLocaleString()
};

let savedSnippets = JSON.parse(localStorage.getItem('snippets')) || [];
savedSnippets.push(snippetData);
localStorage.setItem('snippets', JSON.stringify(savedSnippets));
</pre>

<p>The snippets are stored under the key <code>snippets</code> and retrieved when the popup is opened to display them in the UI.</p>

<h3>CORS (Cross-Origin Resource Sharing) in the Project</h3>
<p><strong>Why CORS is Required:</strong></p>
<p>Since your frontend (Chrome extension) and backend (FastAPI server) run on different origins (the extension operates within the browser, and the FastAPI server is on a different port or domain), the CORS policy ensures that the frontend can communicate with the backend securely.</p>

<p><strong>How CORS Works in This Project:</strong></p>
<ul>
  <li>The FastAPI server has CORS middleware enabled to allow the frontend (Chrome extension) to make requests to it.</li>
  <li>CORS ensures that only trusted origins (in this case, your extension's URL) can make requests to the server.</li>
</ul>

<p><strong>FastAPI CORS Setup:</strong></p>
<pre>
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS settings to allow requests from the Chrome extension's origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://your-extension-id"],  # Replace with actual extension ID
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
</pre>

<p><strong>Process:</strong></p>
<ul>
  <li>When a POST request is made from the Chrome extension to the backend, the CORS middleware checks if the request is coming from an allowed origin (the extension’s URL).</li>
  <li>If the request is from an allowed origin, it is processed. Otherwise, the browser will block the request and show a CORS error.</li>
</ul>

