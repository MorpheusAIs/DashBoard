import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import './../../css/provider/provider_page.css';
import ProviderHostedModels from './ProviderHostedModels';
import ClaimableBalanceCard from './ClaimableBalanceCard';
import ProviderTable from './ProviderTable';
import ProviderChart from './ProviderChart';
import api_url from "./../../config/api_url.json";
import { WalletContext } from '../../WalletContext';
import LockDisplay from './LockDisplay';
import MorDetails from './MorDetails';

const base_api_url = api_url.base_api_url;

function ProviderPage() {
    const [searchParams] = useSearchParams();
    const { walletAddress, isWalletConnected } = useContext(WalletContext);
    const address = searchParams.get('address') || walletAddress;

    const [selectedModel, setSelectedModel] = useState('');
    const [selectedModelID, setSelectedModelID] = useState('');
    const [hostedModels, setHostedModels] = useState([]);
    const [tableData, setTableData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [claimableBalance, setClaimableBalance] = useState(null);
    const [error, setError] = useState(null);
    const [isProvider, setIsProvider] = useState(null);

    useEffect(() => {
        if (address) {
            fetch(`${base_api_url}/providerExists?address=${address}`)
                .then(response => response.json())
                .then(data => {
                    setIsProvider(data.providerExists);
                })
                .catch(error => {
                    setError('Error checking provider status');
                });

            const modelsUrl = `${base_api_url}/hostedModels?address=${address}`;
            fetch(modelsUrl)
                .then(response => response.json())
                .then(modelsData => {
                    const formattedModels = modelsData.map(model => ({
                        modelName: model.modelName,
                        modelID: model.modelID,
                        balance: "10 MOR",
                        count: model.count
                    }));
                    setHostedModels(formattedModels);
                    
                    if (formattedModels.length > 0) {
                        const defaultModel = formattedModels[0];
                        setSelectedModel(defaultModel.modelName);
                        setSelectedModelID(defaultModel.modelID);
                        fetchTableData(defaultModel.modelID);
                        fetchChartData(defaultModel.modelID);
                    }
                })
                .catch(e => {
                    setError('An error occurred while fetching data.');
                });

            fetchClaimableBalance();
        }
    }, [address]);

    const fetchClaimableBalance = async () => {
        try {
            const response = await fetch(`${base_api_url}/providerClaimableBalance?address=${address}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setClaimableBalance(data);
        } catch (error) {
            setError('Error fetching claimable balance');
        }
    };

    const fetchTableData = async (modelID) => {
        try {
            const response = await fetch(`${base_api_url}/providerTableData?address=${address}&modelID=${modelID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTableData(data);
        } catch (error) {
            setError('Error fetching table data');
        }
    };

    const fetchChartData = async (modelID) => {
        try {
            const response = await fetch(`${base_api_url}/providerModelChart?address=${address}&modelID=${modelID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setChartData(data[0].daily_avg_ips);
        } catch (error) {
            setError('Error fetching chart data');
        }
    };

    const handleModelClick = (modelName, modelID) => {
        setSelectedModel(modelName);
        setSelectedModelID(modelID);
        fetchTableData(modelID);
        fetchChartData(modelID);
    };

    const handleClaim = () => {
        // Claim logic
    };

    if (!isWalletConnected && !address) {

        return <LockDisplay message="Please connect your registered provider wallet or enter an address in the URL parameters to view this page." type="error-message" />;

    }


    if (isProvider === false) {

        return <LockDisplay message="This address is not registered as a provider." type="error-message" />;

    }


    if (isProvider === null) {

        return <LockDisplay message="Checking provider status..." type="loading-message" />;
    }

    return (
        <div className="provider_background">
            <div className='provider-page-container'>
                <div>
                    <ProviderHostedModels
                        onModelClick={handleModelClick}
                        selected_modelID={selectedModelID}
                        hostedModels={hostedModels}
                    />
                    <br />
                    {claimableBalance !== null && (
                        <ClaimableBalanceCard balance={claimableBalance} onClaim={handleClaim} />
                    )}
                    <MorDetails />
                </div>
                <div className="provider-content-container">
                    {chartData && <ProviderChart chartData={chartData} />}
                    {tableData && <ProviderTable tableData={tableData} />}
                </div>
            </div>
            {error && <LockDisplay message={error} type="error-message" />}
        </div>
    );
}

export default ProviderPage;
