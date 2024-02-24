import React, {useEffect, useState} from "react";
import {readDonation, readDonationList} from "../../api/donations.js";
import {useParams} from "react-router-dom";


const Donation = () => {
  const {id} = useParams();
  const [donation, setDonation] = useState([]);
  // const [is_confirmed, setConfirmed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user)
  const fetchData = () => {
    readDonation(user, id)
      .then((response) => {
        setDonation(response.data);
        // setConfirmed(response.data.donation.is_confirmed);
      })
      .catch((error) => console.error(error));
  };
    console.log(donation);
  useEffect(() => {
    fetchData();
  },  []);

  return (
    <div className="container">
            {donation.map((donation, index) => (
            <div key={index} className="donation-card">
              <p>{donation.donation_date}</p>
              <h4>{donation.blood_station.name}</h4>
                <p>{donation.blood_station.address} </p>
              <p>{donation.donation_type} </p>
                <p>{donation.is_free} </p>
                <p>{donation.is_confirmed} </p>
            </div>
                ))}
            </div>
    );
}
export default Donation;