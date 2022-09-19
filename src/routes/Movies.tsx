import { useState, useEffect } from 'react';
import { useQueries } from 'react-query';
import {
  getPopularMovies,
  getMovies,
  getTopRatedMovies,
  getUpComingMovies,
  IMovie,
  getMoviesGenres,
} from '../api';
import { makeImagePath } from '../utils';
import VideoSlider from '../components/VideoSlider';
import Modal from '../components/Modal';

import styled from 'styled-components';

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 2rem;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
`;

const Visual = styled.section<{ $bgImg: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 2rem 2rem 2rem;
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.8) 4rem, rgba(0, 0, 0, 0)),
    url(${(props) => props.$bgImg});
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
`;

const Title = styled.h2`
  font-size: 3rem;
`;

const Overview = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: 1.25rem;
  line-height: 1.25;
  overflow: hidden;
`;

const Movies = () => {
  const [allMovies, setAllMovies] = useState<IMovie[]>([]);

  const result = useQueries([
    {
      queryKey: ['movies', 'nowPlaying'],
      queryFn: getMovies,
    },
    {
      queryKey: ['movies', 'popular'],
      queryFn: getPopularMovies,
    },
    {
      queryKey: ['movies', 'topRated'],
      queryFn: getTopRatedMovies,
    },
    {
      queryKey: ['movies', 'upComing'],
      queryFn: getUpComingMovies,
    },
    {
      queryKey: 'genres',
      queryFn: getMoviesGenres,
    },
  ]);

  const [
    { data: nowPlaying },
    { data: popular },
    { data: topRated },
    { data: upComing },
    { data: genres },
  ] = result;

  const finishLoading = result.some((result) => result.isLoading);

  useEffect(() => {
    if (!finishLoading) {
      setAllMovies([
        ...nowPlaying.results,
        ...popular.results,
        ...topRated.results,
        ...upComing.results,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishLoading]);

  return (
    <Wrapper>
      {finishLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Visual
            $bgImg={makeImagePath(nowPlaying?.results[0].backdrop_path || '')}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Visual>
          <VideoSlider title={'Now Playing'} movies={nowPlaying} />
          <VideoSlider title={'Popular'} movies={popular} />
          <VideoSlider title={'Top Rated'} movies={topRated} />
          <VideoSlider title={'Upcoming'} movies={upComing} />
          <Modal
            movies={[nowPlaying, popular, topRated, upComing]}
            allMovies={allMovies}
            movieGenres={genres}
          />
        </>
      )}
    </Wrapper>
  );
};

export default Movies;
