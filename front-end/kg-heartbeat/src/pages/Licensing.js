import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

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
        const licensing_metrics = licensingData[0].Quality_category_array.Licensing;
        const license_table = (
          <Table striped bordered hover>
            <tr><th className='cell'>License in the metadata</th><th className='cell'>License in the KG</th><th className='cell'>Human-redeable license</th></tr>
            <tr>
              <td className='cell'>{licensing_metrics.licenseMetadata}</td><td className='cell'>{licensing_metrics.licenseQuery}</td><td className='cell'>{licensing_metrics.licenseHR}</td>
            </tr>
          </Table>
        );
        setLicensingTable(license_table)
      }else if (selectedKGs.length >= 1){
        console.log(licensingData)
        const license_table = (
          <Table striped bordered hover>
            <tr>
              <th>KG name</th><th>License in the metadata</th><th>License in the KG</th><th>Human-redeable license</th>
            </tr>
            {licensingData.map((item) => (
              <tr>
                <td className='cell' style={{fontSize: '18px'}}>{item.kg_name}</td>
                <td key={item.kg_id}>{item.Quality_category_array.Licensing.licenseMetadata}</td><td>{item.Quality_category_array.Licensing.licenseQuery}</td><td>{item.Quality_category_array.Licensing.licenseHR}</td>
              </tr>
            ))}
          </Table>
        );
        setLicensingTable(license_table)
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