import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { base_url } from '../api';
import { score_for_dimension_kgs } from '../utils';
import MaterialTable from '../components/MaterialTable';

const MAX_SCORE = 54

function Ranking(){
    const [kgsData, setKgsData] = useState(null);
    const [KGsRanking, setKGranking] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${base_url}score/get_all`);
                setKgsData(response.data)
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
    },[]);
    
    useEffect(() => {
        if(kgsData){
            const columns = [
                {
                    accessorKey: 'kgname',
                    header: 'KG name',
                    size: 150,
                },
                {
                    accessorKey: 'score',
                    header: 'Score',
                    size: 5,
                },
                {
                    accessorKey: 'availability',
                    header: 'Availability score',
                    size: 5,
                },
                {
                    accessorKey: 'licensing',
                    header: 'Licensing score',
                    size: 5,
                },
                {
                    accessorKey: 'interlinking',
                    header: 'Interlinking score',
                    size: 5,
                },
                {
                    accessorKey: 'performance',
                    header: 'Performance score',
                    size: 5,
                },
                {
                    accessorKey: 'accuracy',
                    header: 'Accuracy score',
                    size: 5,
                },
                {
                    accessorKey: 'consistency',
                    header: 'Consistency score',
                    size: 5,
                },
                {
                    accessorKey: 'conciseness',
                    header: 'Conciseness score',
                    size: 5,
                },
                {
                    accessorKey: 'verifiability',
                    header: 'Verifiability score',
                    size: 5,
                },
                {
                    accessorKey: 'reputation',
                    header: 'Reputation score',
                    size: 5,
                },
                {
                    accessorKey: 'believability',
                    header: 'Believability score',
                    size: 5,
                },
                {
                    accessorKey: 'currency',
                    header: 'Currency score',
                    size: 5,
                },
                {
                    accessorKey: 'volatility',
                    header: 'Volatility score',
                    size: 5,
                },
                {
                    accessorKey: 'completeness',
                    header: 'Completeness score',
                    size: 5,
                },
                {
                    accessorKey: 'amount',
                    header: 'Amount of data score',
                    size: 5,
                },
                {
                    accessorKey: 'repCons',
                    header: 'Representational-Consistency score',
                    size: 5,
                },
                {
                    accessorKey: 'repConc',
                    header: 'Representational-Conciseness score',
                    size: 5,
                },
                {
                    accessorKey: 'understandability',
                    header: 'Understandability score',
                    size: 5,
                },
                {
                    accessorKey: 'interpretability',
                    header: 'Interpretability score',
                    size: 5,
                },
                {
                    accessorKey: 'versatility',
                    header: 'Versatility score',
                    size: 5,
                },
                {
                    accessorKey: 'security',
                    header: 'Security score',
                    size: 5,
                }
            ]
            const data = score_for_dimension_kgs(kgsData,MAX_SCORE);
            setKGranking(<MaterialTable columns_value={columns} data_table={data}/>)
        }

    },[kgsData])

    return(
        <div>
            <div className='d-flex'>
                <div className='w-100 p-4'>
                    {kgsData && KGsRanking}
                </div>
            </div>
        </div>
    )


}

export default Ranking;