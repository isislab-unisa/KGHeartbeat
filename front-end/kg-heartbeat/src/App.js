import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import QualityData from './pages/QualityData';

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
      <div>
        <div className="App">
        <h1>KGHeartbeat</h1>
        <SearchBar onSearch={handle_search} />
        {content}
        <SearchResults results={searchResults} selected={selectedKGs} onCheckboxChange={handleSelectedDataChange} />
      </div>
        <Link to="/pages/QualityData" target='_blank'>Vai a About Us</Link>
        {/* Configura le rotte */}
        <Routes>
          <Route path="/pages/QualityData" component={QualityData} element={<QualityData selectedKGs={selectedKGs}/>}/>
          {/* Altre rotte se necessario */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
