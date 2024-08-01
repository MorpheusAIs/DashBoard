import React from 'react';
import './../../css/provider/lock_display.css';
import blurredPage from './../../assets/blurred_page.png'; // Importing the image

const LockDisplay = ({ message, type }) => (
    <div className="lock-display-background" style={{ backgroundImage: `url(${blurredPage})` }}>
        <div className="lock-display-container">
            <div className={`lock-display-card ${type}`}>
                {message}
            </div>
        </div>
    </div>
);

export default LockDisplay;
