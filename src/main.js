import { baseImgURL, getJson, getGenres } from "./api.js";
import { movieCardTemplate, featuredMovieTemplate, featuredGenreTemplate } from "./templates.js"
import { mapGenreIdsToNames, attachBackToTopListener } from "./utility.js";
import { attachUserSelectionListeners, initializeButtonState } from "./localstorage.js";

// array storing all trending movies returned by API call to prevent repeated, unecessary calls 
let allTrendingMoviesCache = [];

async function fetchDevFavorites() {
    try {
        // await fetch call to get the response object
        const response = await fetch("dev-favs.json");

        // check if response was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // await the parsing of the JSON object from the response
        const devFavorites = await response.json();
        return devFavorites;
    }

    catch (error) {
        console.error("Error fetching favorite movie data:", error);
        return null;
    }
}

async function fetchAndCacheTrendingMovies(genreMap) {
    const trendingMovieData = await getJson("trending/movie/week");

    // store full list in global cache
    allTrendingMoviesCache = trendingMovieData.results;
    
    // displays initial trending movies (just takes the first 8, not sorted)
    renderMovies(allTrendingMoviesCache, genreMap);
}

function renderMovies(movieArray, genreMap) {
    // grabs only the first 8
    const moviesToDisplay = movieArray.slice(0, 8);

    const moviesContainer = document.querySelector(".moviesContainer");
    // clear container before inserting new movies
    moviesContainer.innerHTML = "";

    // using the moviesToDisplay array, convert each object into html strings with the movieCardTemplate function  
    let html = moviesToDisplay.map(movie => {
      const genres = mapGenreIdsToNames(movie, genreMap);
      return movieCardTemplate(movie, genres, baseImgURL);
    });

    // join the elements of the html array and insert it into the intro section
    moviesContainer.insertAdjacentHTML("afterbegin", html.join(""));

    // attach button listeners after rendering new HTML
    const watchlistButtons = document.querySelectorAll(".watchlistButton");
    initializeButtonState(watchlistButtons, "watchlist"); 
    attachUserSelectionListeners(watchlistButtons, "watchlist");
}

async function setFeaturedMovie() {
    const devFavoritesJson = await fetchDevFavorites();
    // manually pick featured movie (make it random/dynamic in the future)
    const featuredMovie = devFavoritesJson.favorites[1];
    const movie = await getJson(`movie/${featuredMovie.databaseId}`);

    const featuredContainer = document.querySelector(".featuredMovie");
    let html = featuredMovieTemplate(movie, baseImgURL);
    featuredContainer.insertAdjacentHTML("afterbegin", html);
}

async function getTrendingMovieGenres(trendingMovies, genreMap) {
    const trendingMovieGenres = new Set();

    trendingMovies.forEach(movie => {
        const genres = mapGenreIdsToNames(movie, genreMap);

        genres.split(", ").forEach(genre => trendingMovieGenres.add(genre));
    })

    return Array.from(trendingMovieGenres);
}

function setGenreDropdown(genreMap) {
    const list = document.querySelector('.dropdownList');
    const button = document.querySelector('.dropdownBtn');

    const all = document.createElement('li');
    all.textContent = "All Genres";
    all.dataset.id = "";
    list.appendChild(all);

    Object.entries(genreMap).forEach(([id, name]) => {
        const li = document.createElement('li');
        li.textContent = name;
        li.dataset.id = id;
        list.appendChild(li);
    });

    button.addEventListener('click', () => {
        list.classList.toggle('open');
    });

    list.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            button.textContent = li.textContent + " ▼";
            list.classList.remove('open');

            const selectedGenreId = li.dataset.id;

            let filteredMovies = [];
            if (selectedGenreId === "") {
                filteredMovies = allTrendingMoviesCache;
            } else {
                const targetId = parseInt(selectedGenreId);

                // creates an array of only movies with the selected genre id
                filteredMovies = allTrendingMoviesCache.filter(movie => {
                    return movie.genre_ids.includes(targetId);
                });
            }

            // display movies corresponding to genre selected
            renderMovies(filteredMovies, genreMap);
        });
    });
}

// Clear Storage Button
const clearStorageButton = document.getElementById('clearStorage');

if (clearStorageButton) {
  clearStorageButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your watchlist?')) {
      localStorage.removeItem('watchlist');
      watchlist = [];
      
      const watchlistButtons = document.querySelectorAll('.watchlistButton');
      watchlistButtons.forEach(button => {
        button.textContent = "Add to Watchlist";
        button.disabled = false;
      });
      
      alert('Watchlist cleared!');
    }
  });
}

async function init() {
    const genreMap = await getGenres();

    await fetchAndCacheTrendingMovies(genreMap);

    setGenreDropdown(genreMap);
    await setFeaturedMovie();

    // attach button event listener
    attachBackToTopListener();
}

init();