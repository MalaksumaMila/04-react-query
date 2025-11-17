import { useState, useEffect } from 'react';
import css from './App.module.css';

import type { Movie } from '../../types/movie';
import fetchMovies from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

function App() {
  const [topic, setTopic] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (q: string) => setTopic(q);
  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => {
    setSelectedMovie(null);
  };
  useEffect(() => {
    const loadMovies = async () => {
      if (!topic.trim()) return;

      setIsError(false);
      setIsLoading(true);
      setMovies([]);
      try {
        const data = await fetchMovies(topic);

        if (data.length === 0) {
          toast.error('No movies found for your request');
        }
        setMovies(data);
      } catch {
        setIsError(true);
        toast.error('There was an error, please try again...');
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, [topic]);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
