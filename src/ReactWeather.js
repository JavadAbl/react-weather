import "./styles.css";
import { useEffect, useState } from "react";

const BASE_URL =
  "https://api.weatherapi.com/v1/current.json?key=af9730cd2c8d452e9d6121515231408&aqi=no&q=";

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
          setError(() => false);
          setIsLoading(() => true);
          const res = await fetch(BASE_URL + cityName);

          if (!res.ok) throw new Error("An error happens during get data..");
          const mData = await res.json();

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
    [cityName]
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
  return (
    <form
      className="input border"
      onSubmit={(e) => {
        e.preventDefault();
        inputHandler(e.currentTarget.elements.namedItem("city").value);
      }}
    >
      <label htmlFor="city">Select a city:</label>
      <input
        className="edit-text"
        type="text"
        placeholder="Enter city name.."
        name="city"
      />
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
  return (
    <div className="result">
      <div className="result-row">
        <span className="result-property">Temp: </span>
        <span className="result-value">{data.current.temp_c}C</span>
      </div>
      <hr />
      <div className="result-row">
        <span className="result-property">Wind Speed: </span>
        <span className="result-value"> {data.current.wind_kph} kph</span>
      </div>
      <hr />
      <div className="result-row">
        <span className="result-property">Wind Degree: </span>
        <span className="result-value">{data.current.wind_degree}</span>
      </div>
      <hr />
      <div className="result-row">
        <span className="result-property">Humidity: </span>
        <span className="result-value">{data.current.humidity}%</span>
      </div>
      <hr />
      <div className="result-row">
        <span className="result-property">Visibility: </span>
        <span className="result-value">{data.current.vis_km} km</span>
      </div>
    </div>
  );
}

function Message({ msg }) {
  return <p className="msg">{msg}</p>;
}
