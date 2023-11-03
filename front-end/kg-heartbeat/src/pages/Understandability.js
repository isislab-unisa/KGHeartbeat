import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import { trasform_to_series, get_analysis_date, trasform_to_series_stacked, trasform_rep_conc_to_series, trasform_to_series_compl, trasform_to_series_conc, create_percentage_label_seris, create_percentage_label_series, extract_most_recent, add_believability_and_amount} from '../utils';
import LineChart from '../components/LineChart';
import Form from 'react-bootstrap/Form';
import CalendarPopup from '../components/CalendatPopup';
import { find_target_analysis } from '../utils';
import {  parseISO } from "https://cdn.skypack.dev/date-fns@2.28.0";
import ColumnChart from '../components/ColumnChart';
import AmountColumn from '../components/AmountColumn';
import Table from 'react-bootstrap/esm/Table';
import PieChart from '../components/PieChart';

const understandability = 'Understandability';

function Understandability( {selectedKGs} ){
    const [underData, setUnderData] = useState(null);
    const [underChart, setUnderChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [amountData, setAmountData] = useState(null);
    const [believabilityData, setBelievabilityData] = useState(null);
    const [underTable,setUnderTable] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}representational/understandability?id=${selectedKGs[0].id}`);
                const response2 = await axios.get(`${base_url}contextual/amount_of_data?id=${selectedKGs[0].id}`);
                const response3 = await axios.get(`${base_url}trust/believability?id=${selectedKGs[0].id}`);
                setUnderData(response.data);
                setAmountData(response2.data);
                setBelievabilityData(response3.data)
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}representational/understandability`,arrayIDs);
                const response2 = await axios.post(`${base_url}contextual/amount_of_data`,arrayIDs);
                const response3 = await axios.post(`${base_url}trust/believability`,arrayIDs);
                setUnderData(response.data);
                setAmountData(response2.data);
                setBelievabilityData(response3.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(underData && amountData && believabilityData){
            setAvailableDate(get_analysis_date(underData)) //set the analysis date available
            if(selectedDate == null)
                setDeafaultDate(parseISO(underData[underData.length-1].analysis_date))
            if(selectedKGs.length === 1){
                if(!toggleSwitch){
                    const label_series = trasform_to_series_conc(underData,selectedKGs,understandability,'numLabel','Labels');
                    const triples_series = trasform_to_series_conc(amountData,selectedKGs,'Amount of data','numTriples_merged','Triples');
                    const series = [triples_series[0],label_series[0]];
                    setUnderChart(<AmountColumn chart_title={'Understandability'} series={series} y_min={0} y_max={null} sub_title={underData[0].kg_name}/>)
                    const under_table = (
                        <Table striped bordered hover>
                            <tr>
                                <th colSpan={3} className='cell'>Indication of metadata about a dataset</th><th className='cell'>Indication of examples</th><th className='cell'>Indication of a regular expression that matches the URIs of dataset</th><th className='cell'>Indication of the vacabularies used in the dataset</th>
                            </tr>
                            <tr>
                                <td className='cell'>Title</td><td className='cell'>Description</td><td className='cell'>URI</td>
                            </tr>
                            <tr>
                                <td className='cell'>{believabilityData[0].Quality_category_array['Believability'].title}</td><td className='cell'>{believabilityData[0].Quality_category_array['Believability'].description}</td><td className='cell'>{believabilityData[0].Quality_category_array['Believability'].URI}</td>
                                <td className='cell'>{underData[underData.length - 1].Quality_category_array['Understandability'].example}</td><td className='cell'>{underData[underData.length - 1].Quality_category_array['Understandability'].regexUri}</td>
                                <td className='cell'>{underData[underData.length - 1].Quality_category_array['Understandability'].vocabularies}</td>
                            </tr>
                        </Table>
                    )
                    setUnderTable(under_table)
                }else{
                    let analysis_selected_under;
                    let analysis_selected_amount;
                    if(selectedDate == null || selectedDate === '1970-01-01'){
                        analysis_selected_under = find_target_analysis(underData,underData[underData.length-1].analysis_date,selectedKGs);
                        analysis_selected_amount = find_target_analysis(amountData,amountData[amountData.length-1].analysis_date,selectedKGs);
                    }else{
                        analysis_selected_under = find_target_analysis(underData,selectedDate,selectedKGs); 
                        analysis_selected_amount = find_target_analysis(amountData,selectedDate,selectedKGs);
                    }
                    const series = []
                    const pie_data = [{
                        name: 'Labels',
                        y: parseInt(analysis_selected_under[0].Quality_category_array[understandability].numLabel)
                    },
                    {
                        name: 'Triples',
                        y: parseInt(analysis_selected_amount[0].Quality_category_array['Amount of data'].numTriples_merged)
                    }
                    ] 
                    series.push({name: 'Values', data : pie_data});
                    setUnderChart(<PieChart chart_title={'Labels'} series={series} key={selectedDate + 'under chart'}/>)
                    const table_under = (
                        <Table striped bordered hover key={selectedDate + 'under table'}>
                        <tr>
                            <th colSpan={3} className='cell'>Indication of metadata about a dataset</th><th className='cell'>Indication of examples</th><th className='cell'>Indication of a regular expression that matches the URIs of dataset</th><th className='cell'>Indication of the vacabularies used in the dataset</th>
                        </tr>
                        <tr>
                            <td className='cell'>Title</td><td className='cell'>Description</td><td className='cell'>URI</td>
                        </tr>
                        <tr>
                            <td className='cell'>{believabilityData[0].Quality_category_array['Believability'].title}</td><td className='cell'>{believabilityData[0].Quality_category_array['Believability'].description}</td><td className='cell'>{believabilityData[0].Quality_category_array['Believability'].URI}</td>
                            <td className='cell'>{analysis_selected_under[0].Quality_category_array['Understandability'].example}</td><td className='cell'>{analysis_selected_under[0].Quality_category_array['Understandability'].regexUri}</td>
                            <td className='cell'>{analysis_selected_under[0].Quality_category_array['Understandability'].vocabularies}</td>
                        </tr>
                    </Table>
                    )
                    setUnderTable(table_under)
                }
            } else if(selectedKGs.length >= 1){
                if(!toggleSwitch){
                    const label_series = create_percentage_label_series(underData,amountData,selectedKGs);
                    const under_merged = add_believability_and_amount(underData,believabilityData,amountData,selectedKGs);
                    const most_recent_analysis = extract_most_recent(under_merged,selectedKGs,believabilityData);
                    const under_table = (
                        <Table striped bordered hover>
                            <tr>
                                <th colSpan={3} className='cell'>Indication of metadata about a dataset</th><th className='cell'>Indication of examples</th><th className='cell'>Indication of a regular expression that matches the URIs of dataset</th><th className='cell'>Indication of the vacabularies used in the dataset</th>
                            </tr>
                            <tr>
                                <th className='cell'>Title</th><th className='cell'>Description</th><th className='cell'>URI</th>
                            </tr>
                            {most_recent_analysis.map((item) => 
                                <tr>
                                    <td className='cell'>{item.Quality_category_array[understandability].title}</td><td className='cell'>{item.Quality_category_array[understandability].description}</td>
                                    <td className='cell'>{item.Quality_category_array[understandability].URI}</td><td className='cell'>{item.Quality_category_array[understandability].example}</td><td className='cell'>{item.Quality_category_array[understandability].regexUri}</td>
                                    <td className='cell'>{item.Quality_category_array[understandability].vocabularies}</td>
                                </tr>
                            )}
                        </Table>
                    )
                    setUnderChart(<LineChart chart_title={'Labels percentage'} series={label_series} y_min={0} y_max={null} />)
                    setUnderTable(under_table)
                }else{
                    let analysis_selected_under;
                    let analysis_selected_amount;
                    if(selectedDate === null || selectedDate === '1970-01-01'){
                        analysis_selected_under = find_target_analysis(underData,underData[underData.length-1].analysis_date,selectedKGs);
                        analysis_selected_amount = find_target_analysis(amountData,amountData[amountData.length-1].analysis_date,selectedKGs)
                    }
                    else{
                        analysis_selected_under = find_target_analysis(underData,selectedDate,selectedKGs);
                        analysis_selected_amount = find_target_analysis(amountData,selectedDate,selectedKGs);
                    }
                    const analysis_selected_merged = add_believability_and_amount(analysis_selected_under,believabilityData,analysis_selected_amount,selectedKGs);
                    const under_table = (
                        <Table striped bordered hover key={selectedDate + 'under table'}>
                            <tr>
                                <th colSpan={3} className='cell'>Indication of metadata about a dataset</th><th className='cell'>Indication of examples</th><th className='cell'>Indication of a regular expression that matches the URIs of dataset</th><th className='cell'>Indication of the vacabularies used in the dataset</th>
                                <th className='cell'>Number of labels</th><th className='cell'>Percentage of triples with label</th>
                            </tr>
                            <tr>
                                <th className='cell'>Title</th><th className='cell'>Description</th><th className='cell'>URI</th>
                            </tr>
                            {analysis_selected_merged.map((item) => 
                                <tr>
                                    <td className='cell'>{item.Quality_category_array[understandability].title}</td><td className='cell'>{item.Quality_category_array[understandability].description}</td>
                                    <td className='cell'>{item.Quality_category_array[understandability].URI}</td><td className='cell'>{item.Quality_category_array[understandability].example}</td><td className='cell'>{item.Quality_category_array[understandability].regexUri}</td>
                                    <td className='cell'>{item.Quality_category_array[understandability].vocabularies}</td>
                                    <td className='cell'>{item.Quality_category_array[understandability].numLabel}</td>
                                    <td className='cell'>{parseFloat((parseInt(item.Quality_category_array[understandability].numLabel)/parseInt(item.Quality_category_array[understandability].numTriples_merged)).toFixed(2))}</td>
                                </tr>
                            )}
                        </Table>
                    )
                    setUnderChart(null);
                    setUnderTable(under_table);
                }
            }
        }
    },[underData, selectedKGs, toggleSwitch,selectedDate, amountData,believabilityData]);

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
                    {underData && (
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
                            {underChart}
                            {underTable}
                        </div>
                    )}
            </div>
        </div>
    )
}

export default Understandability;