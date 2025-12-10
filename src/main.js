import { baseImgURL, getJson, getGenres } from "./api.js";
import { movieCardTemplate, featuredMovieTemplate, featuredGenreTemplate } from "./templates.js"
import { mapGenreIdsToNames } from "./utility.js";
import { attachUserSelectionListeners, initializeButtonState } from "./localstorage.js";

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

async function setTrendingMovies(genreMap) {
    const trendingMovieData = await getJson("trending/movie/week");
    const allTrendingMovies = trendingMovieData.results;
    // grab only the first 8
    const trendingMovies = allTrendingMovies.slice(0, 8);

    const moviesContainer = document.querySelector(".moviesContainer");
    // using the trendingMovies array, convert each object into html strings with the movieCardTemplate function  
    let html = trendingMovies.map(movie => {
      const genres = mapGenreIdsToNames(movie, genreMap);
      return movieCardTemplate(movie, genres, baseImgURL);
    });
    // join the elements of the html array and insert it into the intro section
    moviesContainer.insertAdjacentHTML("afterbegin", html.join(""));
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

            const movieContainers = document.querySelectorAll('.movieContainer');

            movieContainers.forEach(movieContainer => {
                if (selectedGenreId === "") {
                    movieContainer.style.display = "block";
                } else {
                    const genreText = movieContainer.querySelector('p').textContent;
                    if (genreText.includes(genreMap[selectedGenreId])) {
                        movieContainer.style.display = "block";
                    } else {
                        movieContainer.style.display = "none";
                    }
                }
            });
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
    setGenreDropdown(genreMap);
    await setFeaturedMovie();
    await setTrendingMovies(genreMap);
    
    const watchlistButtons = document.querySelectorAll('.watchlistButton');
    initializeButtonState(watchlistButtons, 'watchlist');
    attachUserSelectionListeners(watchlistButtons, 'watchlist');
}

init();