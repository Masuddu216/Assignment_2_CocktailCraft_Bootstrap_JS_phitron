/* ── CocktailCraft — app.js ── */

const BASE = 'https://www.thecocktaildb.com/api/json/v1/1';
const PAGE_SIZE= 12;

let group =[];
let allDrinks = [];
let currentList = [];
let currentPage = 1;


const productContainer = document.getElementById('product-container');
const notFound = document.getElementById('not-found');
const paginationEl = document.getElementById('pagination');
const paginationWrapper= document.getElementById('pagination-wrapper');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const groupList = document.getElementById('groupList');
const groupCountBadge = document.getElementById('groupCount');
const cartTableHead = document.getElementById('cartTableHead');
const logoBtn = document.getElementById('logoBtn');

// ── Bootstrap modal  ──
const detailsModal= new bootstrap.Modal(document.getElementById('detailsModal'));
const limitModal= new bootstrap.Modal(document.getElementById('limitModal'));


loadAllDrinks();


searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
logoBtn.addEventListener('click', () => {
  searchInput.value = '';
  currentList = allDrinks;
  currentPage = 1;
  renderPage();
});


// FETCH ALL DRINKS

async function loadAllDrinks() {
  showSpinner('Loading all cocktails… 🍹');

  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const results = await Promise.all(
    letters.map(letter =>
      fetch(`${BASE}/search.php?f=${letter}`)
        .then(r => r.json())
        .then(data => data.drinks || [])
        .catch(() => [])
    )
  );

  allDrinks   = results.flat();
  currentList = allDrinks;
  currentPage = 1;
  renderPage();
}

// SEARCH

function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  currentPage = 1;

  if (!query) {
    currentList = allDrinks;
  } else {
    currentList = allDrinks.filter(d =>
      d.strDrink.toLowerCase().includes(query)
    );
  }
  renderPage();
}


//CURRENT PAGE

function renderPage() {
  productContainer.innerHTML = '';
  notFound.classList.add('d-none');
  paginationWrapper.classList.add('d-none');

  if (!currentList || currentList.length === 0) {
    notFound.classList.remove('d-none');
    return;
  }

  const totalPages = Math.ceil(currentList.length / PAGE_SIZE);
  const start      = (currentPage - 1) * PAGE_SIZE;
  const pageItems  = currentList.slice(start, start + PAGE_SIZE);

  pageItems.forEach(drink => {
    const alreadyAdded = group.some(d => d.idDrink === drink.idDrink);
    const col = document.createElement('div');
    col.classList.add('col');
    col.dataset.id = drink.idDrink;

    col.innerHTML = `
      <div class="card bg-black border border-secondary h-100 text-light">
        <img
          src="${drink.strDrinkThumb}/medium"
          alt="${drink.strDrink}"
          class="drink-card-img card-img-top"
          loading="lazy"
        />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold mb-1">Name : ${drink.strDrink}</h5>
          <p class="mb-1 small">
            <span class="text-warning fw-semibold">Category:</span>
            ${drink.strCategory || '—'}
          </p>
          <p class="mb-3 small text-secondary flex-grow-1">
            <span class="text-warning fw-semibold">Instructions:</span>
            ${(drink.strInstructions || '').slice(0, 60)}…
          </p>
          <div class="d-flex gap-2 mt-auto">
            ${alreadyAdded
              ? `<button class="btn btn-secondary btn-sm flex-fill" disabled>
                   <i class="bi bi-check-circle me-1"></i>Already Selected
                 </button>`
              : `<button class="btn btn-warning btn-sm flex-fill fw-semibold"
                   onclick="addToGroup('${drink.idDrink}', '${esc(drink.strDrink)}', '${esc(drink.strDrinkThumb)}')">
                   <i class="bi bi-plus-circle me-1"></i>Add to Group
                 </button>`
            }
            <button class="btn btn-outline-light btn-sm flex-fill"
              onclick="showDetails('${drink.idDrink}')">
              <i class="bi bi-info-circle me-1"></i>Details
            </button>
          </div>
        </div>
      </div>
    `;
    productContainer.appendChild(col);
  });

  renderPagination(totalPages);
}


// PAGINATION

