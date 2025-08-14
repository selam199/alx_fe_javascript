// ====== Quotes Array (Load from localStorage) ======
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { id: 2, text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { id: 3, text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

// ====== Save Quotes ======
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

    const newId = quotes.length ? Math.max(...quotes.map(q => q.id)) + 1 : 1;
    quotes.push({ id: newId, text, category });
    saveQuotes();
    populateCategories();

    textInput.value = "";
    categoryInput.value = "";

    alert("Quote added successfully!");
    showRandomQuote();
  });
}

// ====== Populate Categories Dropdown ======
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("lastCategory") || "all";

  const categories = Array.from(new Set(quotes.map(q => q.category)));
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  select.value = selected;
}

// ====== Filter Quotes ======
function filterQuotes() {
  const select = document.getElementById("categoryFilter");
  const selected = select.value;
  localStorage.setItem("lastCategory", selected);
  showRandomQuote();
}
window.filterQuotes = filterQuotes;

// ====== Export Quotes ======
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

// ====== Import Quotes ======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        // Add IDs if missing
        const maxId = quotes.length ? Math.max(...quotes.map(q => q.id)) : 0;
        importedQuotes.forEach((q, i) => {
          if (!q.id) q.id = maxId + i + 1;
        });
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file: " + err.message);
    } finally {
      event.target.value = "";
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
window.importFromJsonFile = importFromJsonFile;

// ====== Server Sync (Simulated with JSONPlaceholder) ======
function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(serverData => {
      // Map server data to quote structure
      const serverQuotes = serverData.map(item => ({
        id: item.id,
        text: item.title,
        category: "Server"
      }));

      // Merge and remove duplicates (server takes precedence)
      const merged = [...serverQuotes, ...quotes.filter(q => !serverQuotes.find(sq => sq.id === q.id))];
      quotes = merged;
      saveQuotes();
      populateCategories();
      showNotification("Quotes synced with server successfully!");
    })
    .catch(err => console.error("Server sync failed:", err));
}
// ====== Fetch Quotes from Server (Simulated) ======
function fetchQuotesFromServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(serverData => {
      // Map server data to quote structure
      const serverQuotes = serverData.map(item => ({
        id: item.id,
        text: item.title,
        category: "Server"
      }));

      // Merge server quotes with local quotes (server takes precedence)
      const mergedQuotes = [
        ...serverQuotes,
        ...quotes.filter(q => !serverQuotes.find(sq => sq.id === q.id))
      ];

      quotes = mergedQuotes;
      localStorage.setItem("quotes", JSON.stringify(quotes));
      populateCategories();
      showRandomQuote();
      showNotification("Quotes synced with server successfully!");
    })
    .catch(err => console.error("Failed to fetch server quotes:", err));
}
// ====== Fetch Quotes from Server (Async/Await) ======
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    // Map server data to quote structure
    const serverQuotes = serverData.map(item => ({
      id: item.id,
      text: item.title,
      category: "Server"
    }));

    // Merge server quotes with local quotes (server takes precedence)
    const mergedQuotes = [
      ...serverQuotes,
      ...quotes.filter(q => !serverQuotes.find(sq => sq.id === q.id))
    ];

    quotes = mergedQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    showRandomQuote();
    showNotification("Quotes synced with server successfully!");
  } catch (err) {
    console.error("Failed to fetch server quotes:", err);
  }
}
// ====== Send New Quote to Server ======
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const data = await response.json();
    console.log("Quote posted to server:", data);
  } catch (err) {
    console.error("Failed to post quote to server:", err);
  }
}
// ====== Sync Quotes with Server ======
async function syncQuotes() {
  try {
    // Fetch server quotes
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    // Map server data to quote structure
    const serverQuotes = serverData.map(item => ({
      id: item.id,
      text: item.title,
      category: "Server"
    }));

    // Merge quotes: server takes precedence
    const mergedQuotes = [
      ...serverQuotes,
      ...quotes.filter(q => !serverQuotes.find(sq => sq.id === q.id))
    ];

    quotes = mergedQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    showRandomQuote();
    showNotification("Quotes synced with server!");

    // Optionally, POST new local quotes to server
    for (const q of quotes.filter(q => q.id > 100)) { // example condition
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: q.text, body: "", userId: 1 })
      });
    }

  } catch (err) {
    console.error("Sync failed:", err);
  }
}

// ====== Show Notification ======
function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ====== Event Listeners ======
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

  showRandomQuote(); // initial display

  // Periodic server sync every 60 seconds
  setInterval(syncWithServer, 60000);
});
