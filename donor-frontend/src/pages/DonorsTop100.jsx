import React, { useState, useEffect } from "react";
import DonorButton from "../components/DonorButton.jsx";
import { Link } from "react-router-dom";

const tg = window.Telegram.WebApp;

export default function DonorsList() {
  const [apiData, setApiData] = useState(null);

  async function get_top_100_from_api() {
    try {
      const response = await fetch(
        "https://donorsearchorg.ru/api/donation_top/"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    get_top_100_from_api();
  }, []);

  return (
    <div>
      <h1>Топ 100 доноров!</h1>

      <div className="container">
        {apiData && (
          <p>
            {/* Render the data inside the <p> element */}
            {JSON.stringify(apiData)}
          </p>
        )}
      </div>
    </div>
  );
}
