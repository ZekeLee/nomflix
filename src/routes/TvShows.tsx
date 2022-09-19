import { useState, useEffect } from 'react';
import { useQueries } from 'react-query';
import {
  getTopRatedTvShows,
  getTvShows,
  getTvShowsGenres,
  ITvShow,
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

const TvShows = () => {
  const [allTvShows, setAllTvShows] = useState<ITvShow[]>([]);

  const result = useQueries([
    {
      queryKey: ['tvShows', 'onTheAir'],
      queryFn: getTvShows,
    },
    {
      queryKey: ['tvShows', 'topRated'],
      queryFn: getTopRatedTvShows,
    },
    {
      queryKey: 'genres',
      queryFn: getTvShowsGenres,
    },
  ]);

  const [{ data: onTheAir }, { data: topRated }, { data: genres }] = result;

  const finishLoading = result.some((result) => result.isLoading);

  useEffect(() => {
    if (!finishLoading) {
      setAllTvShows([...onTheAir.results, ...topRated.results]);
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
            $bgImg={makeImagePath(onTheAir?.results[0].backdrop_path || '')}
          >
            <Title>{onTheAir?.results[0].name}</Title>
            <Overview>{onTheAir?.results[0].overview}</Overview>
          </Visual>
          <VideoSlider title={'On The Air'} tvShows={onTheAir} />
          <VideoSlider title={'Top Rated'} tvShows={topRated} />
          <Modal
            tvShows={[onTheAir, topRated]}
            allTvShows={allTvShows}
            tvShowGenres={genres}
          />
        </>
      )}
    </Wrapper>
  );
};

export default TvShows;
