import axios from "axios";
export const readDonationList = async (user) => {
  const userToken = user.user.token;
  console.log("token" + userToken);
  return await axios.post(
    "https://donorsearchorg.ru/api/user/donations/",
    {
        token: "token " + userToken,

    list: true


    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export const readDonation = async (user, id_donation) => {
  const userToken = user.user.token;
  // console.log(userToken);
  return await axios.put(
    `http://donorsearchorg.ru/api/user/donations/${id_donation}/`,
    {
        token: "token " + userToken,
        id: id_donation,
        get: true

    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
// export const updateDonation = async (user, id_donation, donation) => {
//   const userToken = localStorage.getItem("user").token;
//   console.log(userToken);
//   return await axios.put(
//     `https://donorsearchorg.ru/api/user/donations/${id_donation}/`,
//     {
//         token: "token " + userToken,
//         donation_date: donation.donation_date,
//         blood_station_id:donation.blood_station_id,
//         donation_type: donation.donation_type,
//         is_free: donation.is_free,
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }

export const createDonation = async (user, donation_date, is_free, donation_type, blood_station_id) => {
  const userToken = user.user.token;

  return await axios.post(
    "https://donorsearchorg.ru/api/user/donations/",
    {
        token: "token " + userToken,
        donation_date: donation_date,
        blood_station:blood_station_id,
        donation_type: donation_type,
        is_free: is_free
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export const deleteDonation = async (user, id_donation) => {
  const userToken = user.user.token;
  console.log(userToken);
  return await axios.delete(
    `https://donorsearchorg.ru/api/user/donations/${id_donation}/`,
    {
        token: "token " + userToken
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
