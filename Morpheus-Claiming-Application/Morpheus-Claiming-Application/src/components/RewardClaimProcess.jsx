import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '../WalletContext';
import GetCurrentUserReward from './GetCurrentUserReward';
import ClaimReward from './ClaimReward';
import CheckBalance from './CheckBalance';
import info from '../config/info.json';
import token_abi from '../config/erc20_abi.json';
import '../css/RewardClaimProcess.css';

const tokenContractAddress = info.token_address;
const tokenContractABI = token_abi;

const RewardClaimProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [rewardAmount, setRewardAmount] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [successTxHash, setSuccessTxHash] = useState(null);
  const [initialBalance, setInitialBalance] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [showNotification, setShowNotification] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const { walletAddress, isWalletConnected } = useContext(WalletContext);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));

  const handleRewardFetched = (amount, pool) => {
    setRewardAmount(amount);
    setSelectedPool(pool);
    nextStep();
  };

  const handleClaimSuccess = async (txHash) => {
    setSuccessTxHash(txHash);
    setShowNotification(true);
    nextStep();
    const balance = await checkBalance(walletAddress);
    setInitialBalance(balance);
    setCurrentBalance(balance);
    setTimeRemaining(isSimulated ? 60 : 600);
  };

  const handleError = (errorMessage) => {
    console.error('An error occurred.');
  };

  const checkBalance = async (address) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
      const contract = new ethers.Contract(tokenContractAddress, tokenContractABI, provider);
      const balance = await contract.balanceOf(address);
      return parseFloat(ethers.utils.formatUnits(balance, 18)).toFixed(4);
    } catch (error) {
      console.error('Error checking balance.');
      return null;
    }
  };

  const simulateSuccessfulClaim = () => {
    const simulatedTxHash = '0x' + Array(64).fill('0').join('');
    setIsSimulated(true);
    handleClaimSuccess(simulatedTxHash);
  };

  useEffect(() => {
    let timer;
    let balanceChecker;

    if (successTxHash && initialBalance !== null) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      balanceChecker = setInterval(async () => {
        const newBalance = await checkBalance(walletAddress);
        setCurrentBalance(newBalance);
        if (parseFloat(newBalance) > parseFloat(initialBalance)) {
          clearInterval(balanceChecker);
        }
      }, 20000); // Check every 20 seconds
    }

    return () => {
      clearInterval(timer);
      clearInterval(balanceChecker);
    };
  }, [successTxHash, initialBalance, walletAddress]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GetCurrentUserReward onRewardFetched={handleRewardFetched} onError={handleError} />;
      case 2:
        return (
          <>
            <ClaimReward 
              rewardAmount={rewardAmount} 
              selectedPool={selectedPool} 
              onClaimSuccess={handleClaimSuccess} 
              onError={handleError} 
            />
            {/* <button onClick={simulateSuccessfulClaim} className="simulate-claim-button">
              Simulate Successful Claim
            </button> */}
          </>
        );
        case 3:
          if (successTxHash && timeRemaining > 0 && parseFloat(currentBalance) <= parseFloat(initialBalance)) {
            return (
              <div className="balance-update-container">
                <div className="balance-card">
                  <h3>Checking Arrival of Tokens</h3>
                  <div className="spinner-container">
                    <div className="spinner-border text-success" role="status" style={{width: '1.5rem', height: '1.5rem'}}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div className="balance-info">
                    <div className="balance-result">
                      <h4>Current Balance</h4>
                      <p><i className="bi bi-wallet"></i> {currentBalance} MOR</p>
                    </div>
                    <div className="balance-result">
                      <h4>ETA for Tokens</h4>
                      <p><i className="bi bi-clock-history"></i> {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</p>
                    </div>
                  </div>
                  <a href={`https://etherscan.io/tx/${successTxHash}`} target="_blank" rel="noopener noreferrer" className="follow-transaction">
                    Follow Transaction <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
              </div>
            );
  } else if (successTxHash && parseFloat(currentBalance) > parseFloat(initialBalance)) {
          return (
            <div className="balance-card success">
              <h3>Balance Updated!</h3>
              <div className="balance-info">
                <div className="balance-result">
                  <h4>New Balance</h4>
                  <p>{currentBalance} MOR</p>
                </div>
                <div className="balance-result">
                  <h4>Increase</h4>
                  <p>{(parseFloat(currentBalance) - parseFloat(initialBalance)).toFixed(4)} MOR</p>
                </div>
              </div>
              {/* {isSimulated && <p className="simulation-note">This was a simulated claim</p>} */}
            </div>
          );
        } else {
          return <CheckBalance onError={handleError} />;
        }
      default:
        return null;
    }
  };

  return (
    <div className="reward-claim-process">
      <div className="left-text">
        <h2>Reward Claim Process</h2>
        <p className="step-indicator">Step {currentStep} of 3</p>
        <img src="https://images.ctfassets.net/b5yqepy48jgc/7bpEA8QPAnvhEadrIyF9z7/eb1f9779dcaa17afc22af61aae9d5749/Group_6__1_.svg" alt="Reward" className="reward-image" />
      </div>
      <div className="process-container">
        <div className="step-content">
          {renderStep()}
        </div>
      </div>
      {showNotification && (
        <div className="notification-modal">
          <div className="notification-content">
            <h3>Claim Successful!</h3>
            <p>Rewards should reach your Arbitrum wallet within 15 minutes.</p>
            <p>
              Transaction Link: <a href={`https://etherscan.io/tx/${successTxHash}`} target="_blank" rel="noopener noreferrer">View on Etherscan </a>
            </p>
            <button onClick={() => setShowNotification(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardClaimProcess;