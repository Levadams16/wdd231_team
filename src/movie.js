import { baseImgURL, getJson } from "./api";
import { movieDetailsTemplate } from "./templates";
import { attachUserSelectionListeners, initializeButtonState } from "./localstorage.js";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

async function loadMovieDetails() {
    if (!movieId) return;

    const movieInfo = await getJson(`movie/${movieId}`);
    const detailsContainer = document.getElementById("movieDetails");

    // insert movie template into main container
    detailsContainer.insertAdjacentHTML("afterbegin", movieDetailsTemplate(movieInfo, baseImgURL));

    const favoritesButtons = document.querySelectorAll('.favoritesButton');
    initializeButtonState(favoritesButtons, 'favorites');
    attachUserSelectionListeners(favoritesButtons, 'favorites');

    const watchlistButtons = document.querySelectorAll('.watchlistButton');
    initializeButtonState(watchlistButtons, 'watchlist');
    attachUserSelectionListeners(watchlistButtons, 'watchlist');
}

async function init() {
    await loadMovieDetails();
}

init();