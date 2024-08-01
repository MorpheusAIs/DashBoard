import React, { useContext, useState, useEffect } from 'react';
import '../css/MainNavbar.css';
import morlogo from '../../src/assets/morlogo.jpg';
import { WalletContext } from '../../src/WalletContext';

const MainNavbar = () => {
  const { walletAddress, isWalletConnected, connectWallet, disconnectWallet } = useContext(WalletContext);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        await connectWallet();
      } catch (err) {
        if (err.message.includes('User rejected the request')) {
          setError('Connection request was rejected.');
        } else if (err.message.includes('Please install MetaMask')) {
          setError('Please install MetaMask!');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      }
    } else {
      setError('Please install MetaMask!');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const closeMenu = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', closeMenu);
    return () => window.removeEventListener('resize', closeMenu);
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">
          <img src={morlogo} alt="Logo" className="logo" />
        </a>
      </div>
      <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li><a href="/" onClick={() => setIsMenuOpen(false)}>Home</a></li>
        <li><a href="/check-tokens" onClick={() => setIsMenuOpen(false)}>Check Balance</a></li>
        <li><a href="https://mor.org/about" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>About</a></li>
        <li><a href="https://mor.org/ecosystem" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Ecosystem</a></li>
        <li><a href="https://mor.org/blog" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Blogs</a></li>
        <li><a href="https://github.com/MorpheusAIs/Docs/blob/main/!KEYDOCS%20README%20FIRST!/Compute%20Providers/Morpheus%20Lumerin%20Model.md" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Contract FAQ</a></li>
      </ul>
      <div className="wallet-container">
        {isWalletConnected ? (
          <button className="wallet-button" onClick={disconnectWallet}>
            {walletAddress.substring(0, 5)}...{walletAddress.substring(walletAddress.length - 4)}
          </button>
        ) : (
          <button className="connect-wallet" type="primary" onClick={connectWalletHandler}>Connect Wallet</button>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </nav>
  );
};

export default MainNavbar;