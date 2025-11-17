import axios from 'axios';
import type { Movie } from '../types/movie';
import toast from 'react-hot-toast';

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

interface MoviesServiseResponse {
  results: Movie[];
  total_page: number;
}

export default async function fetchMovies(
  topic: string,
  page: number
): Promise<MoviesServiseResponse> {
  const query = topic.trim();
  if (!query) return { results: [], total_page: 0 };

  try {
    const response = await axios.get<MoviesServiseResponse>(`${BASE_URL}`, {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    toast.error('There was an error, please try again...');
    return { results: [], total_page: 0 };
  }
}
