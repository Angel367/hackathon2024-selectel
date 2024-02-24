import DonorButton from "../components/DonorButton";
import { setUser } from "../localStorage";
import { useNavigate } from "react-router-dom";
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
      rh_factor: "Unknown",
      kell_factor: "Unknown",
      blood_group: "Unknown",
      gender: "unknown",
    },
  });
  const onSubmit = async (data) => {
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
              autoClose: 2000,
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
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    }
    setUser(userData.data);
    toast.success("Профиль успешно обновлен", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
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
        <label>
          Электронная почта
          <input type="email" placeholder="Почта" {...register("email")} />
        </label>
        <label>
          Телефон
          <input
            type="text"
            placeholder="Номер телефона"
            {...register("phone_number")}
          />
        </label>
        <label>
          Имя
          <input
            type="text"
            placeholder="Ваше имя"
            {...register("first_name")}
          />
        </label>
        <label>
          Фамилия
          <input
            type="text"
            placeholder="Ваша фамилия"
            {...register("last_name")}
          />
        </label>
        <label>
          Отчество
          <input
            type="text"
            placeholder="Ваше отчество"
            {...register("middle_name")}
          />
        </label>
        <label>
          Дата рождения
          <input type="date" {...register("birth_date")} />
        </label>
        <div className="input_container">
          Пол
          <label>
            <input type="radio" {...register("gender")} value="male" />
            Мужской
          </label>
          <label>
            <input type="radio" {...register("gender")} value="female" />
            Женский
          </label>
          <label>
            <input
              type="radio"
              {...register("gender")}
              value="unknown"
              checked
            />
            Неизвестно
          </label>
        </div>
        <label>
          Описание профиля
          <input
            type="text"
            placeholder="Описание профиля"
            {...register("about")}
          />
        </label>

        <div className="input_container">
          Kell-фактор
          <label>
            <input type="radio" {...register("kell_factor")} value="Positive" />
            Положительный
          </label>
          <label>
            <input type="radio" {...register("kell_factor")} value="Negative" />
            Отрицательный
          </label>
          <label>
            <input type="radio" {...register("kell_factor")} value="Unknown" />
            Неизвестно
          </label>
        </div>

        <div className="input_container">
          Группа крови
          <label>
            <input type="radio" {...register("blood_group")} value="A" />A
          </label>
          <label>
            <input type="radio" {...register("blood_group")} value="B" />B
          </label>
          <label>
            <input type="radio" {...register("blood_group")} value="AB" />
            AB
          </label>
          <label>
            <input type="radio" {...register("blood_group")} value="O" />O
          </label>
          <label>
            <input type="radio" {...register("blood_group")} value="Unknown" />
            Неизвестно
          </label>
        </div>

        <div className="input_container">
          Резус-фактор
          <label>
            <input type="radio" {...register("rh_factor")} value="Positive" />
            Положительный
          </label>
          <label>
            <input type="radio" {...register("rh_factor")} value="Negative" />
            Отрицательный
          </label>
          <label>
            <input type="radio" {...register("rh_factor")} value="Unknown" />
            Неизвестно
          </label>
        </div>

        <DonorButton type="submit" text="Сохранить изменения" />
      </form>
      <ToastContainer />
    </div>
  );
}

export default EditProfile;
