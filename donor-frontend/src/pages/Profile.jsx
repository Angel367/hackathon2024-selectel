import { Link } from "react-router-dom";
import DonorButton from "../components/DonorButton";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const contactDataList = [
    user.user.first_name + " " + user.user.last_name,
    user.user.email,
    user.user.phone_number,
  ];
  return (
    <div className="container">
      <h4>{user.user.username}</h4>
      <label htmlFor="contacts">
        Персональные данные
        <div className="input_container">{contactDataList.join(", ")}</div>
      </label>
      <Link to="/donor-card">
        <DonorButton text="Карточка донора" />
      </Link>
      {/* <label htmlFor="plan-donatation">
        Напомнить о донации
        <div className="input_container">
          Укажите центр крови, планируемую дату и тип донации. За 3 дня до
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
        />
      </label> */}
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
