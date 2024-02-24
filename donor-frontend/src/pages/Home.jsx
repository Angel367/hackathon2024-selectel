import React, { useEffect } from "react";
import DonorButton from "../components/DonorButton.jsx";
import { Link } from "react-router-dom";
const tg = window.Telegram.WebApp;
export default function Home() {
  useEffect(() => {
    tg.ready();
    tg.BackButton.show();
    return () => {
      tg.BackButton.hide();
    };
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
