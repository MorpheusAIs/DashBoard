import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext(null);

const mainnetChainId = '0x1'; // Chain ID for Ethereum mainnet

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isMainnet, setIsMainnet] = useState(false);

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsWalletConnected(false);
    setIsMainnet(false);
  };

  useEffect(() => {
    checkWalletConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          await checkNetwork();
        }
      } catch (error) {
        console.error("Failed to check wallet connection");
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
    } else {
      setWalletAddress('');
      setIsWalletConnected(false);
    }
  };

  const handleChainChanged = () => {
    checkNetwork();
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setIsMainnet(chainId === mainnetChainId);
      } catch (error) {
        console.error("Error checking network");
        setIsMainnet(false);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        await checkNetwork();
      } catch (error) {
        console.error("Failed to connect wallet");
      }
    } else {
      console.error("Ethereum object not found, install MetaMask.");
    }
  };

  const switchToMainnet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: mainnetChainId }],
        });
      } catch (switchError) {
        console.error("Failed to switch to mainnet");
      }
    }
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      isWalletConnected,
      isMainnet,
      connectWallet,
      switchToMainnet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};