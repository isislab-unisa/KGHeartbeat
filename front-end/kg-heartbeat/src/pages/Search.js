import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Search({searchResults, handle_search, selectedKGs, handleSelectedDataChange}){
    
    return(

        <Container fluid="md">
            <Row>
                <Col md="12">
                <h2>Search the KGs</h2>
                <SearchBar onSearch={handle_search} />
                </Col>
                </Row>
                <Row>
                <SearchResults results={searchResults} selected={selectedKGs} onCheckboxChange={handleSelectedDataChange} />
                </Row>
        </Container>
    )
}

export default Search;
