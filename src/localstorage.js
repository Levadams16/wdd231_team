
function getMovieDataFromDOM(button) {
  let movieTitle, movieImg, movieId;
  // check 1: check for data attributes first (subpage template and featured movie)
  if (button.dataset.id && button.dataset.title) {
    movieId = button.dataset.id;
    movieTitle = button.dataset.title;
    movieImg = button.dataset.img;
  } else {
    // check 2: trending movies
    let movieContainer = button.closest(".movieContainer");
    if (movieContainer) {
      movieTitle = movieContainer.querySelector("h4").textContent;
      movieImg = movieContainer.querySelector("img").src;

      const link = movieContainer.querySelector(".movieLink");
      const url = new URL(link.href);
      movieId = url.searchParams.get("id");
    }
  }

  if (movieTitle && movieId) {
    // return movie object
    return { title: movieTitle, img: movieImg, id: movieId };
  }

  // if no data is found
  return null;
}

// selection should be either 'watchlist' or 'favorites'
export function attachUserSelectionListeners(buttons, selection) {

  buttons.forEach(button => {
    button.addEventListener('click', () => {

      const movie = getMovieDataFromDOM(button);
      if (!movie) {
        console.error("Could not find movie data for this button.");
        return;
      }

      // get current array from localStorage
      let currentCollection = JSON.parse(localStorage.getItem(selection)) || [];
      const alreadyAdded = currentCollection.some(m => m.id === movie.id);

      if (!alreadyAdded) {
        currentCollection.push(movie);
        localStorage.setItem(selection, JSON.stringify(currentCollection));

        alert(`${movie.title} added to ${selection}!`);

        button.textContent = `- Remove from ${selection}`;
      } else {
        // remove current movie from collection
        const updatedCollection = currentCollection.filter(m => m.id !== movie.id);
        currentCollection = updatedCollection;
        
        localStorage.setItem(selection, JSON.stringify(currentCollection));

        alert(`${movie.title} removed from your ${selection}.`);
        button.textContent = `+ Add to ${selection}`;
        button.disabled = false;
      }
    });
})
}

export function initializeButtonState(buttons, selection) {
  // get current array from localStorage
  const currentCollection = JSON.parse(localStorage.getItem(selection)) || [];

  buttons.forEach((button) => {
    const movie = getMovieDataFromDOM(button);

    if (!movie) {
      console.error("Could not find movie data for this button.");
      return;
    }

    const alreadyAdded = currentCollection.some((m) => m.id === movie.id);

    if (alreadyAdded) {
      button.textContent = `- Remove from ${selection}`;
    } else {
      button.textContent = `+ Add to ${selection}`;
    }
  });
}