import { Link, useParams } from "react-router-dom";
import DonorButton from "../components/DonorButton";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import { readUser } from "../api/user_for_profile";
import axios from "axios";
export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
    const [donorInfo, setDonorInfo] = useState([]);
  const fetchData = () => {
   readUser(user.user.token)
      .then((response) => {
        setDonorInfo(response.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

    let list_of_components = [];
    // console.log(donorInfo.user.donor-card, "donorInfo");
  if (donorInfo.user.ready_to_donate_blood) {
    list_of_components.push("цельную кровь");
  }
  if (donorInfo.user.ready_to_donate_platelets) {
    list_of_components.push("тромбоциты");
  }
  if (donorInfo.user.ready_to_donate_erythrocytes) {
    list_of_components.push("эритроциты");
  }
  if (donorInfo.user.ready_to_donate_granulocytes) {
    list_of_components.push("гранулоциты");
  }
  if (donorInfo.user.ready_to_donate_plasma) {
    list_of_components.push("плазму");
  }


  console.log(donorInfo, "donorInfo");
const contactDataList = [
    donorInfo.user.first_name + " " +donorInfo.user.last_name,
    donorInfo.user.email,
    donorInfo.user.phone_number,
  ];
  return (
    <div className="container">

      <h4>{(donorInfo.user.first_name || "")+ " " + (user.user.last_name || "")}</h4>
      <label htmlFor="contacts">
        Персональные данные
        <div className="input_container">{contactDataList.join(", ")}</div>
      </label>
      <label htmlFor="donor-card">
        Карточка донора
        <div className="input_container"></div>
         <input
          id="donor-card"
          type="text"
          disabled
          value={
            (donorInfo.user.blood_group || "") +
            " " +
            (donorInfo.user.rh_factor || "") +
            ", " +
            "Kell-фактор" +
            (donorInfo.user.kell_factor || "") +
            "/n" +
            "готов сдать " +
            list_of_components.map((components) => components + ", ")
          }
        />
      </label>
      <label htmlFor="plan-donatation">
        Напомнить о донации
        <div className="input_container">
          Укажите центр крови, планируемую дату и тип донации.За 3 дня до
          намеченной даты мы пришлём напоминание на электронную почту.
        </div>
        <input
          id="plan-donatation"
          type="text"
          disabled
          value={
            "Центр крови" +
            (user.user.plan_donations_last.blood_station_id || "") +
            // todo добавить из их апи blood_station_id
            "Дата" +
            (user.user.plan_donations_last.donation_date || "")
          }
        /> *
      </label>
      <DonorButton
        text="Запланировать"
        // onClick={() => navigate("/donation-plan")}
      />

      <button
        className="notButton"
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/");
          location.reload();
        }}
      >
        <img src="/logout.svg" width={50} height={50} />
      </button>
      <Link to="/edit">Редактировать профиль</Link>
    </div>
  );
}
