import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import QualityData from './pages/QualityData';
import Search from './pages/Search';
import NavBar from './components/NavBar';
import Availability from './pages/Availability';
import Licensing from './pages/Licensing';
import Interlinking from './pages/Interlinking';
import Security from './pages/Security';
import Performance from './pages/Performance';
import Accuracy from './pages/Accuracy';
import Consistency from './pages/Consistency';
import Conciseness from './pages/Conciseness';
import Reputation from './pages/Reputation';
import Believability from './pages/Believability';
import Verifiability from './pages/Verifiability';
import Currency from './pages/Currency';
import Volatility from './pages/Volatility';
import Completeness from './pages/Completeness';
import AmountOfData from './pages/AmountOfData';
import RepresentationalConciseness from './pages/RepresentationalConciseness';
import RepresentationalConsistency from './pages/RepresentationalConsistency';
import Understandability from './pages/Understandability';
import Interpretability from './pages/Interpretability';
import Versatility from './pages/Versatility';
import Score from './pages/Score';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedKGs, setKG] = useState([]);

  const handle_search = (results) => {
    setSearchResults(results);
  };

  const handleSelectedDataChange = (newKG) => {
    setKG(newKG);
  }

  let content, score_link;
  if(selectedKGs.length > 0){
    content = <Link to="/pages/QualityData">View Quality</Link>
    score_link = <Link to="/pages/Score">View Score</Link>
  }

  return (
    <div>
    <Router>
      <NavBar quality_link={content} score_link={score_link}/>
        <Routes>
          <Route path="/pages/QualityData" component={QualityData} element={<QualityData selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Search" component={Search} element={<Search searchResults={searchResults} handle_search={handle_search} selectedKGs={selectedKGs} handleSelectedDataChange={handleSelectedDataChange}/>}/>
          <Route path="/pages/Availability" component={Availability} element={<Availability selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Licensing" component={Licensing} element={<Licensing selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Interlinking" component={Interlinking} element={<Interlinking selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Security" component={Security} element={<Security selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Performance" component={Performance} element={<Performance selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Accuracy" component={Accuracy} element={<Accuracy selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Consistency" component={Consistency} element={<Consistency selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Conciseness" component={Conciseness} element={<Conciseness selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Reputation" component={Reputation} element={<Reputation selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Believability" component={Believability} element={<Believability selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Verifiability" component={Verifiability} element={<Verifiability selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>
          <Route path="/pages/Currency" component={Currency} element={<Currency selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>        
          <Route path="/pages/Volatility" component={Volatility} element={<Volatility selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>        
          <Route path="/pages/Completeness" component={Completeness} element={<Completeness selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>        
          <Route path="/pages/AmountOfData" component={AmountOfData} element={<AmountOfData selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>        
          <Route path="/pages/RepresentationalConciseness" component={RepresentationalConciseness} element={<RepresentationalConciseness selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>        
          <Route path="/pages/RepresentationalConsistency" component={RepresentationalConsistency} element={<RepresentationalConsistency selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>        
          <Route path="/pages/Understandability" component={Understandability} element={<Understandability selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>        
          <Route path="/pages/Interpretability" component={Interpretability} element={<Interpretability selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>                
          <Route path="/pages/Versatility" component={Versatility} element={<Versatility selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>                
          <Route path="/pages/Score" component={Score} element={<Score selectedKGs={selectedKGs} setSelectedKGs={setKG}/>}/>                
       </Routes>
    </Router>
    </div>
  );
}

export default App;
