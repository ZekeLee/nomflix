import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useMatch, useNavigate } from 'react-router-dom';
import { makeImagePath } from '../utils';

import styled from 'styled-components';
import { IMovie, IMoviesResult, ITvShow, ITvShowsResult } from '../api';

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
    -webkit-line-clamp: 5;
    line-height: 1.2;
    overflow: hidden;
  }
  .genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

interface IPropsData {
  movies?: IMoviesResult[];
  tvShows?: ITvShowsResult[];
  allMovies?: IMovie[];
  allTvShows?: ITvShow[];
  movieGenres?: IGenres;
  tvShowGenres?: IGenres;
}

interface IGenres {
  genres: Genre[];
}

interface Genre {
  id: number;
  name: string;
}

const Modal = ({
  movies,
  tvShows,
  allMovies,
  allTvShows,
  movieGenres,
  tvShowGenres,
}: IPropsData) => {
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
    allMovies?.find(
      (movie: IMovie) => movie.id + '' === moviePathMatch.params.id
    );
  const clickedTvShow =
    tvShowPathMatch?.params.id &&
    allTvShows?.find(
      (tvShow: ITvShow) => tvShow.id + '' === tvShowPathMatch.params.id
    );

  console.log(clickedTvShow);

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
                      <p className="genres">
                        {clickedMovie.genre_ids.map((genre, index) => {
                          const genres = movieGenres?.genres.filter(
                            (i) => i.id === genre
                          );

                          return (
                            <span key={index}>
                              {genres ? genres[0].name : null}
                            </span>
                          );
                        })}
                      </p>
                      <p>
                        Release Date: {clickedMovie.release_date.toString()}
                      </p>
                      <p>Grade: {clickedMovie.vote_average}</p>
                      <p>Vote Count: {clickedMovie.vote_count}</p>
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
                      <p className="genres">
                        {clickedTvShow.genre_ids.map((genre, index) => {
                          const genres = tvShowGenres?.genres.filter(
                            (i) => i.id === genre
                          );

                          return (
                            <span key={index}>
                              {genres ? genres[0].name : null}
                            </span>
                          );
                        })}
                      </p>
                      <p>
                        First Air Date:{' '}
                        {clickedTvShow.first_air_date.toString()}
                      </p>
                      <p>Grade: {clickedTvShow.vote_average}</p>
                      <p>Vote Count: {clickedTvShow.vote_count}</p>
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
