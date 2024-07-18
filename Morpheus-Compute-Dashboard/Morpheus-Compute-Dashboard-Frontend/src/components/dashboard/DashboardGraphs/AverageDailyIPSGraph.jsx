import React, { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Label, Dot } from 'recharts';
import { format } from 'date-fns';
import api_url from "./../../../config/api_url.json"

const base_api_url = api_url.base_api_url

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#000000', color: '#01FF85', padding: '10px', borderRadius: '5px' }}>
        <p>{`Date: ${label}`}</p>
        <p>{`Average IPS: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const AverageDailyIPSGraph = ({ height }) => {
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${base_api_url}/dailyAvgIps`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        // Trigger the animation after data is loaded
        setIsVisible(true);
      } catch (error) {
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString) => {

    const [day, month, year] = dateString.split('/').map(Number);

    const date = new Date(year, month - 1, day); // Month is 0-indexed

    if (isNaN(date)) {

      return dateString;

    }

    return format(date, 'd MMMM');

  };

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '10px',
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0)' : 'blur(5px)',
        transition: 'opacity 1s ease-in-out, filter 1s ease-in-out',
      }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          width={600}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 50,
            bottom: 40,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="5%" stopColor="#E87000" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#E87000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: '#FFFFFF' }} tickFormatter={formatDate} style={{ fontSize: '10px', color: '#FFFFFF' }}>
            <Label value="Date" offset={-10} position="insideBottom" style={{ fill: '#FFFFFF', fontWeight: 'bold' }} />
          </XAxis>
          <YAxis tick={{ fill: '#FFFFFF' }} style={{ fontSize: '10px', color: '#FFFFFF' }}>
            <Label value="Avg IPS" angle={-90} position="insideLeft" style={{ fill: '#FFFFFF', fontWeight: 'bold' }} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#E87000"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            activeDot={{ r: 5, fill: '#E87000' }}
            dot={{ r: 3, fill: '#E87000' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AverageDailyIPSGraph;
