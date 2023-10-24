import React, { useEffect, useState } from 'react';
import { base_url } from '../api';
import axios from 'axios';
import QualityBar from '../components/QualityBar';
import { trasform_latency_to_series, trasform_throughput_to_series} from '../utils';
import BoxPlot from '../components/BoxPlot';

const performance = 'Performance'

function Performance( {selectedKGs} ){
    const [performanceData, setPerformanceData] = useState(null);
    const [latencyChart, setLatencyChart] = useState(null);
    const [throughputChart, setThroughputChart] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}accessibility/performance?id=${selectedKGs[0].id}`);
                setPerformanceData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}accessibility/performance`,arrayIDs);
                setPerformanceData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
    }, [selectedKGs]);


    useEffect(() => {
        if(performanceData){
            const latency_series = trasform_latency_to_series(performanceData,selectedKGs,performance);
            const throughput_series = trasform_throughput_to_series(performanceData,selectedKGs,performance);
            if(selectedKGs.length === 1){
                setLatencyChart(<BoxPlot chart_title={'Low Latency'}  series={latency_series}/>);
                setThroughputChart(<BoxPlot chart_title={'High Throughput'} series={throughput_series}/>)
            }else if(selectedKGs.length >= 1){
                setLatencyChart(<BoxPlot chart_title={'Low Latency'} series={latency_series}/>);
                setThroughputChart(<BoxPlot chart_title={'High Throughput'} series={throughput_series}/>)
            }
        }
    }, [performanceData, selectedKGs])


    return(
        <div>
            <div className='d-flex'>
                <QualityBar selectedKGs={selectedKGs}/>
                {performanceData && (
                    <div className='w-100 p-3'>
                        {latencyChart}
                        {throughputChart}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Performance;
