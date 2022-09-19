import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { getSearch } from '../api';

import styled from 'styled-components';
import { makeImagePath } from '../utils';

const Wrapper = styled.main`
  height: 100%;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 2rem 2rem 2rem;
  height: 100%;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

const Item = styled.li`
  display: flex;
  gap: 0.5rem;
  img {
    display: block;
    width: 5rem;
  }
`;

interface ISearchResult {
  adult: boolean;
  gender: number;
  backdrop_path: string;
  profile_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword');
  const [searchKeyword, setSearchKeyword] = useState(keyword);

  const { data, isLoading, refetch } = useQuery('searchResult', async () =>
    getSearch(keyword as string)
  );

  useEffect(() => {
    if (keyword !== searchKeyword) {
      setSearchKeyword(keyword);
      refetch();
    }
  }, [keyword, searchKeyword, refetch]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Wrapper>
          <Section>
            <List>
              {data.results.length !== 0
                ? data.results.map((result: ISearchResult) => (
                    <Item key={result.id}>
                      <img
                        src={
                          result.backdrop_path
                            ? makeImagePath(result.backdrop_path, 'w200')
                            : result.poster_path
                            ? makeImagePath(result.poster_path, 'w200')
                            : result.profile_path
                            ? makeImagePath(result.profile_path, 'w200')
                            : 'https://via.placeholder.com/200x113'
                        }
                        alt={result.title || result.name}
                      />
                      <div>
                        <h2>{result.title || result.name}</h2>
                        <span>{result.media_type.toUpperCase()} </span>
                        <span>{result.adult ? '| 19' : null}</span>
                        <p>
                          {result.media_type !== 'person'
                            ? `⭐${result.vote_average} | 🧑‍🤝‍🧑${result.vote_count}`
                            : null}
                        </p>
                      </div>
                    </Item>
                  ))
                : '😭 No search results found.'}
            </List>
          </Section>
        </Wrapper>
      )}
    </>
  );
};

export default Search;
