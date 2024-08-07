import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import {compact_string_temporal_data, compact_temporal_data, trasform_to_series, trasform_to_series_sparql_av} from '../utils';
import Table from '../components/PersonalTable';
import TableBoot from 'react-bootstrap/Table';
import SPARQLAvailabilityChart from '../components/AvailabilityChart';
import RDFDumpAvChart from '../components/RDFDumpAvChart';
import LineChart from '../components/LineChart';

const availability = 'Availability'

function Availability({ selectedKGs, setSelectedKGs}) {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [sparlq_chart,setSparqlChart] = useState(null);
  const [rdfDumpChart,setRDFDumpC] = useState(null);
  const [inactiveTab,setInactiveTab] = useState(null);
  const [uriDefChart,setDefChart] = useState(null);
  const [analysisDate, setAnalysisDate] = useState(null);

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
            const response2 = await axios.get(`${base_url}knowledge_graph/get_analysis_date`);
            setAvailabilityData(response.data);
            setAnalysisDate(response2.data);
          }
        } catch (error) {
          console.error('Error during the search', error);
        }
    }
    fetchData();
  }, [selectedKGs]);

  useEffect(() => { //everytime that availability data change, we create series and redraw the chart
    if (availabilityData) {
      const sparql_series = trasform_to_series_sparql_av(availabilityData, selectedKGs,availability,'sparqlEndpoint');
      const rdfD_series = trasform_to_series_sparql_av(availabilityData,selectedKGs,availability,'RDFDumpM');
      const uridef_series = trasform_to_series(availabilityData,selectedKGs,availability,'uriDef');
      if(selectedKGs.length === 1){
        setSparqlChart(<SPARQLAvailabilityChart chart_title={'SPARQL endpoint availability'} series={sparql_series} y_min={-1} y_max={1}/>);
        setRDFDumpC(<RDFDumpAvChart chart_title={'RDF dump availability'} series={rdfD_series} y_min={-1} y_max={1} />);
        setDefChart(<LineChart chart_title={'URIs Deferenceability'} series={uridef_series} y_min={0} y_max={1}/>);
        const inactive_tab = (
          <TableBoot striped bordered hover>
            <tr><th>Inactive links</th></tr>
            <tr>
              <td className='cell'>{availabilityData[0].Quality_category_array.Availability.inactiveLinks}</td>
            </tr>
          </TableBoot>
        );
        setInactiveTab(inactive_tab);
      }else if (selectedKGs.length >= 1){
        console.log(analysisDate)
        setSparqlChart(<Table series={sparql_series} title={'SPARQL endpoint availability'} analysis_date={analysisDate}/>);
        setRDFDumpC(<Table series={rdfD_series} title={'RDF dump availability'} analysis_date={analysisDate}/>);
        const inactive_l_series = compact_string_temporal_data(availabilityData,selectedKGs,availability,'inactiveLinks')
        const def_value_series = compact_temporal_data(availabilityData,selectedKGs,availability,'uriDef')
        const inactive_tab = (
          <TableBoot striped bordered hover >
            <tr>
              <th>KG name</th><th>Inactive links</th>
            </tr>
            {inactive_l_series.map((item) => (
              <tr>
                <td className='cell' key={item.kg_id} style={{fontSize: '18px'}}>{item.name}</td>
                <td className='cell' style={{fontSize: '18px'}}>{item.data[item.data.length -1][1]}</td>
              </tr>
            ))}
          </TableBoot>
        );
        setInactiveTab(inactive_tab);
        const uri_def_tab = (
          <TableBoot striped bordered hover >
            <tr>
              <th>KG name</th><th>URIs Deferenceability</th>
            </tr>
            {def_value_series.map((item) => (
              <tr>
                <td className='cell' key={item.kg_id} style={{fontSize: '18px'}}>{item.name}</td>
                <td className='cell' style={{fontSize: '18px'}}>{item.data.length > 0 ? item.data[item.data.length -1][1] : '-'}</td>
              </tr>
            ))}
          </TableBoot>
        )
        setDefChart(uri_def_tab)
      }
    }
  }, [availabilityData, selectedKGs, analysisDate]);

    return(
		<div>
			<div className= "d-flex">
				<QualityBar selectedKGs={selectedKGs} setSelectedKG={setSelectedKGs}/>
				{availabilityData && (
				<div className='w-100 p-3'> 
					{sparlq_chart}
          {rdfDumpChart}
          {uriDefChart}
          {inactiveTab}
				</div>    
		)}
			</div>
    </div>
	)
}

export default Availability;