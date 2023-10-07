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

  let content;
  if(selectedKGs.length > 0){
    content = <button>View quality data</button>
  }

  console.log(selectedKGs)
  return (
    <div className="App">
      <h1>KGHeartbeat</h1>
      <SearchBar onSearch={handle_search} />
      {content}
      <SearchResults results={searchResults} selected={selectedKGs} onCheckboxChange={handleSelectedDataChange} />
    </div>
  );
}

export default App;
