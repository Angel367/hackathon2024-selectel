import { useState } from "react";
import DonorButton from "../components/DonorButton";
import { register } from "../api/auth";
import { setUser } from "../localStorage";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";

function Register() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const onSubmit = async () => {
    let userData;
    try {
      userData = await register(password, username);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errors = err.response.data.errors;
        for (const arrayErrors of Object.values(errors)) {
          arrayErrors.forEach((error) => {
            toast.error(error, {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          });
        }
      } else {
        toast.error(err.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
    setUser(userData.data);
    navigate(`/users/${userData.data.user.username}`);
    location.reload();
  };
  return (
    <div>
      <h1>Регистрация</h1>
      <form
        onSubmit={() => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="text"
          required
          placeholder="Почта или телефон"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Пароль для приложения"
          onChange={(e) => setPassword(e.target.value)}
        />
        <DonorButton type="submit" text="Регистрация" />
      </form>
      <div className="goTo">
        <h5>Есть аккаунт?</h5>
        <Link to="/login">
          <h4>Войти</h4>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
