import axios from "axios";
export const readUser = async (token) => {

  return await axios.put(
    "https://donorsearchorg.ru/api/user/main/",
    {
      token: "token " + token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
