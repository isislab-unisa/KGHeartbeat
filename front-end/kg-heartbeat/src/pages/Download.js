import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { base_url } from '../api';
import axios from 'axios';
import { convert_analysis_date } from '../utils';
import Button from 'react-bootstrap/Button';

function Download(){
    const [analysisDate, setAnalysisDate] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [calendar, setCalendar] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${base_url}knowledge_graph/get_analysis_date`);
                setAnalysisDate(convert_analysis_date(response.data));
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      },[]);


    useEffect(() => {
        if(analysisDate){
            setCalendar(
                <DatePicker
                        selected={analysisDate[analysisDate.length - 1]}
                        onChange={onChangeRange}
                        startDate={startDate}
                        endDate={endDate}
                        includeDates={analysisDate}
                        selectsRange
                        selectsDisabledDaysInRange
                        inline
                    />
            )
        }
    },[analysisDate, endDate, startDate])

    const onChangeRange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);

    };

    const handleExportButton = async () => {
        if(startDate !== null && endDate != null){
            let start_date_parsed = new Date(startDate)
            let year = start_date_parsed.getFullYear();
            let month = (start_date_parsed.getMonth() + 1).toString().padStart(2,'0');
            let day = start_date_parsed.getDate().toString().padStart(2,'0');
            start_date_parsed = `${year}-${month}-${day}`;

            let end_date_parsed = new Date(endDate)
            year = end_date_parsed.getFullYear();
            month = (end_date_parsed.getMonth() + 1).toString().padStart(2,'0');
            day = end_date_parsed.getDate().toString().padStart(2,'0');
            end_date_parsed = `${year}-${month}-${day}`;

            const request_body = {
                analysis_date : [start_date_parsed,end_date_parsed]
            }
            const response = await axios.post(`${base_url}knowledge_graph/download`,request_body, {responseType: 'arraybuffer'});
            const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', 'analysis_data.zip'); 
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            setStartDate(new Date())
            setEndDate(null)
        }
    }
    
    
    return(
        <div>
            <p className=' w-70 p-3 border border-primary rounded mx-auto'>Here you can download the complete analyzes in csv format with the related log file which shows any problems in the analysis.<br/>
                        Specify a date range to download all analyzes available in that period. 
                        Every week a new analysis will be available!</p>
        <div className='text-center'>
            <div className='d-flex'>
                <div className='w-100 p-4'>
                        {analysisDate !== null ? (
                        <>
                        {calendar}
                        </>
                        ):(
                            <p>Loading analysis dates...</p>
                        )}
                        {startDate !== null && endDate !== null && (
                            <Button className='mb-2 mt-3' variant="btn btn-outline-success" onClick={handleExportButton}>
                            Export analysis
                            </Button>
                        )}
                    </div>
            </div>
            </div>
        </div>
    )


}

export default Download;