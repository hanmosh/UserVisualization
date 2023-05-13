import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';
import { Button, ButtonGroup } from '@mui/material';

export default function App() {

  //this is for the logo under the title
  const logo = require('./ryde_logo.png'); 

  //this is styling for the DAY|WEEK|MONTH buttons
  const styles = {
    "&.MuiButton-root": {
      border: "1px #8884d8 solid"
    },
    "&.MuiButton-text": {
      color: "#8884d8"
    },
    "&.MuiButton-contained": {
      color: "#8884d8"
    },
    "&.MuiButton-outlined": {
    color: "#8884d8"
    }
  };

  /**
  The time intervals for the different views (Day, Week, Month) of the line graph.
  @type {Object.<string, TimeIntervals>}
  */
  const timeIntervals = {
    Day: {days: 1, slice: 5, length: 10},
    Week: {days: 7, slice: 5, length: 10},
    Month: {days: 30, slice: 5, length: 7},
  };

  //useState constants
  const [graphData, setGraphData] = useState([]);
  const [activeButton, setActiveButton] = useState("Day");

  //default is Day view
  useEffect (() => {
    fetchData("Day");
  },[]);

  /**
  - Fetches the user sign-up data from the API for the specified time interval.
  - Transforms the data into an array of objects with count and date properties, where date is the month and day.
  - Sets the transformed data to the graphData state.
  @param {string} interval - The time interval to fetch data for (Day, Week, Month).
  */
  const fetchData = (interval) => {
    const { days, slice, length } = timeIntervals[interval];
    fetch(`https://dev-backend.rydecarpool.com/coding-challenge/signups?target=dev`)
      .then(response => response.json()) 
      .then(data => {
        const transformedData = [];
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          sum += data[i].count;
          if ((i + 1) % days === 0) {
            transformedData.push({
              count: sum,
              date: data[i].date.slice(slice, length)
            });
            sum = 0;
          }
        }
        if (sum > 0) {
          transformedData.push({
            count: sum,
            date: data[data.length - 1].date.slice(slice, length)
          });
        }
        setGraphData(transformedData);
      })
      .catch(err => console.log(err))
  };

  /** Sets the active button label and fetches the data for the selected time interval.
  @param {string} label - The label of the button that was clicked (Day, Week, or Month). 
  */
  const handleButtonClick = (label) => {
    setActiveButton(label);
    fetchData(label);
  };

    return (
      <main>
        <div className= "rydeLogo">
          <img src={logo} alt="ryde logo" width="45" height="45"/>
        </div>
        <h1>Ryde User Sign-Ups: October-December 2022</h1>
        <div className="graph">
          <div className = "buttonGroup">
            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                <Button onClick={() => handleButtonClick("Day")} sx={styles}>Day</Button>
                <Button onClick={() => handleButtonClick("Week")} sx={styles}>Week</Button>
                <Button onClick={() => handleButtonClick("Month")} sx={styles}>Month</Button>
            </ButtonGroup>
          </div>
          <ResponsiveContainer width="100%" aspect = {3}>
            <LineChart
              width={500}
              height={300}
              data={graphData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date"/>
          <YAxis dataKey="count"/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    );
}

