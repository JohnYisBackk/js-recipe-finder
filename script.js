"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const resultsCount = document.getElementById("resultsCount");

const recipesGrid = document.getElementById("recipesGrid");

const recipeModal = document.getElementById("recipeModal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");

const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalArea = document.getElementById("modalArea");
const modalInstructions = document.getElementById("modalInstructions");
const modalYoutube = document.getElementById("modalYoutube");

// ======================================================
// API SETTINGS
// ======================================================

const searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const detailsUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

// ======================================================
// SEARCH RECIPES FUNCTION
// ======================================================

async function searchRecipes(query) {
  loading.classList.remove("hidden");
  errorMessage.classList.add("hidden");

  recipesGrid.innerHTML = "";

  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  try {
    const response = await fetch(`${searchUrl}${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error("Failed to fetch recipes.");
    }

    const data = await response.json();

    if (!data.meals) {
      throw new Error("No recipes found.");
    }

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 600);
    });

    renderRecipes(data.meals);
  } catch (error) {
    errorMessage.classList.remove("hidden");
    resultsCount.textContent = "No recipes found.";
    console.error(error);
  } finally {
    loading.classList.add("hidden");
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

// ======================================================
// RENDER RECIPES FUNCTION
// ======================================================

function renderRecipes(meals) {
  recipesGrid.innerHTML = "";

  resultsCount.textContent = `${meals.length} recipes found.`;

  meals.forEach((meal) => {
    recipesGrid.innerHTML += `
      <article class="recipe-card">
       <img
          src="${meal.strMealThumb}"
          alt="${meal.strMeal}"
        />

         <div class="recipe-info">
          <h3>${meal.strMeal}</h3>

          <p>${meal.strCategory}</p>

            <button data-id="${meal.idMeal}">
            View Recipe
          </button>
        </div>
      </article>
    `;
  });
}

// ======================================================
// GET RECIPE DETAILS FUNCTION
// ======================================================

async function getRecipeDetails(id) {
  const response = await fetch(`${detailsUrl}${id}`);

  if (!response.ok) {
    throw new Error("no details found.");
  }

  const data = await response.json();

  const meal = data.meals[0];

  openModal(meal);
}

// ======================================================
// OPEN MODAL FUNCTION
// ======================================================

function openModal(meal) {
  modalImage.src = meal.strMealThumb;
  modalTitle.textContent = meal.strMeal;
  modalCategory.textContent = meal.strCategory;
  modalArea.textContent = meal.strArea;
  modalInstructions.textContent = meal.strInstructions;

  if (meal.strYoutube) {
    modalYoutube.href = meal.strYoutube;
    modalYoutube.classList.remove("hidden");
  } else {
    modalYoutube.classList.add("hidden");
  }

  recipeModal.classList.remove("hidden");
}

// ======================================================
// CLOSE MODAL FUNCTION
// ======================================================

function closeRecipeModal() {
  recipeModal.classList.add("hidden");
}
// ======================================================
// HANDLE SEARCH FUNCTION
// ======================================================

function handleSearch(e) {
  e.preventDefault();

  const value = searchInput.value.trim();

  if (value === "") return;

  searchRecipes(value);
}

// ======================================================
// HANDLE CARD CLICK FUNCTION
// ======================================================

recipesGrid.addEventListener("click", (e) => {
  const id = e.target.dataset.id;

  if (!id) return;

  getRecipeDetails(id);
});

// ======================================================
// EVENT LISTENERS
// ======================================================

searchForm.addEventListener("submit", handleSearch);

closeModal.addEventListener("click", closeRecipeModal);

recipeModal.addEventListener("click", (e) => {
  if (e.target === recipeModal) {
    closeRecipeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeRecipeModal();
  }
});

// ======================================================
// INITIAL LOAD
// ======================================================

searchRecipes("chicken");
