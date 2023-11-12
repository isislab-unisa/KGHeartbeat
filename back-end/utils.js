function flat_data(quality_data,quality_dimensions){
  for(let i = 0; i<quality_dimensions.length; i++){
    quality_dimensions[i] = quality_dimensions[i].charAt(0).toUpperCase() + quality_dimensions[i].slice(1);
  }
    const flatData = quality_data.map(entry => {
        const flatEntry = { ...entry }; 
  
        for(let i = 0; i<quality_dimensions.length; i++){
            if (flatEntry[quality_dimensions[i]]) {
                for (const key in flatEntry[quality_dimensions[i]]) {
                    flatEntry[`${quality_dimensions[i]}_${key}`] = flatEntry[quality_dimensions[i]][key];
                }
                delete flatEntry[quality_dimensions[i]]; 
            }
        }
        

        return flatEntry;
    });
    return flatData
}

function filterUniqueObjects(list) {
    const uniqueObjects = [];
  
    list.forEach(obj => {
      // Check if an object with the same kg_id and analysis_date already exists
      const existingObject = uniqueObjects.find(
        o => o.kg_id === obj.kg_id && o.analysis_date === obj.analysis_date
      );
  
      // If not, add the object to the uniqueObjects list
      if (!existingObject) {
        uniqueObjects.push(obj);
      }
    });
  
    return uniqueObjects;
  }

module.exports = {flat_data, filterUniqueObjects}