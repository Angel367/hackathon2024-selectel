import React, { useState, useEffect } from "react";
import DonorButton from "../components/DonorButton.jsx";
import { Link } from "react-router-dom";

const tg = window.Telegram.WebApp;

export default function Home() {
    const [apiData, setApiData] = useState(null);

    useEffect(() => {
        tg.ready();
        tg.BackButton.show();
        return () => {
            tg.BackButton.hide();
        };
    }, []);

    async function get_top_100_from_api() {
        try {
            const response = await fetch("https://donorsearchorg.ru/api/donation_top/");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setApiData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        get_top_100_from_api();
    }, []);

    return (
        <div>
            <h1>Главная</h1>
            <Link to="/register">
                <div className="goTo">
                    <DonorButton text="Регистрация" />
                </div>
            </Link>
            <Link to="/login">Вход</Link>
            {apiData && (
                <p>
                    {/* Render the data inside the <p> element */}
                    {JSON.stringify(apiData)}
                </p>
            )}
        </div>
    );
}
