import React, { useEffect, useState } from 'react';
import './../../css/provider/hosted_model.css';

const ProviderHostedModels = ({ onModelClick, selected_modelID, hostedModels }) => {
    const [models, setModels] = useState([]);

    useEffect(() => {
        setModels(hostedModels);
    }, [hostedModels]);

    const shortenModelID = (modelID) => {

        if (modelID.length <= 10) return modelID;

        return `${modelID.slice(0, 7)}...${modelID.slice(-6)}`;

    };


    return (
        <div className="table_main">
            <main className="table">
                <section className="table__body">
                    <table className="hosted-model-table">
                        <thead>
                            <tr>
                                <th>Hosted Models ({models.length})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map((model, index) => (
                                <tr
                                    key={index}
                                    className={selected_modelID === model.modelID ? 'active' : ""}
                                    onClick={() => onModelClick(model.modelName, model.modelID)}
                                >
                                    <td className='cell_design'>
                                        <div className="model-details">
                                            <span className="model-name">{model.modelName}</span>
                                            <span className="model-balance">
                                                ID: {shortenModelID(model.modelID)}
                                            </span>
                                        </div>
                                        <span className="model-count">{model.count}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default ProviderHostedModels;
