import React, { useState } from 'react';
import './../../css/model/ModelTable.css'

const ModelTable = ({ tableData }) => {
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRowExpansion = (id) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const abbreviateAddress = (address) => {
        return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
    };

    return (
        <div className="model-table-container">
            <table className="model-table">
                <thead>
                    <tr>
                        <th>Provider Address</th>
                        <th>Total Sessions Completed</th>
                        <th>Model Sessions Completed</th>
                        <th>Average IPS</th>
                        <th>Bid Price (mMOR)</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data) => (
                        <tr key={data._id}>
                            <td 
                                className="model-table-address"
                                onClick={() => toggleRowExpansion(data._id)}
                            >
                                {expandedRows[data._id] ? data.provider_address : abbreviateAddress(data.provider_address)}
                            </td>
                            <td>{data.totalSessionsCompleted}</td>
                            <td>{data.modelSessionsCompleted}</td>
                            <td>{data.avgIps}</td>
                            <td>{data.pricePerSecond}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ModelTable;
