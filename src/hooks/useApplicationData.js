import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData( { apiKey }) {
  const [state, setState] = useState({
    location: '',
    input: 'Vancouver',
    weatherData: null,
    unit: 'c',
    expanded: false,
    forecastData: null
  });

  const setLocation = location => setState({ ...state, location });
  const setInput = input => setState({ ...state, input });
  const setWeatherData = weatherData => setState({ ...state, weatherData });
  const setUnit = unit => setState({ ...state, unit });
  const setExpanded = expanded => setState({ ...state, expanded });
  const setForecastData = forecastData => setState({ ...state, forecastData });

  const handleSubmit = (event) => {
    event.preventDefault();
    setInput(state.location);
  };

  const handleLocation = (event) => {
    setLocation(event.target.value);
  };

  useEffect(() => {
    Promise.all([
      axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${state.input}&aqi=no`),
      axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${state.input}&days=3&aqi=no&alerts=no`)
    ])
    .then((all) => {
      console.log('Current: ', all[0].data)
      console.log('Forecast: ', all[1].data)
      setState(prev => ({...prev, weatherData: all[0].data, forecastData: all[1].data}))
    })
    .catch((error) => {
      console.log(error);
      setWeatherData({ location: { name: 'N/A' }, current: { temp_c: 'N/A', condition: { text: 'N/A', icon:'../../public/favicon.ico' } } })
      setForecastData({ forecast: { forecastday: [] } })
    })
  }, [state.input]);

  console.log('Weather data from state:', state.weatherData);
  console.log('Forecast data from state:', state.forecastData);


  const handleToggle = () => {
    if (state.unit === 'c') {
      setUnit('f')
    } else {
      setUnit('c')
    };
  };

  const handleExpand = () => {
    setExpanded(!state.expanded);
  };

  return {
    state,
    handleSubmit,
    handleLocation,
    handleToggle,
    handleExpand
  };
};