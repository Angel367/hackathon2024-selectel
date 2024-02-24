import { useParams } from "react-router-dom";
import DonorButton from "../components/DonorButton";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  let list_of_components = [];
    if (user.user.ready_to_donate_blood) {
        list_of_components.push("цельную кровь");
    }
    if (user.user.ready_to_donate_platelets) {
        list_of_components.push("тромбоциты");
    }
    if (user.user.ready_to_donate_erythrocytes) {
        list_of_components.push("эритроциты");
    }
    if (user.user.ready_to_donate_granulocytes) {
        list_of_components.push("гранулоциты");
    }
    if (user.user.ready_to_donate_plasma) {
        list_of_components.push("плазму");
    }

  return (
      <div className="container">
          <h4>{username}</h4>
          {/*<h4>{(user.user.first_name || "")+ " " + (user.user.last_name || "")}</h4>*/}
          <label htmlFor="contacts">
              Персональные данные
              <input
                  id="contacts"
                  type="text"
                  disabled
                  value={
                      (user.user.first_name || "") + ", " + (user.user.middle_name || "") +
                        ", " + (user.user.last_name || "") + ", " + (user.city_id || "")
                      + (user.user.email || "") + ", " + (user.user.phone_number || "")
                      // TODO добавить город с их апи

                  }
              />
          </label>
          <label htmlFor="donor-card">
              Карточка донора
              <input
                  id="donor-card"
                  type="text"
                  disabled
                  value={
                      (user.user.blood_group || "") + " " + (user.user.rh_factor || "") + ", " +
                        "Kell-фактор" + (user.user.kell_factor || "") + "/n" +
                      "готов сдать " + list_of_components.map((components) => components + ", ")
                  }
              />
          </label>
          <label htmlFor="plan-donatation">
              Напомнить о донации
              <input
                  id="plan-donatation"
                  type="text"
                  disabled
                  value={
                      "Укажите центр крови, планируемую дату и тип донации." +
                      " За 3 дня до намеченной даты мы пришлём " +
                      "напоминание на электронную почту."
                  }
              />

              <input
                  id="plan-donatation"
                  type="text"
                  disabled
                  value={
                        "Центр крови" + (user.plan_donations_last.blood_station_id || "") +
                        // todo добавить из их апи blood_station_id
                        "Дата" + (user.user.plan_donations_last.donation_date || "")

                  }
              />

              <DonorButton text="Запланировать"
                  // onClick={() => navigate("/donation-plan")}
              />
          </label>

          <button
              className="notButton"
              onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/");
                  location.reload();
              }}
          >
              <img src="/logout.svg" width={50} height={50}/>
          </button>
      </div>
  );
}
