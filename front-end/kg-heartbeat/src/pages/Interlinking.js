import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { base_url } from '../api';
import QualityBar from '../components/QualityBar';

function Interlinking({ selectedKGs }) {
    const [interlinkingData, setInterlinkingData] = useState(null);
    const [doCGraph, setDoCGraph] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}accessibility/interlinking?id=${selectedKGs[0].id}`);
                setInterlinkingData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}accessibility/interlinking`,arrayIDs);
                setInterlinkingData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        console.log(interlinkingData)
    }, [interlinkingData, selectedKGs])


    return(
        <div>
            <div className= "d-flex">
                <QualityBar selectedKGs={selectedKGs} />
                {interlinkingData && (
                    <div className='w-100 p-3'> 
                        {}
                  </div> 
                )}
            </div>
        </div>
    )
}

export default Interlinking;