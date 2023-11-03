import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import { trasform_history_data } from '../utils';
import Table from 'react-bootstrap/esm/Table';
import ConcisenessChart from '../components/ConcisenessChart';

const currency = 'Currency'

function Currency( {selectedKGs} ){
    const [currencyData, setCurrencyData] = useState(null);
    const [historyChart, setHistoryChart] = useState(null);
    const [currencyTable, setCurrencyTab] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}dataset_dynamicity/currency?id=${selectedKGs[0].id}`);
                setCurrencyData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}dataset_dynamicity/currency`,arrayIDs);
                setCurrencyData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(currencyData){
            console.log(currencyData)
            const series = trasform_history_data(currencyData,selectedKGs);
            if(selectedKGs.length === 1){
                setHistoryChart(<ConcisenessChart chart_title={'Update history'} series={series} y_min={0} y_max={null} y_label={'no. triples'}/>)
                const now = new Date()
                const modification_date = new Date(currencyData[0].Quality_category_array[currency].modificationDate);
                const creation_date = new Date(currencyData[0].Quality_category_array[currency].creationDate);
                let time_sinc_lm = Math.floor((now-modification_date) / (1000 * 60 * 60 * 24));
                let age_of_data = Math.floor((now-creation_date) / (1000 * 60 * 60 * 24))
                if(isNaN(time_sinc_lm))
                    time_sinc_lm = '-'
                if(isNaN(age_of_data))
                    age_of_data = '-'
                const currency_table = (
                    <Table striped bordered hover>
                        <tr>
                            <th className='cell'>Time since last modification (days)</th><th className='cell'>Specification of the modification date of statements</th><th className='cell'>Age of data (days)</th><th className='cell'>Creation date</th>
                        </tr>
                        <tr>
                            <td className='cell'>{time_sinc_lm}</td><td className='cell'>{currencyData[0].Quality_category_array[currency].modificationDate}</td><td className='cell'>{age_of_data}</td><td className='cell'>{currencyData[0].Quality_category_array[currency].modificationDate}</td>
                        </tr>
                    </Table>
                )
                setCurrencyTab(currency_table)
            }else if(selectedKGs.length >= 1){
                const currency_table = (
                    <Table striped bordered hover>
                        <tr>
                            <th className='cell'>KG name</th><th className='cell'>Time since last modification (days)</th><th className='cell'>Specification of the modification date of statements</th><th className='cell'>Age of data (days)</th><th className='cell'>Creation date</th>
                        </tr>
                        {currencyData.map((item) => {
                            const now = new Date();
                            const modification_date = new Date(item.Quality_category_array[currency].modificationDate);
                            const creation_date = new Date(item.Quality_category_array[currency].creationDate);
                            let time_sinc_lm = Math.floor((now-modification_date) / (1000 * 60 * 60 * 24));
                            let age_of_data = Math.floor((now-creation_date) / (1000 * 60 * 60 * 24))
                            if(isNaN(time_sinc_lm))
                                time_sinc_lm = '-'
                            if(isNaN(age_of_data))
                                age_of_data = '-'

                            return (
                                <tr>
                                    <td className='cell'>{item.kg_name}</td><td className='cell'>{time_sinc_lm}</td><td className='cell'>{item.Quality_category_array[currency].modificationDate}</td><td className='cell'>{age_of_data}</td><td className='cell'>{item.Quality_category_array[currency].modificationDate}</td>
                                </tr>
                            )
                        })}
                    </Table>
                )                
                setHistoryChart(<ConcisenessChart chart_title={'Update history'} series={series} y_min={0} y_max={null} y_label={'no. triples'}/>)            
                setCurrencyTab(currency_table)
            }
        }
    }, [currencyData, selectedKGs]);

    return(
        <div>
            <div className='d-flex'>
                <QualityBar selectedKGs={selectedKGs}/>
                {currencyData && (
                    <div className='w-100 p-3'>
                        {historyChart}
                        {currencyTable}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Currency;