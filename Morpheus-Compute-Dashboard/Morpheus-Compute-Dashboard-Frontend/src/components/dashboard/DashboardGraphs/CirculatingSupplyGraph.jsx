import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, CartesianGrid, YAxis } from 'recharts';
import api_url from "./../../../config/api_url.json"

const base_api_url = api_url.base_api_url

const CirculatingSupplyGraph = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${base_api_url}/circulatingSupply`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.circulating_supply);
      } catch (error) {
      }
    }

    fetchData();
  }, []);

  return (
    <ResponsiveContainer
      width="100%"
      height={props.height}
    >
      <LineChart
        width={600}  // Increase the width here
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 30,  // Increase the left margin here
          bottom: 0,
        }}
      >
        <XAxis dataKey="date" tick={{ fill: '#FFFFFF' }} style={{ fontSize: '10px', color: "#FFFFFF" }} />
        <YAxis tick={{ fill: '#FFFFFF' }} style={{ fontSize: '10px', color: "#FFFFFF" }} />
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#E87000"
          dot={false} // Removes the dots
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CirculatingSupplyGraph;
