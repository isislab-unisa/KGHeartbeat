
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CalendarPopup from '../components/CalendatPopup';
import { base_url } from '../api';
import parseISO from 'date-fns/parseISO';
import QualityBar from '../components/QualityBar';
import Form from 'react-bootstrap/Form';
import { find_target_analysis, get_analysis_date, trasform_to_series_conc, trasform_to_series_stacked } from '../utils';
import ConcisenessChart from '../components/ConcisenessChart';
import ColumnChart from '../components/ColumnChart';
import StackedChart from '../components/StackedChart';

const conciseness = 'Conciseness'

function Conciseness({ selectedKGs, setSelectedKGs}){
    const [concisenessData, setConcisenessData] = useState(null);
    const [concisenessChart, setConcisenessChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [switchComponent, setSwitchComponent] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}intrinsic/conciseness?id=${selectedKGs[0].id}`);
                setConcisenessData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}intrinsic/conciseness`,arrayIDs);
                setConcisenessData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);
    
    useEffect(() => {
        if(concisenessData){
            setAvailableDate(get_analysis_date(concisenessData))
            if(selectedDate == null)
                setDeafaultDate(parseISO(concisenessData[concisenessData.length-1].analysis_date));
            if(selectedKGs.length === 1){
                setSwitchComponent(<Form.Check type="switch" id="custom-switch" label='Switch to chage view' checked={toggleSwitch} onChange={() => setToggleSwitch(!toggleSwitch)}/>)
                if(!toggleSwitch){
                    const int_conc_series = trasform_to_series_conc(concisenessData,selectedKGs,conciseness,'intC','Intensional conciseness');
                    const ext_conc_series = trasform_to_series_conc(concisenessData,selectedKGs,conciseness,'exC','Extensional conciseness');
                    const series = [int_conc_series[0],ext_conc_series[0]]
                    setConcisenessChart(<ConcisenessChart chart_title={'Conciseness'} series={series} y_min={0} y_max={1}/>)
                }else{
                    let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(concisenessData, concisenessData[concisenessData.length - 1].analysis_date,selectedKGs);
                    else    
                        analysis_selected = find_target_analysis(concisenessData,selectedDate,selectedKGs);
                    const int_conc_series = trasform_to_series_conc(analysis_selected,selectedKGs,conciseness,'intC','Intensional conciseness');
                    const ext_conc_series = trasform_to_series_conc(analysis_selected,selectedKGs,conciseness,'exC','Extensional conciseness');
                    const series = [int_conc_series[0],ext_conc_series[0]]
                    console.log(series)
                    setConcisenessChart(<ColumnChart chart_title={'Conciseness'} series={series} y_min={0} y_max={0} key={selectedDate + 'chart'} />)
                }
            } else if(selectedKGs.length >= 1){
                    setSwitchComponent(null);
                    setToggleSwitch(true);
                    let analysis_selected
                    if(selectedDate === null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(concisenessData,concisenessData[concisenessData.length-1].analysis_date,selectedKGs);
                    else
                        analysis_selected = find_target_analysis(concisenessData,selectedDate,selectedKGs);
                    
                    const series = trasform_to_series_stacked(analysis_selected,selectedKGs,conciseness,['exC','intC'],['Extensional conciseness','Intensional conciseness'])
                    let kgs_name = [];
                    analysis_selected.map((item)=>
                        kgs_name.push(item.kg_name)
                    )
                    setConcisenessChart(<StackedChart chart_title={'Conciseness'} series={series} x_categories={kgs_name} best_value={2} y_max={2} y_min={0} y_title={'Values'} key={selectedDate + 'conci'} />)

            }
        }
    },[concisenessData,selectedKGs,toggleSwitch,selectedDate]);

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
                <QualityBar selectedKGs={selectedKGs} setSelectedKG={setSelectedKGs}/>
                    {concisenessData && (
                        <div className='w-100 p-3'>
                            {switchComponent}
                            {toggleSwitch ? (
                                <div>
                                    <CalendarPopup selectableDates={availableDates} onDateSelect={handleDateSelect} defaultDate={defaultDate}/>
                                </div>
                            ) : (
                                <div>
 
                                </div>
                            )}
                            {concisenessChart}
                        </div>
                    )}
            </div>
    )
}

export default Conciseness;