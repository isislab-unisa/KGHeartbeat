import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';

const licensing = 'Licensing'

function Licensing({ selectedKGs }) {
    const [licensingData, setLicensingData] = useState(null);
    const [licensingTable, setLicensingTable] = useState(null);

  useEffect(() => {
    async function fetchData() {
        try {
          if (selectedKGs.length === 1) {
            const response = await axios.get(`${base_url}accessibility/licensing?id=${selectedKGs[0].id}`);
            setLicensingData(response.data);
          }
          else if(selectedKGs.length > 1){
            let arrayIDs = selectedKGs.map((item) => item.id);
            arrayIDs = {
              id : arrayIDs
            }
            const response = await axios.post(`${base_url}accessibility/licensing`,arrayIDs);
            setLicensingData(response.data);
          }
        } catch (error) {
          console.error('Error during the search', error);
        }
    }
    fetchData();
  }, [selectedKGs]);

  useEffect(() => { //everytime that availability data change, we create series and redraw the chart
    if (licensingData) {
      if(selectedKGs.length === 1){
        
      }else if (selectedKGs.length >= 1){

      }
    }
  }, [licensingData, selectedKGs]);

    return(
		<div>
			<div className= "d-flex">
				<QualityBar selectedKGs={selectedKGs}/>
				{licensingData && (
				<div className='w-100 p-3'> 
          <span id="licensing"></span>
					{licensingTable}
				</div>    
		)}
			</div>
    	</div>
	)
}

export default Licensing;