function renderPagination(totalPages) {
  paginationEl.innerHTML = '';

  if (totalPages <= 1) return;
  paginationWrapper.classList.remove('d-none');

  const makeItem = (label, page, disabled = false, active = false) => {
    const li  = document.createElement('li');
    li.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;
    const a   = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.innerHTML = label;
    if (!disabled && !active) {
      a.addEventListener('click', e => {
        e.preventDefault();
        currentPage = page;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    li.appendChild(a);
    return li;
  };

  // Prev
  paginationEl.appendChild(makeItem('&laquo;', currentPage - 1, currentPage === 1));

  // Page numbers (show window of 5 around current)
  const delta = 2;
  const left  = Math.max(1, currentPage - delta);
  const right = Math.min(totalPages, currentPage + delta);

  if (left > 1) {
    paginationEl.appendChild(makeItem('1', 1));
    if (left > 2) {
      const dots = document.createElement('li');
      dots.className = 'page-item disabled';
      dots.innerHTML = '<a class="page-link">…</a>';
      paginationEl.appendChild(dots);
    }
  }

  for (let p = left; p <= right; p++) {
    paginationEl.appendChild(makeItem(p, p, false, p === currentPage));
  }

  if (right < totalPages) {
    if (right < totalPages - 1) {
      const dots = document.createElement('li');
      dots.className = 'page-item disabled';
      dots.innerHTML = '<a class="page-link">…</a>';
      paginationEl.appendChild(dots);
    }
    paginationEl.appendChild(makeItem(totalPages, totalPages));
  }

  paginationEl.appendChild(makeItem('&raquo;', currentPage + 1, currentPage === totalPages));
}


// ADD TO GROUP

function addToGroup(id, name, thumb) {
  if (group.length >= 7) { limitModal.show(); return; }
  if (group.some(d => d.idDrink === id)) return;

  group.push({ idDrink: id, strDrink: name, strDrinkThumb: thumb });
  updateCartPanel();
  markCardAdded(id);
}

function markCardAdded(id) {
  const col = productContainer.querySelector(`[data-id="${id}"]`);
  if (!col) return;
  const btn = col.querySelector('.btn-warning');
  if (btn) {
    btn.outerHTML = `<button class="btn btn-secondary btn-sm flex-fill" disabled>
                       <i class="bi bi-check-circle me-1"></i>Already Selected
                     </button>`;
  }
}


// CART PANEL

function updateCartPanel() {
  groupCountBadge.textContent = group.length;

  if (group.length === 0) {
    cartTableHead.classList.add('d-none');
    groupList.innerHTML = `<p class="text-secondary text-center py-4 px-3 mb-0">No drinks added yet.</p>`;
    return;
  }

  cartTableHead.classList.remove('d-none');

  groupList.innerHTML = `
    <table class="table table-dark table-hover align-middle mb-0">
      <tbody>
        ${group.map((d, i) => `
          <tr>
            <td class="text-center fw-bold text-warning" style="width:40px">${i + 1}</td>
            <td style="width:50px">
              <img src="${d.strDrinkThumb}/small" alt="${d.strDrink}" class="group-avatar" />
            </td>
            <td class="small fw-semibold">${d.strDrink}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}


// DETAILS MODAL

async function showDetails(id) {
  document.getElementById('modalBody').innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-3 text-secondary">Loading details…</p>
    </div>`;
  detailsModal.show();

  const res    = await fetch(`${BASE}/lookup.php?i=${id}`);
  const data   = await res.json();
  const drinks = data.drinks;

  if (!drinks) {
    document.getElementById('modalBody').innerHTML =
      `<p class="text-danger p-4">Could not load details.</p>`;
    return;
  }

  const d = drinks[0];

  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ing = d[`strIngredient${i}`];
    const mea = d[`strMeasure${i}`];
    if (ing) ingredients.push(mea ? `${mea.trim()} ${ing}` : ing);
  }

  document.getElementById('detailsModalLabel').textContent = d.strDrink;

  document.getElementById('modalBody').innerHTML = `
    <div class="row g-0">
      <div class="col-md-5">
        <img src="${d.strDrinkThumb}" alt="${d.strDrink}"
          class="img-fluid w-100"
          style="max-height:360px;object-fit:cover;border-radius:0 0 0 .375rem" />
      </div>
      <div class="col-md-7 p-4">

        <div class="row g-2 mb-3">
          <div class="col-6">
            <div class="bg-secondary bg-opacity-25 rounded p-2">
              <div class="text-warning small fw-semibold mb-1">Category</div>
              <div class="small">${d.strCategory || '—'}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="bg-secondary bg-opacity-25 rounded p-2">
              <div class="text-warning small fw-semibold mb-1">Alcoholic</div>
              <div class="small">${d.strAlcoholic || '—'}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="bg-secondary bg-opacity-25 rounded p-2">
              <div class="text-warning small fw-semibold mb-1">Glass</div>
              <div class="small">${d.strGlass || '—'}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="bg-secondary bg-opacity-25 rounded p-2">
              <div class="text-warning small fw-semibold mb-1">IBA</div>
              <div class="small">${d.strIBA || '—'}</div>
            </div>
          </div>
        </div>

        <p class="text-warning small fw-semibold mb-1">Instructions</p>
        <p class="small text-secondary mb-3" style="line-height:1.7">${d.strInstructions || '—'}</p>

        <p class="text-warning small fw-semibold mb-2">Ingredients</p>
        <div class="d-flex flex-wrap gap-2">
          ${ingredients.map(ing =>
            `<span class="badge bg-secondary text-light">${ing}</span>`
          ).join('')}
        </div>
      </div>
    </div>
  `;
}


// HELPER Function

function showSpinner(msg = 'Loading…') {
  productContainer.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-3 text-secondary">${msg}</p>
    </div>`;
  notFound.classList.add('d-none');
  paginationEl.innerHTML = '';
  paginationWrapper.classList.add('d-none');
}

function esc(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
