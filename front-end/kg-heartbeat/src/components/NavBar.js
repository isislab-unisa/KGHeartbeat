import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import GitHubImg from '../img/github.svg'


function BasicExample({quality_link, score_link}) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/kgheartbeat">KGHeartbeat</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link><Link to="/pages/Search">Search</Link></Nav.Link>
          <Nav.Link><Link to="/pages/Ranking">KGs ranking</Link></Nav.Link>
          <Nav.Link><Link to="/pages/Download">Download analysis data </Link></Nav.Link>
          <Nav.Link>{quality_link}</Nav.Link>
          <Nav.Link>{score_link}</Nav.Link>
          </Nav>
          <Nav className='ml-auto'>
          <Nav.Link as={"a"}><a href="https://github.com/isislab-unisa/KGHeartbeat" target='blank'><img src={GitHubImg} alt="GitHub" width="30" height="30" /></a></Nav.Link>
          <Nav.Link as={"a"}><a href="https://isislab-unisa.github.io/KGHeartbeat/" target='blank'>How are the metrics calculated?</a></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;