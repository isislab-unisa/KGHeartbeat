function trasform_to_series(quality_data,selectedKGs,quality_dimension,quality_metric){
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
                series[j].data.push([date_utc,parseInt(quality_data[i].Quality_category_array[quality_dimension][quality_metric])])
                if(series[j].name === '')
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

export {trasform_to_series,compact_temporal_data, trasform_latency_to_series, trasform_throughput_to_series};