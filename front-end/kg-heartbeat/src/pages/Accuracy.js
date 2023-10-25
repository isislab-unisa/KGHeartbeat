import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import { trasform_to_series } from '../utils';
import LineChartAccuracy from '../components/LineChartAccuracy';
import Form from 'react-bootstrap/Form';
import PolarChart from '../components/PolarChart';

const accuracy = 'Accuracy';

function Accuracy( {selectedKGs } ){
    const [accuracyData, setAccuracyData] = useState(null);
    const [accuracyChart, setAccuracyChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    
    
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
            console.log(accuracyData)
            const fp_series = trasform_to_series(accuracyData,selectedKGs,accuracy,'FPvalue','Functional property violation');
            const ifp_series = trasform_to_series(accuracyData,selectedKGs,accuracy,'IFPvalue','Inverse functional property violation');
            const empty_ann_series = trasform_to_series(accuracyData,selectedKGs,accuracy,'emptyAnn','Empty annotation labels');
            const malformed_series = trasform_to_series(accuracyData,selectedKGs,accuracy,'malformedDataType','Datatype consistency');
            const whitespace_ann = trasform_to_series(accuracyData,selectedKGs,accuracy,'wSA','White space in annotation');
            delete fp_series[0].id;
            delete ifp_series[0].id;
            delete empty_ann_series[0].id;
            delete malformed_series[0].id;
            delete whitespace_ann[0].id;
            const series = [fp_series[0],ifp_series[0],empty_ann_series[0],malformed_series[0],whitespace_ann[0]];
            if (selectedKGs.length === 1){
                if(!toggleSwitch)
                    setAccuracyChart(<LineChartAccuracy chart_title={'Accuracy'} series={series} y_min={0} y_max={1}/>)
                else{
                    const most_recent_analysis = accuracyData[accuracyData.length -1];
                    const accuracy_obj = most_recent_analysis.Quality_category_array.Accuracy;
                    const data = [parseFloat(accuracy_obj.emptyAnn),parseFloat(accuracy_obj.wSA),parseFloat(accuracy_obj.malformedDataType),parseFloat(accuracy_obj.FPvalue),parseFloat(accuracy_obj.IFPvalue)]
                    const series = [{name:most_recent_analysis.kg_name, data : data}]
                    const x_categories = ['Empty annotation labels','White space in annotation','Datatype consistency','Functional property violation','Inverse functional property violation'];
                    setAccuracyChart(<PolarChart chart_title={'Accuracy'} series={series} x_categories={x_categories} y_min={0} y_max={1} />)
                }
            } else if (selectedKGs.length >= 1){

            }
        }
    },[accuracyData, selectedKGs,toggleSwitch]);

    return(
        <div>
            <div className='d-flex'>
                <QualityBar selectedKGs={selectedKGs}/>
                    {accuracyData && (
                        <div className='w-100 p-3'>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label='Switch to see analysis by day'
                                checked={toggleSwitch}
                                onChange={() => setToggleSwitch(!toggleSwitch)}
                                />
                            {accuracyChart}
                        </div>
                    )}
            </div>
        </div>
    )
}

export default Accuracy;