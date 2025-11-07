export function mapGenreIdsToNames(movie, genreMap) {
    // returns a string of each genre name associated with movie ("Action", "Adventure", "Suspense" ...)
    return movie.genre_ids.map(id => genreMap[id]).join(", ");
}