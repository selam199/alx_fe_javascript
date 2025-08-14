// ====== Quotes Array ======
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

// ====== Save Quotes to Local Storage ======
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====== Display Random Quote ======
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (!quotes.length) {
    display.innerHTML = "<p>No quotes available.</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  display.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;
}

// ====== Create Add Quote Form (hooks existing HTML elements) ======
function createAddQuoteForm() {
  const addBtn = document.getElementById("addQuoteBtn");
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  addBtn.addEventListener("click", () => {
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
      alert("Please enter both quote text and category.");
      return;
    }

    quotes.push({ text, category });
    saveQuotes();

    textInput.value = "";
    categoryInput.value = "";

    alert("Quote added successfully!");
    showRandomQuote();
  });
}

// ====== Export Quotes to JSON ======
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ====== Import Quotes from JSON ======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid JSON file format.");
      }
    } catch (err) {
      alert("Error reading JSON file: " + err.message);
    } finally {
      event.target.value = ""; // reset file input
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
window.importFromJsonFile = importFromJsonFile; // make it callable from HTML onchange

// ====== Event Listeners ======
document.addEventListener("DOMContentLoaded", () => {
  // Initialize add quote form
  createAddQuoteForm();

  // New quote button
  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);

  // Export button
  const exportBtn = document.getElementById("exportQuotes");
  if (exportBtn) exportBtn.addEventListener("click", exportQuotes);

  // Show a random quote on page load
  showRandomQuote();
});
