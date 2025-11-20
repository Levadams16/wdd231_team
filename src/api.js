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