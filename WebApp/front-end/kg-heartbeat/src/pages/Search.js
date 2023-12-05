import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Search({searchResults, handle_search, selectedKGs, handleSelectedDataChange}){
    
    return(

        <Container className='w-100 p-3'>
            <Row>
                <Col md="12">
                <div className='text-center'>
                <h2>Search the KGs</h2>
                <SearchBar onSearch={handle_search} />
                </div>
                </Col>
                </Row>
                <Row>
                <SearchResults results={searchResults} selected={selectedKGs} onCheckboxChange={handleSelectedDataChange} />
                </Row>
        </Container>
    )
}

export default Search;
