import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { IMovie, ITvShow } from '../api';
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

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  width: 100%;
  height: 100%;
`;

const Item = styled(motion.div)<{ $bgImg: string }>`
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
  &:nth-child(6) {
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
  left: calc(50% - 22vw);
  width: 40vw;
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
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.2;
    overflow: hidden;
  }
`;

const NextButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 0.5rem;
  width: 1.5rem;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 0 5px 5px 0;
  opacity: 0;
  transition: all 0.3s;
  svg {
    width: 100%;
    height: 100%;
    color: #fff;
  }
  :hover {
    opacity: 1;
  }
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
      (tvShow: ITvShow) => tvShow.id + '' === tvShowPathMatch.params.id
    );

  return (
    <>
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
            <NextButton onClick={increaseIndex}>
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
              </svg>
            </NextButton>
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
                        src={makeImagePath(clickedMovie.backdrop_path, 'w500')}
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
