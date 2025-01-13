// Get the elements
const saveBtn = document.getElementById("save-btn");
const codeInput = document.getElementById("code-input");
const snippetTableBody = document.querySelector("#snippet-table tbody");

// Event listener for the save button
saveBtn.addEventListener("click", async function () {
  const code = codeInput.value.trim();

  // If there's no code, don't do anything
  if (!code) {
    alert("Please paste some code!");
    return;
  }

  try {
    // Fetch language and description from the backend
    const response = await fetch("http://127.0.0.1:8000/analyze-snippet/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze snippet");
    }

    const { language, description } = await response.json();

    const timestamp = new Date().toLocaleString();

    // Add the new snippet to the table
    addSnippetToTable(code, language, description, timestamp);

    // Save the table data to storage
    saveTableToStorage();

    // Clear the textarea
    codeInput.value = "";
  } catch (error) {
    console.error(error);
    alert("An error occurred while analyzing the snippet.");
  }
});

// Add snippet to table
function addSnippetToTable(code, language, description, timestamp) {
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td><img src="icons/copy-64.png" class="icon copy-icon" /></td>
    <td>${code}</td>
    <td>${language}</td>
    <td>${description}</td>
    <td>${timestamp}</td>
    <td><img src="icons/trash-64.png" class="icon delete-icon" /></td>
  `;

  snippetTableBody.appendChild(newRow);

  // Add event listeners for copy and delete functionality
  const copyIcon = newRow.querySelector(".copy-icon");
  const deleteIcon = newRow.querySelector(".delete-icon");

  copyIcon.addEventListener("click", () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  });

  deleteIcon.addEventListener("click", () => {
    newRow.remove();
    removeSnippetFromStorage(code); // Update storage after deletion
  });
}

// Remove snippet from Chrome storage
function removeSnippetFromStorage(codeToDelete) {
  // Get the current snippets from Chrome storage
  chrome.storage.local.get("snippets", (result) => {
    if (result.snippets) {
      // Filter out the snippet that matches the code to delete
      const updatedSnippets = result.snippets.filter(
        (snippet) => snippet.code !== codeToDelete
      );

      // Save the updated snippets back to Chrome storage
      chrome.storage.local.set({ snippets: updatedSnippets }, () => {
        console.log("Snippet removed from storage.");
      });
    }
  });
}

// Save the table data to Chrome Storage
function saveTableToStorage() {
  const rows = snippetTableBody.querySelectorAll("tr");
  const snippets = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    snippets.push({
      code: cells[1].textContent,
      language: cells[2].textContent,
      description: cells[3].textContent,
      timestamp: cells[4].textContent,
    });
  });

  chrome.storage.local.set({ snippets }, () => {
    console.log("Table data saved to storage!");
  });
}

// Load the table data from Chrome Storage
function loadTableFromStorage() {
  chrome.storage.local.get("snippets", (result) => {
    if (result.snippets) {
      result.snippets.forEach((snippet) => {
        addSnippetToTable(
          snippet.code,
          snippet.language,
          snippet.description,
          snippet.timestamp
        );
      });
    }
  });
}

// Load table data when the extension loads
document.addEventListener("DOMContentLoaded", loadTableFromStorage);
