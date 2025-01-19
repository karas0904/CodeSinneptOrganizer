// Get the elements
const saveBtn = document.getElementById("save-btn");
const codeInput = document.getElementById("code-input");
const snippetTableBody = document.querySelector("#snippet-table tbody");
const searchIcon = document.getElementById("search-icon"); // Search icon
const headerContainer = document.querySelector(".header-container"); // Container of the header

// Event listener for the search icon click
searchIcon.addEventListener("click", function () {
  // Hide the search icon
  searchIcon.style.display = "none";

  // Create and append the search input box dynamically
  const searchBox = document.createElement("input");
  searchBox.type = "text";
  searchBox.id = "search";
  searchBox.placeholder = "Search by language or timestamp";
  searchBox.style.padding = "5px";
  searchBox.style.width = "150px";
  searchBox.style.transition = "transform 0.3s ease-in-out"; // Smooth transition
  searchBox.style.borderRadius = "50px";

  // Position the search box where the icon is (adjust accordingly)
  searchBox.style.position = "absolute";
  searchBox.style.right = "10px"; // Position the search box on the right
  // Adjust top position if necessary

  // Append the search box to the header container
  headerContainer.appendChild(searchBox);

  // Focus on the input box when it appears
  searchBox.focus();

  // Event listener to remove the search box when the user starts typing
  searchBox.addEventListener("blur", function () {
    if (searchBox.value.trim() === "") {
      searchBox.style.width = "0";
      // Apply a transition effect before removing the search box
      // Move search box out to the right

      // Wait for the transition to end, then remove the element
      setTimeout(function () {
        searchBox.remove();
        searchIcon.style.display = "inline";
      }, 300); // 300ms matches the transition duration
    }
  });

  // Filter the snippets based on the query in the search box
  searchBox.addEventListener("input", function (event) {
    const query = event.target.value.toLowerCase(); // Get the search query
    filterSnippets(query); // Filter the snippets based on the query
  });
});

// Filter snippets by search query (language or timestamp)
function filterSnippets(query) {
  const rows = snippetTableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    const language = row
      .querySelector(".language-column")
      .textContent.toLowerCase();
    const timestamp = row
      .querySelector(".timestamp-column")
      .textContent.toLowerCase();

    if (language.includes(query) || timestamp.includes(query)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Event listener for the save button
saveBtn.addEventListener("click", async function () {
  const code = codeInput.value.trim();

  // If there's no code, don't do anything
  if (!code) {
    alert("Please paste some code!");
    return; // Correct use of return
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

    // Debug: Check the language and description returned
    console.log("Detected language from backend:", language);

    const timestamp = new Date().toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Optional: Set to `false` for 24-hour format
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    // Add the new snippet to the table
    addSnippetToTable(code, language, description, timestamp);

    // Save the table data to storage
    saveTableToStorage();

    // Clear the textarea
    codeInput.value = "";
  } catch (error) {
    console.error("Fetch error:", error);
    alert("An error occurred while analyzing the snippet.");
  }
});

// Add snippet to table
function addSnippetToTable(code, language, description, timestamp) {
  const newRow = document.createElement("tr");

  // Create a pre and code block for syntax highlighting
  const preElement = document.createElement("pre");
  const codeElement = document.createElement("code");
  codeElement.className = `language-${language.toLowerCase()}`; // Add language class
  codeElement.textContent = code; // Add the actual code
  preElement.appendChild(codeElement); // Nest code inside pre

  newRow.innerHTML = `
    <td><img src="icons/copy-64.png" class="icon copy-icon" /></td>
    <td></td> <!-- This cell will be populated dynamically with the code block -->
    <td class="language-column">${language}</td>
    <td class="description-column">${description}</td>
    <td class="timestamp-column">${timestamp}</td>
    <td><img src="icons/trash-64.png" class="icon delete-icon" /></td>
  `;

  // Insert the pre/code block into the correct cell
  const codeCell = newRow.cells[1]; // Get the second cell for code
  codeCell.appendChild(preElement); // Populate it with the pre/code block

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

  // Trigger Prism.js to highlight the newly added code
  Prism.highlightElement(codeElement);
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
      console.log("Loaded snippets from storage:", result.snippets); // Debugging line
      result.snippets.forEach((snippet) => {
        addSnippetToTable(
          snippet.code,
          snippet.language,
          snippet.description,
          snippet.timestamp
        );
      });
    } else {
      console.log("No snippets found in storage");
    }
  });
}

// Load table data when the extension loads
document.addEventListener("DOMContentLoaded", loadTableFromStorage);
