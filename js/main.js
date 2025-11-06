const watchlistButtons = document.querySelectorAll('.watchlistButton');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

watchlistButtons.forEach(button => {
  button.addEventListener('click', () => {
    let movieContainer = button.closest('.movieContainer');
    let movieTitle, movieImg;

    if (movieContainer) {
      movieTitle = movieContainer.querySelector('h4').textContent;
      movieImg = movieContainer.querySelector('img').src;
    } else {
      const featuredMovie = button.closest('.featuredMovie');
      if (featuredMovie) {
        movieTitle = featuredMovie.querySelector('h2').textContent;
        movieImg = featuredMovie.querySelector('img').src;
      }
    }

    if (movieTitle && movieImg) {
      const movie = { title: movieTitle, img: movieImg };

      const alreadyAdded = favorites.some(fav => fav.title === movie.title);

      if (!alreadyAdded) {
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${movie.title} added to favorites!`);
        button.textContent = "Added ✓";
        button.disabled = true;
      } else {
        alert(`${movie.title} is already in your favorites.`);
      }
    }
  });
});

// Clear Storage Button
const clearStorageButton = document.getElementById('clearStorage');

if (clearStorageButton) {
  clearStorageButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      localStorage.removeItem('favorites');
      favorites = [];
      
      const watchlistButtons = document.querySelectorAll('.watchlistButton');
      watchlistButtons.forEach(button => {
        button.textContent = "Add to Watchlist";
        button.disabled = false;
      });
      
      alert('Favorites cleared!');
    }
  });
}