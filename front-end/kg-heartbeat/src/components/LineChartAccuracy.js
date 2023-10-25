import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from "highcharts/highstock";

function create_options(chart_title,series,y_min,y_max,sub_title){

  const options = {
    chart: {
        type: "spline"
    }, 
    title: {
      text: chart_title
    },
    subtitle: {
      text: sub_title,
    },
    tooltip: {
      headerFormat: '<span style=" border:0px">{point.key}</span><table style="width=100%; border:0px">: ',
      pointFormat: '<tr><td id="legendAcc" style="color:{series.color};padding:0">{series.name}: </td> ' +
      '<td style="padding:0"><b>{point.y}</b></td></tr> ',
      footerFormat: '</table>',
      shared: true,
      useHTM: true,
    },
    rangeSelector: {
        enabled:true
    },
    xAxis: {
      type:'datetime',
    },
    yAxis: {
        min: y_min,
        max: y_max,
        title: {
            text: 'Number of triples'
        },
        plotOptions: {
            series:{
                minPointLength:3
            },
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        plotLines: [{ 
            width:2,
            value: 1,
            color: '#28FF49',
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
const LineChartAccuracy = ({chart_title, series, y_min, y_max,sub_title}) => <HighchartsReact
  //containerProps = {{style: {width: "80%"}}}
  highcharts={Highcharts}
  options={create_options(chart_title,series, y_min, y_max, sub_title)}
/>

export default LineChartAccuracy;