import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';

function SearchResults({ results, selected, onCheckboxChange }) {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  // Effect to edit the status of chechkbox when the the results is changed
  useEffect(() => {
    setSelectedCheckboxes(selected.map((item) => item.id));
  }, [selected]);

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

  return (
    <Container>
      <Row>
        <Col md="3">
          <div id="selectedKG">
            {selectedCheckboxes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </div>
        </Col>
        <Col md="9">
          {results.map((result) => (
            <div key={result.kg_id}>
              <input
                type="checkbox"
                id={result.kg_id}
                name={result.kg_id}
                value={result.kg_id}
                className="kg_checkbox"
                onChange={() => handleOnChange(result.kg_id)}
                checked={selectedCheckboxes.includes(result.kg_id)}
              />
              <label htmlFor={result.kg_id}>{result.kg_name}</label>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResults;
