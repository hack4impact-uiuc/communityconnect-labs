import React from "react";
import Sample from "./sample";
import MapBox from "./mapbox";
import "../styles/App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Route path="/" component={Sample} />
        <Route path="/map" component={MapBox} />
      </div>
    </Router>
  );
}

export default App;
