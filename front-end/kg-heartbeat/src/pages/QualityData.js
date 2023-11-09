import React from 'react';
import QualityBar from '../components/QualityBar';

function QualityData({ selectedKGs, setSelectedKGs}) {

  return(
    <div className="d-flex">
        <QualityBar selectedKGs={selectedKGs} setSelectedKG={setSelectedKGs}/>
    </div>
  )
  }
  
  export default QualityData;