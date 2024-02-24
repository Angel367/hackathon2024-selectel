import axios from "axios";
export const readCityById = async (user, id_city) => {
  const userToken = localStorage.getItem("user").token;
  const blood_stations = await axios.get(
    `https://hackaton.donorsearch.org/api/cities/${id_city}/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
};
