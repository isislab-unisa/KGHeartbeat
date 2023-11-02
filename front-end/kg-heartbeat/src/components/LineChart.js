import React from 'react';
import Highcharts from "highcharts/highstock";
import HighchartsReact from 'highcharts-react-official';
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);


function create_options(chart_title,series,y_min,y_max,sub_title){

  const options = {
    chart: {
        type: "spline"
    }, 
    title: {
      text: chart_title
    },
    subtitle: {
      text: sub_title
    },
    xAxis: {
      type:'datetime',
    },
    rangeSelector: {
      enabled:true
  },
    yAxis:{
      min: y_min,
      max: y_max
    },
    tooltip: {
      shared: true
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
const LineChart = ({chart_title, series, y_min, y_max, sub_title}) => <HighchartsReact
  //containerProps = {{style: {width: "80%"}}}
  highcharts={Highcharts}
  options={create_options(chart_title,series, y_min, y_max,sub_title)}
/>

export default LineChart