import { useState } from 'react';
import { useQuery } from 'react-query';
import { useMatch, useNavigate } from 'react-router-dom';
import { getMovies, IMoviesResult } from '../api';
import { makeImagePath } from '../utils';

import styled from 'styled-components';
import { motion, AnimatePresence, useScroll } from 'framer-motion';

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
  height: 100%;
  font-size: 3rem;
  color: red;
  background-image: url(${(props) => props.$bgImg});
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 0.5rem;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  h3 {
    font-size: 0.75rem;
    color: ${(props) => props.theme.white.darker};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Card = styled(motion.div)<{ $scrollY: number }>`
  position: absolute;
  top: ${(props) => props.$scrollY + '10vh'};
  left: calc(50% - 30vw);
  width: 60vw;
  height: 80vh;
  color: ${(props) => props.theme.white.lighter};
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 5px;
  img {
    display: block;
    width: 100%;
    border-radius: 5px 5px 0 0;
  }
  h4 {
    font-size: 1.25rem;
  }
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
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

const itemVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    y: -30,
    scale: 1.3,
    transition: {
      type: 'tween',
      delay: 0.3,
      duration: 0.3,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 0.3,
      duration: 0.3,
    },
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

  const navigate = useNavigate();

  const moviePathMatch = useMatch('/movies/:id');
  const clickedVideo =
    moviePathMatch?.params.id &&
    data?.results.find((video) => video.id + '' === moviePathMatch.params.id);

  console.log(clickedVideo);

  const { scrollY } = useScroll();

  const increaseIndex = () => {
    if (data) {
      if (isLeave) return;
      toggleLeave();
      const totalMovies = data?.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeave = () => setIsLeave((prev) => !prev);

  const onItemClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => navigate('/');

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Visual $bgImg={makeImagePath(data?.results[0].backdrop_path || '')}>
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
                        onClick={() => onItemClicked(item.id)}
                        layoutId={item.id + ''}
                        variants={itemVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: 'tween' }}
                        $bgImg={makeImagePath(item.backdrop_path, 'w500')}
                      >
                        <Info variants={infoVariants}>
                          <h3>{item.title}</h3>
                        </Info>
                      </Item>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {moviePathMatch && (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                  <Card
                    layoutId={moviePathMatch.params.id}
                    $scrollY={scrollY.get()}
                  >
                    {clickedVideo && (
                      <>
                        <img
                          src={makeImagePath(clickedVideo.backdrop_path)}
                          alt={clickedVideo.original_title}
                        />
                        <Detail>
                          <h4>{clickedVideo.title}</h4>
                          <p>{clickedVideo.overview}</p>
                        </Detail>
                      </>
                    )}
                  </Card>
                </>
              )}
            </AnimatePresence>
          </Visual>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
