import React from 'react';

function SearchResults({ results }){
    return (
        <ul>
          {results.map((result) => (
            <li key={result.kg_id}>{result.kg_name}</li>
            // Mostra altri campi del risultato se necessario
          ))}
        </ul>
      );
}

export default SearchResults;