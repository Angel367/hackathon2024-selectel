import axios from "axios";
export const readUser = async () => {
  const userToken = localStorage.getItem("user").token;
  console.log(userToken);
  return await axios.get(
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
