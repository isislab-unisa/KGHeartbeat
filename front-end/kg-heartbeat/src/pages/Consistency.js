import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import CalendarPopup from '../components/CalendatPopup';
import { base_url } from '../api';
import axios from 'axios';
import { find_target_analysis, get_analysis_date, trasform_to_series, trasform_to_series_stacked } from '../utils';
import {  parseISO } from "https://cdn.skypack.dev/date-fns@2.28.0";
import LineChartAccuracy from '../components/LineChartAccuracy';
import PolarChart from '../components/PolarChart';
import ColumnChart from '../components/ColumnChart';

const consistency = 'Consistency'

function Consistency({ selectedKGs }){
    const [consistencyData, setConsistencyData] = useState(null);
    const [consistencyChart, setConsistencyChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);

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
                    const disjoint_series = trasform_to_series(consistencyData,selectedKGs,consistency,'disjointClasses','Entities as members of disjoint classes');
                    const hijacking_series = trasform_to_series(consistencyData,selectedKGs,consistency,'oHijacking','Ontology hijacking');
                    const misplacedC_series = trasform_to_series(consistencyData,selectedKGs,consistency,'triplesMC','Misplaced classes');
                    const misplacedP_series = trasform_to_series(consistencyData,selectedKGs,consistency,'triplesMP','Misplaced properties');
                    delete deprecated_series[0].id;
                    delete disjoint_series[0].id;
                    delete hijacking_series[0].id;
                    delete misplacedC_series[0].id;
                    delete misplacedP_series[0].id;
                    const series = [deprecated_series[0], disjoint_series[0], hijacking_series[0], misplacedC_series[0], misplacedP_series[0]];
                    setConsistencyChart(<LineChartAccuracy chart_title={'Consistency'} sub_title={consistencyData[0].kg_name} y_min={0} y_max={1} series={series}/>)
                    setSelectedDate(null);
                }else{
                    let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(consistencyData, consistencyData[consistencyData.length - 1].analysis_date,selectedKGs);
                    else    
                        analysis_selected = find_target_analysis(consistencyData,selectedDate,selectedKGs);
                    const consistency_obj = analysis_selected[0].Quality_category_array[consistency];
                    const data = [parseFloat(consistency_obj.deprecated),parseFloat(consistency_obj.disjointClasses),parseFloat(consistency_obj.oHijacking),parseFloat(consistency_obj.triplesMC),parseFloat(consistency_obj.triplesMP)]
                    const series = [{name:analysis_selected[0].kg_name, data : data}]
                    const x_categories = ['Use of deprecated classes or properties','Entities as members of disjoint classes','Ontology hijacking','Misplaced classes','Misplaced properties'];
                
                    setConsistencyChart(<PolarChart chart_title={'Consistency'} x_categories={x_categories} y_min={0} y_max={1} series={series} key={selectedDate} />)
                }
            } else if(selectedKGs.length >= 1){
                if(!toggleSwitch){
                    //TODO:insert chart
                    setConsistencyChart(<p>TODO</p>)
                } else {
                    let analysis_selected;
                    if(selectedDate === null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(consistencyData,consistencyData[consistencyData.length-1].analysis_date,selectedKGs);
                    else
                        analysis_selected = find_target_analysis(consistencyData,selectedDate,selectedKGs);

                        const series = trasform_to_series_stacked(analysis_selected,selectedKGs,consistency,['deprecated','disjointClasses','oHijacking','triplesMC','triplesMP'],['Use of deprecated classes or properties','Entities as members of disjoint classes','Ontology hijacking','Misplaced classes','Misplaced properties']);
                        let kgs_name = [];
                        analysis_selected.map((item) => 
                            kgs_name.push(item.kg_name)
                        )
                        setConsistencyChart(<ColumnChart chart_title={'Consistency'} x_categories={kgs_name} best_value={5} y_min={0} y_max={5} y_title={'Values'} series={series} key={selectedDate}/>)

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
                        </div>
                    )}
            </div>
    )
}


export default Consistency;