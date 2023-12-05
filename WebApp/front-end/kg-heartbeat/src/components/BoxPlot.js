import React from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);


function create_options(chart_title, series){
    const options = {
        chart: {
            type: 'boxplot'
        },
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: chart_title,
        },
        rangeSelector: {
            enabled:true
        },
        legend: {
            enabled: true
        },
        xAxis: {
            type:'datetime',
        },
        yAxis: {
            title: {
                text: 'Observations'
            },
        },
        series : series
    }

    return options
}

const BoxPlot = ({chart_title, kg_name, series}) => <HighchartsReact 
    highcharts={Highcharts}
    options={create_options(chart_title,series)}
/>

export default BoxPlot;