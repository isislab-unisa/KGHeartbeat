import React from 'react';
import QualityBar from '../components/QualityBar';
import ListGroup from 'react-bootstrap/ListGroup';

function QualityData({ selectedKGs }) {

  return(
    <div className="d-flex">
        <QualityBar />
      <div id="selectedKG" className='float-right'>
        <ListGroup>
          {selectedKGs.map((item) => (
            <ListGroup.Item>{item.id}</ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  )
  }
  
  export default QualityData;