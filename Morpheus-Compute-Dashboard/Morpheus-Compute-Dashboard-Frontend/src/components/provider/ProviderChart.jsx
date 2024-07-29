import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts';

// Custom date formatting function
const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
};

// Helper function to parse date strings into Date objects for sorting
const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: '#000000', color: '#01FF85', padding: '10px', borderRadius: '5px' }}>
                <p>{`Date: ${formatDate(label)}`}</p>
                <p>{`Avg Daily IPS: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

const ProviderChart = ({ chartData }) => {
    // Sort the chartData array by date
    const sortedData = chartData.sort((a, b) => parseDate(a.date) - parseDate(b.date));

    return (
        <div style={{ padding: '20px', borderRadius: '10px', width: '100%' }}>
            <h2 style={{ color: '#FFFFFF', marginBottom: '40px', textAlign: 'center' }}>Model Average Daily IPS Graph</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={sortedData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 40,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: '#FFFFFF', fontWeight: 'bold' }} style={{ fontSize: '12px', color: '#FFFFFF' }}>
                        <Label value="Date" offset={-10} position="insideBottom" style={{ fill: '#FFFFFF', fontWeight: 'bold' }} />
                    </XAxis>
                    <YAxis tick={{ fill: '#FFFFFF', fontWeight: 'bold' }} style={{ fontSize: '12px', color: '#FFFFFF' }}>
                        <Label value="Avg Daily IPS" angle={-90} position="insideLeft" style={{ fill: '#FFFFFF', fontWeight: 'bold' }} />
                    </YAxis>
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ProviderChart;
