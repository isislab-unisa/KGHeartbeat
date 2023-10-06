import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../api';

function SearchBar({onSearch}) {
    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${base_url}knowledge_graph/search?q=${query}`);
            onSearch(response.data);
        } catch (error){
            console.error('Error during the search',error);
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
        handleSearch();
    }

return (
    <div>
        <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
    </div>
    );
}

export default SearchBar;