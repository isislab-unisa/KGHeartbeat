import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

function Search({searchResults, handle_search, selectedKGs, handleSelectedDataChange}){
    
    return(

        <div>
            <div className="App">
            <h2>Search the KGs</h2>
            <SearchBar onSearch={handle_search} />
            <SearchResults results={searchResults} selected={selectedKGs} onCheckboxChange={handleSelectedDataChange} />
            </div>
        </div>
    )
}

export default Search;
