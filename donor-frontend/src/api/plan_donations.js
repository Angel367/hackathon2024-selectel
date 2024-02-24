import axios from "axios";
export const readPlanDonationList = async (user) => {
  const userToken = localStorage.getItem("user").token;
  console.log(userToken);
  return await axios.get(
    "https://donorsearchorg.ru/api/user/plan_donations/",
    {
        token: "token " + userToken,

    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export const readPlanDonation = async (user, id_plan_donation) => {
  const userToken = localStorage.getItem("user").token;
  console.log(userToken);
  return await axios.put(
    `https://donorsearchorg.ru/api/user/plan_donations/${id_plan_donation}/`,
    {
        token: "token " + userToken,

    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
export const updatePlanDonation = async (user, id_plan_donation, plan_donation) => {
  const userToken = localStorage.getItem("user").token;
  console.log(userToken);
  return await axios.put(
    `https://donorsearchorg.ru/api/user/plan_donations/${id_plan_donation}/`,
    {
        token: "token " + userToken,
        donation_date: plan_donation.donation_date,
        blood_station_id:plan_donation.blood_station_id,
        donation_type: plan_donation.donation_type,
        is_free: plan_donation.is_free,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export const createPlanDonation = async (user, plan_donation) => {
  const userToken = localStorage.getItem("user").token;
  console.log(userToken);
  return await axios.post(
    "https://donorsearchorg.ru/api/user/plan_donations/",
    {
        token: "token " + userToken,
        donation_date: plan_donation.donation_date,
        blood_station_id:plan_donation.blood_station_id,
        donation_type: plan_donation.donation_type,
        is_free: plan_donation.is_free,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export const deletePlanDonation = async (user, id_plan_donation) => {
  const userToken = localStorage.getItem("user").token;
  console.log(userToken);
  return await axios.put(
    `https://donorsearchorg.ru/api/user/donations/${id_plan_donation}/`,
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
