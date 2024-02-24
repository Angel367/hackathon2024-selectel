import { Link } from "react-router-dom";

function MenuCard({ text, src, link }) {
  return (
    <Link to={link}>
      <div className="menuCard">
        <img src={src} />
        <p>{text}</p>
      </div>
    </Link>
  );
}

export default MenuCard;
