import {  parseISO } from "https://cdn.skypack.dev/date-fns@2.28.0";

function trasform_to_series(quality_data,selectedKGs,quality_dimension,quality_metric,custom_series_name){
    let series = []
    for(let i = 0; i< selectedKGs.length; i++){
        let serie = {
            id : selectedKGs[i].id,
            name: custom_series_name,
            data : [],
            linkedTo: quality_metric,
            stack: ''
        }
        series.push(serie)
    }
    for(let i = 0; i < quality_data.length; i++){
        for(let j = 0; j<selectedKGs.length; j++){
            if (series[j].id === quality_data[i].kg_id){
                const tab_date = quality_data[i].analysis_date.split('-');
                const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                series[j].data.push([date_utc,parseFloat(quality_data[i].Quality_category_array[quality_dimension][quality_metric])])
                if(series[j].stack === '')
                    series[j].stack = quality_data[i].kg_name;
                if(series[j].name === '' || series[j].name === undefined)
                    series[j].name = quality_data[i].kg_name;
            }
        }
    }
    return series
}

/*This function is useful when we have analysis data over different time from the db, and we want to compact in an array with a number of values equal to the number of kg  */
function compact_temporal_data(quality_data,selectedKGs,quality_dimension,quality_metric){
    let series = []
    for(let i = 0; i< selectedKGs.length; i++){
        let serie = {
            id : selectedKGs[i].id,
            name: '',
            data : []
        }
        series.push(serie)
    }
    for(let i = 0; i < quality_data.length; i++){
        for(let j = 0; j<selectedKGs.length; j++){
            if (series[j].id === quality_data[i].kg_id){
                const tab_date = quality_data[i].analysis_date.split('-');
                const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                series[j].data.push([date_utc,quality_data[i].Quality_category_array[quality_dimension][quality_metric]])
                if(series[j].name === '')
                    series[j].name = quality_data[i].kg_name;
            }
        }
    }
    return series
}

function trasform_latency_to_series(quality_data,selectedKGs,quality_dimension){
    let series = []
    for(let i = 0; i< selectedKGs.length; i++){
        let serie = {
            id : selectedKGs[i].id,
            name: '',
            data : []
        }
        series.push(serie)
    }
    for(let i = 0; i < quality_data.length; i++){
        for(let j = 0; j<selectedKGs.length; j++){
            if (series[j].id === quality_data[i].kg_id){
                const tab_date = quality_data[i].analysis_date.split('-');
                const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                const  dimension_obj =  quality_data[i].Quality_category_array[quality_dimension]
                series[j].data.push([date_utc,parseFloat(dimension_obj.minLatency),parseFloat(dimension_obj.percentile25L),parseFloat(dimension_obj.medianL),parseFloat(dimension_obj.percentile75L),parseFloat(dimension_obj.maxLantency)])
                if(series[j].name === '')
                    series[j].name = quality_data[i].kg_name;
            }
        }
    }
    return series
}

function trasform_throughput_to_series(quality_data,selectedKGs,quality_dimension){
    let series = []
    for(let i = 0; i< selectedKGs.length; i++){
        let serie = {
            id : selectedKGs[i].id,
            name: '',
            data : []
        }
        series.push(serie)
    }
    for(let i = 0; i < quality_data.length; i++){
        for(let j = 0; j<selectedKGs.length; j++){
            if (series[j].id === quality_data[i].kg_id){
                const tab_date = quality_data[i].analysis_date.split('-');
                const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                const  dimension_obj =  quality_data[i].Quality_category_array[quality_dimension]
                series[j].data.push([date_utc,parseFloat(dimension_obj.minThroughput),parseFloat(dimension_obj.percentile25T),parseFloat(dimension_obj.medianT),parseFloat(dimension_obj.percentile75T),parseFloat(dimension_obj.maxThrougput)])
                if(series[j].name === '')
                    series[j].name = quality_data[i].kg_name;
            }
        }
    }
    return series
}

function get_analysis_date(quality_data){
    let parsed_date = []
    for(let i = 0; i<quality_data.length; i++){
        parsed_date.push(parseISO(quality_data[i].analysis_date))
    }   
    return parsed_date
}

function find_target_analysis(quality_data,analysis_date,selectedKGs){
    let target_analysis = [];
    for(let i = 0; i<selectedKGs.length; i++){
        for(let j = 0; j<quality_data.length; j++){
            if(selectedKGs[i].id === quality_data[j].kg_id && quality_data[j].analysis_date === analysis_date){
                target_analysis.push(quality_data[j])
            }
        }
    }

    return target_analysis;
}

