import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Certificates from './certificates';

function App() {
return (
    <Router>
    <div className="App">
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certificates" element={<Certificates />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
