import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '../WalletContext';
import info from '../config/info.json';
import abi from '../config/distribution_abi.json';
import '../css/ClaimReward.css';

const contractAddress = info.contract_address;
const contractABI = abi;
const ether_fee = info.ether_fee;

const ClaimReward = ({ rewardAmount, selectedPool, onClaimSuccess, onError }) => {
  const { walletAddress, isWalletConnected, isMainnet, connectWallet, switchToMainnet } = useContext(WalletContext);
  const [receiver, setReceiver] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let timer;
    if (error || success) {
      timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [error, success]);

  const setCurrentAddress = () => {
    setReceiver(walletAddress);
  };

  const claimReward = async () => {
    if (!isWalletConnected) {
      setError('Please connect your wallet first!');
      return;
    }

    if (!isMainnet) {
      setError('Please switch to Ethereum Mainnet');
      return;
    }

    if (!ethers.utils.isAddress(receiver)) {
      setError('Invalid receiver address! Please Try Again.');
      return;
    }

    if (parseFloat(rewardAmount) === 0) {
      setError('No reward available to claim.');
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.claim(selectedPool, receiver, { value: ethers.utils.parseEther(ether_fee) });
      await tx.wait();
      setSuccess('Reward claimed successfully!');
      onClaimSuccess(tx.hash);
    } catch (err) {
      console.error("Error occurred during the reward claim process.");
      setError('An error occurred while claiming the reward.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderButton = () => {
    if (!isWalletConnected) {
      return (
        <button onClick={connectWallet} className="claim-button">
          Connect Wallet
        </button>
      );
    } else if (!isMainnet) {
      return (
        <button onClick={switchToMainnet} className="claim-button">
          Switch to Mainnet
        </button>
      );
    } else {
      const isDisabled = isLoading || parseFloat(rewardAmount) === 0;
      return (
        <button 
          onClick={claimReward} 
          disabled={isDisabled} 
          className={`claim-button ${isDisabled ? 'disabled' : ''}`}
        >
          {isLoading ? 'Claiming...' : parseFloat(rewardAmount) === 0 ? 'No Reward to Claim' : 'Claim Reward'}
        </button>
      );
    }
  };

  return (
    <div className="claim-reward">
      <h3>Claim Your Reward</h3>
      <div className="pool-selection">
        <label>Pool</label>
        <select value={selectedPool} disabled>
          <option value={0}>Capital Provider</option>
          <option value={1}>Code Provider</option>
        </select>
      </div>
      <div className="receiver-address">
        <label>Receiver Address</label>
        <div className="address-input-container">
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Enter receiver address"
          />
          <button onClick={setCurrentAddress} className="fetch-button">Fetch</button>
        </div>
      </div>
      <div className="available-reward">
        <p>Available Reward</p>
        <p className="reward-amount">{rewardAmount} MOR</p>
      </div>
      {renderButton()}
      {error && (
        <div className="card error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="card success">
          <h3>Success</h3>
          <p>{success}</p>
        </div>
      )}
    </div>
  );
};

export default ClaimReward;