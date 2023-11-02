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
    <NavDropdown title="Verifiability" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Verifiability" className='quality-link'>Verifying publisher information</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Verifiability" className='quality-link'>Verifying autenticity of the dataset</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Verifiability" className='quality-link'>Verifying usage of digital signatures</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Currency" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Currency" className='quality-link'>Time since the last modification</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Currency" className='quality-link'>Specification of the modification date od statements</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Currency" className='quality-link'>Age of data</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Volatility" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Volatility" className='quality-link'>Timeliness frequency</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Completeness" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Completeness" className='quality-link'>Interlinking completeness</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Amount of data" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/AmountOfData" className='quality-link'>Number of triples</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/AmountOfData" className='quality-link'>Level of detail</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/AmountOfData" className='quality-link'>Scope</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Representational-conciseness" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/RepresentationalConciseness" className='quality-link'>Keeping URI short</Link></NavDropdown.Item>
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