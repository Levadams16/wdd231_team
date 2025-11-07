import { movieCardTemplate, featuredMovieTemplate, featuredGenreTemplate } from "./templates.js"
import { mapGenreIdsToNames } from "./utility.js";

const baseURL = "https://api.themoviedb.org/3/";
const apiKey = import.meta.env.VITE_API_KEY;

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
}

init();