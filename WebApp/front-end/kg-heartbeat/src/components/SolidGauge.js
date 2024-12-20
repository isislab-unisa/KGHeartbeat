import Highcharts from "highcharts/highcharts.js";
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";

highchartsMore(Highcharts);
solidGauge(Highcharts);

function create_options(series,chart_title){

    const options = {
        chart:{
            type : 'solidgauge',
            renderTo: 'scoreChart',
        },
        title: chart_title,	
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: 
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        yAxis: {
            stops: [
                [0, '#32ff96'], // green
                ],
            lineWidth: 0,
            tickWidth: 0,
            minorTickInterval: null,
            tickAmount: 0,
            min: 0,
            max: 100,
            title: {
                text: chart_title
            }
        },
        series: [{
            
            name: chart_title,
            data: [series],
            dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4"></span>' +
                '</div>'
            },
        }]
    }

    return options;
}

const SolidGauge = ({series, chart_title}) => <HighchartsReact
    highcharts={Highcharts}
    options={create_options(series, chart_title)}
/>

export default SolidGauge;