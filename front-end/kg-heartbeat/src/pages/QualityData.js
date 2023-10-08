import React from 'react';

function QualityData({ selectedKGs }) {
  console.log(selectedKGs)

  return(
    <div id="selectedKG">
      {selectedKGs.map((item) => (
        <li key={item.id}>{item.id}</li>
      ))}
    </div>
  )
  }
  
  export default QualityData;