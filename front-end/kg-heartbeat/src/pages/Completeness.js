import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import CalendarPopup from '../components/CalendatPopup';
import { base_url } from '../api';
import axios from 'axios';
import {  parseISO } from "https://cdn.skypack.dev/date-fns@2.28.0";
import Table from 'react-bootstrap/esm/Table';
import { find_target_analysis, get_analysis_date, trasform_to_series_conc, trasform_to_series_compl} from '../utils';
import LineChart from '../components/LineChart';
import ConcisenessChart from '../components/ConcisenessChart';

const completeness = 'Completeness'

function Completeness ( {selectedKGs} ){
    const [completenessData, setCompletenessData] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [completenessChart, setCompletenessChart] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}contextual/completeness?id=${selectedKGs[0].id}`);
                setCompletenessData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}contextual/completeness`,arrayIDs);
                setCompletenessData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    
    useEffect(() => {
        if(completenessData){
            setAvailableDate(get_analysis_date(completenessData));
            if(selectedDate == null)
                setDeafaultDate(parseISO(completenessData[completenessData.length-1].analysis_date));
            if(selectedKGs.length === 1){
                if(!toggleSwitch){
                    const series = trasform_to_series_conc(completenessData,selectedKGs,completeness,'interlinkingC','Interlinking completeness',)
                    setCompletenessChart(<LineChart chart_title={'Interlinking completeness'} series={series} y_min={0} y_max={1}/>)
                }else{
                    let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(completenessData, completenessData[completenessData.length - 1].analysis_date,selectedKGs);
                    else    
                        analysis_selected = find_target_analysis(completenessData,selectedDate,selectedKGs);
                    const completeness_table = (
                        <Table striped bordered hover key={selectedDate + 'completeness'}>
                            <tr>
                                <th className='cell'>Interlinking completeness</th><th className='cell'>Number of triples</th><th className='cell'>Number of triples linked</th>
                            </tr>
                            <tr>
                                <td className='cell'>{analysis_selected[0].Quality_category_array[completeness].interlinkingC}</td>
                                <td className='cell'>{analysis_selected[0].Quality_category_array[completeness].numTriples}</td>
                                <td className='cell'>{analysis_selected[0].Quality_category_array[completeness].numTriplesL}</td>
                            </tr>
                        </Table>
                    )
                    setCompletenessChart(completeness_table)
                }   
            }else if(selectedKGs.length >= 1){
                if(!toggleSwitch){
                    const series = trasform_to_series_compl(completenessData,selectedKGs,completeness,'interlinkingC');
                    setCompletenessChart(<ConcisenessChart chart_title={'Interlinking Completeness'} series={series} y_min={0} y_max={1}/>)
                }else{
                    let analysis_selected;
                    if(selectedDate === null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(completenessData,completenessData[completenessData.length-1].analysis_date,selectedKGs);
                    else
                        analysis_selected = find_target_analysis(completenessData,selectedDate,selectedKGs);

                    const completeness_table = (
                        <Table striped bordered hover key={selectedDate + 'completeness'}>
                            <tr>
                                <th className='cell'>KG name</th><th className='cell'>Interlinking completeness</th><th className='cell'>Number of triples</th><th className='cell'>Number of truples linked</th>
                            </tr>
                            {analysis_selected.map((item) =>
                                <tr>
                                    <td className='cell'>{item.kg_name}</td><td className='cell'>{item.Quality_category_array[completeness].interlinkingC}</td><td className='cell'>{item.Quality_category_array[completeness].numTriples}</td><td className='cell'>{item.Quality_category_array[completeness].numTriplesL}</td>
                                </tr>
                            )}
                        </Table>
                    )
                    setCompletenessChart(completeness_table)
                }
            }
        }
    },[completenessData, selectedKGs,toggleSwitch, selectedDate])

    const handleDateSelect = (date) => {
        const calendar_date = new Date(date)
        const year = calendar_date.getFullYear();
        const month = (calendar_date.getMonth() + 1).toString().padStart(2,'0');
        const day = calendar_date.getDate().toString().padStart(2,'0');
        const converted_date = `${year}-${month}-${day}`;
        setSelectedDate(converted_date);
    }

    return (
        <div className='d-flex'>
                <QualityBar selectedKGs={selectedKGs}/>
                    {completenessData && (
                        <div className='w-100 p-3'>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label='Switch to chage view'
                                checked={toggleSwitch}
                                onChange={() => setToggleSwitch(!toggleSwitch)}
                                />
                            {toggleSwitch ? (
                                <div>
                                    <CalendarPopup selectableDates={availableDates} onDateSelect={handleDateSelect} defaultDate={defaultDate}/>
                                </div>
                            ) : (
                                <div>
 
                                </div>
                            )}
                            {completenessChart}
                            {}
                        </div>
                    )}
            </div>
    )
}

export default Completeness;