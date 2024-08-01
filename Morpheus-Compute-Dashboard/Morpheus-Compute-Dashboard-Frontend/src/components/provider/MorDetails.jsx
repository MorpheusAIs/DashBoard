// src/components/Provider/NewCardComponent.jsx
import React from 'react';
import './../../css/provider/mor_details.css'

function MorDetails() {
    return (
        <div className="mmor-card">
            <div className="mmor-card-title">
                What is mMOR?
            </div>

            <div className="mmor-amount">
                We introduced the term "mMOR" as the smallest unit of MOR (1 MOR = 10¹⁸ mMOR), 
                It is similar to Bitcoin's Satoshi and Ethereum's Wei.
            </div>
        </div>
    );
}

export default MorDetails;
