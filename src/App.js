import React, {useState, useEffect} from 'react';
import './App.css';
import LeftPane from './components/LeftPane';
import RightPane from './components/RightPane';
import moment from 'moment';

function App() {
  const [activeDates, setActiveDates] = useState([new Date()]);
  const [currentColor, setCurrentColor] = useState("#7f5ffb");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  useEffect(()=>{
    const dateStringFormat = moment(activeDates[activeDates.length-1]).format("ddd, MMM Do");
    const header = document.querySelectorAll(`div[title*="Scroll to ${dateStringFormat}"] .Cal__Header__date`);
    header[0].click();
  },[activeDates])
  return (
    <div className="App">
      <div className="App__LeftPaneContainer">
        <LeftPane setActiveDates={setActiveDates} setCurrentColor={setCurrentColor} setShowScrollToTop={setShowScrollToTop} />
      </div>
      <div className="App__RightPaneContainer">
        <RightPane activeDates={activeDates} currentColor={currentColor} showScrollToTop={showScrollToTop}/>
      </div>
    </div>
  );
}

export default App;
