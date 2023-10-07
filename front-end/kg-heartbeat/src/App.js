import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import { useState } from 'react';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedKGs, setKG] = useState([]);

  const handle_search = (results) => {
    setSearchResults(results);
  };

  const handleSelectedDataChange = (newKG) => {
    setKG(newKG);
  }

  return (
    <div className="App">
      <h1>KGHeartbeat</h1>
      <SearchBar onSearch={handle_search} />
      <SearchResults results={searchResults} selected={selectedKGs} onChechboxChange={handleSelectedDataChange} />
    </div>
  );
}

export default App;
