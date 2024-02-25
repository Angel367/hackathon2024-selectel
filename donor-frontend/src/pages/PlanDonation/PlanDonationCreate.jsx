import React, {useEffect, useState} from "react";
import {createDonation, readDonation, readDonationList} from "../../api/donations.js";
import {useNavigate, useParams} from "react-router-dom";
import DonorButton from "../../components/DonorButton.jsx";
import {toast, ToastContainer} from "react-toastify";
import {readBloodStations} from "../../api/donorsearch/blood_station.js";
import {readCities} from "../../api/donorsearch/city.js";
import {register} from "../../api/auth.js";
import {AxiosError} from "axios";
import {setUser} from "../../localStorage.js";


const PlanDonationCreate = () => {

  const [donation_date, setDonationDate] = useState("");
    const [is_free, setIsFree] = useState("");
    const [donation_type, setDonationType] = useState("");
    const [blood_station_id, setBloodStationId] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

 const [cities, setCities] = useState([]);
    const [blood_stations, setBloodStations] = useState([]);

    const fetchCities = () => {
        readCities()
            .then((response) => {
                setCities(response.data);
            })
            .catch((error) => console.error(error));
    }
    const fetchBloodStations = () => {
        readBloodStations()
            .then((response) => {
                setBloodStations(response.data);
            })
            .catch((error) => console.error(error));
    }
    useEffect(() => {
        fetchCities();
        fetchBloodStations();
    }, []);
    console.log(cities);
    console.log(blood_stations);
    const onSubmit = async () => {
    let donationData;
    donationData = await createDonation(user, donation_date, is_free, donation_type, blood_station_id);
    try {

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
    const navigate = useNavigate();
    navigate(`/users/${userData.data.user.username}/donations/${userData.data.donation.id}`);
    location.reload();
  };
  return (
      <div>
        <h1>Добавление донации</h1>
        <form
           onSubmit={() => {
          event.preventDefault();
          onSubmit();
        }}

        >

            <div>
                <div> Выберите тип донации
                <label>
                Цельная кровь
                    <input onChange= {(e) => setDonationType(e.target.value)}
                               type="radio" id="donation_type_blood" name="donation_type" value="blood"/>
                </label>
                <label
                > Плазма
                    <input onChange={(e) => setDonationType(e.target.value)}
                        type="radio" id="donation_type_plasma" name="donation_type" value="plasma"/> </label>
                <label > Эритроциты
                    <input
                        onChange={(e) => setDonationType(e.target.value)}
                        type="radio" id="donation_type_erythrocytes" name="donation_type" value="erythrocytes"/> </label>
                <label >
                    Тромбоциты
                    <input onChange={(e) => setDonationType(e.target.value)}
                        type="radio" id="donation_type_platelets" name="donation_type" value="platelets"/> </label>
                <label >
                    Гранулоциты
                    <input onChange={(e) => setDonationType(e.target.value)}
                        type="radio" id="donation_type_granulocytes" name="donation_type" value="granulocytes"/> </label>
                    </div>
                <label>
                    Планируемая дата
                    <input
                        onChange={(e) => setDonationDate(e.target.value)}
                        type="date"
                        id="donation_date"

                    />
                </label>
                <div> Тип возмещения
                <label >
                    <h5>Бесплатно</h5>
                    <p>Питание или компенсация питания (5% МРОТ порядка 700-1500 ₽.
                        Учитывается при получении звания Почетного донора)</p>

                    <input
                        onChange={(e) => setIsFree(e.target.value)}
                       type="radio"
                        id="is_free_true"
                        name="is_free"
                        value="true"

                    />
                </label>
                <label >
                    <h5>Платно</h5>
                    <p>Деньги или социальная поддержка. Не учитывается при получении звания почетного донора</p>
                    <input
                        onChange={(e) => setIsFree(e.target.value)}
                        type="radio"
                        id="is_free_false"
                        name="is_free"
                        value="false"

                    />

                </label>
                </div>
                <div>
                Место сдачи
                <label>
                    <h5>
                        Стационарный пункт
                    </h5>
                    <p>
                        Центр крови или станция переливания в вашем городе
                    </p>
                    < input
                        onChange={(e) => setBloodStationId(e.target.value)}
                        type="radio"
                        id="blood_station_type_static"
                        name="blood_station_type"
                    />
    </label>

                    <label >
                    <h5>
                       Выездная акция
                    </h5>
                    <p>
                        День донора, выезды в ВУЗы, передвижные мобильные бригады
                        </p>
                    < input
                        onChange={(e) => setBloodStationId(e.target.value)}
                        type="radio"
                        id="blood_station_type_mobile"
                        name="blood_station_type"
                    />
                    </label>

                    </div>
                    <label htmlFor="city">
                        Город
                        <select onChange={(e) => setBloodStationId(e.target.value)}
                            id="city" name="city">
                            {cities.map((donation) => (
                            <option value={donation.id}>{donation.title}</option>
                            ))}
                        </select>

                    </label>
                    <label >
                        Центр крови
                        <select    onChange={(e) => setBloodStationId(e.target.value)}
                            id="blood_station" name="blood_station">
                            {blood_stations.map((blood_station) => (
                            <option value={blood_station.id}>{blood_station.title}</option>
                            ))}
                        </select>
                    </label>
                <div>
                    <span>Важно:</span> если ваш центр крови принимает по записи, то нужно отдельно записаться на сайте центра крови или через Госуслуги. Планирование донации на сайте DonorSearch позволит нам за 3 дня до указанной даты напомнить о вашем намерении совершить донацию и подготовиться к ней.
                </div>
                <div>
                    <span> </span>
                    <span>Планирование не означает запись на донацию в центр крови
                        </span>
                </div>

            </div>
            <DonorButton type="submit" text="Создать"/>
        </form>
          <ToastContainer/>
      </div>
  );
}
export default PlanDonationCreate;