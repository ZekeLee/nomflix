import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { IMovie } from '../api';
import { makeImagePath } from '../utils';

import styled from 'styled-components';
import { motion, AnimatePresence, useScroll } from 'framer-motion';

const Slider = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0 -2rem;
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
  cursor: pointer;
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
  border-radius: 5px 5px 0 0;
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

const VideoSlider = ({ movies, tvShows }: any) => {
  const [index, setIndex] = useState(0);
  const [isLeave, setIsLeave] = useState(false);

  console.log(movies, tvShows);

  const navigate = useNavigate();

  const { scrollY } = useScroll();

  const toggleLeave = () => setIsLeave((prev) => !prev);

  const onItemClicked = (videoId: number) => {
    if (movies) {
      navigate(`/movies/${videoId}`);
    }
    if (tvShows) {
      navigate(`/tv/${videoId}`);
    }
  };

  const increaseIndex = () => {
    if (movies) {
      if (isLeave) return;
      toggleLeave();
      const totalVideo = movies?.results.length;
      const maxIndex = Math.floor(totalVideo / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    } else if (tvShows) {
      if (isLeave) return;
      toggleLeave();
      const totalVideo = tvShows?.results.length;
      const maxIndex = Math.floor(totalVideo / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onOverlayClick = () => {
    if (movies) navigate('/');
    if (tvShows) navigate('/tv');
  };

  const moviePathMatch = useMatch('/movies/:id');
  const tvShowPathMatch = useMatch('/tv/:id');

  const clickedMovie =
    moviePathMatch?.params.id &&
    movies?.results.find(
      (movie: IMovie) => movie.id + '' === moviePathMatch.params.id
    );
  const clickedTvShow =
    tvShowPathMatch?.params.id &&
    tvShows?.results.find(
      (movie: IMovie) => movie.id + '' === tvShowPathMatch.params.id
    );

  return (
    <>
      <Slider onClick={increaseIndex}>
        <AnimatePresence initial={false} onExitComplete={toggleLeave}>
          <Row
            key={index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', duration: 1 }}
          >
            {movies
              ? movies?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((item: any) => (
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
                  ))
              : tvShows
              ? tvShows?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((item: any) => (
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
                        <h3>{item.name}</h3>
                      </Info>
                    </Item>
                  ))
              : null}
          </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {movies
          ? moviePathMatch && (
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
                  {clickedMovie && (
                    <>
                      <img
                        src={makeImagePath(clickedMovie.backdrop_path)}
                        alt={clickedMovie.original_title}
                      />
                      <Detail>
                        <h4>{clickedMovie.title}</h4>
                        <p>{clickedMovie.overview}</p>
                      </Detail>
                    </>
                  )}
                </Card>
              </>
            )
          : tvShows
          ? tvShowPathMatch && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <Card
                  layoutId={tvShowPathMatch.params.id}
                  $scrollY={scrollY.get()}
                >
                  {clickedTvShow && (
                    <>
                      <img
                        src={makeImagePath(clickedTvShow.backdrop_path)}
                        alt={clickedTvShow.original_name}
                      />
                      <Detail>
                        <h4>{clickedTvShow.name}</h4>
                        <p>{clickedTvShow.overview}</p>
                      </Detail>
                    </>
                  )}
                </Card>
              </>
            )
          : null}
      </AnimatePresence>
    </>
  );
};

export default VideoSlider;
