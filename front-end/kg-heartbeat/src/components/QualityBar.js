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
        <NavDropdown.Divider />
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
    <NavDropdown title="Performance" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Performance" className='quality-link'>Low latency</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Performance" className='quality-link'>High Throughput</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Accuracy" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Accuracy" className='quality-link'>Empty annotation labels</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Accuracy" className='quality-link'>White space in annotation</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Consistency" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Consistency" className='quality-link'>Entities as members of disjoint classes</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Consistency" className='quality-link'>Misplaced classes or properties </Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Conciseness" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Conciseness" className='quality-link'>Intensional conciseness</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Conciseness" className='quality-link'>Extensional conciseness</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Reputation" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Reputation" className='quality-link'>PageRank</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Believability" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Believability" className='quality-link'>Meta-information about the indentity of information provider</Link></NavDropdown.Item>
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