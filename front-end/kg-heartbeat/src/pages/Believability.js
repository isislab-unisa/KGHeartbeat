import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import Table from 'react-bootstrap/esm/Table';

const believability = 'Believability';

function Believability({ selectedKGs, setSelectedKGs}){
    const [believabilityData, setBelievabilityData] = useState(null);
    const [believabilityChart, setBelievabilityChart] = useState(null); 

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}trust/believability?id=${selectedKGs[0].id}`);
                setBelievabilityData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}trust/believability`,arrayIDs);
                setBelievabilityData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(believabilityData){
            if(selectedKGs.length === 1){
                const believability_metrics = believabilityData[0].Quality_category_array[believability]
                const believability_table = (
                    <Table striped bordered hover>
                        <tr>
                            <th className='cell'>Title</th><th className='cell'>URI</th><th className='cell'>Reliable provider</th><th className='cell'>Trust value</th><th className='cell'>Description</th>
                        </tr>
                        <tr>
                            <td className='cell'>{believability_metrics.title}</td><td className='cell'>{believability_metrics.URI}</td><td className='cell'>{believability_metrics.reliableProvider}</td><td className='cell'>{believability_metrics.trustValue}</td><td className='cell'>{believability_metrics.description}</td>
                        </tr>
                    </Table>
                )   
                setBelievabilityChart(believability_table)
            }else if(selectedKGs.length >= 1){
                const believability_table = (
                    <Table striped bordered hover>
                        <tr>
                            <th className='cell'>Title</th><th className='cell'>URI</th><th className='cell'>Reliable provider</th><th className='cell'>Trust value</th><th className='cell'>Description</th>
                        </tr>
                        {believabilityData.map((item) => 
                            <tr>
                                <td className='cell'>{item.Quality_category_array[believability].title}</td><td className='cell'>{item.Quality_category_array[believability].URI}</td><td className='cell'>{item.Quality_category_array[believability].reliableProvider}</td><td className='cell'>{item.Quality_category_array[believability].trustValue}</td><td className='cell'>{item.Quality_category_array[believability].description}</td>
                            </tr>
                        )}
                    </Table>
                )
                setBelievabilityChart(believability_table)
            }   
        }
    }, [believabilityData, selectedKGs])


    return (
        <div className='d-flex'>
            <QualityBar selectedKGs={selectedKGs} setSelectedKG={setSelectedKGs}/>
                {believabilityData && (
                    <div className='w-100 p-3'>
                        {believabilityChart}
                        <Table striped bordered hover>
                            <tr>
                                <th className='cell'>List of trusted providers</th>
                            </tr>
                            <tr><td className='cell'>Wikipedia</td></tr>
                            <tr><td className='cell'>Government</td></tr>
                            <tr><td className='cell'>Bioportal</td></tr>
                            <tr><td className='cell'>Bio2RDF</td></tr>
                            <tr><td className='cell'>Academic</td></tr>
                        </Table>
                    </div>
                )}
        </div>
    )
}

export default Believability;