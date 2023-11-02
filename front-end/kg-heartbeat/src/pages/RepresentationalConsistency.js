import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

const repr_consistency = 'Representational-consistency';

function RepresentationalConsistency( {selectedKGs} ){
    const [reprConsData, setReprConsData] = useState(null);
    const [reprConsTable, setReprConsTable] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}representational/representational_consistency?id=${selectedKGs[0].id}`);
                setReprConsData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}representational/representational_consistency`,arrayIDs);
                setReprConsData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);
    

    useEffect(() => {
        if(reprConsData){
            if(selectedKGs.length === 1){
                let new_vocabs_count = (reprConsData[0].Quality_category_array[repr_consistency].newVocab).split(';').length;
                let new_terms_count = (reprConsData[0].Quality_category_array[repr_consistency].useNewTerms).split(';').length;
                if (new_vocabs_count === 1)
                    new_vocabs_count = '-'
                if (new_terms_count === 1)
                    new_terms_count = '-'
                const repr_cons_tab = (
                    <Table striped bordered hover>
                        <tr>
                            <th className='cell'>New vocabularies defined <br /> (better if none) ({new_vocabs_count})</th><th className='cell'>New terms defined <br />(better if none) ({new_terms_count})</th>
                        </tr>
                        <tr>
                            <td className='cell'><div className='scroll'>{reprConsData[0].Quality_category_array[repr_consistency].newVocab}</div></td>
                            <td className='cell'><div className='scroll'>{reprConsData[0].Quality_category_array[repr_consistency].useNewTerms}</div></td>
                        </tr>
                    </Table>
                )
                setReprConsTable(repr_cons_tab)
            } else if(selectedKGs.length >= 1){
                console.log(reprConsData)
                const repr_cons_tab = (
                    <Table striped bordered hover>
                        <tr>
                            <th className='cell'>KG name</th><th className='cell'>New vocabularies defined <br /> (better if none)</th><th className='cell'>New terms defined <br /> (better if none)</th>
                        </tr>
                        {reprConsData.map((item) => {
                            let new_vocabs_count = (item.Quality_category_array[repr_consistency].newVocab).split(';').length;
                            let new_terms_count = (item.Quality_category_array[repr_consistency].useNewTerms).split(';').length;
                            if (new_vocabs_count === 1)
                                new_vocabs_count = '-'
                            if (new_terms_count === 1)
                                new_terms_count = '-'
                            return(
                                <tr>
                                    <td className='cell'><div className='scroll'>{item.kg_name}</div></td>
                                    <td className='cell'><div className='scroll'>New vocabs counter:{new_vocabs_count}<br/>{item.Quality_category_array[repr_consistency].newVocab}</div></td>
                                    <td className='cell'><div className='scroll'>New terms counter:{new_terms_count}<br/>{item.Quality_category_array[repr_consistency].useNewTerms}</div></td>
                                </tr>
                            )
                        })}
                    </Table>   
                )
                setReprConsTable(repr_cons_tab)
            }
        }
    }, [reprConsData, selectedKGs])


    return (
        <div>
            <div className= "d-flex">
                <QualityBar selectedKGs={selectedKGs}/>
                {reprConsData && (
                <div className='w-100 p-3'> 
                    {reprConsTable}
                </div>    
        )}
            </div>
        </div>
    )

}

export default RepresentationalConsistency;