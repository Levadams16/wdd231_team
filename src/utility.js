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