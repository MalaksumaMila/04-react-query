import { useState } from 'react';
import css from './App.module.css';
import ReactPaginate from 'react-paginate';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', topic, page],
    queryFn: () => fetchMovies(topic, page),
    enabled: topic !== '',
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_page ?? 0;

  const handleSearch = (q: string) => setTopic(q);
  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => {
    setSelectedMovie(null);
  };
  // useEffect(() => {
  //   const loadMovies = async () => {
  //     if (!topic.trim()) return;

  //     setIsError(false);
  //     setIsLoading(true);
  //     setMovies([]);
  //     try {
  //       const data = await fetchMovies(topic, page);

  //       if (data.length === 0) {
  //         toast.error('No movies found for your request');
  //       }
  //       setMovies(data);
  //     } catch {
  //       setIsError(true);
  //       toast.error('There was an error, please try again...');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   loadMovies();
  // }, [topic]);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

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
