// ====== Quotes Array ======
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

// ====== Save Quotes ======
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====== Display Random Quote or Filtered Quotes ======
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (!quotes.length) {
    display.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const selectedCategory = localStorage.getItem("lastCategory") || "all";
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (!filteredQuotes.length) {
    display.innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  display.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;
}

// ====== Create Add Quote Form ======
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
    populateCategories(); // update categories dropdown

    textInput.value = "";
    categoryInput.value = "";

    alert("Quote added successfully!");
    showRandomQuote();
  });
}

// ====== Populate Categories Dropdown ======
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const selected = select.value || "all";

  // Get unique categories
  const categories = Array.from(new Set(quotes.map(q => q.category)));

  // Clear current options except "All Categories"
  select.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem("lastCategory") || "all";
  select.value = lastCategory;
}

// ====== Filter Quotes by Category ======
function filterQuotes() {
  const select = document.getElementById("categoryFilter");
  const selected = select.value;
  localStorage.setItem("lastCategory", selected); // save last selected filter
  showRandomQuote();
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
        populateCategories();
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
window.importFromJsonFile = importFromJsonFile;

// ====== Event Listeners ======
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

  showRandomQuote(); // initial display
});
