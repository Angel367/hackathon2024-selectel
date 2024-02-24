import axios from "axios";
export const readBonusesWithCity = async (user ) => {
  const userToken = localStorage.getItem("user").token;
  if (userToken === null) {
      return await axios.get(
          `https://hackaton.donorsearch.org/api/bonuses/`,
          {
              headers: {
                  "Content-Type": "application/json",
              },
              query_params: {
                  city_id: user.city_id
              }
          }
      )
  }
  return null;
};

export const readBloodStationById = async (user, id_bonus ) => {
  const userToken = localStorage.getItem("user").token;
  const bonus = await axios.get(
    `https://hackaton.donorsearch.org/api/blood_stations/${id_bonus}/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
};
