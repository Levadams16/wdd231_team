import { baseImgURL, getJson } from "./api.js";
import { movieCardTemplate, featuredMovieTemplate, featuredGenreTemplate } from "./templates.js"
import { mapGenreIdsToNames } from "./utility.js";

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
    setTrendingMovieGenres(genres);

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

function setTrendingMovieGenres(genres) {
    const genreListContainer = document.querySelector(".genreList");
    const html = genres.map(featuredGenreTemplate).join("");
    genreListContainer.insertAdjacentHTML("afterbegin", html);
}

async function init() {
    const genreMap = await getGenres();
    setFeaturedMovie();
    setTrendingMovies(genreMap);
    attachWatchlistListeners();
}

init();

// start of local storage and button logic

// const watchlistButtons = document.querySelectorAll('.watchlistButton');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function attachWatchlistListeners() {
  const watchlistButtons = document.querySelectorAll('.watchlistButton');

  watchlistButtons.forEach(button => {
    button.addEventListener('click', () => {
      let movieContainer = button.closest('.movieContainer');
      let movieTitle, movieImg;

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
          button.textContent = "Added ✓";
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