import MenuCard from "../components/MenuCard";

function Menu() {
  const menuItems = [
    { text: "Бонусы", src: "bonus.svg", link: "/bonuses" },
    { text: "Центры крови", src: "blood_center.svg", link: "/blood_centers" },
    { text: "Топ доноров", src: "top_donors.svg", link: "/top" },
    { text: "Мероприятия", src: "events.svg", link: "/events" },
    { text: "Статьи", src: "articles.svg", link: "/articles" },
    { text: "Спецпроекты", src: "projects.svg", link: "/projects" },
  ];
  return (
    <>
      <h1>Меню</h1>
      <div className="container">
        <div className="menuGrid">
          {menuItems.map((item) => (
            <MenuCard text={item.text} src={item.src} link={item.link} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Menu;
