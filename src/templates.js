import { mapGenreIdsToNames } from "./utility";

export function movieCardTemplate(info, genreMap, baseImgURL) {
    const genres = mapGenreIdsToNames(info, genreMap);

    return `
    <div class="movieContainer">
      <img src="${baseImgURL}${info.poster_path}" alt="${info.title} poster">
      <p>${genres}</p>
      <h4>${info.title}</h4>
      <p>${info.overview}</p>
      <div class="movieOptionsContainer">
        <button class="ratingButton">Rating</button>
        <button class="watchlistButton">Add to Watchlist</button>
      </div>
    </div>
    `;
}

export function featuredMovieTemplate(info, baseImgURL) {
    // change template to include "reason" (from JSON file) instead of overview (from database)
    return `
    <div class="featuredMovieDesc">
        <h2>${info.title}</h2>
        <p>${info.overview}</p>
        <div class="movieOptionsContainer">
            <button class="ratingButton">Rating</button>
            <button class="watchlistButton">Add to Watchlist</button>
        </div>
    </div>
    <div class="featuredMovieImgContainer">
        <img src="${baseImgURL}${info.poster_path}" alt="${info.title} poster">
    </div>`;
}

export function featuredGenreTemplate(genre) {
    return `
    <li>${genre}</li>
    `;
}