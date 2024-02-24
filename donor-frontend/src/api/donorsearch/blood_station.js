import axios from "axios";
export const readBloodStationWithCity = async (user, page ) => {
  const userToken = localStorage.getItem("user").token;
  if (userToken === null) {
      return await axios.get(
          `https://hackaton.donorsearch.org/api/blood_stations/`,
          {
              headers: {
                  "Content-Type": "application/json",
              },
              query_params: {
                  city_id: user.city_id,
                  page: page
              }
          }
      )
  }
  else {
      return await axios.get(
          `https://hackaton.donorsearch.org/api/blood_stations/`,
          {
              headers: {
                  "Content-Type": "application/json",
              },
          }
      )
  }
};
export const readBloodStationWithoutCity = async (user, page ) => {
  const userToken = localStorage.getItem("user").token;

  return await axios.get(
      `https://hackaton.donorsearch.org/api/blood_stations/`,
      {
          headers: {
              "Content-Type": "application/json",
          },
          query_params: {
              page: page
          }
      }
  )


};

export const readBloodStationById = async ( id_blood_station ) => {
  const userToken = localStorage.getItem("user").token;
  const blood_stations = await axios.get(
    `https://hackaton.donorsearch.org/api/blood_stations/${id_blood_station}/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
};
