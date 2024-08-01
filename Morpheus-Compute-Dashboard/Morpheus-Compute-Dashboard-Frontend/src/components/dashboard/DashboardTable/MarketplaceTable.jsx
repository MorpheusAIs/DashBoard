import React, { useEffect, useState } from 'react';
import './../../../css/dashboard/marketplaceTable.css';
import api_url from "./../../../config/api_url.json";
import { useNavigate } from "react-router-dom";

const base_api_url = api_url.base_api_url;

const MarketplaceTable = () => {
    const [homepageTable, setHomepageTable] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTableData() {
            try {
                const response = await fetch(`${base_api_url}/homepageTable`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHomepageTable(data.items);
            } catch (error) {
            }
        }

        fetchTableData();
    }, []);

    let homepageTable_sort = homepageTable.sort((a, b) => b.activeSessions - a.activeSessions);

    const handleModelClick = (modelID) => {

        navigate(`/model?modelID=${modelID}`);
    };

    return (
        <div className="table_main">
            <br />
            <br />
            <main className="table">
                <section className="table__body">
                    <table>
                        <thead>
                            <tr>
                                <th>MODEL</th>
                                <th>NO. OF PROVIDERS</th>
                                <th>BEST ASK (mMOR)</th>
                                <th>ACTIVE SESSIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {homepageTable_sort.map((product) => (
                                <tr key={product._id} onClick={() => handleModelClick(product.modelID)}>
                                    <td>{product.model}</td>
                                    <td>{product.numberOfProviders}</td>
                                    <td>{product.bestAsk}</td>
                                    <td>{product.activeSessions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default MarketplaceTable;