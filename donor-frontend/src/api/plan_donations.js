import axios from "axios";

export const readPlanDonationList = async (user) => {
  const userToken = user.user.token;
  console.log("token" + userToken);
  return await axios.post(
    "https://donorsearchorg.ru/api/user/donations/",
    {
      token: "token " + userToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const readPlanDonation = async (user, idDonation) => {
  const userToken = user.user.token;
  return await axios.put(
    `http://donorsearchorg.ru/api/user/donations/${idDonation}/`,
    {
      token: "token " + userToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
export const updatePlanDonation = async (
  user,
  id_plan_donation,
  plan_donation
) => {
  const userToken = localStorage.getItem("user").token;
  console.log(userToken);
  return await axios.put(
    `https://donorsearchorg.ru/api/user/plan_donations/${id_plan_donation}/`,
    {
      token: "token " + userToken,
      donation_date: plan_donation.donation_date,
      blood_station_id: plan_donation.blood_station_id,
      donation_type: plan_donation.donation_type,
      is_free: plan_donation.is_free,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// export const updatePlanDonation = async (user, idDonation, donation) => {
//   const userToken = localStorage.getItem("user").token;
//   console.log(userToken);
//   return await axios.put(
//     `https://plandonorsearchorg.ru/api/user/donations/${idDonation}/`,
//     {
//         token: "token " + userToken,
//         donationDate: donation.donation_date,
//         bloodStationId: donation.blood_station_id,
//         donationType: donation.donation_type,
//         isFree: donation.is_free,
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }

export const createPlanDonation = async (
  user,
  donationDate,
  isFree,
  donationType,
  bloodStationId
) => {
  const userToken = user.user.token;
  return await axios.post(
    "https://donorsearchorg.ru/api/user/donations/",
    {
      token: "token " + userToken,
      donation_date: plan_donation.donation_date,
      blood_station_id: plan_donation.blood_station_id,
      donation_type: plan_donation.donation_type,
      is_free: plan_donation.is_free,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const deletePlanDonation = async (user, idDonation) => {
  const userToken = user.user.token;
  console.log(userToken);
  return await axios.delete(
    `https://donorsearchorg.ru/api/user/donations/${idDonation}/`,
    {
      token: "token " + userToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
