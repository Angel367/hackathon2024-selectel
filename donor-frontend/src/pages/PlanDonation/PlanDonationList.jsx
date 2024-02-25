import React, {useEffect, useState} from "react";
import {readDonationList} from "../../api/donations.js";


const PlanDonationList = () => {

  const [donations, setDonations] = useState([]);
  const [is_confirmed, setConfirmed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user)
  const fetchData = () => {
    readDonationList(user)
      .then((response) => {
        setDonations(response.data);
        // setConfirmed(response.data.donation.is_confirmed);
      })
      .catch((error) => console.error(error));
  };
    console.log(donations);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
            {donations.map((donation, index) => (
            <div key={index} className="donation-card">
              <p>{donation.donation_date}</p>
              <h4>{donation.blood_station.title}</h4>
                <p>{donation.blood_station.address} </p>
              <p>{donation.donation_type} </p>
                <p>{donation.is_free} </p>
                <p>{donation.is_confirmed} </p>
            </div>
                ))}
            </div>
    );
}
export default PlanDonationList;