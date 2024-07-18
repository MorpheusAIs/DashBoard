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
        <div className="">
            <table className="">
                <thead className="">
                    <tr>
                        {/* <th scope="col" className="px-6 py-3">Model Name</th> */}
                        <th scope="col">Provider Address</th>
                        <th scope="col">Total Sessions Completed</th>
                        <th scope="col">Model Sessions Completed</th>
                        <th scope="col">Average IPS</th>
                        <th scope="col">Bid Price (mMOR)</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data) => (
                        <tr key={data._id}>
                            {/* <td font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {data.model_name}
                            </td> */}
                            <td onClick={() => toggleRowExpansion(data._id)}>
                                {expandedRows[data._id] ? data.provider_address : abbreviateAddress(data.provider_address)}
                            </td>
                            <td >{data.totalSessionsCompleted}</td>
                            <td >{data.modelSessionsCompleted}</td>
                            <td >{data.avgIps}</td>
                            <td>{data.pricePerSecond}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ModelTable;
