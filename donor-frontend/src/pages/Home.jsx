import React, { useEffect } from "react";
import DonorButton from "../components/DonorButton.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const tg = window.Telegram.WebApp;
export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    tg.ready();
    if (tg.isClosing) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <h1>Главная</h1>
      <Link to="/register">
        <div className="goTo">
          <DonorButton text="Регистрация" />
          <Link to="/login">Вход</Link>
        </div>
      </Link>
    </div>
  );
}
