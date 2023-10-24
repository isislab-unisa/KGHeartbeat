import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
//import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import { HashLink as Link } from 'react-router-hash-link';

function QualityBar({selectedKGs}) {
  return (
    <Nav defaultActiveKey="/home"  className="flex-column quality-navbar">
    <NavDropdown title="Availability" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1"><Link to="/pages/Availability#sparql" className='quality-link'>SPARQL endpoint</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2"><Link to="/pages/Availability#rdfdump" className='quality-link'>RDF dump</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3">Another action</NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Licensing" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Licensing" className='quality-link'>Machine-redeable license</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.6">Another action</NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Interlinking" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Interlinking" className='quality-link'>Degree of connection</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.6">Another action</NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Security" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Security" className='quality-link'>Access to data is secure</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.6">Another action</NavDropdown.Item>
    </NavDropdown>
  
    <Nav.Link href="/home">Test</Nav.Link>
    <Nav.Link eventKey="link-1">Link</Nav.Link>
    <Nav.Link eventKey="link-2">Link</Nav.Link>
    <div id="selectedKG" className='float-right'>
        <ListGroup>
          <ListGroup.Item><b>KG selected</b></ListGroup.Item>
          {selectedKGs.map((item) => (
            <ListGroup.Item key={item.id}>{item.id}</ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Nav>
  );
}

export default QualityBar;