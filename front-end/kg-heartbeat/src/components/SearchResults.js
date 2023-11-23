import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import MaterialTable from './MaterialTable';
import RemoveImg from '../img/remove.png'

function SearchResults({ results, selected, onCheckboxChange }) {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [KGsTable,setKGsTable] = useState(null);

  // Effect to edit the status of chechkbox when the the results is changed
  useEffect(() => {
    setSelectedCheckboxes(selected.map((item) => item.id));
  }, [selected]);
  
  useEffect(() => {
    const columns = [
      {
        accessorKey: 'select',
        header: 'Select',
        size: 1,
      },
      {
        accessorKey: 'kgname',
        header: 'KG name',
        size: 100,
      },
      {
        accessorKey: 'website',
        header: 'Website URL',
        size: 100
      },
      {
        accessorKey: 'sparql',
        header: 'SPARQL endpoint link',
        size: 200
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 250
      }
    ]
    const handleOnChange = (kg_id) => {
      const isSelected = selectedCheckboxes.includes(kg_id);
  
      let newSelection;
  
      if (isSelected) {
        newSelection = selectedCheckboxes.filter((item) => item !== kg_id);
      } else {
        newSelection = [...selectedCheckboxes, kg_id];
      }
  
      setSelectedCheckboxes(newSelection);
      onCheckboxChange(newSelection.map((id) => ({ id }))); // Send data to App.js
    };
    console.log(results)
    if(results){
      let data = []
      for(let i = 0; i < results.length; i++){
          const checkbox = (
              <div key={results[i].kg_id}>
              <input
                type="checkbox"
                id={results[i].kg_id}
                name={results[i].kg_id}
                value={results[i].kg_id}
                className="kg_checkbox"
                onChange={() => handleOnChange(results[i].kg_id)}
                checked={selectedCheckboxes.includes(results[i].kg_id)}
              />
            </div>
          )
          let description,url;
          if (results[i].Believability.description.length < 250)
            description = results[i].Believability.description;
          else
          description = '-';
          if(results[i].Believability.URI.includes('http')) 
            url = <a href={results[i].Believability.URI}>{results[i].Believability.URI}</a>
          else
            url = '-'
          let sparql_link = results[i]['Extra']['sparql_link'];
          if (sparql_link === 'nan')
            sparql_link = '-'
          else
            sparql_link = <a href={sparql_link}>{sparql_link}</a>

          const row_data = {
              select: checkbox,
              kgname: results[i].kg_name,
              sparql: sparql_link,
              website: url,
              description: description,
            }
          data.push(row_data)
      }
      if(results)
        setKGsTable(<MaterialTable columns_value={columns} data_table={data}/>)
    }
  },[results,selectedCheckboxes,onCheckboxChange])

  const handleOnChangeRemove = (kg_id) => {
    if(results.length > 0){
    const isSelected = selectedCheckboxes.includes(kg_id);

    let newSelection;

    if (isSelected) {
      newSelection = selectedCheckboxes.filter((item) => item !== kg_id);
    } else {
      newSelection = [...selectedCheckboxes, kg_id];
    }

    setSelectedCheckboxes(newSelection);
    onCheckboxChange(newSelection.map((id) => ({ id }))); // Send data to App.js
  }
  };

  return (
    <Container>
      <Row>
        <Col md="2">
          <div id="selectedKG" className='selectedKGs-tab'>
            {selectedCheckboxes.map((item) => (
              <>
              <input 
                type='image' 
                src={RemoveImg} 
                alt='remove'
                id={item}
                name={item}
                value={item}
                className="kg-del-btn"
                onClick={() => handleOnChangeRemove(item)}
                checked={selectedCheckboxes.includes(item)}
              />
              <span className='btn-text'>{item}</span><br/>
              </>
            ))}
          </div>
        </Col>
        <Col md="10">
          {KGsTable}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResults;
