import React from 'react';
import NextDispursementTimer from './NextDispursementTimer';
import './../../css/dashboard/card.css';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function Cards({ cards_data }) {
    return (
        <div className="card_main">
            {cards_data.length > 0 &&
                cards_data.map((card, index) => (
                    // Apply 'card_bottom' class only to the second row of cards
                    <div className={`card ${index >= 0 ? 'card_bottom' : ''}`} key={index}>
                        <section className="card_head">
                            <p className="card-title">{card.name}</p>
                            <i className={`fa-solid ${card.name === "Registered Providers" ? "fa-user" : card.name === "Available Models" ? "fa-satellite-dish" : card.name === "Next Disbursement" ? "fa-calendar-check" : "fa-face-smile"} card_icon`} ></i>
                        </section>
                        <section>
                            <span className="card-text">
                                {index === 2 ? (
                                    <h2><NextDispursementTimer /></h2>
                                ) : (
                                    <h2>
                                        {(card.name === "Registered Providers" || card.name === "Available Models") ? (
                                            <CountUp end={card.amount} duration={2.5} />
                                        ) : (
                                            card.amount
                                        )}
                                    </h2>
                                )}
                            </span>
                            <p className="text-xs text-gray-500 label">
                                <a href={card.href} className="card-label card_link">{card.label}
                                    <i className="fa-solid fa-arrow-up-right-from-square link_icon"></i>
                                </a>
                            </p>
                        </section>
                    </div>
                ))}
        </div>
    );
}

export default Cards;
