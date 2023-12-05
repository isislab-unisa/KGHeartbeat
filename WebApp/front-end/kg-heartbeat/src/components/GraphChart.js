import React from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';

function create_options(kg_name,series){
    const options = {
        chart : {
            type : 'networkgraph'
        },
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: 'External links',
        },
        subtitle: {
            text:kg_name,
            style:{
                fontSize:'24px'
            }
        },
        plotOptions: {
            networkgraph: {
                keys: ['from', 'to'],
                layoutAlgorithm: {
                    enableSimulation: true,
                    friction: -0.9
                }
            }
        },
        series: series
    }

    return options
}

const GraphChart = ({kg_name,series}) => <HighchartsReact
    highcharts={Highcharts}
    options={create_options(kg_name,series)}
></HighchartsReact>

export default GraphChart