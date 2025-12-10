export function mapGenreIdsToNames(movie, genreMap) {
    // for movies from trending/search
    if (movie.genre_ids) {
        // returns a string of each genre name associated with movie ("Action", "Adventure", "Suspense" ...)
        return movie.genre_ids.map(id => genreMap[id]).join(", ");
    }
}

export function getMovieGenres(movie) {
    // for movie details endpoint
    return movie.genres.map(g => g.name).join(", ");
}

export function attachBackToTopListener() {
    const backToTopButton = document.querySelector(".back_to_top");
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}