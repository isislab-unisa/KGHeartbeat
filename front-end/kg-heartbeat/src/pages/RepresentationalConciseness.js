import React, { useEffect, useState } from 'react';
import { base_url } from '../api';
import axios from 'axios';
import QualityBar from '../components/QualityBar';
import { trasform_latency_to_series, trasform_throughput_to_series, trasform_rep_conc_to_series, get_analysis_date, trasform_to_series_compl, trasform_to_series_conc, trasform_rep_conc_to_series_multiple} from '../utils';
import BoxPlot from '../components/BoxPlot';
import CalendarPopup from '../components/CalendatPopup';
import { find_target_analysis } from '../utils';
import {  parseISO } from "https://cdn.skypack.dev/date-fns@2.28.0";

const rep_conciseness = 'Representational-conciseness';

function RepresentationalConciseness( {selectedKGs} ){
    const [repConcisenessData, setRepConcisenessData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [repConcChart, setRepConcChart] = useState(null);
    const [calendar, setCalendar] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}representational/representational_conciseness?id=${selectedKGs[0].id}`);
                setRepConcisenessData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}representational/representational_conciseness`,arrayIDs);
                setRepConcisenessData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(repConcisenessData){
            if(selectedKGs.length === 1){
                const subject_series = trasform_rep_conc_to_series(repConcisenessData,selectedKGs,rep_conciseness,'minLengthS','percentile25LengthS','medianLengthS','percentile75LengthS','maxLengthS','URIs length Subject');
                const predicate_series = trasform_rep_conc_to_series(repConcisenessData,selectedKGs,rep_conciseness,'minLengthP','percentile25LengthP','medianLengthP','percentile75LengthP','maxLengthP', 'URIs length Predicate');
                const object_series = trasform_rep_conc_to_series(repConcisenessData,selectedKGs,rep_conciseness,'minLengthO','percentile25LengthO','medianLengthO','percentile75LengthO','maxLengthO', 'URIs length Object');
                const series = [subject_series[0],predicate_series[0],object_series[0]]
                setRepConcChart(<BoxPlot chart_title={'URIs length'} series={series} />)
            } else if(selectedKGs.length >= 1){
                setAvailableDate(get_analysis_date(repConcisenessData));
                if(selectedDate == null)
                    setDeafaultDate(parseISO(repConcisenessData[repConcisenessData.length-1].analysis_date));
                setCalendar(<CalendarPopup selectableDates={availableDates} onDateSelect={handleDateSelect} defaultDate={defaultDate}/>                )
                let analysis_selected;
                if(selectedDate == null || selectedDate === '1970-01-01')
                    analysis_selected = find_target_analysis(repConcisenessData, repConcisenessData[repConcisenessData.length - 1].analysis_date,selectedKGs);
                else    
                    analysis_selected = find_target_analysis(repConcisenessData,selectedDate,selectedKGs);
                const subject_series = trasform_rep_conc_to_series_multiple(analysis_selected,selectedKGs,rep_conciseness,'minLengthS','percentile25LengthS','medianLengthS','percentile75LengthS','maxLengthS','URIs length Subject');
                const predicate_series = trasform_rep_conc_to_series_multiple(analysis_selected,selectedKGs,rep_conciseness,'minLengthP','percentile25LengthP','medianLengthP','percentile75LengthP','maxLengthP', 'URIs length Predicate');
                const object_series = trasform_rep_conc_to_series_multiple(analysis_selected,selectedKGs,rep_conciseness,'minLengthO','percentile25LengthO','medianLengthO','percentile75LengthO','maxLengthO', 'URIs length Object');

                const rep_conc_chart = (
                    <div>
                        <BoxPlot chart_title={'Subject URIs length'} series={subject_series} key={selectedDate + 'rep_conc_s'}/>
                        <BoxPlot chart_title={'Predicated URIs length'} series={predicate_series} key={selectedDate + 'rep_conc_p'}/>
                        <BoxPlot chart_title={'Object URIs length'} series={object_series} key={selectedDate + 'rep_conc_o'}/>
                    </div>
                )
                setRepConcChart(rep_conc_chart)
            }
        }
    }, [repConcisenessData, selectedKGs, selectedDate])

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
                {repConcisenessData && (
                    <div className='w-100 p-3'>
                        <div>
                            {calendar}
                        </div>
                        {repConcChart}
                        {}
                    </div>
                )}
            </div>
        </div>
    )
}

export default RepresentationalConciseness;