import React from 'react';
import './../../css/navbar/sub_navbar.css';
import { Link, useLocation } from "react-router-dom";

const SubNavbar = () => {
    const currentPath = window.location.pathname;

    const location = useLocation().pathname;

    return (
        <>
            <div className="sub_navbar">
                <Link to="/" className="menu_text">
                    <div className={`sub_card ${location === '/' ? 'active' : ''}`}>
                        {/* <a href="/" className="menu_text">Dashboard</a> */}
                        Dashboard

                    </div>
                </Link>
                <Link to="/model" className="menu_text">
                    <div className={`sub_card ${location === '/model' ? 'active' : ''}`}>
                        {/* <a href="/model" className="menu_text">Models</a> */}
                        Models

                    </div>
                </Link>
                <Link to="/provider" className="menu_text">
                    <div className={`sub_card ${location === '/provider' ? 'active' : ''}`}>
                        {/* <a href="/provider" className="menu_text">Providers</a> */}
                        Providers
                    </div>
                </Link>
            </div>
        </>
    );
};

export default SubNavbar;
