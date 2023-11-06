import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import CalendarPopup from '../components/CalendatPopup';
import { base_url } from '../api';
import axios from 'axios';
import parseISO from 'date-fns/parseISO';
import { find_target_analysis, get_analysis_date, set_message_availability } from '../utils';
import Table from 'react-bootstrap/esm/Table';

const versatility = 'Versatility';

function Versatility({ selectedKGs } ){
    const [versatilityData, setVersatilityData] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [versatilityTab, setVerstatilityTab] = useState(null);
    
    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}representational/versatility?id=${selectedKGs[0].id}`);
                setVersatilityData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}representational/versatility`,arrayIDs);
                setVersatilityData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(versatilityData){
            setAvailableDate(get_analysis_date(versatilityData));
            if(selectedDate == null)
                setDeafaultDate(parseISO(versatilityData[versatilityData.length-1].analysis_date));
                let analysis_selected;
            if(selectedDate == null || selectedDate === '1970-01-01')
                analysis_selected = find_target_analysis(versatilityData,versatilityData[versatilityData.length-1].analysis_date,selectedKGs);
            else
                analysis_selected = find_target_analysis(versatilityData,selectedDate,selectedKGs); 
            if(selectedKGs.length === 1){
                setToggleSwitch(true);
                set_message_availability(analysis_selected);
                const vers_tab = (
                    <Table striped bordered hover key={selectedDate + 'vers'}>
                        <tr>
                            <th className='cell'>Usage of multiple languages</th><th className='cell'>Different serialization formats</th><th colSpan={2} className='cell'>Accessing of data in different ways</th>
                        </tr>
                        <tr>
                            <td className='cell'></td><td className='cell'></td><td className='cell'>SPARQL endpoint link</td><td className='cell'>RDF dump link</td>
                        </tr>
                        <tr>
                            <td className='cell'>{analysis_selected[0].Quality_category_array[versatility].languages_merged}</td>
                            <td className='cell'>{analysis_selected[0].Quality_category_array[versatility].serializationFormats}</td>
                            <td className='cell'>{analysis_selected[0].Quality_category_array[versatility].sparqlEndpoint}</td>
                            <td className='cell'>{analysis_selected[0].Quality_category_array[versatility].availabilityRDFD_merged}</td>
                        </tr>
                    </Table>
                )
                setVerstatilityTab(vers_tab)
            } else if(selectedKGs.length >= 1){
                setToggleSwitch(true)
                set_message_availability(analysis_selected);
                const vers_tab = (
                    <Table striped bordered hover key={selectedDate + 'vers'}>
                        <tr>
                            <th className='cell'>KG name</th><th className='cell'>Usage of multiple languages</th><th className='cell'>Different serialization formats</th><th colSpan={2} className='cell'>Accessing of data in different ways</th>
                        </tr>
                        <tr>
                            <td className='cell'></td><td className='cell'></td><td className='cell'></td><td className='cell'>SPARQL endpoint link</td><td className='cell'>RDF dump link</td>
                        </tr>
                        {analysis_selected.map((item) =>
                            <tr>
                            <td className='cell'>{item.kg_name}</td>
                            <td className='cell'>{item.Quality_category_array[versatility].languages_merged}</td>
                            <td className='cell'>{item.Quality_category_array[versatility].serializationFormats}</td>
                            <td className='cell'>{item.Quality_category_array[versatility].sparqlEndpoint}</td>
                            <td className='cell'>{item.Quality_category_array[versatility].availabilityRDFD_merged}</td>
                            </tr>
                        )}
                    </Table>
                )
                setVerstatilityTab(vers_tab);

            }
        }
    },[versatilityData, selectedKGs, toggleSwitch, selectedDate]);
    
    const handleDateSelect = (date) => {
        const calendar_date = new Date(date)
        const year = calendar_date.getFullYear();
        const month = (calendar_date.getMonth() + 1).toString().padStart(2,'0');
        const day = calendar_date.getDate().toString().padStart(2,'0');
        const converted_date = `${year}-${month}-${day}`;
        setSelectedDate(converted_date);
    }

    return (
        <div>
        <div className='d-flex'>
            <QualityBar selectedKGs={selectedKGs}/>
                {versatilityData && (
                    <div className='w-100 p-3'>
                        {toggleSwitch ? (
                            <div>
                                <CalendarPopup selectableDates={availableDates} onDateSelect={handleDateSelect} defaultDate={defaultDate}/>
                            </div>
                        ) : (
                            <div>

                            </div>
                        )}
                        {versatilityTab}
                    </div>
                )}
        </div>
    </div>
    )
}

export default Versatility;