import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import { trasform_to_series, get_analysis_date, trasform_to_series_stacked} from '../utils';
import LineChartAccuracy from '../components/LineChartAccuracy';
import Form from 'react-bootstrap/Form';
import PolarChart from '../components/PolarChart';
import CalendarPopup from '../components/CalendatPopup';
import { find_target_analysis } from '../utils';
import parseISO from 'date-fns/parseISO';
import StackedChart from '../components/StackedChart';

const accuracy = 'Accuracy';

function Accuracy( {selectedKGs } ){
    const [accuracyData, setAccuracyData] = useState(null);
    const [accuracyChart, setAccuracyChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [switchComponent, setSwitchComponent] = useState(null);
    
    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}intrinsic/accuracy?id=${selectedKGs[0].id}`);
                setAccuracyData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}intrinsic/accuracy`,arrayIDs);
                setAccuracyData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if (accuracyData){
            setAvailableDate(get_analysis_date(accuracyData)) //set the analysis date available
            if(selectedDate == null)
                setDeafaultDate(parseISO(accuracyData[accuracyData.length-1].analysis_date))
            if (selectedKGs.length === 1){
                setSwitchComponent(<Form.Check type="switch" id="custom-switch" label='Switch to chage view' checked={toggleSwitch} onChange={() => setToggleSwitch(!toggleSwitch)}/>)
                const fp_series = trasform_to_series(accuracyData,selectedKGs,accuracy,'FPvalue','Functional property violation');
                const ifp_series = trasform_to_series(accuracyData,selectedKGs,accuracy,'IFPvalue','Inverse functional property violation');
                const empty_ann_series = trasform_to_series(accuracyData,selectedKGs,accuracy,'emptyAnn','Empty annotation labels');
                const malformed_series = trasform_to_series(accuracyData,selectedKGs,accuracy,'malformedDataType','Datatype consistency');
                const whitespace_ann = trasform_to_series(accuracyData,selectedKGs,accuracy,'wSA','White space in annotation');
                const series = [fp_series[0],ifp_series[0],empty_ann_series[0],malformed_series[0],whitespace_ann[0]];
                delete fp_series[0].id;
                delete ifp_series[0].id;
                delete empty_ann_series[0].id;
                delete malformed_series[0].id;
                delete whitespace_ann[0].id;
                if(!toggleSwitch){
                    setAccuracyChart(<LineChartAccuracy chart_title={'Accuracy'} sub_title={accuracyData[0].kg_name} series={series} y_min={0} y_max={1}/>)
                    setSelectedDate(null)
                }else{
                    let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(accuracyData,accuracyData[accuracyData.length-1].analysis_date,selectedKGs);
                    else
                        analysis_selected = find_target_analysis(accuracyData,selectedDate,selectedKGs); 
                    const accuracy_obj = analysis_selected[0].Quality_category_array.Accuracy;
                    const data = [parseFloat(accuracy_obj.emptyAnn),parseFloat(accuracy_obj.wSA),parseFloat(accuracy_obj.malformedDataType),parseFloat(accuracy_obj.FPvalue),parseFloat(accuracy_obj.IFPvalue)]
                    const series = [{name:analysis_selected[0].kg_name, data : data}]
                    const x_categories = ['Empty annotation labels','White space in annotation','Datatype consistency','Functional property violation','Inverse functional property violation'];

                    setAccuracyChart(<PolarChart key={selectedDate} chart_title={'Accuracy'} series={series} x_categories={x_categories} y_min={0} y_max={1} />)
                }
            } else if (selectedKGs.length >= 1){
                setSwitchComponent(null);
                setToggleSwitch(true);
                let analysis_selected;
                if(selectedDate === null || selectedDate === '1970-01-01')
                    analysis_selected = find_target_analysis(accuracyData,accuracyData[accuracyData.length-1].analysis_date,selectedKGs);
                else
                    analysis_selected = find_target_analysis(accuracyData,selectedDate,selectedKGs);

                const series = trasform_to_series_stacked(analysis_selected,selectedKGs,accuracy,['FPvalue','IFPvalue','emptyAnn','malformedDataType','wSA'],['Functional property violation','Inverse functional property violation','Empty label','Wrong datatype','Whitespace at the beginnig or end of the label'])
                let kgs_name = []
                analysis_selected.map((item)=>
                    kgs_name.push(item.kg_name)
                )
                setAccuracyChart(<StackedChart chart_title={'Accuracy'} series={series} x_categories={kgs_name} best_value={5} y_max={5} y_min={0} y_title={'N. triples'} key={selectedDate}/>)
            }
        }
    },[accuracyData, selectedKGs,toggleSwitch,selectedDate]);

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
                    {accuracyData && (
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
                            {accuracyChart}
                        </div>
                    )}
            </div>
        </div>
    )
}

export default Accuracy;