import logo from './logo.svg';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import { useState } from 'react';

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const handle_search = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="App">
      <h1>KGHearthbeat</h1>
      <SearchBar onSearch={handle_search} />
      <SearchResults results={searchResults} />
    </div>
  );
}

export default App;
