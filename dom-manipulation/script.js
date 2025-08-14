// Select elements
const newQuoteBtn = document.getElementById('newQuote');
const quoteDisplay = document.getElementById('quoteDisplay');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const quoteInput = document.getElementById('quoteInput');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

// Initialize quotes array from localStorage or default
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  "The best way to get started is to quit talking and begin doing.",
  "Don't let yesterday take up too much of today.",
  "It's not whether you get knocked down, it's whether you get up."
];

// Load the last viewed quote from sessionStorage (optional)
if (sessionStorage.getItem('lastQuote')) {
  quoteDisplay.textContent = sessionStorage.getItem('lastQuote');
}

// Show random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = randomQuote;

  // Save last viewed quote in session storage
  sessionStorage.setItem('lastQuote', randomQuote);
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Add new quote
function addQuote() {
  const newQuote = quoteInput.value.trim();
  if (newQuote) {
    quotes.push(newQuote);
    saveQuotes();
    quoteInput.value = '';
    alert("Quote added successfully!");
  } else {
    alert("Please enter a quote before adding.");
  }
}

// Export quotes to JSON
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid file format. Please provide a JSON array.');
      }
    } catch (err) {
      alert('Error reading JSON file: ' + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
exportBtn.addEventListener('click', exportToJsonFile);
importFile.addEventListener('change', importFromJsonFile);

// Initial random quote
showRandomQuote();
