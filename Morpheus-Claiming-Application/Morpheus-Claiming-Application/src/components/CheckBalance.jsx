import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '../WalletContext';
import info from '../config/info.json';
import token_abi from '../config/erc20_abi.json';
import '../css/CheckBalance.css';

const tokenContractAddress = info.token_address;
const tokenContractABI = token_abi;

const CheckBalance = () => {
  const { walletAddress } = useContext(WalletContext);
  const [balance, setBalance] = useState(null);
  const [inputAddress, setInputAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(null);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  const checkBalance = async () => {
    if (!ethers.utils.isAddress(inputAddress)) {
      setError('Invalid address entered! Please Enter a Valid Arbitrum Address.');
      return;
    }

    setIsLoading(true);
    setBalance(null);
    setError(null);

    try {
      const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
      const contract = new ethers.Contract(tokenContractAddress, tokenContractABI, provider);
      const balance = await contract.balanceOf(inputAddress);
      const formattedBalance = parseFloat(ethers.utils.formatUnits(balance, 18)).toFixed(4);
      setBalance(formattedBalance);
    } catch (err) {
      if (err.message.includes('invalid address')) {
        setError('Invalid address entered!');
      } else if (err.message.includes('network is not available')) {
        setError('This network is not available in your MetaMask, please add it manually!');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentAddress = () => {
    setInputAddress(walletAddress);
  };

  return (
    <div className="check-balance">
      <h3>Check MOR Balance on Arbitrum</h3>
      <div className="input-group">
        <label>Enter Address</label>
        <div className="address-input-container">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="Enter Ethereum address"
          />
          <button onClick={setCurrentAddress} className="fetch-button">Fetch</button>
        </div>
      </div>
      <button onClick={checkBalance} disabled={isLoading} className="check-button">
        {isLoading ? 'Checking...' : 'Check Balance'}
      </button>
      {balance !== null && (
        <div className="balance-result">
          <h4>MOR Balance</h4>
          <p>{balance} MOR</p>
        </div>
      )}
      {error && (
        <div className="balance-card error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default CheckBalance;