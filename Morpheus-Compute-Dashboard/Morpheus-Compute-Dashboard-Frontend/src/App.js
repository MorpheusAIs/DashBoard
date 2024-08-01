// App.js
import logo from './logo.svg';
import './App.css';
import MainNavbar from './components/navbar/main_navbar';
import SubNavbar from './components/navbar/sub_navbar';
import MainApp from './components/main_app';
import React, { useState, createContext } from 'react';
import { WalletProvider } from './WalletContext';

export const ModelStateContext = createContext(null);

function App() {
  const [model, setModel] = useState("")
  const handleToggleSideBar = () => {
    document.body.classList.toggle('toggle-sidebar');
  };

  return (
    <WalletProvider>
      <div className="">
        <MainNavbar />
        <div className="main2">
          <SubNavbar />
          <ModelStateContext.Provider value={{ model, setModel }} >
            <MainApp />
          </ModelStateContext.Provider>
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;