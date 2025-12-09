import { baseImgURL, getJson } from "./api";
import { movieDetailsTemplate } from "./templates";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

async function loadMovieDetails() {
    if (!movieId) return;

    const movieInfo = await getJson(`movie/${movieId}`);
    const detailsContainer = document.getElementById("movieDetails");

    // insert movie template into main container
    detailsContainer.insertAdjacentHTML("afterbegin", movieDetailsTemplate(movieInfo, baseImgURL));
}

loadMovieDetails();
