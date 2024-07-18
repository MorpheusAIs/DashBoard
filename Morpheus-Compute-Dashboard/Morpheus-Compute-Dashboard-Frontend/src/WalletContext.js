// src/WalletContext.js
import React, { createContext, useState, useEffect } from 'react';

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const storedWalletConnected = localStorage.getItem('isWalletConnected') === 'true';
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (storedWalletConnected && storedWalletAddress) {
      setIsWalletConnected(true);
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const connectWallet = (address) => {
    setWalletAddress(address);
    setIsWalletConnected(true);
    localStorage.setItem('isWalletConnected', 'true');
    localStorage.setItem('walletAddress', address);
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsWalletConnected(false);
    localStorage.removeItem('isWalletConnected');
    localStorage.removeItem('walletAddress');
  };

  return (
    <WalletContext.Provider value={{ walletAddress, isWalletConnected, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};