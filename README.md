# 🎬 Nomflix(clone Netflix)

## 📌 Deploy URL

- [https://zekelee.github.io/nomflix/](https://zekelee.github.io/nomflix/)

## 📌 Skills

- React(CRA with TypeScript), react-router-dom@6, recoil, react-query, react-hook-form, styled-components, framer-motion, API - [TheMovieDB API](https://www.themoviedb.org/settings/api?language=ko), gh-pages

## 📌 Page Directory

- `/movie`: 영화 페이지
- `/movie/:id`: 영화 상세 페이지
- `/tv`: TV 쇼 페이지
- `/tv/:id`: TV 쇼 상세 페이지
- `/search/:keyword`: 검색 결과 페이지

## 📌 File Path

```bash
├── public                     Static Files
│
└── src
    ├── api
    │   └── index.ts           API functions
    ├── components
    │   └── Header.tsx         Header Component
    ├── routes
    │   ├── Movies.tsx         Movies Page
    │   ├── Search.tsx         Search Result Page
    │   └── TvShows.tsx        TV Shows Page
    ├── styles
    │   ├── GlobalStyle.tsx    Global Style Component
    │   ├── style.d.ts         styled-components module file
    │   └── theme.ts           styled-components theme file
    ├── utils
    │   └── index.ts           Util functions
    ├── App.tsx                App Component
    └── index.tsx
```
