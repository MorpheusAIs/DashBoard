import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { WalletProvider } from './WalletContext';
import MainNavbar from './components/MainNavbar';
import RewardClaimProcess from './components/RewardClaimProcess';
import TokenArrivalCheck from './components/TokenArrivalCheck';
import './css/global/styles.css'

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="App">
          <MainNavbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<RewardClaimProcess />} />
              <Route path="/check-tokens" element={<TokenArrivalCheck />} />
            </Routes>
          </div>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;