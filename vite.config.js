import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // The key (main, movie) is just a name for the chunk
        main: resolve(__dirname, 'index.html'),
        movie: resolve(__dirname, 'movie.html'),
        favorites: resolve(__dirname, 'favorites.html'),
        newsletter: resolve(__dirname, 'newsletter.html'),
      },
    },
  },
});