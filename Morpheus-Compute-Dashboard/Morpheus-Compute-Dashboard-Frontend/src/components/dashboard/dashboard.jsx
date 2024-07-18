import React from 'react';
import './../../css/dashboard/dashboard.css';
import { useQuery } from 'react-query';
import MarketplaceTable from './DashboardTable/MarketplaceTable';
import CirculatingSupplyGraph from './DashboardGraphs/CirculatingSupplyGraph';
import AverageDailyIPSGraph from './DashboardGraphs/AverageDailyIPSGraph'
import Cards from './card';
import api_url from "./../../config/api_url.json"

const base_api_url = api_url.base_api_url

async function fetchCardData() {
    const response = await fetch(`${base_api_url}/publicCards`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

function Dashboard() {
    const { data, error, isLoading, isFetching } = useQuery('cardData', fetchCardData, {
        initialData: () => {
            const cachedData = localStorage.getItem('cardData');
            return cachedData ? JSON.parse(cachedData) : undefined;
        },
        onSuccess: (data) => {
            localStorage.setItem('cardData', JSON.stringify(data));
        },
        refetchInterval: 100000,
    });

    if (error) return <div>Error: {error.message}</div>;

    const cards = data || [];
    const cards_data = data || [];


    return (
        <div className="">
            <Cards cards_data={cards_data} />
            <br />
            <br />
            <section className="">

                {/* <div className="chart_background">
                        <br />
                        <h2 className="chartheading">
                            Circulating Supply
                        </h2>
                        <br />
                        <CirculatingSupplyGraph height={400} />

                    </div> */}
                <div className="chart_background">
                    <br />
                    <h2 className="chartheading">
                        Average Daily IPS
                    </h2>
                    <br />
                    <AverageDailyIPSGraph height={400} />
                </div>
            </section >
            <br />
            <br />
            <br />
            <div className="table_background">
                <br />
                <br />
                <h2 className="tableheading">
                    MarketPlace Data
                </h2>
                <MarketplaceTable />
                <br />
                <br />
            </div>

        </div >
    );
}

export default Dashboard;
