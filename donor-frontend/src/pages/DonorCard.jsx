import { useEffect, useState } from "react";
import ReadyToDonateItem from "../components/ReadyToDonateItem";
import { readUser } from "../api/user_for_profile";
import { editUserDonorCard } from "../api/user";

function DonorCard() {
  const [donorInfo, setDonorInfo] = useState({});
  useEffect(() => {
    const getDonorInfo = async () => {
      setDonorInfo((await editUserDonorCard({})).user);
    };

    getDonorInfo();
  }, []);
  console.log(donorInfo);
  return (
    <div>
      <h1>Карточка донора</h1>
      {donorInfo && (
        <div className="container">
          <div className="input_container donor-card-container">
            <ReadyToDonateItem
              ready={donorInfo.ready_to_donate_blood}
              name="Цельная кровь"
              svg="/blood.svg"
            />
            <ReadyToDonateItem
              ready={donorInfo.ready_to_donate_plasma}
              name="Плазма"
              svg="/plasma.svg"
            />
            <ReadyToDonateItem
              ready={donorInfo.ready_to_donate_platelets}
              name="Тромбоциты"
              svg="/trombs.svg"
            />
            <ReadyToDonateItem
              ready={donorInfo.ready_to_donate_erythrocytes}
              name="Эритроциты"
              svg="/eritrociti.svg"
            />
            <ReadyToDonateItem
              ready={donorInfo.ready_to_donate_granulocytes}
              name="Гранулоциты"
              svg="/granuls.svg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorCard;
