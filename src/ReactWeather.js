import "./styles.css";
import { useEffect, useState } from "react";
import cityData from "./data/country-capital.json";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search?count=1&name=";
const CURRENT_URL = `https://api.open-meteo.com/v1/forecast?hourly=relativehumidity_2m,visibility&current_weather=true&forecast_days=1&`;

export default function ReactWeather() {
  const [cityName, setCityName] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      if (cityName === "") {
        return;
      }

      async function getData() {
        try {
          setData({});
          setError("");
          setIsLoading(true);

          const resGeo = await fetch(GEO_URL + cityName);
          if (!resGeo.ok) throw new Error("An error happens during get data..");
          const geoData = await resGeo.json();
          if (geoData.response === "false") throw new Error("City not found!");
          let latitude = geoData.results[0].latitude;
          let longitude = geoData.results[0].longitude;

          const resCurrent = await fetch(
            CURRENT_URL + `latitude=${latitude}&longitude=${longitude}`,
          );
          if (!resCurrent.ok)
            throw new Error("An error happens during get data..");
          const mData = await resCurrent.json();
          if (mData.response === "false") throw new Error("City not found!");

          setData(mData);
          console.log(mData);
        } catch (e) {
          setError(() => e.message);
          console.log(e.toString());
        } finally {
          setIsLoading(() => false);
        }
      }

      getData();
    },
    [cityName],
  );

  function inputHandler(city) {
    setCityName(() => city);
  }

  return (
    <div className="root">
      <div className="box-top">
        <Header></Header>
        <Input inputHandler={inputHandler}></Input>
      </div>

      <Content data={data} isLoading={isLoading} error={error} />
    </div>
  );
}
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function Header() {
  return (
    <div className="header border">
      <div className="title">
        <h1>React WeatherApp</h1>
        <i>by M.J Abolhassani</i>
      </div>
      <br />
      <Menu />
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

function Menu() {
  return (
    <span className="menu border">
      <a
        href="http://www.javad-abl.gigfa.com"
        target="_blank"
        rel="noreferrer noopener"
      >
        my site
      </a>
      <a
        href="https://github.com/JavadAbl"
        target="_blank"
        rel="noreferrer noopener"
      >
        my github
      </a>
      <a
        href="mailto://com.javadabl@gmail.com"
        target="_blank"
        rel="noreferrer noopener"
      >
        my email
      </a>
    </span>
  );
}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
function Input({ inputHandler }) {
  const [cityValue, setCityValue] = useState("");

  return (
    <form
      className="input border"
      onSubmit={(e) => {
        e.preventDefault();
        inputHandler(e.currentTarget.elements.namedItem("city").value);
      }}
    >
      Select a city:
      <br />
      <input
        className="edit-text"
        type="text"
        placeholder="Enter city name.."
        name="city"
        value={cityValue}
        onChange={(e) => {
          setCityValue(e.value);
        }}
      />
      <br />
      or select from list
      <br />
      <select
        className="edit-text"
        name="city-select"
        onChange={(i) => {
          setCityValue(i.currentTarget.value);
        }}
      >
        {Array.from(cityData, (item, i) => {
          return i !== 0 ? (
            <option
              value={item.city}
            >{`${i} - ${item.country} -- ${item.city}`}</option>
          ) : (
            <option value={""}>select..</option>
          );
        })}
      </select>
      <button>Search</button>
    </form>
  );
}

function Option() {
  return <div></div>;
}

function Content({ data, isLoading, error }) {
  const contentSelect = () => {
    //  if (!isLoading && !error && data === null)
    //   return <Message msg={"Select a city"}></Message>;
    if (isLoading) return <Message msg={"Loading..."}></Message>;
    if (error) return <Message msg={error}></Message>;
    if (data !== null) return <Result data={data}></Result>;
  };
  return <div className="content">{contentSelect()}</div>;
}

function Result({ data }) {
  // const currentTime = data.current_weather.time;
  const currentTime = new Date(data.current_weather.time);

  let indexTime;
  for (var i = 0; i < data.hourly.time.length; i++) {
    const dataTime = new Date(data.hourly.time[i]);
    if (
      dataTime.getHours() == currentTime.getHours() &&
      dataTime.getDay() == currentTime.getDay()
    )
      indexTime = i;
  }
  return (
    <div className="result">
      <div className="result-row">
        <span className="result-property">Temperature: </span>
        <span className="result-value">
          {data.current_weather.temperature}c
        </span>
      </div>
      <hr />
      <div className="result-row">
        <span className="result-property">Wind Speed: </span>
        <span className="result-value">
          {" "}
          {data.current_weather.windspeed} kph
        </span>
      </div>
      <hr />
      <div className="result-row">
        <span className="result-property">Wind Degree: </span>
        <span className="result-value">
          {data.current_weather.winddirection}
          <sup>o</sup>
        </span>
      </div>
      <hr />
      <div className="result-row">
        <span className="result-property">Humidity: </span>
        <span className="result-value">
          {data.hourly.relativehumidity_2m[indexTime]}%
        </span>
      </div>
      <hr />
      <div className="result-row">
        <span className="result-property">Visibility: </span>
        <span className="result-value">
          {data.hourly.visibility[indexTime]} m
        </span>
      </div>
    </div>
  );
}

function Message({ msg }) {
  return <p className="msg">{msg}</p>;
}
