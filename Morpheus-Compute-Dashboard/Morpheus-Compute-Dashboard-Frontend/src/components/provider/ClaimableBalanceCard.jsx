import React from 'react';
import './../../css/provider/claim_card.css'

function ClaimableBalanceCard({ balance, onClaim }) {
    return (
        <div className="claimable-card">
            <div className="claimable-card-title">Claimable Balance</div>
            <div>
            <span className="claimable-amount">{balance} mMOR</span>
                <a href="https://louper.dev/diamond/0x437E71B8fc341bafB2687Ad6935476231c49928F?network=arbitrumSepolia#write" className="claim-button-link">
                    <button className="claim-button" onClick={onClaim}>Claim Now</button>
                </a>
            </div>
        </div>
    );
}

export default ClaimableBalanceCard;
