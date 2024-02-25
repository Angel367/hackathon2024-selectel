import React, {useEffect, useState} from "react";
import {readDonationList} from "../../api/donations.js";
import {Link, useParams} from "react-router-dom";


const DonationList = () => {
  const {username} = useParams();
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
                <p>{donation.is_confirmed} </p>//TODO: fix this
              <Link to={`/users/${username}/donations/${donation.id}`}>
                    <h4>Подробнее</h4>
                </Link>
            </div>
                ))}
            </div>
    );
}
export default DonationList;