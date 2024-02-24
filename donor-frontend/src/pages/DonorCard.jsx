import { useEffect, useState } from "react";
import ReadyToDonateItem from "../components/ReadyToDonateItem";
import { editUserDonorCard } from "../api/user";
import DonorButton from "../components/DonorButton";
import { ToastContainer, toast } from "react-toastify";
import { AxiosError } from "axios";

function DonorCard() {
  const [donorInfo, setDonorInfo] = useState({});
  const [blood, setBlood] = useState(donorInfo.ready_to_donate_blood);
  const [plasma, setPlasma] = useState(donorInfo.ready_to_donate_plasma);
  const [platelets, setPlatelets] = useState(
    donorInfo.ready_to_donate_platelets
  );
  const [erythrocytes, setErythrocytes] = useState(
    donorInfo.ready_to_donate_erythrocytes
  );
  const [granuls, setGranuls] = useState(
    donorInfo.ready_to_donate_granulocytes
  );

  useEffect(() => {
    const fetchData = async () => {
      setDonorInfo((await editUserDonorCard(donorInfo)).data.user);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Карточка донора</h1>
      {donorInfo && (
        <div className="container">
          <label>
            <strong>Группа крови</strong>
            <input
              list="blood_groups"
              onChange={(e) => {
                setDonorInfo({ ...donorInfo, blood_group: e.target.value });
              }}
              value={donorInfo.blood_group}
            />
            <datalist id="blood_groups">
              <option value="A" />
              <option value="AB" />
              <option value="B" />
              <option value="O" />
              <option value="Unknown" />
            </datalist>
          </label>
          <label>
            <strong>Kell-фактор</strong>
            <input
              list="kell_factors"
              onChange={(e) => {
                setDonorInfo({ ...donorInfo, kell_factor: e.target.value });
              }}
              value={donorInfo.kell_factor}
            />
            <datalist id="kell_factors">
              <option value="Positive" />
              <option value="Negative" />
              <option value="Unknown" />
            </datalist>
          </label>
          <label>
            <strong>Резус-фактор</strong>
            <input
              list="rh_factors"
              onChange={(e) => {
                setDonorInfo({ ...donorInfo, rh_factor: e.target.value });
              }}
              value={donorInfo.rh_factor}
            />
            <datalist id="rh_factors">
              <option value="Positive" />
              <option value="Negative" />
              <option value="Unknown" />
            </datalist>
          </label>
          <div className="input_container donor-card-container">
            <strong>Готов сдавать</strong>
            <button
              className="notButton"
              onClick={() => {
                setDonorInfo({ ...donorInfo, ready_to_donate_blood: !blood });
                setBlood(!blood);
              }}
            >
              <ReadyToDonateItem
                ready={donorInfo.ready_to_donate_blood}
                name="Цельная кровь"
                svg="/blood.svg"
              />
            </button>
            <button
              className="notButton"
              onClick={() => {
                setDonorInfo({ ...donorInfo, ready_to_donate_plasma: !plasma });
                setPlasma(!plasma);
              }}
            >
              <ReadyToDonateItem
                ready={donorInfo.ready_to_donate_plasma}
                name="Плазма"
                svg="/plasma.svg"
              />
            </button>
            <button
              className="notButton"
              onClick={() => {
                setDonorInfo({
                  ...donorInfo,
                  ready_to_donate_platelets: !platelets,
                });
                setPlatelets(!platelets);
              }}
            >
              <ReadyToDonateItem
                ready={donorInfo.ready_to_donate_platelets}
                name="Тромбоциты"
                svg="/trombs.svg"
              />
            </button>
            <button
              className="notButton"
              onClick={() => {
                setDonorInfo({
                  ...donorInfo,
                  ready_to_donate_erythrocytes: !erythrocytes,
                });
                setErythrocytes(!erythrocytes);
              }}
            >
              <ReadyToDonateItem
                ready={donorInfo.ready_to_donate_erythrocytes}
                name="Эритроциты"
                svg="/eritrociti.svg"
              />
            </button>
            <button
              className="notButton"
              onClick={() => {
                setDonorInfo({
                  ...donorInfo,
                  ready_to_donate_granulocytes: !granuls,
                });
                setGranuls(!granuls);
              }}
            >
              <ReadyToDonateItem
                ready={donorInfo.ready_to_donate_granulocytes}
                name="Гранулоциты"
                svg="/granuls.svg"
              />
            </button>
          </div>
          <DonorButton
            text="Сохранить изменения"
            onClick={() => {
              editUserDonorCard(donorInfo)
                .then(() =>
                  toast.success("Изменения сохранены", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    theme: "dark",
                  })
                )
                .catch((err) => {
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
                });
            }}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default DonorCard;
