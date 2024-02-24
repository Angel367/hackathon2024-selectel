import React, {useEffect, useState} from "react";
import {readCities} from "../api/donorsearch/city.js";
import {readBloodStations} from "../api/donorsearch/blood_station.js";
const SearchBloodStation = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    //todo split this into search and chose filter
    console.log(user);
    const [keywords, setKeywords] = useState("");
    const [city, setCity] = useState("");
    const [is_work_on_sunday, setIsWorkOnSunday] = useState("");
    const [is_work_on_saturday, setIsWorkOnSaturday] = useState("");
    const [is_typing_available, setIsTypingAvailable] = useState("");
    const [is_without_registration, setIsWithoutRegistration] = useState("");
    const [blood_type, setBloodType] = useState("");
    // if (user != null) { todo add user data to search
    //     blood_type
    // }
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
    return (
        <div>
            <form>
            <label htmlFor="keywords">Search Blood Station</label>
            <input type="text" id="keywords" name="keywords" placeholder="Search Blood Station"
            onChange={(e) => {
                setKeywords(e.target.value);
            }}
            />

             <label >
                      Город
                      <select
                          onChange={(e) => {
                                setCities(e.target.value);
                          }}
                          id="city" name="city">
                          {cities.map((city) => (
                              <option value={city.id}>{city.title}</option>
                          ))}
                      </select>
                  </label>


                <input type="checkbox" id="is_work_on_sunday" name="is_work_on_sunday"
                onChange={(e) => {
                    setIsWorkOnSunday(e.target.value);
                }}
                />
                <label htmlFor="is_work_on_sunday">Работает по ВС</label>
                <input type="checkbox" id="is_work_on_saturday" name="is_work_on_saturday"
                onChange={(e) => {
                    setIsWorkOnSaturday(e.target.value);
                }}
                />
                <label htmlFor="is_work_on_saturday">Работает по СБ</label>

                <input type="checkbox" id="is_typing_available" name="is_typing_available"
                onChange={(e) => {
                    setIsTypingAvailable(e.target.value);
                }}
                />
                <label htmlFor="is_typing_available">Типирование</label>
                <input type="checkbox" id="is_without_registration" name="is_without_registration"
                onChange={(e) => {
                    setIsWithoutRegistration(e.target.value);
                }}
                />
                <label htmlFor="is_without_registration">Без записи</label>
                <label htmlFor="blood_type">Тип крови</label>
                <select onChange={(e) => {
                    setBloodType(e.target.value);
                }} id="blood_type" name="blood_type"
                value={blood_type}>
                    <option value="o_plus">O+</option>
                    <option value="o_minus">O-</option>
                    <option value="a_plus">A+</option>
                    <option value="a_minus">A-</option>
                    <option value="b_plus">B+</option>
                    <option value="b_minus">B-</option>
                    <option value="ab_plus">AB+</option>
                    <option value="ab_minus">AB-</option>
                </select>
                <label htmlFor="city">Город</label>
                <select onChange={(e) => {
                    setCity(e.target.value);
                }} id="city" name="city"
                value={city}>
                    {cities.map((city_) => (
                        <option value={city_.id}>{city_.title}</option>
                    ))}
                </select>



     <button onClick={() => {
            readBloodStations(keywords, is_work_on_sunday, is_work_on_saturday, is_typing_available, is_without_registration, blood_type, city)
                .then((response) => {
                    setBloodStations(response.data);
                })
                .catch((error) => console.error(error));
            useEffect(() => {
                fetchBloodStations();
            });
     }
     }
             type="submit">Search</button>

</form>
            <div>
                {blood_stations.map((blood_station) => (
                    <div>
                        <h4>{blood_station.title}</h4>
                        <p>{blood_station.address}</p>
                        <p>{blood_station.city}</p>
                        <p>{blood_station.is_work_on_sunday}</p>
                        <p>{blood_station.is_work_on_saturday}</p>
                        <p>{blood_station.is_typing_available}</p>
                        <p>{blood_station.is_without_registration}</p>
                        {/*<p>{blood_station.o_plus}</p>*/}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default SearchBloodStation;