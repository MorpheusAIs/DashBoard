import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModelList from './ModelList';
import ModelGraph from './ModelGraph';
import ModelTable from './ModelTable';
import './../../css/model/modelPage.css';
import { ModelStateContext } from "../../../src/App";
import { ClipLoader } from 'react-spinners';
import api_url from "./../../config/api_url.json"

const base_api_url = api_url.base_api_url

const ModelPage = () => {
    const [searchParams] = useSearchParams();
    const { setModel } = useContext(ModelStateContext);
    const [modelData, setModelData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modelList, setModelList] = useState([]);
    const [active_model_id, setActive_model] = useState('')

    useEffect(() => {
        fetchModelList();
    }, []);

    useEffect(() => {
        const modelID = searchParams.get('modelID');
        if (modelID) {
            fetchModelData(modelID);
            setActive_model(modelID)
        } else if (modelList.length > 0) {
            // Fetch data for the first model if no modelID is provided
            fetchModelData(modelList[0].modelID);
            setActive_model(modelList[0].modelID)
        }
    }, [searchParams, modelList]);

    const fetchModelList = async () => {
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

            setModelList(formattedData);
        } catch (error) {
            setError('Error fetching model list');
        }
    };

    const fetchModelData = async (modelID) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${base_api_url}/model?modelID=${modelID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const modelName = Object.keys(data)[0];
            setModelData(data[modelName]);
            setModel({ modelName, modelID });
        } catch (error) {
            setError('Error fetching model data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="model_background">
            <div className='model-page-container'>
                <div><ModelList active_model_id={active_model_id} /></div>
                <div>
                    <div className="main-content-container">
                        {loading ? (
                            <div className="loader-container">
                                <ClipLoader color="white" loading={loading} size={50} />
                                <div>Loading...</div>
                            </div>
                        ) : (
                            <>
                                {error && <div style={{ color: 'white' }}>{error}</div>}
                                {modelData ? (
                                    <>
                                        {modelData.graphData && Object.keys(modelData.graphData).length === 0 ? (
                                            <div style={{ color: 'white' }}>Not enough data on chain for this model</div>
                                        ) : (
                                            modelData.graphData && <ModelGraph graphData={modelData.graphData} />
                                        )}
                                        {modelData.tableData && modelData.tableData.length === 0 ? (
                                            <div style={{ color: 'white' }}>Not enough data on chain for this model</div>
                                        ) : (
                                            modelData.tableData && <ModelTable tableData={modelData.tableData} />
                                        )}
                                    </>
                                ) : (
                                    !loading && <div style={{ color: 'white' }}>No model data available</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelPage;