function trasform_to_series_stacked(quality_data,selectedKGs,quality_dimension,quality_metrics, quality_metrics_label){
    let series = []
    for(let i = 0; i< quality_metrics.length; i++){
        let serie = {
            name: quality_metrics_label[i],
            data : [],
            minPointLength: 10,
        }
        for(let j = 0; j < quality_data.length; j++){
            let quality_category_array = quality_data[j].Quality_category_array;
            serie.data.push(parseFloat(quality_category_array[quality_dimension][quality_metrics[i]]))
        }
        series.push(serie);
    }
    return series
}

function remove_duplicates(arr){
    return arr.filter((item,index) => arr.indexOf(item) === index);
}

function series_for_polar_chart(analysis_selected,selectedKGs,quality_dimension){
    let series = [];
    for(let i = 0; i<selectedKGs.length; i++){
        let serie = {
            name : '',
            data: [],
        };
        for(let j = 0; j<analysis_selected.length; j++){
            if(selectedKGs[i].id === analysis_selected[j].kg_id){
                const consistency_obj = analysis_selected[j].Quality_category_array[quality_dimension];
                serie.data = [parseFloat(consistency_obj.deprecated),parseFloat(consistency_obj.triplesMC),parseFloat(consistency_obj.triplesMP),parseFloat(consistency_obj.undefinedClass),parseFloat(consistency_obj.undefinedProperties)];
                serie.name = analysis_selected[j].kg_name;
            }
        }
        series.push(serie);
    }

    return series
}

function trasform_to_series_conc(quality_data,selectedKGs,quality_dimension,quality_metric,custom_series_name,min_point){
    let series = []
    for(let i = 0; i< selectedKGs.length; i++){
        if(min_point){
            let serie = {
                name: custom_series_name,
                data : [],
                minPointLength: 10,
            }
            series.push(serie)
        }
        else{
            let serie = {
                name: custom_series_name,
                data : [],
                minPointLength: 10,
            }
            series.push(serie)
        }
    }
    for(let i = 0; i < quality_data.length; i++){
        for(let j = 0; j<selectedKGs.length; j++){
            if (selectedKGs[j].id === quality_data[i].kg_id){
                const tab_date = quality_data[i].analysis_date.split('-');
                const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                series[j].data.push([date_utc,parseFloat(quality_data[i].Quality_category_array[quality_dimension][quality_metric])])
            }
        }
    }
    return series
}

function trasform_history_data(quality_data,selectedKGs){
    let series = []
    for(let i = 0; i< selectedKGs.length; i++){
        let serie = {
            name: '',
            data : [],
        }
        series.push(serie)
    }
    for(let i = 0; i < quality_data.length; i++){
        for(let j = 0; j<selectedKGs.length; j++){
            if (selectedKGs[j].id === quality_data[i].kg_id){
                const historical_up = quality_data[i].Quality_category_array['Currency'].historicalUp;
                const historical_up_arr = historical_up.split(';')
                const data = historical_up_arr.map((item) =>{
                    const date = item.split('|')[0];
                    const triples_modified = item.split('|')[1];
                    const tab_date = date.split('-');
                    const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                    const data = [date_utc,parseInt(triples_modified)]  
                    
                    return data
                });
                series[j].data = data
                if(series[j].name === '' || series[j].name === undefined)
                    series[j].name = quality_data[i].kg_name;
            }
        }
    }
    return series
}

function trasform_to_series_compl(quality_data,selectedKGs,quality_dimension,quality_metric,custom_series_name){
    let series = []
    for(let i = 0; i< selectedKGs.length; i++){
        let serie = {
            name: custom_series_name,
            data : [],
        }
        series.push(serie)
    }
    for(let i = 0; i < quality_data.length; i++){
        for(let j = 0; j<selectedKGs.length; j++){
            if (selectedKGs[j].id === quality_data[i].kg_id){
                const tab_date = quality_data[i].analysis_date.split('-');
                const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                series[j].data.push([date_utc,parseFloat(quality_data[i].Quality_category_array[quality_dimension][quality_metric])])
                if(series[j].stack === '')
                    series[j].stack = quality_data[i].kg_name;
                if(series[j].name === '' || series[j].name === undefined)
                    series[j].name = quality_data[i].kg_name;
            }
        }
    }
    return series
}

function trasform_rep_conc_to_series(quality_data,selectedKGs,quality_dimension,min,perc25,median,perc75,max,series_name){
    let series = []
    for(let i = 0; i< selectedKGs.length; i++){
        let serie = {
            id : selectedKGs[i].id,
            name: series_name,
            data : []
        }
        series.push(serie)
    }
    for(let i = 0; i < quality_data.length; i++){
        for(let j = 0; j<selectedKGs.length; j++){
            if (series[j].id === quality_data[i].kg_id){
                const tab_date = quality_data[i].analysis_date.split('-');
                const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                const  dimension_obj =  quality_data[i].Quality_category_array[quality_dimension]
                series[j].data.push([date_utc,parseFloat(dimension_obj[min]),parseFloat(dimension_obj[perc25]),parseFloat(dimension_obj[median]),parseFloat(dimension_obj[perc75]),parseFloat(dimension_obj[max])])
            }
        }
    }
    return series
}

