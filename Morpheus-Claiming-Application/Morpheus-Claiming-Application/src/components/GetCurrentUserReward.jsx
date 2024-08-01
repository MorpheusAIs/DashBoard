import React, { useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '../WalletContext';
import info from '../config/info.json';
import abi from '../config/distribution_abi.json';
import '../css/GetCurrentUserReward.css';

const contractAddress = info.contract_address;
const contractABI = abi;

const GetCurrentUserReward = ({ onRewardFetched, onError }) => {
  const { walletAddress, isWalletConnected, isMainnet, connectWallet, switchToMainnet } = useContext(WalletContext);
  const [poolId, setPoolId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentUserReward = async () => {
    if (!isWalletConnected) {
      setError('Please connect your wallet first!');
      return;
    }

    if (!isMainnet) {
      setError('Please switch to Ethereum Mainnet');
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const reward = await contract.getCurrentUserReward(poolId, walletAddress);
      const formattedReward = parseFloat(ethers.utils.formatUnits(reward, 18)).toFixed(4);
      onRewardFetched(formattedReward, poolId);
    } catch (err) {
      console.error('Error occurred while fetching the reward.');
      onError('An error occurred while fetching the reward.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderButton = () => {
    if (!isWalletConnected) {
      return (
        <button onClick={connectWallet} className="get-reward-button">
          Connect Wallet
        </button>
      );
    } else if (!isMainnet) {
      return (
        <button onClick={switchToMainnet} className="get-reward-button">
          Switch to Mainnet
        </button>
      );
    } else {
      return (
        <button onClick={getCurrentUserReward} disabled={isLoading} className="get-reward-button">
          {isLoading ? 'Loading...' : 'Get Reward'}
        </button>
      );
    }
  };

  const renderNetworkStatus = () => {
    if (!isWalletConnected) {
      return <span className="network-status not-connected">● Not Connected</span>;
    } else if (!isMainnet) {
      return <span className="network-status wrong-network">● Wrong Network</span>;
    } else {
      return <span className="network-status connected">● Ethereum Mainnet</span>;
    }
  };

  return (
    <div className="get-current-user-reward">
      <h3>Get Current User Reward</h3>
      <div className="pool-selection">
        <label>Pool</label>
        <select value={poolId} onChange={(e) => setPoolId(Number(e.target.value))}>
          <option value={0}>Capital Provider</option>
          <option value={1}>Code Provider</option>
        </select>
      </div>
      <div className="current-address">
        <label>Connected Address</label>
        <input type="text" value={walletAddress || 'Not connected'} disabled />
      </div>
      <div className="network-status-container">
        <label>Network</label>
        {renderNetworkStatus()}
      </div>
      {renderButton()}
    </div>
  );
};

export default GetCurrentUserReward;