import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./../../css/model/modelList.css";
import { ModelStateContext } from "../../App";
import api_url from "./../../config/api_url.json"

const base_api_url = api_url.base_api_url

const ModelList = ({ active_model_id }) => {
    const [productData, setProductData] = useState([]);
    const { setModel } = useContext(ModelStateContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchModelData() {
            try {
                const response = await fetch(`${base_api_url}/modelList`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const formattedData = [];

                Object.keys(data).forEach((modelName) => {
                    data[modelName].forEach((modelID) => {
                        formattedData.push({
                            model: modelName,
                            modelID: modelID,
                        });
                    });
                });

                setProductData(formattedData);
            } catch (error) {
            }
        }

        fetchModelData();
    }, []);

    const handleModelClick = (model, modelID) => {
        setModel({ modelName: model, modelID: modelID });
        navigate(`/model?modelID=${modelID}`);
    };

    return (
        <div className="table_main">
            <main className="table">
                <section className="table__body">
                    <table>
                        <thead>
                            <tr>
                                <th>MODEL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((product, index) => (
                                <tr key={index} className={active_model_id === product.modelID ? 'active' : ""} onClick={() => handleModelClick(product.model, product.modelID)}>
                                    <td>{product.model}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default ModelList;
