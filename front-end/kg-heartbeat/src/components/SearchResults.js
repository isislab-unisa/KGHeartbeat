import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function SearchResults({ results, selected, onChechboxChange }){
  //TODO: Spostare in App per poter passare la selezione ai vari component per i grafici
  
  const handleOnChange = (kg_id) => {
    let found = false
    for(let i = 0; i<selected.length; i++){
      if(selected[i].id === kg_id){
        found = true;
        break;
      }
    }
    if(!found){
      const newSelection = [...selected,{id: kg_id}];
      onChechboxChange(newSelection)
    }else {
      const newSelection = selected.filter(kg => kg.id !== kg_id);
      onChechboxChange(newSelection)
    }
  }

    return (
      <Container>
        <Row>
        <Col md="9">
            {results.map((result) => (
              <div>
                <input type='checkbox' id={result.kg_id} name={result.kg_id} value={result.kg_id} className="kg_checkbox" onChange={() => handleOnChange(result.kg_id)}/>
                <label htmlFor={result.kg_id}>{result.kg_name}</label>
              </div>
          ))} 
          </Col>
            <Col md="3">
              <div id="selectedKG">
                {selected.map(selected => (
                  <li>{selected.id}</li>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      );
}

export default SearchResults;