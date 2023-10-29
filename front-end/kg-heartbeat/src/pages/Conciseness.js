
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CalendarPopup from '../components/CalendatPopup';
import { base_url } from '../api';
import {  parseISO } from "https://cdn.skypack.dev/date-fns@2.28.0";
import QualityBar from '../components/QualityBar';
import Form from 'react-bootstrap/Form';

const conciseness = 'Conciseness'

function Conciseness({ selectedKGs }){
    const [concisenessData, setConcisenessData] = useState(null);
    const [concisenessChart, setConcisenessChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);

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
            setDeafaultDate(parseISO(concisenessData[concisenessData.length-1].analysis_date));
            if(selectedKGs.length === 1){
                if(!toggleSwitch){

                }else{

                }
            } else if(selectedKGs.length >= 1){
                if(!toggleSwitch){
                    
                } else {

                }
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
                <QualityBar selectedKGs={selectedKGs}/>
                    {concisenessData && (
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
                            {concisenessChart}
                        </div>
                    )}
            </div>
    )
}

export default Conciseness;