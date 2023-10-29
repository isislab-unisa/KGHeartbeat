import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import CalendarPopup from '../components/CalendatPopup';
import { base_url } from '../api';
import axios from 'axios';
import { find_target_analysis, get_analysis_date, series_for_polar_chart, trasform_to_series, trasform_to_series_stacked } from '../utils';
import {  parseISO } from "https://cdn.skypack.dev/date-fns@2.28.0";
import LineChartAccuracy from '../components/LineChartAccuracy';
import PolarChart from '../components/PolarChart';
import Table from 'react-bootstrap/esm/Table';

const consistency = 'Consistency'

function Consistency({ selectedKGs }){
    const [consistencyData, setConsistencyData] = useState(null);
    const [consistencyChart, setConsistencyChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [consistencyTable, setConsistencyTable] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}intrinsic/consistency?id=${selectedKGs[0].id}`);
                setConsistencyData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}intrinsic/consistency`,arrayIDs);
                setConsistencyData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(consistencyData){
            setAvailableDate(get_analysis_date(consistencyData));
            if(selectedDate == null)
                setDeafaultDate(parseISO(consistencyData[consistencyData.length-1].analysis_date));
            if(selectedKGs.length === 1){
                if(!toggleSwitch){
                    const deprecated_series = trasform_to_series(consistencyData,selectedKGs,consistency,'deprecated','Use of deprecated classes or properties');
                    const misplacedC_series = trasform_to_series(consistencyData,selectedKGs,consistency,'triplesMC','Misplaced classes');
                    const misplacedP_series = trasform_to_series(consistencyData,selectedKGs,consistency,'triplesMP','Misplaced properties');
                    const undefinedC_series = trasform_to_series(consistencyData,selectedKGs,consistency,'undefinedClass','Invalid usage of undefined classes');
                    const undefinedP_series = trasform_to_series(consistencyData,selectedKGs,consistency,'undefinedProperties','Invalid usage of undefined properties');
                    delete deprecated_series[0].id;
                    delete misplacedC_series[0].id;
                    delete misplacedP_series[0].id;
                    const series = [deprecated_series[0], misplacedC_series[0], misplacedP_series[0],undefinedC_series[0], undefinedP_series[0]];
                    const consistency_last_measurement = consistencyData[consistencyData.length -1].Quality_category_array[consistency];
                    const table = (
                        <Table striped bordered hover >
                            <tr>
                                <th className='cell'>Entities as members of disjoint classes</th><th className='cell'>Ontology hijacking</th>
                            </tr>
                            <tr>
                                <td className='cell'>{consistency_last_measurement.disjointClasses}</td><td className='cell'>{consistency_last_measurement.oHijacking}</td>
                            </tr>
                        </Table>
                    )
                    setConsistencyChart(<LineChartAccuracy chart_title={'Consistency'} sub_title={consistencyData[0].kg_name} y_min={0} y_max={1} series={series}/>)
                    setConsistencyTable(table);
                }else{
                    let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(consistencyData, consistencyData[consistencyData.length - 1].analysis_date,selectedKGs);
                    else    
                        analysis_selected = find_target_analysis(consistencyData,selectedDate,selectedKGs);
                    const consistency_obj = analysis_selected[0].Quality_category_array[consistency];
                    const data = [parseFloat(consistency_obj.deprecated),parseFloat(consistency_obj.triplesMC),parseFloat(consistency_obj.triplesMP),parseFloat(consistency_obj.undefinedClass),parseFloat(consistency_obj.undefinedProperties)]
                    const series = [{name:analysis_selected[0].kg_name, data : data}]
                    const x_categories = ['Use of deprecated classes or properties','Misplaced classes','Misplaced properties','Invalid usage of undefined classes','Invalid usage of undefined properties'];
                    const table = (
                        <Table striped bordered hover key={selectedDate}>
                            <tr>
                                <th className='cell'>Entities as members of disjoint classes</th><th className='cell'>Ontology hijacking</th>
                            </tr>
                            <tr>
                                <td className='cell'>{consistency_obj.disjointClasses}</td><td className='cell'>{consistency_obj.oHijacking}</td>
                            </tr>
                        </Table>
                    )
                    setConsistencyTable(table)
                    setConsistencyChart(<PolarChart chart_title={'Consistency'} x_categories={x_categories} y_min={0} y_max={1} series={series} key={selectedDate + ' chart'}/>)
                }
            } else if(selectedKGs.length >= 1){
                if(!toggleSwitch){
                    //TODO:insert chart
                    setConsistencyChart(<p>TODO</p>)
                    setSelectedDate(null);
                } else {
                    let analysis_selected;
                    if(selectedDate === null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(consistencyData,consistencyData[consistencyData.length-1].analysis_date,selectedKGs);
                    else
                        analysis_selected = find_target_analysis(consistencyData,selectedDate,selectedKGs);

                    const x_categories = ['Use of deprecated classes or properties','Misplaced classes','Misplaced properties','Invalid usage of undefined classes','Invalid usage of undefined properties'];
                    const series = series_for_polar_chart(analysis_selected,selectedKGs,consistency);
                    const table = (
                        <Table striped bordered hover>
                            <tr>
                                <th>KG name</th><th>Entities as members of disjoint classes</th><th>Ontology hijacking</th>
                            </tr>
                            {analysis_selected.map((item) => (
                                <tr>
                                    <td>{item.kg_name}</td><td>{item.Quality_category_array[consistency].disjointClasses}</td><td>{item.Quality_category_array[consistency].oHijacking}</td>
                                </tr>
                            ))}
                        </Table>
                    )
                    setConsistencyChart(<PolarChart chart_title={'Consistency'} x_categories={x_categories} y_min={0} y_max={1} series={series}/>)
                    setConsistencyTable(table)
                }
            }
        }
    },[consistencyData, selectedKGs, toggleSwitch, selectedDate]);
    
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
                    {consistencyData && (
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
                            {consistencyChart}
                            {consistencyTable}
                        </div>
                    )}
            </div>
    )
}


export default Consistency;