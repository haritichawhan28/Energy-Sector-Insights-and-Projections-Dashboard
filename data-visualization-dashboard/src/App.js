import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import CityChart from "./components/CityChart";
import LineChart from "./components/LineChart";
import RegionChart from "./components/RegionChart";
import TimelineChart from "./components/TimelineChart";
import TopicsChart from "./components/TopicsChart";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/city" element={<CityChart />} />
        <Route path="/line" element={<LineChart />} />
        <Route path="/region" element={<RegionChart />} />
        <Route path="/timeline" element={<TimelineChart />} />
        <Route path="/topics" element={<TopicsChart />} />
      </Routes>
    </Router>
  );
}

export default App;
