import React from 'react';
import Highcharts from "highcharts/highstock";
import HighchartsReact from 'highcharts-react-official';
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);


function create_options(chart_title,series,y_min,y_max,y_label){

  const options = {
    chart: {
        type: 'spline'
    },
    title: {
        style:{
            fontSize:'30px',
            fontWeight:'bold'
        },
        text: chart_title
    },
    tooltip: {
        shared: true,
    },
    rangeSelector: {
        enabled:true
    },
    xAxis: {
        type:'datetime',
    },
    yAxis: {
        min:y_min,
        max:y_max,
        title: {
            text: y_label
        },
        plotLines: [{ 
            width:2,
            value: 1,
            color: '#0090eacc',
            label: { 
                style:{
                    color:'#0090eacc',
                    fontSize:'15px',
                    fontWeight:'bold'
                },
            text: 'Best value: 1', // Content of the label. 
            align: 'left', // Positioning of the label. 
            }
        }],
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: series
}

  return options
}

  /*
const addSeries = () => {
    const chart = this.refs.chart.chart;

    chart.addSeries({
        name: 'nuova serie',
        data: [[5,2],[4,2]]
    })
}
*/
const ConcisenessChart = ({chart_title, series, y_min, y_max, y_label}) => <HighchartsReact
  //containerProps = {{style: {width: "80%"}}}
  highcharts={Highcharts}
  options={create_options(chart_title,series, y_min, y_max, y_label)}
/>

export default ConcisenessChart;