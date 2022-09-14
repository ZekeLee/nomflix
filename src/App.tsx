import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Movies from './routes/Movies';
import Search from './routes/Search';
import Tv from './routes/TvShows';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Movies />}></Route>
        <Route path="/movies/:id" element={<Movies />}></Route>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/tv/:id" element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
