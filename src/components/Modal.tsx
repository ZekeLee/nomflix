import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useMatch, useNavigate } from 'react-router-dom';
import { makeImagePath } from '../utils';

import styled from 'styled-components';
import { IMovie, ITvShow } from '../api';

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

const Modal = ({ movies, tvShows, allMovies, allTvShows }: any) => {
  const { scrollY } = useScroll();

  const navigate = useNavigate();

  const onOverlayClick = () => {
    if (movies) navigate('/');
    if (tvShows) navigate('/tv');
  };

  const moviePathMatch = useMatch('/movies/:id');
  const tvShowPathMatch = useMatch('/tv/:id');

  const clickedMovie =
    moviePathMatch?.params.id &&
    allMovies.find(
      (movie: IMovie) => movie.id + '' === moviePathMatch.params.id
    );
  const clickedTvShow =
    tvShowPathMatch?.params.id &&
    allTvShows.find(
      (tvShow: ITvShow) => tvShow.id + '' === tvShowPathMatch.params.id
    );

  console.log(clickedMovie);

  return (
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
  );
};

export default Modal;
