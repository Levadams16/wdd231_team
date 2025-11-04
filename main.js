const baseURL = "https://api.themoviedb.org/3/";
const apiKey = import.meta.env.API_KEY;

async function getJson(endpoint) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${baseURL}${endpoint}${separator}api_key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Response not ok");
    }

    return await response.json();
}

