function trasform_to_series(quality_data,selectedKGs){
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
                series[j].data.push([date_utc,parseInt(quality_data[i].Quality_category_array.Availability.sparqlEndpoint)])
                if(series[j].name === '')
                    series[j].name = quality_data[i].kg_name;
            }
        }
    }
    return series
}

export default trasform_to_series;