import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

function QualityBar({selectedKGs}) {
  return (
    <Nav defaultActiveKey="/home"  className="flex-column quality-navbar">
    <NavDropdown title="Accesibility" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1"><Link to="/pages/Availability" className='quality-link'>Availability</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2">Another action</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
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