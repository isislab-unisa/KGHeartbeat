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
    tooltip:{
        formatter: function(){
            if(this.y === 1){
                return Highcharts.dateFormat('%Y %B %e',this.x) + '<br> RDF dump: <p style="color:#90ed7d"><b>Online</b></p>'
            } else if(this.y === 0){
                return Highcharts.dateFormat('%Y %B %e',this.x) + '<br> RDF dump: <p style="color:#fd5e53"><b>Offline</b></p>'
            } else if (this.y === -1){
                return Highcharts.dateFormat('%Y %B %e',this.x) + '<br> RDF dump: <p style="color:#fd5e53"><b>Absent</b></p>'
            }
        }
    },
    rangeSelector: {
      enabled:true
  },
  legend:{
    itemStyle: {
        fontSize:'15px',
        font: '13pt Trebuchet MS, Verdana, sans-serif',
        color: '#A0A0A0'
    },
    enabled: true,
    layout : 'vertical',
    labelFormatter: function (){
        return 'RDF dump status:<br> <p style="color:#fd5e53">Absent:-1</p>&nbsp &nbsp;<p style="color:#fd5e53">Offline:0</p>&nbsp &nbsp;<p style="color:#90ed7d">Online:1</p>';
    }
},
  plotOptions: {
    series: {
      marker: {
        enabled: true
      }
    }
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
const RDFDumpAvChart = ({chart_title, series, y_min, y_max, sub_title}) => <HighchartsReact
  //containerProps = {{style: {width: "80%"}}}
  highcharts={Highcharts}
  options={create_options(chart_title,series, y_min, y_max,sub_title)}
/>

export default RDFDumpAvChart;