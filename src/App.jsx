import './App.css';
import React, { useEffect, useState } from 'react';

import clear from "./assets/sun.png";
import rain from "./assets/rainy-day.png";
import humidity from "./assets/humidity.png";
import drizzle from "./assets/drizzle.png";
import snow from "./assets/snowy.png";
import wind from "./assets/wind.png";
import eye from "./assets/view.png"
import cloud from "./assets/cloud.png";  // ✅ Import cloud
import loupe from "./assets/loupe.png";  // ✅ Import loupe

const WeatherDetails = (props) => {
  return (
    <>
      <div className="image">
        <img src={props.image} alt="Image" width={200} />
      </div>
      <div className="temp">{props.temp}°C</div>
      <div className="location">{props.city}</div>
      <div className="country">{props.country}</div>
      <div className="cord">
        <div> <span className="lat">Latitude : </span> <span>{props.lat}</span> </div>
        <div> <span className="long">Longitude : </span> <span>{props.long}</span> </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidity} alt="Humidity" width={40} className='icon' />
          <div className="data">
            <div className="humidity-percentage">{props.humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind} alt="wind" width={40} className='icon' />
          <div className="data">
            <div className="wind-percentage">{props.wind} km/h</div>
            <div className="text">Wind</div>
          </div>
        </div>
        <div className="element">
          <img src={eye} alt="visibility" width={40} className='icon' />
          <div className="data">
            <div className="wind-percentage">{props.visibility} km</div>
            <div className="text">Visibility</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [image, setImage] = useState(clear);
  const [temp, setTemp] = useState(12);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [text, setText] = useState("Trichy");
  const [city, setCity] = useState("Trichy");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [visibility, setVisibility] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const WeatherIconMap = {
    "01d": clear,
    "01n": clear,
    "02n": cloud,
    "02d": cloud,
    "03d": drizzle,
    "03n": drizzle,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const search = async () => {
    let key = "d09f5ffb548e881ca236d853bb0f5af4";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${key}&units=metric`;

    try {
      setLoading(true);
      let res = await fetch(url);

      if (!res.ok) {
        console.log("HTTP error: ", res.status);
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      let data = await res.json();
      if (data.cod === "404") {
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      console.log(data);
      setHumidity(data.main.humidity);
      setTemp(Math.round(data.main.temp));  // ✅ Fixed temp calculation
      setWind(data.wind.speed);
      setLat(data.coord.lat);
      setLong(data.coord.lon);
      setCountry(data.sys.country);
      setCity(data.name);
      setVisibility((data.visibility)/1000)
      
      const WeatherIconCode = data.weather[0]?.icon;
      setImage(WeatherIconMap[WeatherIconCode] || clear);  // ✅ Fixed image assignment
      setCityNotFound(false);
      setLoading(false);
    } catch (error) {
      console.log("An error occurred: ", error.message);
      setError("An eroor occured while fetching the weather!")
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
  useEffect(function () {
    search();
  },[])
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" placeholder='Search city' onChange={handleCity} value={text} onKeyDown={handleKeyDown} />
          <div className="search-icon" onClick={() => search()}>
            <img src={loupe} alt="search" />
          </div>
        </div>
        
        {loading && <div className="loading-msg">Loading...</div>}
        {error && <div className="error-msg">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
        
        {!loading && !cityNotFound && <WeatherDetails image={image} temp={temp} city={city} country={country} lat={lat} long={long} humidity={humidity} wind={wind} visibility={visibility} />}
      </div>
    </>
  );
}

export default App;
