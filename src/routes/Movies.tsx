import { useQuery } from 'react-query';
import { getMovies, IMoviesResult } from '../api';
import { makeImagePath } from '../utils';
import VideoSlider from '../components/VideoSlider';

import styled from 'styled-components';

const Wrapper = styled.main``;

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
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.8) 4rem, rgba(0, 0, 0, 0)),
    url(${(props) => props.$bgImg});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 3rem;
`;

const Overview = styled.p`
  font-size: 1.25rem;
  line-height: 1.25;
`;

const Movies = () => {
  const { data, isLoading } = useQuery<IMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );

  const movies = data;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Visual $bgImg={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
            <VideoSlider movies={movies} />
          </Visual>
        </>
      )}
    </Wrapper>
  );
};

export default Movies;
