import React from 'react';
import { Routes, Route } from 'react-router-dom';
import "./../css/main.css";
import Dashboard from './dashboard/dashboard';
import ModelPage from './models/ModelPage';
import ProviderPage from './provider/ProviderPage'


function MainApp({ walletAddress, isWalletConnected }) {
    return (
        <main id="main" className='main'>

            <Routes>
                <Route path="/" element={
                    <>
                        <Dashboard />
                    </>
                } />
                <Route path="/model" element={
                    <>
                        <ModelPage />
                    </>
                } />
                <Route path="/provider" element={
                    <>
                        <ProviderPage walletAddress={walletAddress} isWalletConnected={isWalletConnected} />
                    </>
                } />
            </Routes>
        </main>
    );
}

export default MainApp;
