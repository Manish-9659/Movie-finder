const API_KEY = "thewdb"; // you can replace with your own key later

const moviesEl = document.getElementById("movies");
const search = document.getElementById("search");
const loading = document.getElementById("loading");

// Load default movies
getMovies("avengers");

// Live search
search.addEventListener("input", () => {
  const q = search.value.trim();
  if (q) getMovies(q);
});

// Fetch list
async function getMovies(query) {
  loading.classList.remove("hidden");
  try {
    const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === "False") {
      moviesEl.innerHTML = `<h2>${data.Error}</h2>`;
      return;
    }

    showMovies(data.Search);
  } catch (e) {
    moviesEl.innerHTML = `<h2>Error loading data</h2>`;
  } finally {
    loading.classList.add("hidden");
  }
}

// Render cards
function showMovies(movies) {
  moviesEl.innerHTML = "";

  movies.forEach(movie => {
    const el = document.createElement("div");
    el.className = "movie";

    el.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" alt="">
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;

    el.addEventListener("click", () => {
      getMovieDetails(movie.imdbID);
    });

    moviesEl.appendChild(el);
  });
}

// Fetch details + open fullscreen
async function getMovieDetails(id) {
  const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
  const data = await res.json();

  const container = document.getElementById("movieDetails");
  container.style.backgroundImage = `url(${data.Poster})`;

  container.innerHTML = `
    <div class="details-content">
      <h1>${data.Title}</h1>
      <p class="rating">⭐ ${data.imdbRating}</p>
      <p>${data.Plot}</p>
      <p><b>Year:</b> ${data.Year}</p>
    </div>
  `;

  document.getElementById("modal").classList.add("active");
}

// Close button
document.getElementById("close").onclick = () => {
  document.getElementById("modal").classList.remove("active");
};

// Close when clicking outside
window.onclick = (e) => {
  const modal = document.getElementById("modal");
  if (e.target === modal) {
    modal.classList.remove("active");
  }
};