import React, { useState } from 'react';

function SearchResults({ results }){
  const [selected, setKG] = useState([]);

  const handleOnChange = (kg_id) => {
    let found = false
    for(let i = 0; i<selected.length; i++){
      if(selected[i].id === kg_id){
        found = true;
        break;
      }
    }
    console.log(selected)
    if(!found){
      setKG([
        ...selected,
        {id: kg_id}
      ]);
    }else {
      setKG(
        selected.filter(kg => kg.id !== kg_id)
      );
    }
  }

    return (
        <div>
          {results.map((result) => (
            <div>
              <input type='checkbox' id={result.kg_id} name={result.kg_id} value={result.kg_id} className="kg_checkbox" onChange={() => handleOnChange(result.kg_id)}/>
              <label htmlFor={result.kg_id}>{result.kg_name}</label>
            </div>
        ))}
            <div>
              {selected.map(selected => (
                <li>{selected.id}</li>
              ))}
            </div>
        </div>
      );
}

export default SearchResults;