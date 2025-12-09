export const baseURL = "https://api.themoviedb.org/3/";
export const apiKey = import.meta.env.VITE_API_KEY;

export const baseImgURL = "https://image.tmdb.org/t/p/w500";


export async function getJson(endpoint) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${baseURL}${endpoint}${separator}api_key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Response not ok");
    }

    return await response.json();
}

export async function getGenres() {
    const data = await getJson("genre/movie/list");
    // returns { genres: [{id: 28, name: Action}, ...]}
    const genreMap = {};
    data.genres.forEach(genre => {
        genreMap[genre.id] = genre.name;
    });

    return genreMap;
}