import React, { useEffect, useState } from 'react';
import QualityBar from "../components/QualityBar";
import { base_url } from '../api';
import axios from 'axios';
import Table from 'react-bootstrap/esm/Table';
import { find_target_analysis, get_analysis_date, trasform_to_series } from '../utils';
import parseISO from 'date-fns/parseISO';
import LineChart from "../components/LineChart"
import CalendarPopup from '../components/CalendatPopup';
import Form from 'react-bootstrap/Form';

const reputation = 'Reputation'

function Reputation({ selectedKGs, setSelectedKGs}){
    const [reputationData,setReputationData] = useState(null);
    const [reputationChart,setReputationChart] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}trust/reputation?id=${selectedKGs[0].id}`);
                setReputationData(response.data);              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}trust/reputation`,arrayIDs);
                setReputationData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);


    useEffect(() => {
        if(reputationData){
            setAvailableDate(get_analysis_date(reputationData));
            if(selectedDate == null)
                setDeafaultDate(parseISO(reputationData[reputationData.length-1].analysis_date))
            if(selectedKGs.length === 1){   
                if(!toggleSwitch){
                    const series = trasform_to_series(reputationData,selectedKGs,reputation,'pageRank','PageRank');
                    setReputationChart(<LineChart chart_title={'Reputation'} y_min={0} y_max={10} series={series}/>)
                }else{
                    let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(reputationData,reputationData[reputationData.length-1].analysis_date,selectedKGs);
                    else
                        analysis_selected = find_target_analysis(reputationData,selectedDate,selectedKGs);
                    const reputation_table = (
                        <Table striped bordered hover>
                            <tr>
                                <th className='cell'>KG name</th><th className='cell'>PageRank</th>
                            </tr>
                            {analysis_selected.map((item) => 
                                <tr>
                                    <td className='cell'>{item.kg_name}</td><td className='cell'>{item.Quality_category_array[reputation].pageRank}</td>
                                </tr>
                            )}
                        </Table>
                    )
                    setReputationChart(reputation_table)
                }   
            }else if(selectedKGs.length >= 1){
                setToggleSwitch(true) //with this, we have always the toggle switch checked, this mean that we display only data over time if the data is selected from the calendar
                let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(reputationData,reputationData[reputationData.length-1].analysis_date,selectedKGs);
                    else
                        analysis_selected = find_target_analysis(reputationData,selectedDate,selectedKGs);
                const reputation_table = (
                    <Table striped bordered hover key={selectedDate}>
                        <tr>
                            <th className='cell'>KG name</th><th className='cell'>PageRank</th>
                        </tr>
                        {analysis_selected.map((item) => (
                            <tr>
                                <td className='cell'>{item.kg_name}</td><td className='cell'>{item.Quality_category_array[reputation].pageRank}</td>
                            </tr>
                        ))}
                    </Table>
                )
                setReputationChart(reputation_table)
            }
        }
    },[reputationData, selectedKGs, toggleSwitch,selectedDate])

    const handleDateSelect = (date) => {
        const calendar_date = new Date(date)
        const year = calendar_date.getFullYear();
        const month = (calendar_date.getMonth() + 1).toString().padStart(2,'0');
        const day = calendar_date.getDate().toString().padStart(2,'0');
        const converted_date = `${year}-${month}-${day}`;
        setSelectedDate(converted_date);
    }

    return (
        <div className="d-flex">
            <QualityBar selectedKGs={selectedKGs} setSelectedKG={setSelectedKGs}/>
            {reputationData && (
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
                {reputationChart}
                </div>
            )}
        </div>
    )
}


export default Reputation; 