function trasform_rep_conc_to_series_multiple(quality_data,selectedKGs,quality_dimension,min,perc25,median,perc75,max,series_name){
    let series = []
    for(let i = 0; i< selectedKGs.length; i++){
        let serie = {
            id : selectedKGs[i].id,
            name: series_name,
            data : []
        }
        series.push(serie)
    }
    for(let i = 0; i < quality_data.length; i++){
        for(let j = 0; j<selectedKGs.length; j++){
            if (series[j].id === quality_data[i].kg_id){
                const tab_date = quality_data[i].analysis_date.split('-');
                const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                const  dimension_obj =  quality_data[i].Quality_category_array[quality_dimension]
                series[j].data.push([date_utc,parseFloat(dimension_obj[min]),parseFloat(dimension_obj[perc25]),parseFloat(dimension_obj[median]),parseFloat(dimension_obj[perc75]),parseFloat(dimension_obj[max])])
                if(series[j].name === '' || series[j].name === undefined)
                    series[j].name = quality_data[i].kg_name;
            }
        }
    }
    return series
}

function create_percentage_label_series(underst_data,amount_data,selectedKGs){
    let series = [];
    for(let i = 0; i<selectedKGs.length; i++){
        let serie = {
            name: '',
            data : []
        }
        series.push(serie)
    }
        for(let j = 0; j < selectedKGs.length; j++){
            for(let k = 0; k < underst_data.length; k++){
                if(underst_data[k].kg_id === selectedKGs[j].id){
                    const analysis_date = underst_data[k].analysis_date;
                    for(let i = 0; i<amount_data.length; i++){
                        if(underst_data[k].kg_id === amount_data[i].kg_id && analysis_date === amount_data[i].analysis_date){
                            const num_triples = parseInt(amount_data[i].Quality_category_array['Amount of data'].numTriples_merged);
                            const num_label = parseInt(underst_data[k].Quality_category_array['Understandability'].numLabel);
                            const percentage = num_label/num_triples * 100;
                            const tab_date = underst_data[k].analysis_date.split('-');
                            const date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                            series[j].data.push([date_utc,parseFloat(percentage.toFixed(2))]);
                            if(series[j].name === '')
                                series[j].name = underst_data[k].kg_name 
                        }
                    }
                }
            }
        }
    return series;
}

function extract_most_recent(quality_data,selectedKGs){
    let last_analysis = []
    for(let i = 0; i<selectedKGs.length; i++){
        const last_analysis_date = quality_data[quality_data.length -1].analysis_date;
        for(let j = 0; j<quality_data.length; j++){
            if(selectedKGs[i].id === quality_data[j].kg_id && last_analysis_date === quality_data[j].analysis_date){
                last_analysis.push(quality_data[j])
            }
        }
    }
    return last_analysis;
}

function add_believability_and_amount(under_data,believability_data,amount_data,selectedKGs){
    for(let i = 0; i<under_data.length; i++){
        for(let j = 0; j<believability_data.length; j++){
            if(under_data[i].kg_id === believability_data[j].kg_id){
                let quality_obj = under_data[i].Quality_category_array['Understandability'];
                quality_obj['title'] = believability_data[j].Quality_category_array['Believability'].title;
                quality_obj['description'] = believability_data[j].Quality_category_array['Believability'].description;
                quality_obj['URI'] = believability_data[j].Quality_category_array['Believability'].URI;
            }
        }
        for(let k = 0; k<amount_data.length;k++){
            if(under_data[i].kg_id === amount_data[k].kg_id && under_data[i].analysis_date === amount_data[k].analysis_date){
                let quality_obj = under_data[i].Quality_category_array['Understandability'];
                quality_obj['numTriples_merged'] = amount_data[k].Quality_category_array['Amount of data'].numTriples_merged;
            }
        }
    }
    return under_data
}

export {trasform_to_series,compact_temporal_data, trasform_latency_to_series, trasform_throughput_to_series, get_analysis_date, find_target_analysis,trasform_to_series_stacked, remove_duplicates, series_for_polar_chart, trasform_to_series_conc, trasform_history_data, trasform_to_series_compl, trasform_rep_conc_to_series, trasform_rep_conc_to_series_multiple, create_percentage_label_series,extract_most_recent,add_believability_and_amount};