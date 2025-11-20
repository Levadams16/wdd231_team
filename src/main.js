import { movieCardTemplate, featuredMovieTemplate, featuredGenreTemplate } from "./templates.js"
import { mapGenreIdsToNames } from "./utility.js";

const baseURL = "https://api.themoviedb.org/3/";
const apiKey = import.meta.env.VITE_API_KEY;
console.log("API KEY LOADED:", apiKey);

const baseImgURL = "https://image.tmdb.org/t/p/w500";


async function getJson(endpoint) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${baseURL}${endpoint}${separator}api_key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Response not ok");
    }

    return await response.json();
}

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

    const genres = await getTrendingMovieGenres(trendingMovies, genreMap);

    const moviesContainer = document.querySelector(".moviesContainer");
    // using the trendingMovies array, convert each object into html strings with the movieCardTemplate function  
    let html = trendingMovies.map(movie => movieCardTemplate(movie, genreMap, baseImgURL));
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

async function getGenres() {
    const data = await getJson("genre/movie/list");
    // returns { genres: [{id: 28, name: Action}, ...]}
    const genreMap = {};
    data.genres.forEach(genre => {
        genreMap[genre.id] = genre.name;
    });

    return genreMap;
}

async function getTrendingMovieGenres(trendingMovies, genreMap) {
    // sets don't allow for duplicate values
    const trendingMovieGenres = new Set();

    trendingMovies.forEach(movie => {
        // gets a string of all a specific movie's genres
        const genres = mapGenreIdsToNames(movie, genreMap);

        // split into individual genres within an array and adds each to the set
        genres.split(", ").forEach(genre => trendingMovieGenres.add(genre));
    })

    return Array.from(trendingMovieGenres);
}

function setGenreDropdown(genreMap) {
  const dropdown = document.getElementById("genreDropdown");
  Object.entries(genreMap).forEach(([id, name]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    dropdown.appendChild(option);
  })
}

// start of local storage and button logic

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function attachWatchlistListeners() {
  const watchlistButtons = document.querySelectorAll('.watchlistButton');

  watchlistButtons.forEach(button => {
    button.addEventListener('click', () => {
      let movieContainer = button.closest('.movieContainer');
      let movieTitle, movieImg;
      console.log("Button clicked:", button);

      if (movieContainer) {
        movieTitle = movieContainer.querySelector('h4').textContent;
        movieImg = movieContainer.querySelector('img').src;
      } else {
        const featuredMovie = button.closest('.featuredMovie');
        if (featuredMovie) {
          movieTitle = featuredMovie.querySelector('h2').textContent;
          movieImg = featuredMovie.querySelector('img').src;
        }
      }

      if (movieTitle && movieImg) {
        const movie = { title: movieTitle, img: movieImg };
        const alreadyAdded = favorites.some(fav => fav.title === movie.title);

        if (!alreadyAdded) {
          favorites.push(movie);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          alert(`${movie.title} added to favorites!`);
          button.textContent = "Added to Watchlist";
          button.disabled = true;
        } else {
          alert(`${movie.title} is already in your favorites.`);
        }
      }
    });
  });
}


// Clear Storage Button
const clearStorageButton = document.getElementById('clearStorage');

if (clearStorageButton) {
  clearStorageButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      localStorage.removeItem('favorites');
      favorites = [];
      
      const watchlistButtons = document.querySelectorAll('.watchlistButton');
      watchlistButtons.forEach(button => {
        button.textContent = "Add to Watchlist";
        button.disabled = false;
      });
      
      alert('Favorites cleared!');
    }
  });
}

async function init() {
    const genreMap = await getGenres();
    setGenreDropdown(genreMap);
    await setFeaturedMovie();
    await setTrendingMovies(genreMap);
    attachWatchlistListeners();
}

init();