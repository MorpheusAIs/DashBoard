// main_navbar.jsx
import React, { useContext, useState } from 'react';
import './../../css/navbar/main_navbar.css'
import morlogo from './../../assets/morlogo.jpg';
import { WalletContext } from '../../WalletContext';

const MainNavbar = () => {
    const { walletAddress, isWalletConnected, connectWallet, disconnectWallet } = useContext(WalletContext);
    const [error, setError] = useState(null);

    // Change this chain config to mainnet when the official mainnet contracts roll out

    const switchToArbitrumNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x66eee' }]
            });
        } catch (error) {
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x66eee',
                                chainName: 'Arbitrum Sepolia',
                                rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                                nativeCurrency: {
                                    name: 'Sepolia Ether',
                                    symbol: 'ETH',
                                    decimals: 18
                                },
                                blockExplorerUrls: ['https://sepolia.arbiscan.io']
                            }
                        ]
                    });
                } catch (addError) {
                    setError('Failed to add the Arbitrum Sepolia network.');
                }
            } else {
                setError('Failed to switch to the Arbitrum Sepolia network.');
            }
        }
    };

    const connectWalletHandler = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    connectWallet(accounts[0]);
                    await switchToArbitrumNetwork();
                }
            } catch (err) {
                setError(err.message);
            }
        } else {
            setError('Please install MetaMask!');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <a href="/">
                    <img src={morlogo} alt="Logo" className="logo" />
                </a>
            </div>
            <ul className="navbar-links">
                <li>
                    <a href="https://mor.org/about" target="_blank" rel="noopener noreferrer">
                        <span className="font-thin ml-4" id="labels">About</span>
                    </a>
                </li>
                <li>
                    <a href="https://mor.org/ecosystem" target="_blank" rel="noopener noreferrer">
                        <span className="font-thin ml-4" id="labels">Ecosystem</span>
                    </a>
                </li>
                <li>
                    <a href="https://mor.org/blog" target="_blank" rel="noopener noreferrer">
                        <span className="font-thin ml-4" id="labels">Blogs</span>
                    </a>
                </li>
                <li>
                    <a href="https://github.com/MorpheusAIs/Docs/blob/main/!KEYDOCS%20README%20FIRST!/Compute%20Providers/Morpheus%20Lumerin%20Model.md" target="_blank" rel="noopener noreferrer">
                        <span className="font-thin ml-4" id="labels">Contract FAQ</span>
                    </a>
                </li>
            </ul>
            <div className="wallet-container">
                {isWalletConnected ? (
                    <button className="wallet-button" onClick={disconnectWallet}>
                        {walletAddress.substring(0, 5)}...{walletAddress.substring(walletAddress.length - 4)}
                    </button>
                ) : (
                    <button className="connect-wallet" type="primary" onClick={connectWalletHandler}>
                        Connect Wallet
                    </button>
                )}
                {error && <p className="error-message">{error}</p>}
            </div>
        </nav>
    );
};

export default MainNavbar;
