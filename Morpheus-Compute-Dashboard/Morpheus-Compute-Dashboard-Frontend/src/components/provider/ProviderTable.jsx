import React from 'react';
import './ProviderTable.css';

const ProviderTable = ({ tableData }) => {
    return (
        <div className="provider-table">
            <h2>Model Earnings</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Model</th>
                        <th>Avg IPS</th>
                        <th>MOR Earned (mMOR)</th>
                        <th>Sessions Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.date}</td>
                            <td>{data.modelName}</td>
                            <td>{data.avgIPSforSessionsClosedThatDay}</td>
                            <td>{data.morEarnedThatDay}</td>
                            <td>{data.totalSessionsCompletedThatDay}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProviderTable;
