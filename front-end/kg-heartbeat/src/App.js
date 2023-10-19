import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import QualityData from './pages/QualityData';
import Search from './pages/Search';
import NavBar from './components/NavBar';
import Availability from './pages/Availability';
import Licensing from './pages/Licensing';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedKGs, setKG] = useState([]);

  const handle_search = (results) => {
    setSearchResults(results);
  };

  const handleSelectedDataChange = (newKG) => {
    setKG(newKG);
  }

  let content;
  if(selectedKGs.length > 0){
    content = <Link to="/pages/QualityData">View Quality</Link>
  }

  console.log(selectedKGs)
  return (
    <div>
    <Router>
      <NavBar quality_link={content}/>
        <Routes>
          <Route path="/pages/QualityData" component={QualityData} element={<QualityData selectedKGs={selectedKGs}/>}/>
          <Route path="/pages/Search" component={Search} element={<Search searchResults={searchResults} handle_search={handle_search} selectedKGs={selectedKGs} handleSelectedDataChange={handleSelectedDataChange}/>}/>
          <Route path="/pages/Availability" component={Availability} element={<Availability selectedKGs={selectedKGs}/>}/>
          <Route path="/pages/Licensing" component={Licensing} element={<Licensing selectedKGs={selectedKGs}/>}/>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
