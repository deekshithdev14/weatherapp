import { useState, useEffect } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const getDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

function getBackground(condition) {
  if (!condition) return "linear-gradient(135deg, #667eea, #764ba2)";

  condition = condition.toLowerCase();

  if (condition.includes("cloud"))
    return "linear-gradient(135deg, #757f9a, #d7dde8)";
  if (condition.includes("rain"))
    return "linear-gradient(135deg, #314755, #26a0da)";
  if (condition.includes("clear"))
    return "linear-gradient(135deg, #f7971e, #ffd200)";
  if (condition.includes("snow"))
    return "linear-gradient(135deg, #e6dada, #274046)";

  return "linear-gradient(135deg, #667eea, #764ba2)";
}

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.background = getBackground(
      data?.weather?.[0]?.main
    );
  }, [data]);

  const fetchWeather = async () => {
    if (!query.trim()) return;

    setStatus("loading");
    setError("");
    setData(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("City not found");

      const result = await res.json();
      setData(result);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="container">
      <div className="card">
        {/* HEADER */}
        <div className="header">
          <h1>Weather</h1>
          <p>{getDate()}</p>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button onClick={fetchWeather}>Search</button>
        </div>

        {/* STATES */}
        {status === "loading" && <p className="info">Loading...</p>}
        {status === "error" && <p className="error">{error}</p>}

        {/* WEATHER */}
        {data && (
          <div className="weather">
            <h2>
              {data.name}, {data.sys.country}
            </h2>

            <div className="temp">
              {Math.round(data.main.temp)}°C
            </div>

            <p className="condition">
              {data.weather[0].description}
            </p>

            <div className="stats">
              <div>
                <span>{Math.round(data.main.feels_like)}°C</span>
                <p>Feels</p>
              </div>
              <div>
                <span>{data.main.humidity}%</span>
                <p>Humidity</p>
              </div>
              <div>
                <span>{data.wind.speed} m/s</span>
                <p>Wind</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}