import React from 'react';
import QualityBar from '../components/QualityBar';

function QualityData({ selectedKGs }) {

  return(
    <div className="d-flex">
        <QualityBar selectedKGs={selectedKGs}/>
    </div>
  )
  }
  
  export default QualityData;