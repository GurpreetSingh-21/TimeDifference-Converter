import React, { useState, useEffect } from "react";
import "./Header.css";

function Header() {
  const [timezones, setTimezones] = useState([]);
  const [fromZone, setFromZone] = useState("");
  const [toZone, setToZone] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [convertedTime, setConvertedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch time zones
  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await fetch("http://worldtimeapi.org/api/timezone");
        const data = await response.json();
        setTimezones(data);
      } catch (error) {
        console.error("Error fetching time zones:", error);
      }
    };

    fetchTimezones();
  }, []);

  // Convert time logic
  const convertTime = async () => {
    if (!fromZone || !toZone || !inputTime) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const fromResponse = await fetch(`http://worldtimeapi.org/api/timezone/${fromZone}`);
      const fromData = await fromResponse.json();
      const toResponse = await fetch(`http://worldtimeapi.org/api/timezone/${toZone}`);
      const toData = await toResponse.json();

      const fromOffset = parseInt(fromData.utc_offset.split(":")[0], 10);
      const toOffset = parseInt(toData.utc_offset.split(":")[0], 10);
      const timeDifference = toOffset - fromOffset;

      const [hours, minutes] = inputTime.split(":").map(Number);
      const convertedHours = (hours + timeDifference + 24) % 24;

      setConvertedTime(
        `${convertedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      );
    } catch (error) {
      console.error("Error converting time:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="Navbar">
        <h1 className="logo">TimeZone Converter</h1>
      </div>

      <div className="home-content">
        <h2>Welcome to TimeZone Converter</h2>
        <p>
          Convert times between time zones instantly. Perfect for meetings, travel, or staying connected globally.
        </p>

        {/* Conversion Section */}
        <div className="convert-section">
          <h2>Convert Time Zones</h2>
          <label>
            From Time Zone:
            <select
              value={fromZone}
              onChange={(e) => setFromZone(e.target.value)}
            >
              <option value="">Select Time Zone</option>
              {timezones.map((zone, index) => (
                <option key={index} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>
          <label>
            To Time Zone:
            <select
              value={toZone}
              onChange={(e) => setToZone(e.target.value)}
            >
              <option value="">Select Time Zone</option>
              {timezones.map((zone, index) => (
                <option key={index} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>
          <label>
            Enter Time:
            <input
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
            />
          </label>
          <button onClick={convertTime}>
            {isLoading ? "Converting..." : "Convert"}
          </button>
          {convertedTime && (
            <div className="result">
              <h3>Converted Time</h3>
              <p>
                {convertedTime} ({toZone})
              </p>
            </div>
          )}
        </div>

        <div className="features-section">
          <h3>Features:</h3>
          <ul>
            <li>Convert between any global time zones.</li>
            <li>Fast and easy-to-use interface.</li>
            <li>Perfect for remote workers and travelers.</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} TimeZone Converter. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Header;
