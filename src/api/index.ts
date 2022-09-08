const BASE_PATH = 'https://api.themoviedb.org/3';
const API_KEY = '0609f8b4c3d282d09fbdeddc1330fafc';

export interface IMoviesResult {
  dates: Dates;
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface Dates {
  maximum: Date;
  minimum: Date;
}

interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: OriginalLanguage;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

enum OriginalLanguage {
  En = 'en',
  Es = 'es',
  Ja = 'ja',
}

export const getMovies = () => {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};
