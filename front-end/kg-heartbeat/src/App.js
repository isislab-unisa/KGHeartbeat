import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import QualityData from './pages/QualityData';
import Search from './pages/Search';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedKGs, setKG] = useState([]);

  const handle_search = (results) => {
    setSearchResults(results);
  };

  const handleSelectedDataChange = (newKG) => {
    setKG(newKG);
  }

  let content;
  if(selectedKGs.length > 0){
    content = <Link to="/pages/QualityData">Vai a About Us</Link>
  }

  console.log(selectedKGs)
  return (
    <Router>
        <Link to="/pages/QualityData">View Quality</Link>
        <Link to="/pages/Search">Search</Link>
        {/* Configura le rotte */}
        <Routes>
          <Route path="/pages/QualityData" component={QualityData} element={<QualityData selectedKGs={selectedKGs}/>}/>
          <Route path="/pages/Search" component={Search} element={<Search searchResults={searchResults} handle_search={handle_search} selectedKGs={selectedKGs} handleSelectedDataChange={handleSelectedDataChange}/>}/>
          {/* Altre rotte se necessario */}
        </Routes>
    </Router>
  );
}

export default App;
