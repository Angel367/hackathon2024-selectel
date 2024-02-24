import React, {useEffect, useState} from "react";
import {readDonation, readDonationList} from "../../api/donations.js";
import {useParams} from "react-router-dom";
import DonorButton from "../../components/DonorButton.jsx";
import {ToastContainer} from "react-toastify";


const DonationCreate = () => {
  const {id} = useParams();
  const [donation, setDonation] = useState([]);
  // const [is_confirmed, setConfirmed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user)
  const fetchData = () => {
    readDonation(user, id)
      .then((response) => {
        setDonation(response.data);
        // setConfirmed(response.data.donation.is_confirmed);
      })
      .catch((error) => console.error(error));
  };

    console.log(donation);
  useEffect(() => {
    fetchData();
  },  []);
 const [cities, setCities] = useState([]);
    const [blood_stations, setBloodStations] = useState([]);

    const fetchCities = () => {
        readCities()
            .then((response) => {
                setCities(response.data);//todo
            })
            .catch((error) => console.error(error));
    }
    const fetchBloodStations = () => {
        readBloodStations() //todo
            .then((response) => {
                setBloodStations(response.data);
            })
            .catch((error) => console.error(error));
    }
    useEffect(() => {
        fetchCities();
        fetchBloodStations();
    }, []);

  return (
      <div>
        <h1>Добавление донации</h1>
        <form
            onSubmit={handleSubmit((data) => {
              event.preventDefault();
              onSubmit(data);
            })}
        >

            <div>
                <div> Выберите тип донации
                <label htmlFor="donation_type_blood">
                > Цельная кровь
                    <input type="radio" id="donation_type_blood" name="donation_type" value="blood"/> </label>
                <label htmlFor="donation_type_plasma"
                > Плазма
                    <input type="radio" id="donation_type_plasma" name="donation_type" value="plasma"/> </label>
                <label htmlFor="donation_type_erythrocytes"> Эритроциты
                    <input type="radio" id="donation_type_erythrocytes" name="donation_type" value="erythrocytes"/> </label>
                <label htmlFor="donation_type_platelets">
                    Тромбоциты
                    <input type="radio" id="donation_type_platelets" name="donation_type" value="platelets"/> </label>
                <label htmlFor="donation_type_granulocytes">
                    Гранулоциты
                    <input type="radio" id="donation_type_granulocytes" name="donation_type" value="granulocytes"/> </label>
                    </div>
                <label htmlFor="donation_date">
                    Планируемая дата
                    <input

                        type="date"
                        id="donation_date"

                    />
                </label>
                <div> Тип возмещения
                <label htmlFor="is_free_true">
                    <h5>Бесплатно</h5>
                    <p>Питание или компенсация питания (5% МРОТ порядка 700-1500 ₽.
                        Учитывается при получении звания Почетного донора)</p>

                    <input
                       type="radio"
                        id="is_free_true"
                        name="is_free"
                        value="true"

                    />
                </label>
                <label htmlFor="is_free_false">
                    <h5>Платно</h5>
                    <p>Деньги или социальная поддержка. Не учитывается при получении звания почетного донора</p>
                    <input
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
                        type="radio"
                        id="blood_station_type_static"
                        name="blood_station_type"
                    />
    </label>

                    <label htmlFor="blood_station_type_mobile">
                    <h5>
                       Выездная акция
                    </h5>
                    <p>
                        День донора, выезды в ВУЗы, передвижные мобильные бригады
                        </p>
                    < input
                        type="radio"
                        id="blood_station_type_mobile"
                        name="blood_station_type"
                    />
                    </label>

                    </div>
                    <label htmlFor="city">
                        Город
                        <select id="city" name="city">
                            {cities.map((donation) => (
                            <option value={donation.id}>{donation.name}</option>
                            ))}
                        </select>

                    </label>
                    <label htmlFor="blood_station">
                        Центр крови
                        <select id="blood_station" name="blood_station">
                            {blood_stations.map((blood_station) => (
                            <option value={blood_station.id}>{blood_station.name}</option>
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
            <DonorButton type="submit" text="Напомнить о донации"/>
        </form>
          <ToastContainer/>
      </div>
  );
}
export default DonationCreate;