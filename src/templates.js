import { getMovieGenres, mapGenreIdsToNames } from "./utility.js";

export function movieCardTemplate(info, genreMap, baseImgURL) {
    const genres = mapGenreIdsToNames(info, genreMap);

    return `
    <div class="movieContainer">
      <a href="./movie.html?id=${info.id}" class="movieLink">
        <img src="${baseImgURL}${info.poster_path}" alt="${info.title} poster">
        <p>${genres}</p>
        <h4>${info.title}</h4>
        <p>${info.overview}</p>
      </a>
      <div class="movieOptionsContainer">
        <button class="watchlistButton"><span class="plusIcon">+</span> Add to Watchlist</button>
      </div>
    </div>
    `;
}

export function movieDetailsTemplate(movie, baseImgURL) {
    const genres = getMovieGenres(movie);

    // maybe add rating somewhere in here
    return `
        <div class="movieDetailsCard">
        <img src="${baseImgURL}${movie.poster_path}" alt="${movie.title}">
        
        <div class="movieDetailsInfo">
            <h1>${movie.title}</h1>
            <div class="additionalDetails">
              <small>${genres}</small>
              <small> | </small>
              <small>${movie.release_date}</small>
              <small> | </small>
              <small>${movie.runtime} mins</small>
            </div>
            <p class="movieDesc">${movie.overview}</p>
            
            <div class="buttons">
              <button><span class="plusIcon">+</span> Add to Favorites</button>
              <button><span class="plusIcon">+</span> Add to Watchlist</button>
            </div>
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