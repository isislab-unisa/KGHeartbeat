import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import ListGroup from 'react-bootstrap/ListGroup';
import { base_url } from '../api';
import axios from 'axios';

function Availability({ selectedKGs }) {
  const [availabilityData, setAvailabilityData] = useState(null);

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

    return(
        <div className="d-flex">
        <QualityBar />
        {availabilityData && (
        <div>
          <h2>Availability Data</h2>
          <pre>{JSON.stringify(availabilityData, null, 2)}</pre>
        </div>
      )}
      <div id="selectedKG" className='float-right'>
        <ListGroup>
          <ListGroup.Item><b>KG selected</b></ListGroup.Item>
          {selectedKGs.map((item) => (
            <ListGroup.Item key={item.id}>{item.id}</ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
    )
}

export default Availability;