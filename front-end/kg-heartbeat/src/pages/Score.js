import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import { trasform_to_series, get_analysis_date, trasform_to_series_stacked, score_to_series, score_series_multiple_kgs} from '../utils';
import Form from 'react-bootstrap/Form';
import CalendarPopup from '../components/CalendatPopup';
import { find_target_analysis } from '../utils';
import {  parseISO } from "https://cdn.skypack.dev/date-fns@2.28.0";
import LineChart from '../components/LineChart';
import SolidGauge from '../components/SolidGauge';
import BasicSorting from '../components/MaterialTable';
import MaterialTable from '../components/MaterialTable';

const score = 'Score'

function Score( { selectedKGs } ){
    const [scoreData, setScoreData] = useState(null);
    const [scoreChart, setScoreChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [graphicToggle,setGraphicToggle] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}score/score_data?id=${selectedKGs[0].id}`);
                setScoreData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}score/score_data`,arrayIDs);
                setScoreData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(scoreData){
            setAvailableDate(get_analysis_date(scoreData)) //set the analysis date available
            if(selectedDate == null)
                setDeafaultDate(parseISO(scoreData[scoreData.length-1].analysis_date))
            if(selectedKGs.length === 1){
                setGraphicToggle(<Form.Check
                    type="switch"
                    id="custom-switch"
                    label='Switch to chage view'
                    checked={toggleSwitch}
                    onChange={() => setToggleSwitch(!toggleSwitch)}
                    />)
                if(!toggleSwitch){
                    const series = score_to_series(scoreData,selectedKGs,score,'totalScore','Quality score value',54);
                    setScoreChart(<LineChart chart_title={'Score'} series={series} sub_title={scoreData[0].kg_name} y_min={0} y_max={100}/>)
                } else {
                    let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(scoreData,scoreData[scoreData.length-1].analysis_date,selectedKGs);
                    else
                        analysis_selected = find_target_analysis(scoreData,selectedDate,selectedKGs); 
                    const series = score_to_series(analysis_selected,selectedKGs,score,'totalScore','Quality score value',54);
                    setScoreChart(<SolidGauge series={series[0].data[0][1]} key={selectedDate + 'score'}/>)
                }
            } else if(selectedKGs.length >= 1){
                setGraphicToggle(null);
                setToggleSwitch(true);
                let analysis_selected;
                if(selectedDate == null || selectedDate === '1970-01-01')
                    analysis_selected = find_target_analysis(scoreData,scoreData[scoreData.length-1].analysis_date,selectedKGs);
                else
                    analysis_selected = find_target_analysis(scoreData,selectedDate,selectedKGs);

                const columns = [
                    {
                        accessorKey: 'kgname',
                        header: 'KG name',
                        size: 150,
                    },
                    {
                        accessorKey: 'score',
                        header: 'Score',
                        size: 5,
                    }
                ]
                const data = score_series_multiple_kgs(analysis_selected,selectedKGs,54);
                setScoreChart(<MaterialTable columns_value={columns} data_table={data} key={selectedDate + 'score'}/>)
            }
        }
    }, [scoreData, selectedKGs, toggleSwitch, selectedDate]);

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
                    {scoreData && (
                        <div className='w-100 p-3'>
                            {graphicToggle}
                            {toggleSwitch ? (
                                <div>
                                    <CalendarPopup selectableDates={availableDates} onDateSelect={handleDateSelect} defaultDate={defaultDate}/>
                                </div>
                            ) : (
                                <div>
 
                                </div>
                            )}
                            {scoreChart}
                        </div>
                    )}
            </div>
        </div>
    )
}

export default Score;