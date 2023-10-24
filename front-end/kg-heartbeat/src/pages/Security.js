import React, { useEffect, useState } from 'react';
import { base_url } from '../api';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import QualityBar from '../components/QualityBar';

const security = 'Security';

function Security({ selectedKGs }){
    const [secuirityData, setSecurityData] = useState(null);
    const [securityTable, setSecurityTab] = useState(null);
    
    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}accessibility/security?id=${selectedKGs[0].id}`);
                setSecurityData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}accessibility/security`,arrayIDs);
                setSecurityData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(secuirityData){
            console.log(secuirityData)
            if(selectedKGs.length === 1){
                const security_tab = (
                    <Table>
                        <tr>
                            <th className='cell' key={secuirityData[0].kg_id}>Use of login credentials</th><th className='cell'>HTTPS support</th>
                        </tr>
                        <tr>
                            <td className='cell'>{secuirityData[0].Quality_category_array.Security.requiresAuth}</td>
                            <td className='cell'>{secuirityData[0].Quality_category_array.Security.useHTTPS}</td>
                        </tr>
                    </Table>
                );
                setSecurityTab(security_tab)
            }else if(selectedKGs.length >= 1){
                const secuirity_tab = (
                    <Table striped bordered hover>
                        <tr>
                            <th className='cell'>KG name</th><th className='cell'>Use of login credentials</th><th className='cell'>HTTPS support</th>
                        </tr>
                        {secuirityData.map((item) => (
                            <tr>
                                <td className='cell'>{item.kg_name}</td>
                                <td className='cell'>{item.Quality_category_array.Security.requiresAuth}</td>
                                <td className='cell'>{item.Quality_category_array.Security.useHTTPS}</td>
                            </tr>
                        ))}
                    </Table>
                );
                setSecurityTab(secuirity_tab)
            }
        }
    }, [secuirityData, selectedKGs])

    return(
        <div>
            <div className='d-flex'>
                <QualityBar selectedKGs={selectedKGs}/>
                {secuirityData && (
                    <div className='w-100 p-3'>
                        {securityTable}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Security;