document.getElementById("saveButton").addEventListener("click", function () {
  const codeSnippet = document.getElementById("codeSnippet").value;
  if (!codeSnippet) {
    alert("Please paste some code!");
    return;
  }

  // Call the ML model to detect language and description
  detectLanguageAndDescription(codeSnippet)
    .then((result) => {
      const { language, description } = result;

      // Save the snippet and display it in the table
      const timeStamp = new Date().toLocaleString();
      const snippet = {
        code: codeSnippet,
        language: language,
        description: description,
        time: timeStamp,
      };

      saveSnippet(snippet);
      displaySnippet(snippet);
    })
    .catch((error) => {
      console.error("Error detecting language and description:", error);
    });
});

// Save the snippet to local storage or background script
function saveSnippet(snippet) {
  chrome.storage.local.get(["snippets"], function (result) {
    let snippets = result.snippets || [];
    snippets.push(snippet);
    chrome.storage.local.set({ snippets: snippets });
  });
}

// Display the snippet in the table
function displaySnippet(snippet) {
  const tableBody = document.querySelector("#snippetTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
      <td>${snippet.code}</td>
      <td>${snippet.language}</td>
      <td>${snippet.description}</td>
      <td>${snippet.time}</td>
  `;
  tableBody.appendChild(row);
}

// Detect language and description (fake implementation)
function detectLanguageAndDescription(code) {
  return new Promise((resolve, reject) => {
    // Placeholder ML logic
    const language = "JavaScript"; // Placeholder, replace with actual ML model integration
    const description = "A sample code snippet"; // Placeholder, replace with actual ML model integration
    resolve({ language, description });
  });
}

// Load previously saved snippets when popup is opened
window.onload = function () {
  chrome.storage.local.get(["snippets"], function (result) {
    const snippets = result.snippets || [];
    snippets.forEach(displaySnippet);
  });
};
