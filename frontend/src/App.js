import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Eye from './components/Eye';
import Shree from './components/Shree';
import Dhantha from './components/Dhantha';
import Music from './components/Music';
import Kalaagruha from './components/Kalaagruha';
import Author from './components/Author';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Eye" element={<Eye />} />
          <Route path="/Shree" element={<Shree />} />
          <Route path="/Dhantha" element={<Dhantha />} />
          <Route path="/Music" element={<Music />} />
          <Route path="/Kalaagruha" element={<Kalaagruha />} />
          <Route path="/author" element={<Author />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;