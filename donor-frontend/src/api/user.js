import axios from "axios";
export const editUser = async (user) => {
  const userToken = JSON.parse(localStorage.getItem("user")).user.token;
  return await axios.put(
    "https://donorsearchorg.ru/api/user/account/",
    {
      email: user.email,
      username: user.username,
      token: "token " + userToken,
      phone_number: user.phone_number,
      first_name: user.first_name,
      last_name: user.last_name,
      middle_name: user.middle_name,
      birth_date: user.birth_date,
      gender: user.gender,
      about: user.about,
      is_email_verified: user.is_email_verified,
      is_phone_verified: user.is_phone_verified,
      kell_factor: user.kell_factor,
      blood_group: user.blood_group,
      rh_factor: user.rh_factor,
      donor_status_name: user.donor_status_name,
      has_donor_certificate: user.has_donor_certificate,
      ready_to_donate_blood: user.ready_to_donate_blood,
      ready_to_donate_plasma: user.ready_to_donate_plasma,
      ready_to_donate_platelets: user.ready_to_donate_platelets,
      ready_to_donate_erythrocytes: user.ready_to_donate_erythrocytes,
      ready_to_donate_granulocytes: user.ready_to_donate_granulocytes,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
export const editUserDonorCard = async (user) => {
  const userToken = JSON.parse(localStorage.getItem("user")).user.token;
  return await axios.put(
    "https://donorsearchorg.ru/api/user/donor-card/",
    {
      kell_factor: user.kell_factor,
      blood_group: user.blood_group,
      rh_factor: user.rh_factor,
      token: "token " + userToken,
      ready_to_donate_blood: user.ready_to_donate_blood,
      ready_to_donate_plasma: user.ready_to_donate_plasma,
      ready_to_donate_platelets: user.ready_to_donate_platelets,
      ready_to_donate_erythrocytes: user.ready_to_donate_erythrocytes,
      ready_to_donate_granulocytes: user.ready_to_donate_granulocytes,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
