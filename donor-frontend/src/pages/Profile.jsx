import { useParams } from "react-router-dom";
import DonorButton from "../components/DonorButton";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="container">
      <h4>{username}</h4>
      <label htmlFor="contacts">
        Контактные данные
        <input
          id="contacts"
          type="text"
          disabled
          value={
            (user.user.email || "") + ", " + (user.user.phone_number || "")
          }
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
        <img src="/logout.svg" width={50} height={50} />
      </button>
    </div>
  );
}
