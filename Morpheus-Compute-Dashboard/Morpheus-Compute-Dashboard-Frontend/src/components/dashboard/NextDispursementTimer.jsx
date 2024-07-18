import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import './../../css/dashboard/NextDispursementTimer.css';


function NextDispursementTimer() {
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [previousTime, setPreviousTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const nowGMT = new Date(now.toUTCString().slice(0, -4));
            const midnightGMT = new Date(nowGMT.getFullYear(), nowGMT.getMonth(), nowGMT.getDate() + 1);
            const remainingTime = midnightGMT - nowGMT;
            const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            setPreviousTime(time); // Update the previous time
            setTime({ hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(interval);
    }, [time]);

    return (
        <div className="timer">
            <span className="timer-part"><CountUp start={previousTime.hours} end={time.hours} duration={2.5} />H</span>
            <span className="timer-part"><CountUp start={previousTime.minutes} end={time.minutes} duration={2.5} />M</span>
            <span className="timer-part"><CountUp start={previousTime.seconds} end={time.seconds} duration={2.5} />S</span>
        </div>
    );
}

export default NextDispursementTimer;
