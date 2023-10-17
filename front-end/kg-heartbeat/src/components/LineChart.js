import React from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';


function create_options(chart_title,series){

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
const LineChart = ({chart_title, series}) => <HighchartsReact
  //containerProps = {{style: {width: "80%"}}}
  highcharts={Highcharts}
  options={create_options(chart_title,series)}
/>

export default LineChart