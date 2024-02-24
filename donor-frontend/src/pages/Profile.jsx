import { useParams } from "react-router-dom";
import DonorButton from "../components/DonorButton";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {readUser} from "../api/user_for_profile.js";
export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState({});


    const fetchData = () => {
        readUser(user).then(response => {
            setUserData(response.data);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        fetchData();
    }, []);
    console.log(userData);
  // let list_of_components = [];
  // if (userData.user.ready_to_donate_blood) {
  //   list_of_components.push("цельную кровь");
  // }
  // if (userData.user.ready_to_donate_platelets) {
  //   list_of_components.push("тромбоциты");
  // }
  // if (userData.user.ready_to_donate_erythrocytes) {
  //   list_of_components.push("эритроциты");
  // }
  // if (userData.user.ready_to_donate_granulocytes) {
  //   list_of_components.push("гранулоциты");
  // }
  // if (userData.user.ready_to_donate_plasma) {
  //   list_of_components.push("плазму");
  // }

  // const contactDataList = [];
  // for (const [key, contact] of Object.entries(user.user)) {
  //   if (key !== "token" && contact && key !== "id")
  //     contactDataList.push(contact);
  // }
  //
  // const donorInfo = [];
  // useEffect(() => {});

  return (
    <div className="container">
      {/*<h4>{username}</h4>*/}
      {/*<h4>{(userData.user.first_name || "")+ " " + (userData.user.last_name || "")}</h4>*/}
      {/*  <h5>*/}
      {/*      {userData.user.donor_status_name || ""}*/}
      {/*  </h5>*/}
      {/*  <h3>*/}
      {/*      /!*{userData.user*!/*/}
      {/*  </h3>*/}
      {/*<label htmlFor="contacts">*/}
      {/*  Персональные данные*/}
      {/*  <div className="input_container">*/}
      {/*      /!*{user}*!/*/}
      {/*  </div>*/}
      {/*</label>*/}
      {/*<label htmlFor="donor-card">*/}
      {/*  Карточка донора*/}
      {/*  <div className="input_container"></div>*/}
      {/*   <input*/}
      {/*    id="donor-card"*/}
      {/*    type="text"*/}
      {/*    disabled*/}
      {/*    value={*/}
      {/*      (user.user.blood_group || "") +*/}
      {/*      " " +*/}
      {/*      (user.user.rh_factor || "") +*/}
      {/*      ", " +*/}
      {/*      "Kell-фактор" +*/}
      {/*      (user.user.kell_factor || "") +*/}
      {/*      "/n"*/}
      {/*        // +*/}
      {/*      // "готов сдать " +*/}
      {/*      // list_of_components.map((components) => components + ", ")*/}
      {/*    }*/}
      {/*  />*/}
      {/*</label>*/}
      {/*<label htmlFor="plan-donatation">*/}
      {/*  Напомнить о донации*/}
      {/*  <div className="input_container">*/}
      {/*    {" "}*/}
      {/*    "Укажите центр крови, планируемую дату и тип донации." + " За 3 дня до*/}
      {/*    намеченной даты мы пришлём " + "напоминание на электронную почту."*/}
      {/*  </div>*/}
      {/*  /!* <input*/}
      {/*    id="plan-donatation"*/}
      {/*    type="text"*/}
      {/*    disabled*/}
      {/*    value={*/}
      {/*      "Центр крови" +*/}
      {/*      (user.user.plan_donations_last.blood_station_id || "") +*/}
      {/*      // todo добавить из их апи blood_station_id*/}
      {/*      "Дата" +*/}
      {/*      (user.user.plan_donations_last.donation_date || "")*/}
      {/*    }*/}
      {/*  /> *!/*/}
      {/*</label>*/}
      {/*<DonorButton*/}
      {/*  text="Запланировать"*/}
      {/*  // onClick={() => navigate("/donation-plan")}*/}
      {/*/>*/}

      {/*<button*/}
      {/*  className="notButton"*/}
      {/*  onClick={() => {*/}
      {/*    localStorage.removeItem("user");*/}
      {/*    navigate("/");*/}
      {/*    location.reload();*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <img src="/logout.svg" width={50} height={50} />*/}
      {/*</button>*/}
    </div>
  );
}
