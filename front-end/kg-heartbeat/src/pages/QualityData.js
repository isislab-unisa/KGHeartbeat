import React from 'react';
import QualityBar from '../components/QualityBar';
import ListGroup from 'react-bootstrap/ListGroup';

function QualityData({ selectedKGs }) {

  return(
    <div className="d-flex">
        <QualityBar selectedKGs={selectedKGs}/>
    </div>
  )
  }
  
  export default QualityData;