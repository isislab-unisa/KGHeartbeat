import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import CalendarPopup from '../components/CalendatPopup';
import { base_url } from '../api';
import axios from 'axios';
import parseISO from 'date-fns/parseISO';
import { add_amount, compact_temporal_data, extract_most_recent, find_target_analysis, get_analysis_date, trasform_to_series, trasform_to_series_conc, trasform_to_series_stacked } from '../utils';
import LineChart from '../components/LineChart';
import Table from 'react-bootstrap/esm/Table';
import InterpColumnChart from '../components/InterpColumnChart';
import StackedChart from '../components/StackedChart';

const interpretability = 'Interpretability';

function Interpretability( { selectedKGs, setSelectedKGs} ){
    const [interpretabilityData, setInterpretabilityData] = useState(null);
    const [amountData, setAmountData] = useState(null);
    const [interpretabilityChart, setInterpretabilityChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [interpretabilityTab, setInterpretabilityTab] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}representational/interpretability?id=${selectedKGs[0].id}`);
                const response2 = await axios.get(`${base_url}contextual/amount_of_data?id=${selectedKGs[0].id}`);
                setInterpretabilityData(response.data);
                setAmountData(response2.data)
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}representational/interpretability`,arrayIDs);
                const response2 = await axios.post(`${base_url}contextual/amount_of_data`,arrayIDs);
                setInterpretabilityData(response.data);
                setAmountData(response2.data)
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

      
    useEffect(() => {
        if(interpretabilityData && amountData){
            console.log(interpretabilityData)
            setAvailableDate(get_analysis_date(interpretabilityData)) //set the analysis date available
            if(selectedDate == null)
                setDeafaultDate(parseISO(interpretabilityData[interpretabilityData.length-1].analysis_date))
            if(selectedKGs.length === 1){
                if(!toggleSwitch){
                    const series = trasform_to_series(interpretabilityData,selectedKGs,interpretability,'numBN','Blank nodes number');
                    const interp_table = (
                        <Table striped bordered hover>
                            <tr>
                                <th className='cell'>Atypical use of collections, containers and reification</th>
                            </tr>
                            <tr>
                                <td className='cell'>{interpretabilityData[interpretabilityData.length - 1].Quality_category_array[interpretability].RDFStructures}</td>
                            </tr>
                        </Table>
                    )
                    setInterpretabilityChart(<LineChart chart_title={'Interpretability'} series={series} y_min={0} y_max={null} sub_title={interpretabilityData[0].kg_name} />)
                    setInterpretabilityTab(interp_table);
                }else{
                    let analysis_selected, analysis_selected_amount;
                    if(selectedDate === null || selectedDate === '1970-01-01'){
                        analysis_selected = find_target_analysis(interpretabilityData,interpretabilityData[interpretabilityData.length-1].analysis_date,selectedKGs);
                        analysis_selected_amount = find_target_analysis(amountData,amountData[amountData.length-1],selectedKGs);
                    }else{
                        analysis_selected = find_target_analysis(interpretabilityData,selectedDate,selectedKGs);
                        analysis_selected_amount = find_target_analysis(amountData,selectedDate,selectedKGs);
                    }
                    const blank_nodes_series = trasform_to_series_conc(analysis_selected,selectedKGs,'Interpretability','numBN','Blank nodes number');
                    const triples_series = trasform_to_series_conc(analysis_selected_amount,selectedKGs,'Amount of data','numTriples_merged','Number of triples');
                    const series = [blank_nodes_series[0], triples_series[0]];
                    const interp_table = (
                        <Table striped bordered hover key={selectedDate + 'interp tab'}>
                            <tr>
                                <th className='cell'>Atypical use of collections, containers and reification</th>
                            </tr>
                            <tr>
                                <td className='cell'>{analysis_selected[0].Quality_category_array[interpretability].RDFStructures}</td>
                            </tr>
                        </Table>
                    )
                    setInterpretabilityChart(<InterpColumnChart chart_title={'Interpretability'} series={series} y_min={0} y_max={null} key={selectedDate + 'interp chart'} />)
                    setInterpretabilityTab(interp_table)
                }
            } else if(selectedKGs.length >= 1){
                if(!toggleSwitch){
                    const series = compact_temporal_data(interpretabilityData,selectedKGs,interpretability,'numBN');
                    const most_recent_analysis = extract_most_recent(interpretabilityData,selectedKGs);
                    const interp_table = (
                        <Table striped bordered hover>
                            <tr>
                                <th className='cell'>KG name</th><th className='cell'>Atypical use of collections, containers and reification</th>
                            </tr>
                            {most_recent_analysis.map((item) =>
                                <tr>
                                    <td className='cell'>{item.kg_name}</td><td className='cell'>{item.Quality_category_array[interpretability].RDFStructures}</td>
                                </tr>
                            )}
                        </Table>
                    )
                    setInterpretabilityChart(<LineChart chart_title={'Blank nodes number'} series={series} y_min={0} y_max={null} />)
                    setInterpretabilityTab(interp_table);
                }else{
                    let analysis_selected;
                    const interpData_merged = add_amount(interpretabilityData,amountData,selectedKGs);
                    if(selectedDate === null || selectedDate === '1970-01-01'){
                        analysis_selected = find_target_analysis(interpData_merged,interpData_merged[interpData_merged.length-1].analysis_date,selectedKGs);
                    }else{
                        analysis_selected = find_target_analysis(interpData_merged,selectedDate,selectedKGs);
                    }
                    let series_interp = trasform_to_series_stacked(analysis_selected,selectedKGs,interpretability,['numBN','numTriples_merged'],['Number of blank nodes','Number of triples']);
                    let kgs_name = [];
                    analysis_selected.map((item)=>
                        kgs_name.push(item.kg_name)
                    )
                    const interp_table = (
                        <Table striped bordered hover key={selectedDate + 'interp tab'}>
                            <tr>
                                <th className='cell'>KG name</th><th className='cell'>Atypical use of collections, containers and reification</th>
                            </tr>
                            {analysis_selected.map((item) =>
                                <tr>
                                    <td className='cell'>{item.kg_name}</td><td className='cell'>{item.Quality_category_array[interpretability].RDFStructures}</td>
                                </tr>
                            )}
                        </Table>
                    )
                    setInterpretabilityChart(<StackedChart chart_title={'Interpretability'} best_value={null} series={series_interp} x_categories={kgs_name} y_min={0}  y_max={null} y_title={'Values'} key={selectedDate + 'interp chart'}/>)
                    setInterpretabilityTab(interp_table)
                
                }
            }
        }
    },[interpretabilityData, amountData,selectedKGs, toggleSwitch, selectedDate]);

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
            <QualityBar selectedKGs={selectedKGs} setSelectedKG={setSelectedKGs}/>
                {interpretabilityData && (
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
                        {interpretabilityChart}
                        {interpretabilityTab}
                    </div>
                )}
        </div>
    </div>
    )
}

export default Interpretability;