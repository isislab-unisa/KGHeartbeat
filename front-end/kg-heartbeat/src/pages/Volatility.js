import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import Table from 'react-bootstrap/esm/Table';
import CalendarPopup from '../components/CalendatPopup';
import { find_target_analysis, get_analysis_date} from '../utils';
import parseISO from 'date-fns/parseISO';

const volatility = 'Volatility';

function Volatility({ selectedKGs }){
    const [volatilityData, setVolatilityData] = useState(null);
    const [volatilityTable, setVolatilityTable] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}dataset_dynamicity/volatility?id=${selectedKGs[0].id}`);
                setVolatilityData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}dataset_dynamicity/volatility`,arrayIDs);
                setVolatilityData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);
    
    useEffect(() => {
        if(volatilityData){
            setAvailableDate(get_analysis_date(volatilityData)) //set the analysis date available
            if(selectedDate === null)
                setDeafaultDate(parseISO(volatilityData[volatilityData.length-1].analysis_date))
            let analysis_selected;
            if(selectedDate == null || selectedDate === '1970-01-01')
                analysis_selected = find_target_analysis(volatilityData,volatilityData[volatilityData.length-1].analysis_date,selectedKGs);
            else
                analysis_selected = find_target_analysis(volatilityData,selectedDate,selectedKGs); 

            if(selectedKGs.length === 1){
                const volatility_table = (
                    <Table striped bordered hover key={selectedDate + 'volatility'}>
                        <tr>
                            <th className='cell'>Timeliness frequency</th>
                        </tr>
                        <tr>
                            <td className='cell'>{analysis_selected[0].Quality_category_array[volatility].frequency}</td>
                        </tr>
                    </Table>
                )
                setVolatilityTable(volatility_table)
            } else if(selectedKGs.length >= 1){
                const volatility_table = (
                    <Table striped bordered hover key={selectedDate + 'volatility'}>
                        <tr>
                            <th className='cell'>KG name</th><th className='cell'>Timeliness frequency</th>
                        </tr>
                        {analysis_selected.map((item) => (
                            <tr>
                                <td className='cell'>{item.kg_name}</td><td className='cell'>{item.Quality_category_array[volatility].frequency}</td>
                            </tr>
                        ))}
                    </Table>
                )
                setVolatilityTable(volatility_table)
            }
        }
    }, [volatilityData, selectedKGs, selectedDate])

    const handleDateSelect = (date) => {
        const calendar_date = new Date(date)
        const year = calendar_date.getFullYear();
        const month = (calendar_date.getMonth() + 1).toString().padStart(2,'0');
        const day = calendar_date.getDate().toString().padStart(2,'0');
        const converted_date = `${year}-${month}-${day}`;
        setSelectedDate(converted_date);
    }

    return(
        <div>
            <div className='d-flex'>
                <QualityBar selectedKGs={selectedKGs}/>
                {volatilityData && (
                    <div className='w-100 p-3'>
                        <div>
                            <CalendarPopup selectableDates={availableDates} onDateSelect={handleDateSelect} defaultDate={defaultDate}/>
                        </div>
                        {volatilityTable}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Volatility;