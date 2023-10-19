import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import LineChart from '../components/LineChart';
import trasform_to_series from '../utils';
import Table from '../components/PersonalTable';

const availability = 'Availability'

function Availability({ selectedKGs }) {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [sparlq_chart,setSparqlChart] = useState(null);
  const [rdfDumpChart,setRDFDumpC] = useState(null);
  const [uriDefChart,setUriDefC] = useState(null);

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
      const sparql_series = trasform_to_series(availabilityData, selectedKGs,availability,'sparqlEndpoint');
      const rdfD_series = trasform_to_series(availabilityData,selectedKGs,availability,'RDFDump_merged');
      //const uridef_series = trasform_to_series(availabilityData,selectedKGs,availability,'')
      if(selectedKGs.length === 1){
        setSparqlChart(<LineChart chart_title={'SPARQL endpoint availability'} series={sparql_series} y_min={-1} y_max={1}/>);
        setRDFDumpC(<LineChart chart_title={'RDF dump availability'} series={rdfD_series} y_min={-1} y_max={1} />);
      }else if (selectedKGs.length >= 1){
        setSparqlChart(<Table series={sparql_series} title={'SPARQL endpoint availability'}/>);
        setRDFDumpC(<Table series={rdfD_series} title={'RDF dump availability'}/>);
      }
    }
  }, [availabilityData, selectedKGs]);

    return(
		<div>
			<div className= "d-flex">
				<QualityBar selectedKGs={selectedKGs}/>
				{availabilityData && (
				<div className='w-100 p-3'> 
          <span id="sparql"></span>
					{sparlq_chart}
          <span id="rdfdump"></span>
          {rdfDumpChart}
				</div>    
		)}
			</div>
    	</div>
	)
}

export default Availability;