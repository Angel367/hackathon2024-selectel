import React, { useState, useEffect } from "react";
import axios from "axios";

const tg = window.Telegram.WebApp;

const MySVG = ({ fillColor, digit }) => (
  <svg
    width="37"
    height="49"
    viewBox="0 0 37 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M-1.52588e-05 28.3976C-1.52588e-05 16.3932 9.32266 11.024 16.9037 0.714279C17.5936 -0.223667 18.4509 -0.250843 19.1088 0.714279C25.1069 9.51397 36.1599 15.3319 36.1599 28.3161C36.1599 39.4558 28.1794 48.5684 18.1536 48.5684C8.12793 48.5684 -1.52588e-05 39.538 -1.52588e-05 28.3976Z"
      fill={fillColor}
    />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="20"
      fill={["1", "2", "3"].includes(digit) ? "white" : "black"} // Change color based on the digit
    >
      {digit}
    </text>
  </svg>
);

const DonorsTop100 = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    axios
      .get("https://donorsearchorg.ru/api/donation_top/")
      .then((response) => {
        setDonors(response.data);
        setLoading(false);
        console.log(setDonors);
        console.log(loading);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1>Топ 100 доноров</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="container">
          <div className="donor-list">
            {donors.map((donor, index) => (
              <div key={index} className="donor-card">
                <h3>{donor.name_to_display}</h3>
                <p>{donor.value_to_display}</p>
                <p>{donor.total_amount} </p>
                <br></br>
                <MySVG
                  fillColor={
                    index === 0
                      ? "#F9DA62"
                      : index === 1
                      ? "#A6B3CE"
                      : index === 2
                      ? "#ED9564"
                      : "#F4F5F6"
                  }
                  digit={(index + 1).toString()} // Convert index to string before passing
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DonorsTop100;
