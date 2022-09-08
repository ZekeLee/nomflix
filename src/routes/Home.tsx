import { useQuery } from 'react-query';
import { getMovies, IMoviesResult } from '../api';
import { makeImagePath } from '../utils';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const Wrapper = styled.main``;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
`;

const Visual = styled.section<{ bgImg: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.8) 4rem, rgba(0, 0, 0, 0)),
    url(${(props) => props.bgImg});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 3rem;
`;

const Overview = styled.p`
  width: 50vw;
  font-size: 1.25rem;
`;

const Slider = styled.section``;

const Row = styled(motion.div)``;

const Item = styled(motion.div)``;

const Home = () => {
  const { data, isLoading } = useQuery<IMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );

  console.log(data, isLoading);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Visual bgImg={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
            <Slider>
              <Row>
                <Item />
                <Item />
                <Item />
              </Row>
              <Row>
                <Item />
                <Item />
                <Item />
              </Row>
              <Row>
                <Item />
                <Item />
                <Item />
              </Row>
            </Slider>
          </Visual>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
