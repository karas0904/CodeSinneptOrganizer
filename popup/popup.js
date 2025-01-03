document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-snippet");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const snippet = document.getElementById("code-snippet").value;
      const language = document.getElementById("language").value;
      const webpage = window.location.hostname;

      chrome.storage.local.get("snippets", (result) => {
        const snippets = result.snippets || [];
        snippets.push({ snippet, language, webpage });
        chrome.storage.local.set({ snippets });
        alert("Snippet saved!");
      });
    });
  }
});
