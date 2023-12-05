import React from 'react';
import QualityBar from '../components/QualityBar';

function QualityData({ selectedKGs, setSelectedKGs}) {

  return(
<div className="d-flex">
    <QualityBar selectedKGs={selectedKGs} setSelectedKG={setSelectedKGs}/>
    <div className='col-md-1'>
    </div>
    <div className="col-md-6 textalign-left mt-4">
        <p className="fs-5">Now from the bar on the left you can view and compare the quality of the KGs you have selected, divided by quality dimensions</p>
        <div id="selectedKG-tab">
        <p id='selectedKGs-text'> Knowledge Graphs selected</p>
        <ul>
          {selectedKGs.map((item) => {
            return(
              <li className="fs-5">{item.id && item.id.includes('|') ? item.id.split('|')[1] : item.id}</li>
            )
        })}
        </ul>
      </div>
    </div>
      </div>
  )
  }
  
  export default QualityData;