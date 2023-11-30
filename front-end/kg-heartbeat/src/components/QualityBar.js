import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { HashLink as Link } from 'react-router-hash-link';
import RemoveImg from '../img/remove.png'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QualityBar({selectedKGs, setSelectedKG}) {
    let navigate = useNavigate(); 
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleOnChangeRemove = (kg_id) => {
        if(selectedKGs.length > 1){
            setSelectedKG(selectedKGs.filter((item) => item !== kg_id))
        } else if(selectedKGs.length === 1){
            setSelectedKG(selectedKGs.filter((item) => item !== kg_id))
            navigate('/pages/Search/');
        }

      };

    
    const handleMouseEnter = (eventKey) => {
        setOpenDropdown(eventKey);
    };

    const handleMouseLeave = () => {
        setOpenDropdown(null);
    };


  return (
    <Nav defaultActiveKey="/home"  className="flex-column quality-navbar">
    <NavDropdown title="Availability" id="nav-dropdown" show={openDropdown === 'Availability'} onMouseEnter={() => handleMouseEnter('Availability')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.1"><Link to="/pages/Availability" className='quality-link'>SPARQL endpoint</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2"><Link to="/pages/Availability" className='quality-link'>RDF dump</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2"><Link to="/pages/Availability" className='quality-link'>Derefereaceability of the URI</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2"><Link to="/pages/Availability" className='quality-link'>Inactive links</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Licensing" id="nav-dropdown"  show={openDropdown === 'Licensing'} onMouseEnter={() => handleMouseEnter('Licensing')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Licensing" className='quality-link'>Machine-redeable license</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Licensing" className='quality-link'>Human-redeable license</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Interlinking" id="nav-dropdown" show={openDropdown === 'Interlinking'} onMouseEnter={() => handleMouseEnter('Interlinking')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Interlinking" className='quality-link'>Degree of connection</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Interlinking" className='quality-link'>Clustering coefficient</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Interlinking" className='quality-link'>Centrality</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Interlinking" className='quality-link'>Number of same as chains</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Security" id="nav-dropdown" show={openDropdown === 'Security'} onMouseEnter={() => handleMouseEnter('Security')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Security" className='quality-link'>Access to data is secure</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Performance" id="nav-dropdown" show={openDropdown === 'Performance'} onMouseEnter={() => handleMouseEnter('Performance')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Performance" className='quality-link'>Low latency</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Performance" className='quality-link'>High Throughput</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Accuracy" id="nav-dropdown" show={openDropdown === 'Accuracy'} onMouseEnter={() => handleMouseEnter('Accuracy')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Accuracy" className='quality-link'>Empty annotation labels</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Accuracy" className='quality-link'>White space in annotation</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Accuracy" className='quality-link'>Datatype consistency</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Accuracy" className='quality-link'>Functional property violations</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Accuracy" className='quality-link'>Inverse functional violation</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Consistency" id="nav-dropdown" show={openDropdown === 'Consistency'} onMouseEnter={() => handleMouseEnter('Consistency')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Consistency" className='quality-link'>Entities as members of disjoint classes</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Consistency" className='quality-link'>Misplaced classes or properties </Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Consistency" className='quality-link'>Use of members of deprecated classes or properties</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Conciseness" id="nav-dropdown" show={openDropdown === 'Conciseness'} onMouseEnter={() => handleMouseEnter('Conciseness')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Conciseness" className='quality-link'>Intensional conciseness</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Conciseness" className='quality-link'>Extensional conciseness</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Reputation" id="nav-dropdown" show={openDropdown === 'Reputation'} onMouseEnter={() => handleMouseEnter('Reputation')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Reputation" className='quality-link'>Reputation of the dataset</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Believability" id="nav-dropdown" show={openDropdown === 'Believability'} onMouseEnter={() => handleMouseEnter('Believability')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Believability" className='quality-link'>Meta-information about the indentity of information provider</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Verifiability" id="nav-dropdown" show={openDropdown === 'Verifiability'} onMouseEnter={() => handleMouseEnter('Verifiability')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Verifiability" className='quality-link'>Verifying publisher information</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Verifiability" className='quality-link'>Verifying autenticity of the dataset</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Verifiability" className='quality-link'>Verifying usage of digital signatures</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Currency" id="nav-dropdown" show={openDropdown === 'Currency'} onMouseEnter={() => handleMouseEnter('Currency')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Currency" className='quality-link'>Update history</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Currency" className='quality-link'>Time since the last modification</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Currency" className='quality-link'>Specification of the modification date od statements</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Currency" className='quality-link'>Age of data</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Volatility" id="nav-dropdown" show={openDropdown === 'Volatility'} onMouseEnter={() => handleMouseEnter('Volatility')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Volatility" className='quality-link'>Timeliness frequency</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Completeness" id="nav-dropdown" show={openDropdown === 'Completeness'} onMouseEnter={() => handleMouseEnter('Completeness')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Completeness" className='quality-link'>Interlinking completeness</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Amount of data" id="nav-dropdown" show={openDropdown === 'Amount of data'} onMouseEnter={() => handleMouseEnter('Amount of data')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/AmountOfData" className='quality-link'>Number of triples</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/AmountOfData" className='quality-link'>Level of detail</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/AmountOfData" className='quality-link'>Scope</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Representational-conciseness" id="nav-dropdown" show={openDropdown === 'Representational-conciseness'} onMouseEnter={() => handleMouseEnter('Representational-conciseness')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/RepresentationalConciseness" className='quality-link'>Keeping URI short</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/RepresentationalConciseness" className='quality-link'>Re-use of exsisting terms</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Representational-consistency" id="nav-dropdown" show={openDropdown === 'Representational-consistency'} onMouseEnter={() => handleMouseEnter('Representational-consistency')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/RepresentationalConsistency" className='quality-link'>Re-use of existing vocabularies</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/RepresentationalConsistency" className='quality-link'>Re-use of existing terms</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Understandability" id="nav-dropdown" show={openDropdown === 'Understandability'} onMouseEnter={() => handleMouseEnter('Understandability')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Understandability" className='quality-link'>Human-readable labelling </Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Understandability" className='quality-link'>Indication of some example</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Understandability" className='quality-link'>Indication of metadata about a dataset</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Understandability" className='quality-link'>Indication of a regular expression</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Understandability" className='quality-link'>Indication of the vocabularies used in the dataset</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Interpretability" id="nav-dropdown" show={openDropdown === 'Interpretability'} onMouseEnter={() => handleMouseEnter('Interpretability')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Interpretability" className='quality-link'>No misinterpretation of missing values</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Interpretability" className='quality-link'>Atypical use of collections, containers and reification</Link></NavDropdown.Item>
    </NavDropdown>
    <NavDropdown title="Versatility" id="nav-dropdown" show={openDropdown === 'Versatility'} onMouseEnter={() => handleMouseEnter('Versatility')} onMouseLeave={handleMouseLeave}>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Versatility" className='quality-link'>Usage of multiple languages</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Versatility" className='quality-link'>Different serialization formats</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.5"><Link to="/pages/Versatility" className='quality-link'>Accessing of data in different ways</Link></NavDropdown.Item>
    </NavDropdown>

    <div id="selectedKG-tab" className='float-right'>
        <p id='selectedKGs-text'> Selected KGs</p>
          {selectedKGs.map((item) => {
            return(
                <>
                    <input 
                    type='image' 
                    src={RemoveImg} 
                    alt='remove'
                    id={item}
                    name={item}
                    value={item}
                    className="kg-del-btn"
                    onClick={() => handleOnChangeRemove(item)}/>
                    <span className='btn-text'>{item.id && item.id.includes('|') ? item.id.split('|')[1] : item.id}</span><br/>
                </>
            )
        })}
      </div>
    </Nav>
  );
}

export default QualityBar;