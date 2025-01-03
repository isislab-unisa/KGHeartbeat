import Table from 'react-bootstrap/Table';
import { compare_date, compare_date_array } from '../utils';

function PersonalTable({series,title, analysis_date}){
    console.log(series)
    for(let i = 0; i < series.length; i++){
        series[i].data.sort(compare_date_array)
    }
    analysis_date.sort(compare_date)
    return(
        <div>
            <p>{title}</p>
            <Table striped bordered hover>
                <tr>
                    <td className='cell' style={{fontSize: '18px'}}>KG name</td>
                    {analysis_date.map((item) => {
                        const data = new Date(item.analysis_date)
                        const year = data.getFullYear();
                        const month = (data.getMonth() + 1).toString().padStart(2,'0');
                        const day = data.getDate().toString().padStart(2,'0');
                        const parsed_data = `${year}-${month}-${day}`;
                        return <td className='cell' style={{fontSize: '18px', minWidth: "135px"}}>{parsed_data}</td>     
                    })}
                </tr>
                    {series.map((item) => (
                     <tr><td className='cell' style={{fontSize: '18px'}}>{item.name}</td>
                     {item.data.map((item) => {
                        let color;
                        let sparql_value;
                        if(item[1] === 1){
                            color = '#00ea89';
                            sparql_value = 'Online'
                        }
                        else if (item[1] === 0){
                            color = '#ff6666';
                            sparql_value = 'Offline'
                        }
                        else if(item[1] === -1){
                            color = 'grey';
                            sparql_value = '-'
                        }
                        else{
                            color = 'white';
                            sparql_value = '-'
                        }
                        return <td style={{backgroundColor: color, fontSize: '18px'}}>{sparql_value}</td>
                    })}
                    </tr>
                    ))}
            </Table>
        </div>
    )
}

export default PersonalTable;