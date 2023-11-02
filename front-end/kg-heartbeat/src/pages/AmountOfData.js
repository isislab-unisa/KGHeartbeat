import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import CalendarPopup from '../components/CalendatPopup';
import { base_url } from '../api';
import axios from 'axios';
import { find_target_analysis, get_analysis_date, trasform_to_series_conc, trasform_to_series_stacked} from '../utils';
import {  parseISO } from "https://cdn.skypack.dev/date-fns@2.28.0";
import Form from 'react-bootstrap/Form';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import StackedChartAmount from '../components/StackedChartAmount';

const amount = 'Amount of data'

function AmountOfData({ selectedKGs }){
    const [amountData, setAmountData] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [amountChart,setAmountChart] = useState(null);
    const [formCheck,setFormCheck] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}contextual/amount_of_data?id=${selectedKGs[0].id}`);
                setAmountData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}contextual/amount_of_data`,arrayIDs);
                setAmountData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(amountData){
            setAvailableDate(get_analysis_date(amountData));
            if(selectedDate == null)
                setDeafaultDate(parseISO(amountData[amountData.length-1].analysis_date));
            if(selectedKGs.length === 1){
                setFormCheck(<Form.Check
                    type="switch"
                    id="custom-switch"
                    label='Switch to chage view'
                    checked={toggleSwitch}
                    onChange={() => setToggleSwitch(!toggleSwitch)}
                    />)
                if(!toggleSwitch){
                    const triples_series = trasform_to_series_conc(amountData, selectedKGs,amount,'numTriples_merged','Triples');
                    const property_series = trasform_to_series_conc(amountData,selectedKGs,amount,'numProperty','Properties');
                    const entities_series = trasform_to_series_conc(amountData,selectedKGs,amount,'numEntities_merged','Entities');
                    const series = [triples_series[0],property_series[0],entities_series[0]];
                    setAmountChart(<LineChart chart_title={'Amount of data'} series={series} y_min={0} y_max={null} y_label={'Values'} sub_title={amountData[0].kg_name}/>)
                }else{
                    let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(amountData, amountData[amountData.length - 1].analysis_date,selectedKGs);
                    else    
                        analysis_selected = find_target_analysis(amountData,selectedDate,selectedKGs);
                    const triples_series = trasform_to_series_conc(analysis_selected, selectedKGs,amount,'numTriples_merged','Triples',true);
                    const property_series = trasform_to_series_conc(analysis_selected,selectedKGs,amount,'numProperty','Properties',true);
                    const entities_series = trasform_to_series_conc(analysis_selected,selectedKGs,amount,'numEntities_merged','Entities',true);
                    const series = [triples_series[0],property_series[0],entities_series[0]];
                    setAmountChart(<BarChart chart_title={'Amount of data'} series={series} y_min={0} y_max={null} sub_title={analysis_selected[0].kg_name} key={selectedDate + 'amount'}/>)

                }
            }else if(selectedKGs.length >= 1){
                setToggleSwitch(true) //force the case in which we want see data by day
                let analysis_selected;
                if(selectedDate == null || selectedDate === '1970-01-01')
                    analysis_selected = find_target_analysis(amountData, amountData[amountData.length - 1].analysis_date,selectedKGs);
                else    
                    analysis_selected = find_target_analysis(amountData,selectedDate,selectedKGs);
                
                const series = trasform_to_series_stacked(analysis_selected,selectedKGs,amount,['numTriples_merged','numProperty','numEntities_merged'],['Triples', 'Properties','Entities']);
                let kgs_name = []
                analysis_selected.map((item)=>
                    kgs_name.push(item.kg_name)
                )
                setAmountChart(<StackedChartAmount chart_title={'Amount of data'} series={series} x_categories={kgs_name} y_max={null} y_min={0} y_title={'Values'} key={selectedDate + 'amount'}/>)
            }
        }
    },[amountData, selectedKGs, toggleSwitch, selectedDate]);

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
                    {amountData && (
                        <div className='w-100 p-3'>
                            {formCheck}
                            {toggleSwitch ? (
                                <div>
                                    <CalendarPopup selectableDates={availableDates} onDateSelect={handleDateSelect} defaultDate={defaultDate}/>
                                </div>
                            ) : (
                                <div>
 
                                </div>
                            )}
                            {amountChart}
                            {}
                        </div>
                    )}
            </div>
    )

}

export default AmountOfData;