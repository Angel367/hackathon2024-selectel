import axios from "axios";
export const readBloodStation = async (search_text=undefined,
                                             is_work_on_sunday=undefined,
                                             is_work_on_saturday=undefined,
                                             is_typing_available=undefined,
                                             is_without_registration=undefined,
                                             blood_type=undefined,
                                       city=undefined
                                             ) => {
    let query_params = {};

        if (search_text !== undefined) {
            query_params.search_text = search_text;
        }
        if (is_work_on_sunday!== undefined) {
            query_params.is_work_on_sunday = is_work_on_sunday;
        }
        if (is_work_on_saturday!== undefined) {
            query_params.is_work_on_saturday = is_work_on_saturday;
        }
        if (is_typing_available!== undefined) {
            query_params.is_typing_available = is_typing_available;
        }
        if (is_without_registration!== undefined) {
            query_params.is_without_registration = is_without_registration;
        }
        if (blood_type!== undefined) {
            query_params.blood_type = blood_type;
        }
        if (city !== undefined) {
            query_params.city = city;
        }
      return await axios.get(
          `https://donorsearchorg.ru/api/blood_station_search/`,
          {
              headers: {
                  "Content-Type": "application/json",
              },
              query_params: query_params
          }
      );
}

export const readBloodStations = async (user ) => {
  return await axios.get(
      `https://donorsearchorg.ru/api/blood_station_search/`,
      {
          headers: {
              "Content-Type": "application/json",
          },

      }
  )


};


export const readBloodStationById = async ( id_blood_station ) => {
  return await axios.get(
    `https://hackaton.donorsearch.org/api/blood_stations_search/${id_blood_station}/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
};
