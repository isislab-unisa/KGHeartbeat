import React from 'react';
import Highcharts from "highcharts/highstock";
import HighchartsReact from 'highcharts-react-official';


function create_options(chart_title,series,y_min,y_max){

  const options = {
    chart: {
        type: "spline"
    }, 
    title: {
      text: chart_title
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
const LineChart = ({chart_title, series, y_min, y_max}) => <HighchartsReact
  //containerProps = {{style: {width: "80%"}}}
  highcharts={Highcharts}
  options={create_options(chart_title,series, y_min, y_max)}
/>

export default LineChart