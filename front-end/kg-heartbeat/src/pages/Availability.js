import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import LineChart from '../components/LineChart';
import trasform_to_series from '../utils';
import Table from '../components/PersonalTable';

function Availability({ selectedKGs }) {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [sparlq_chart,setSparqlChart] = useState(null);

  useEffect(() => {
    async function fetchData() {
        try {
          if (selectedKGs.length === 1) {
            const response = await axios.get(`${base_url}accessibility/availability?id=${selectedKGs[0].id}`);
            setAvailabilityData(response.data);
          }
          else if(selectedKGs.length > 1){
            let arrayIDs = selectedKGs.map((item) => item.id);
            arrayIDs = {
              id : arrayIDs
            }
            const response = await axios.post(`${base_url}accessibility/availability`,arrayIDs);
            setAvailabilityData(response.data);
          }
        } catch (error) {
          console.error('Error during the search', error);
        }
    }
    fetchData();
  }, [selectedKGs]);

  useEffect(() => { //everytime that availability data change, we create series and redraw the chart
    if (availabilityData) {
      const series = trasform_to_series(availabilityData, selectedKGs);
      if(selectedKGs.length === 1)
        setSparqlChart(<LineChart chart_title={'SPARQL endpoint availability'} series={series} y_min={-1} y_max={1}/>);
      else if (selectedKGs.length >= 1)
        setSparqlChart(<Table series={series}/>)
    }
  }, [availabilityData, selectedKGs]);

    return(
		<div>
			<div className= "d-flex">
				<QualityBar selectedKGs={selectedKGs}/>
				{availabilityData && (
				<div className='w-100 p-3'> 
					{sparlq_chart}
				</div>    
		)}
			</div>
    	</div>
	)
}

export default Availability;