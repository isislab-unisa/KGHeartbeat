import Table from 'react-bootstrap/Table';

function PersonalTable({series,title}){
    const serie = series[0]
    return(
        <div>
            <p>{title}</p>
            <Table striped bordered hover>
                <tr>
                    <td className='cell' style={{fontSize: '18px'}}>KG name</td>
                    {serie.data.map((item) => {
                        const data = new Date(item[0])
                        const parsed_data = data.toLocaleDateString(); 
                        return <td className='cell' style={{fontSize: '18px'}}>{parsed_data}</td>     
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