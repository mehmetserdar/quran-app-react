import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './components/HomePage';
import SurahList from './components/SurahList';
import SurahDetailApi from './components/SurahDetailApi';
import DuaList from './components/DuaList';
import DuaDetail from './components/DuaDetail';
import Counter from './components/Counter';
import Settings from './components/Settings';
import Bookmark from './components/Bookmark';
import Privacy from './components/Privacy';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/surah-list" element={<SurahList />} />
            <Route path="/surah/:id" element={<SurahDetailApi />} />
            <Route path="/dua-list" element={<DuaList />} />
            <Route path="/dua/:id" element={<DuaDetail />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
