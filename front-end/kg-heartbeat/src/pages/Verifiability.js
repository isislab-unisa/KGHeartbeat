import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import Table from 'react-bootstrap/esm/Table';
import CalendarPopup from '../components/CalendatPopup';
import { find_target_analysis, get_analysis_date} from '../utils';
import parseISO from 'date-fns/parseISO';

const verifiability = 'Verifiability'

function Verifiability({ selectedKGs, setSelectedKGs}){
    const [verifiabilityData, setVerifiabilityData] = useState(null);
    const [verifiabilityChart, setVerifiabilityChart] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}trust/verifiability?id=${selectedKGs[0].id}`);
                setVerifiabilityData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}trust/verifiability`,arrayIDs);
                setVerifiabilityData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(verifiabilityData){
            setAvailableDate(get_analysis_date(verifiabilityData)) //set the analysis date available
            if(selectedDate === null)
                setDeafaultDate(parseISO(verifiabilityData[verifiabilityData.length-1].analysis_date))
            let analysis_selected;
            if(selectedDate == null || selectedDate === '1970-01-01')
                analysis_selected = find_target_analysis(verifiabilityData,verifiabilityData[verifiabilityData.length-1].analysis_date,selectedKGs);
            else
                analysis_selected = find_target_analysis(verifiabilityData,selectedDate,selectedKGs); 
            if(selectedKGs.length === 1){
                const verifiability_table = (
                    <Table striped bordered hover key={selectedDate + 'verifiability'}>
                        <tr>
                            <th colSpan={4} className='cell'>Verifying publisher information</th><th className='cell'>Verifying authenticity of the dataset</th><th className='cell'>Verifying usage of digital signatures</th>
                        </tr>
                        <tr>
                            <th className='cell'>Author</th><th className='cell'>Contributors</th><th className='cell'>Publishers</th><th className='cell'>Sources</th><th className='cell'>Vocabularies used</th><th className='cell'>Signed</th>
                        </tr>
                        <tr>
                            <td className='cell'>{analysis_selected[0].Quality_category_array[verifiability].authorM}</td><td className='cell'>{analysis_selected[0].Quality_category_array[verifiability].contributor}</td>
                            <td className='cell'>{analysis_selected[0].Quality_category_array[verifiability].publisher}</td><td className='cell'>{analysis_selected[0].Quality_category_array[verifiability].sources}</td>
                            <td className='cell'>{analysis_selected[0].Quality_category_array[verifiability].vocabularies}</td><td className='cell'>{analysis_selected[0].Quality_category_array[verifiability].sign}</td>
                        </tr>
                    </Table>
                )
                setVerifiabilityChart(verifiability_table)
            }else if(selectedKGs.length >= 1){
                console.log(analysis_selected)
                const verifiability_table = (
                    <Table striped bordered hover key={selectedDate + 'verifiability'}>
                        <tr>
                            <th className='cell'>KG name</th><th colSpan={4} className='cell'>Verifying publisher information</th><th className='cell'>Verifying authenticity of the dataset</th><th className='cell'>Verifying usage of digital signatures</th>
                        </tr>
                        <tr>
                            <th className='cell'></th><th className='cell'>Author</th><th className='cell'>Contributors</th><th className='cell'>Publishers</th><th className='cell'>Sources</th><th className='cell'>Vocabularies used</th><th className='cell'>Signed</th>
                        </tr>
                        {analysis_selected.map((item) => 
                        <tr>
                            <td className='cell'>{item.kg_name}</td>
                            <td className='cell'>{item.Quality_category_array[verifiability].authorM}</td><td className='cell'>{item.Quality_category_array[verifiability].contributor}</td>
                            <td className='cell'>{item.Quality_category_array[verifiability].publisher}</td><td className='cell'>{item.Quality_category_array[verifiability].sources}</td>
                            <td className='cell'>{item.Quality_category_array[verifiability].vocabularies}</td><td className='cell'>{item.Quality_category_array[verifiability].sign}</td>
                        </tr>
                        )}
                    </Table>
                )
                setVerifiabilityChart(verifiability_table)
            }
        }
    }, [verifiabilityData, selectedKGs,selectedDate])

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
                <QualityBar selectedKGs={selectedKGs} setSelectedKG={setSelectedKGs}/>
                {verifiabilityData && (
                    <div className='w-100 p-3'>
                        <div>
                            <CalendarPopup selectableDates={availableDates} onDateSelect={handleDateSelect} defaultDate={defaultDate}/>
                        </div>
                        {verifiabilityChart}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Verifiability;