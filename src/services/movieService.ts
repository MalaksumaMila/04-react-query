import axios from 'axios';
import type { Movie } from '../types/movie';
import toast from 'react-hot-toast';

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

interface MoviesServiseResponse {
  results: Movie[];
}

export default async function fetchMovies(topic: string): Promise<Movie[]> {
  const query = topic.trim();
  if (!query) return [];

  try {
    const response = await axios.get<MoviesServiseResponse>(`${BASE_URL}`, {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page: 1,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return response.data.results;
  } catch (error) {
    toast.error('There was an error, please try again...');
    return [];
  }
}
