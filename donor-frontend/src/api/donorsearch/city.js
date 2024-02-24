import axios from "axios";
export const readCityById = async (user, id_city) => {
  return await axios.get(
    `https://donorsearchorg.ru/api/city/${id_city}/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
};
export const readCities = async (user) => {
  return await axios.get(
    `https://donorsearchorg.ru/api/city/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
};

