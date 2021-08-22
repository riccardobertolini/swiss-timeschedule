import * as React from "react";
import axios from 'axios';
import { format } from 'date-fns';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
const citiesList = require('../data/cities.json');

// styles
const pageStyles = {
  color: "#232129",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  padding: 6,
  maxWidth: 800,
  margin: '120px auto 0'
}

const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
  fontSize: 40,
}

const inputContainer = {
  display: 'flex',
  flex: 1,
}

const separator = {
  marginBottom: '20px'
}

const containerTimes = {
  padding: '20px',
  margin: '20px 0',
  border: '1px solid gray',
  borderRadius: '5px',
  boxShadow: '5px 5px 5px #eee',
}

const inputSearch = {
  width: '100%',
  paddingRight: 10,
}

const getHours = (string) => {
  const handleString = string.split('d')[1].split(':');
  const hours = handleString[0] > 0 ? `${handleString[0]}h` : '';
  const minutes = handleString[1] > 0 ? `${handleString[1]}m` : '';
  const separator = (hours.length > 0 && minutes.length > 0) ? ' and ' : '';
  return hours + separator + minutes;
}

const cleanSpecialChar = (element) => {
  var translate_re = /[àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ]/g;
  var translate = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';
  return (element.replace(translate_re, function(match){
      return translate.substr(translate_re.source.indexOf(match)-1, 1); })
  );
}

const IndexPage = () => {
  const [values, getValues] = React.useState([]);
  const [cityStart, selectCityStart] = React.useState('lucerne');
  const [cityDestination, selectCityDestination] = React.useState('zurich');

  React.useEffect(async ()=> {
    const results = await axios.get(`https://transport.opendata.ch/v1/connections?from=${cleanSpecialChar(cityStart)}&to=${cleanSpecialChar(cityDestination)}`);
    results && getValues(results.data.connections);
  }, [cityStart, cityDestination]);

return (
    <main style={pageStyles}>
      <title>Home Page</title>
      <h1 style={headingStyles}>
        Lookup for next trains in 🇨🇭
      </h1>
      <div style={inputContainer}>
        <div style={inputSearch}>
          From: <ReactSearchAutocomplete
                items={citiesList}
                onSelect={(item) => selectCityStart(item.name)}
                autoFocus
              />
        </div>
        <div style={inputSearch}>
        To: <ReactSearchAutocomplete
              items={citiesList}
              onSelect={(item) => selectCityDestination(item.name)}
              autoFocus
            />
        </div>
      </div>
      {
        values?.map(element => {
          return <div style={containerTimes}>
            <div>From: <strong>{element.from.station.name}</strong></div>
            <div>📅 {format(new Date(element.from.departure), 'dd/MM/yyyy HH:mm')}</div>
            <div>To: <strong>{element.to.station.name}</strong></div>
            <div>📅 {format(new Date(element.to.arrival), 'dd/MM/yyyy HH:mm')}</div>
            <div>⏱ {getHours(element.duration)}</div>
            <div></div>
          </div>
        })
      }
    </main>
  )
}

export default IndexPage
