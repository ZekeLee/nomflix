import { useQuery } from 'react-query';
import { getMovies, IMoviesResult } from '../api';
import { makeImagePath } from '../utils';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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
  padding: 2rem;
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

const Slider = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: -2rem;
  width: calc(100% + 4rem);
  height: 8rem;
`;

const Row = styled(motion.ul)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  width: 100%;
  height: 100%;
`;

const Item = styled(motion.li)<{ $bgImg: string }>`
  background-color: #fff;
  height: 100%;
  font-size: 3rem;
  color: red;
  background-image: url(${(props) => props.$bgImg});
  background-position: center center;
  background-size: cover;
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth + 8,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 8,
  },
};

const offset = 6;

const Home = () => {
  const { data, isLoading } = useQuery<IMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [isLeave, setIsLeave] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (isLeave) return;
      toggleLeave();
      const totalMovies = data?.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  console.log(data);

  const toggleLeave = () => setIsLeave((prev) => !prev);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Visual
            onClick={increaseIndex}
            $bgImg={makeImagePath(data?.results[0].backdrop_path || '')}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeave}>
                <Row
                  key={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: 'tween', duration: 1 }}
                >
                  {data?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((item) => (
                      <Item
                        key={item.id}
                        $bgImg={makeImagePath(item.backdrop_path, 'w500')}
                      />
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </Visual>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
