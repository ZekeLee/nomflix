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
  height: 100%;
`;

const Item = styled.li`
  display: flex;
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

  console.log(data);

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
              {data.results.map((result: ISearchResult) => (
                <Item key={result.id}>
                  <img
                    src={
                      result.backdrop_path
                        ? makeImagePath(result.backdrop_path, 'w200')
                        : result.poster_path
                        ? makeImagePath(result.poster_path, 'w200')
                        : result.profile_path
                        ? makeImagePath(result.profile_path, 'w200')
                        : ''
                    }
                    alt={result.title || result.name}
                  />

                  <h2>{result.title || result.name}</h2>
                </Item>
              ))}
            </List>
          </Section>
        </Wrapper>
      )}
    </>
  );
};

export default Search;
