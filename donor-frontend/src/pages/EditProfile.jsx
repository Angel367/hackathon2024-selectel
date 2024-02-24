import DonorButton from "../components/DonorButton";
import { setUser } from "../localStorage";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";
import { editUser } from "../api/user";
import { useForm } from "react-hook-form";

function EditProfile() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: null,
      phone_number: null,
      first_name: null,
      last_name: null,
      middle_name: null,
      about: null,
      birth_date: null,
    },
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log(data);
    let userData;
    try {
      userData = await editUser(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errors = err.response.data.errors;
        for (const arrayErrors of Object.values(errors)) {
          arrayErrors.forEach((error) => {
            toast.error(error, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "dark",
            });
          });
        }
      } else {
        toast.error(err.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    }
    setUser(userData.data);
    navigate(`/users/${userData.data.user.username}`);
    location.reload();
  };
  return (
    <div>
      <h1>Редактирование профиля</h1>
      <form
        onSubmit={handleSubmit((data) => {
          event.preventDefault();
          onSubmit(data);
        })}
      >
        <label htmlFor="email">
          Электронная почта
          <input
            type="email"
            id="email"
            placeholder="Почта"
            {...register("email")}
          />
        </label>
        <label htmlFor="phone">
          Телефон
          <input
            type="text"
            id="phone"
            placeholder="Номер телефона"
            {...register("phone_number")}
          />
        </label>
        <label htmlFor="first_name">
          Имя
          <input
            type="text"
            id="first_name"
            placeholder="Ваше имя"
            {...register("first_name")}
          />
        </label>
        <label htmlFor="last_name">
          Фамилия
          <input
            type="text"
            id="last_name"
            placeholder="Ваша фамилия"
            {...register("last_name")}
          />
        </label>
        <label htmlFor="middle_name">
          Отчество
          <input
            type="text"
            id="middle_name"
            placeholder="Ваше отчество"
            {...register("middle_name")}
          />
        </label>
        <label htmlFor="birth_date">
          Дата рождения
          <input type="date" id="birth_date" {...register("birth_date")} />
        </label>
        <label htmlFor="gender">
          Пол
          <div className="input_container">
            <label htmlFor="male">
              <input
                type="radio"
                id="male"
                {...register("gender")}
                name="gender"
                value="male"
              />
              Мужской
            </label>
            <label htmlFor="female">
              <input
                type="radio"
                id="female"
                {...register("gender")}
                name="gender"
                value="female"
              />
              Женский
            </label>
            <label htmlFor="unknown">
              <input
                type="radio"
                id="female"
                {...register("gender")}
                name="gender"
                value="unknown"
              />
              Неизвестно
            </label>
          </div>
        </label>

        <label htmlFor="about">
          Описание профиля
          <input
            type="text"
            id="about"
            placeholder="Описание профиля"
            {...register("about")}
          />
        </label>
        <label htmlFor="kell_factor">
          Kell-фактор
          <div className="input_container">
            <label htmlFor="Positive">
              <input
                type="radio"
                id="Positive"
                {...register("kell_factor")}
                name="kell_factor"
                value="Positive"
              />
              Положительный
            </label>
            <label htmlFor="Negative">
              <input
                type="radio"
                id="Negative"
                {...register("kell_factor")}
                name="kell_factor"
                value="Negative"
              />
              Отрицательный
            </label>
            <label htmlFor="unknown">
              <input
                type="radio"
                id="Unknown"
                {...register("kell_factor")}
                name="kell_factor"
                value="Unknown"
              />
              Неизвестно
            </label>
          </div>
        </label>
        <label htmlFor="blood_group">
          Группа крови
          <div className="input_container">
            <label htmlFor="A">
              <input
                type="radio"
                id="A"
                {...register("blood_group")}
                name="blood_group"
                value="A"
              />
              A
            </label>
            <label htmlFor="B">
              <input
                type="radio"
                id="B"
                {...register("blood_group")}
                name="blood_group"
                value="B"
              />
              B
            </label>
            <label htmlFor="AB">
              <input
                type="radio"
                id="AB"
                {...register("blood_group")}
                name="blood_group"
                value="AB"
              />
              AB
            </label>
            <label htmlFor="O">
              <input
                type="radio"
                id="O"
                {...register("blood_group")}
                name="blood_group"
                value="O"
              />
              O
            </label>
            <label htmlFor="Unknown">
              <input
                type="radio"
                id="Unknown"
                {...register("blood_group")}
                name="blood_group"
                value="unknown"
              />
              Неизвестно
            </label>
          </div>
        </label>
        <label htmlFor="rh_factor">
          Резус-фактор
          <div className="input_container">
            <label htmlFor="Positive">
              <input
                type="radio"
                id="Positive"
                {...register("rh_factor")}
                name="rh_factor"
                value="Positive"
              />
              Положительный
            </label>
            <label htmlFor="Negative">
              <input
                type="radio"
                id="Negative"
                {...register("rh_factor")}
                name="rh_factor"
                value="Negative"
              />
              Отрицательный
            </label>
            <label htmlFor="unknown">
              <input
                type="radio"
                id="Unknown"
                {...register("rh_factor")}
                name="rh_factor"
                value="Unknown"
              />
              Неизвестно
            </label>
          </div>
        </label>

        <DonorButton type="submit" text="Сохранить изменения" />
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

export default EditProfile;
