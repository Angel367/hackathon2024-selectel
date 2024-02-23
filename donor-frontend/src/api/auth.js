import axios from "axios";
export async function register(password, username) {
  return await axios.post(
    "https://donorsearchorg.ru/api/users/",
    {
      user: {
        password: password,
        username: username,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function login(accountlogin, password) {
  return await axios.post(
    "https://donorsearchorg.ru/api/users/login/",
    {
      user: {
        username: accountlogin,
        password: password,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
