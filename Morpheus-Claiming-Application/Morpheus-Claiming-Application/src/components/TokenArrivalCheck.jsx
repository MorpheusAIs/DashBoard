import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '../WalletContext';
import info from '../config/info.json';
import token_abi from '../config/erc20_abi.json';
import '../css/TokenArrivalCheck.css'; // Reuse the existing CSS

const tokenContractAddress = info.token_address;
const tokenContractABI = token_abi;

const TokenArrivalCheck = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { walletAddress } = useContext(WalletContext);

  const checkBalance = async () => {
    if (!ethers.utils.isAddress(address)) {
      setError('Invalid address entered! Please Enter a Valid Arbitrum Address.');
      return;
    }

    setIsLoading(true);
    setBalance(null);
    setError(null);

    try {
      const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
      const contract = new ethers.Contract(tokenContractAddress, tokenContractABI, provider);
      const balance = await contract.balanceOf(address);
      const formattedBalance = parseFloat(ethers.utils.formatUnits(balance, 18)).toFixed(4);
      setBalance(formattedBalance);
    } catch (err) {
      console.error('Error checking balance.');
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentAddress = () => {
    setAddress(walletAddress);
  };

  return (
    <div className="token-arrival-check">
      <div className="left-content">
        <h2>Check MOR Balance</h2>
        <p className="description">Verify your MOR token balance on the Arbitrum network.</p>
        <img src="https://images.ctfassets.net/b5yqepy48jgc/7bpEA8QPAnvhEadrIyF9z7/eb1f9779dcaa17afc22af61aae9d5749/Group_6__1_.svg" alt="MOR Token" className="token-image" />
      </div>
      <div className="right-content">
        <div className="balance-card">
          <h3>Check MOR Balance on Arbitrum</h3>
          <div className="input-group">
            <label>Enter Address</label>
            <div className="address-input-container">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Ethereum address"
              />
              <button onClick={fetchCurrentAddress} className="fetch-button">Fetch</button>
            </div>
          </div>
          <button onClick={checkBalance} disabled={isLoading} className="check-button">
            {isLoading ? 'Checking...' : 'Check Balance'}
          </button>
          {balance !== null && (
            <div className="balance-result full-width">
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
      </div>
    </div>
  );
};

export default TokenArrivalCheck;