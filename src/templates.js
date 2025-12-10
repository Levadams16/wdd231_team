import { getMovieGenres, mapGenreIdsToNames } from "./utility.js";

export function movieCardTemplate(info, genres, baseImgURL, showButtons = true) {
    return `
    <div class="movieContainer">
      <a href="./movie.html?id=${info.id}" class="movieLink">
        <img src="${baseImgURL}${info.poster_path}" alt="${info.title} poster">
        <p>${genres}</p>
        <h4>${info.title}</h4>
        <p>${info.overview}</p>
      </a>
      ${showButtons ? `
      <div class="movieOptionsContainer">
        <button class="watchlistButton"><span class="plusIcon">+</span> Add to Watchlist</button>
      </div>` : ''}
    </div>
    `;
}

// buttons contain custom data attributes so event listeners will work correctly
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
              <button class="favoritesButton"
                data-id="${movie.id}"
                data-title="${movie.title}"
                data-img="${baseImgURL + movie.poster_path}">
                <span class="plusIcon">+</span> Add to Favorites
              </button>
              <button class="watchlistButton"
                data-id="${movie.id}"
                data-title="${movie.title}"
                data-img="${baseImgURL + movie.poster_path}">
                <span class="plusIcon">+</span> Add to Watchlist
              </button>
            </div>
        </div>

        </div>
    `;
}

export function featuredMovieTemplate(info, baseImgURL) {
    return `
    <div class="featuredMovieDesc" data-id="${info.id}">
      <a href="./movie.html?id=${info.id}" class="movieLink">
        <h2>${info.title}</h2>
        <p>${info.overview}</p>
      </a>
        <div class="movieOptionsContainer">
            <button class="watchlistButton"
              data-id="${info.id}"
              data-title="${info.title}"
              data-img="${baseImgURL + info.poster_path}">
              <span class="plusIcon">+</span> Add to Watchlist
            </button>
        </div>
    </div>
    <div class="featuredMovieImgContainer">
      <a href="./movie.html?id=${info.id}" class="movieLink">
        <img src="${baseImgURL}${info.poster_path}" alt="${info.title} poster">
      </a>
    </div>`;
}

export function featuredGenreTemplate(genre) {
    return `
    <li>${genre}</li>
    `;
}