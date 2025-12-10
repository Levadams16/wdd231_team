import { movieCardTemplate } from "./templates";
import { baseImgURL, getJson } from "./api.js";
import { getMovieGenres } from "./utility.js";

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
const favoriteMovieSection = document.querySelector('.favoriteMovies');
const watchlistMovieSection = document.querySelector('.watchlistMovies');

async function displayUserSelections(movieArray, arrayContainer, selection) {

    if (movieArray.length == 0) {
        console.log(`No movies in your ${selection}.`);
        return;
    }

    // returns an array of all movie objects when all API requests have been completed/resolved
    const movieData = await Promise.all(
        movieArray.map(movie => getJson(`movie/${movie.id}`))
    );

    let html = movieData.map(movie => {
        const genres = getMovieGenres(movie);
        return movieCardTemplate(movie, genres, baseImgURL, false);
    });

    arrayContainer.innerHTML = html.join("");
}

async function init() {
    displayUserSelections(favorites, favoriteMovieSection, "Favorites");
    displayUserSelections(watchlist, watchlistMovieSection, "Watchlist");
}

init();