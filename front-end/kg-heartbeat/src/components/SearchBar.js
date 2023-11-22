import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../api';
import Form from 'react-bootstrap/Form';

function SearchBar({onSearch}) {
    const [query, setQuery] = useState('');
    const [toggleSwitchSPARQL, setToggleSwitchSPARQL] = useState(null);

    const handleSearch = async () => {
        try {
            if(!toggleSwitchSPARQL){
                const response = await axios.get(`${base_url}knowledge_graph/search?q=${query}`);
                onSearch(response.data);
            } else {
                console.log('ciao')
                const response = await axios.get(`${base_url}knowledge_graph/search?q=${query}&sparql=online`);
                onSearch(response.data);
            }
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
        <Form.Check
            type="switch"
            id="custom-switch"
            label='Only with SPARQL endpoint online'
            checked={toggleSwitchSPARQL}
            onChange={() => setToggleSwitchSPARQL(!toggleSwitchSPARQL)}
            />
    </div>
    );
}

export default SearchBar;