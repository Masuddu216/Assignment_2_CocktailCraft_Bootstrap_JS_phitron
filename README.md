# 🍹 CocktailCraft — Drink Explorer

A responsive cocktail discovery web app built with **Vanilla JavaScript** and **Bootstrap 5**, powered by the free [TheCocktailDB API](https://www.thecocktaildb.com/api.php).

---

## 📸 Features

- 🔍 **Search cocktails** by name in real time
- 📋 **Browse 600+ drinks** fetched from the full CocktailDB database
- 📄 **Pagination** — 12 drinks per page with smart windowed page numbers
- 🛒 **My Group (Cart)** — add up to 7 drinks with SL, image, and name
- ✅ **Already Selected** state — button changes after a drink is added
- 🚫 **7-drink limit** — modal alert when the group is full
- 🔎 **Details Modal** — shows 5+ drink details (category, alcoholic type, glass, IBA, instructions, ingredients)
- 🏠 **Logo click** — resets the view to all drinks
- 📱 **Fully responsive** — works on mobile, tablet, and desktop

---

## 🗂️ Project Structure

```
cocktailcraft/
├── index.html      # Main HTML — Bootstrap layout, modals, navbar
├── style.css       # Minimal custom CSS (Bootstrap handles the rest)
└── app.js          # All JavaScript logic — fetch, render, search, cart, pagination
```

---

## 🚀 Getting Started

### 1. Clone or Download

```bash
git clone https://github.com/your-username/cocktailcraft.git
cd cocktailcraft
```

Or simply download the three files (`index.html`, `style.css`, `app.js`) into the same folder.

### 2. Open in Browser

No build step or server required. Just open `index.html` directly:

```bash
# On Linux / Mac
open index.html

# Or double-click index.html in your file explorer
```

> ✅ Works with any modern browser (Chrome, Firefox, Edge, Safari).

---

## 🌐 API Used

**TheCocktailDB** — Free public cocktail database  
Base URL: `https://www.thecocktaildb.com/api/json/v1/1`

| Endpoint | Purpose |
|---|---|
| `/search.php?f={letter}` | Fetch all drinks by first letter (a–z) |
| `/search.php?s={name}` | Search drinks by name |
| `/lookup.php?i={id}` | Get full details of a single drink |

> The app fires 26 parallel requests (one per letter) using `Promise.all` to load the entire database at once on startup.

---

## 🧩 How It Works

### Data Loading
On page load, `loadAllDrinks()` fetches drinks for every letter a–z simultaneously and merges the results into a single array (`allDrinks`). This gives access to 600+ cocktails without a premium API key.

### Search
Search filters the locally cached `allDrinks` array — no extra API call needed after the initial load.

### Pagination
The `renderPage()` function slices `currentList` into chunks of 12. The `renderPagination()` function builds a Bootstrap pagination bar that shows a sliding window of 5 page numbers around the current page.

### Cart (My Group)
- Drinks are stored in a JavaScript array (`group`) capped at 7 items.
- Each entry stores `idDrink`, `strDrink` (name), and `strDrinkThumb` (image URL).
- The cart panel updates live with a numbered table (SL / Img / Name).
- Once added, the card button changes to "Already Selected" (disabled).

### Details Modal
Clicking **Details** fetches full drink data via `/lookup.php?i={id}` and renders a Bootstrap modal with: drink image, category, alcoholic type, glass type, IBA classification, full instructions, and all ingredients as badges.

---

## 🛠️ Technologies

| Tech | Usage |
|---|---|
| HTML5 | Page structure |
| Bootstrap 5.3 | Layout, cards, modals, pagination, navbar, badges, tables |
| Bootstrap Icons 1.11 | Button and UI icons |
| Vanilla JavaScript (ES6+) | Fetch API, DOM manipulation, state management |
| TheCocktailDB API | Cocktail data source |

> Custom CSS is kept to a minimum — only 5 rules covering card image height, avatar styling, hover lift, and pagination dark theme.

---

## 📋 Assignment Requirements Checklist

| # | Requirement | Status |
|---|---|---|
| Q1 | Default drinks shown on first load | ✅ |
| Q2 | Search bar + button + "not found" message | ✅ |
| Q3 | Card: Name, Category, Instructions (60 chars), Add to Group, Details buttons | ✅ |
| Q4 | Two-column layout (cards left, cart right) | ✅ |
| Q5 | Add to Group → name appears in cart, count increases | ✅ |
| Q6 | Max 7 drinks — alert modal if exceeded | ✅ |
| Q7 | Details modal with 5+ drink info fields | ✅ |
| ➕ | Full database loaded (600+ drinks, a–z fetch) | ✅ |
| ➕ | 12 drinks per page with pagination | ✅ |
| ➕ | Logo click resets to all drinks | ✅ |
| ➕ | "Already Selected" button state | ✅ |

---

## 📄 License

This project is for educational purposes. Cocktail data is provided by [TheCocktailDB](https://www.thecocktaildb.com) under their free tier API.
