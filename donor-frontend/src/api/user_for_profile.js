import axios from "axios";
export const readUser = async () => {
  const userToken = JSON.parse(localStorage.getItem("user")).user.token;
  console.log(userToken);
  return await axios.put(
    "https://donorsearchorg.ru/api/user/main/",
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
