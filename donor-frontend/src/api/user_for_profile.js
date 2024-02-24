import axios from "axios";
export const readUser = async (user) => {
  const userToken = localStorage.getItem("user").token;
  console.log(userToken, "token" + userToken);
  return await axios.get(
    "https://donorsearchorg.ru/api/user/main/",
      {
            query_params:{
               token: "token " + userToken,
      },

      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
