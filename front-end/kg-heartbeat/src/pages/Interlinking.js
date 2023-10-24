import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { base_url } from '../api';
import QualityBar from '../components/QualityBar';
import PieChart from '../components/PieChart';
import Table from 'react-bootstrap/esm/Table';

function Interlinking({ selectedKGs }) {
    const [interlinkingData, setInterlinkingData] = useState(null);
    const [amountData, setAmountData] = useState(null);
    const [sameAsChart, setSameAsChart] = useState(null);
    const [otherMetrics, setOtherMet] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}accessibility/interlinking?id=${selectedKGs[0].id}`);
                const response_amount = await axios.get(`${base_url}contextual/amount_of_data?id=${selectedKGs[0].id}`);                
                setInterlinkingData(response.data);
                setAmountData(response_amount.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}accessibility/interlinking`,arrayIDs);
                const response_amount = await axios.get(`${base_url}contextual/amount_of_data?id=${selectedKGs[0].id}`);                
                setInterlinkingData(response.data);
                setAmountData(response_amount.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(interlinkingData){
          let sameAs = '-'
          let num_triples = '-'
          try{
            sameAs = parseInt(interlinkingData[0].Quality_category_array.Interlinking.sameAs)
            num_triples = parseInt(amountData[amountData.length-1].Quality_category_array['Amount of data']['numTriples_merged']);
          } catch (error){
            console.log(error)
          }
          if(selectedKGs.length === 1){
            const series = []
            const data = [{
              name: 'Number of same as chains',
              color:'#90ed7d',
              y: sameAs,
              sliced: true,
              selected: true
            },{
              name : 'Other triples',
              y: num_triples,
              color:'#0090eacc'
            }]
            series.push({name: 'Triples', data : data})
            setSameAsChart(<PieChart series={series} chart_title={'Same As Chains'}/>)
            
            const other_int_metrics = (
              <Table striped bordered hover>
                <tr><th className='cell'>Degree of connection</th><th className='cell'>Clustering coefficient</th><th className='cell'>Centrality</th></tr>
                <tr>
                  <td className='cell'>{interlinkingData[0].Quality_category_array.Interlinking.degreeConnection}</td>
                  <td className='cell'>{interlinkingData[0].Quality_category_array.Interlinking.clustering}</td>
                  <td className='cell'>{interlinkingData[0].Quality_category_array.Interlinking.centrality}</td>
                </tr>
              </Table>
            )
            setOtherMet(other_int_metrics);

          }else if (selectedKGs.length >= 1){
            const interlinking_tab = (
              <Table striped bordered hover>
                <tr>
                  <th className='cell'> KG name</th><th className='cell'>Numer of sameAs chains</th><th className='cell'>Degree of connection</th><th className='cell'>Clustering coefficient</th><th className='cell'>Centrality</th>
                </tr>
                {interlinkingData.map((item) => (
                  <tr>
                    <td className='cell' key={item.kg_id}>{item.kg_name}</td>
                    <td className='cell' >{item.Quality_category_array.Interlinking.sameAs}</td>
                    <td className='cell'>{item.Quality_category_array.Interlinking.degreeConnection}</td>
                    <td className='cell'>{item.Quality_category_array.Interlinking.clustering}</td>
                    <td className='cell'>{item.Quality_category_array.Interlinking.centrality}</td>
                  </tr>
                ))}
              </Table>
            );
          setOtherMet(interlinking_tab)
          }
        }

    }, [amountData,interlinkingData, selectedKGs])


    return(
        <div>
            <div className= "d-flex">
                <QualityBar selectedKGs={selectedKGs} />
                {interlinkingData && (
                    <div className='w-100 p-3'> 
                        {sameAsChart}
                        {otherMetrics}
                  </div> 
                )}
            </div>
        </div>
    )
}

export default Interlinking;