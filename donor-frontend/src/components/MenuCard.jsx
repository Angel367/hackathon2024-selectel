import { Link } from "react-router-dom";

function MenuCard({ text, src, link }) {
  return (
    <Link to={link}>
      <div className="menuCard">
        <img src={src} width={40} height={40} />
        <p>{text}</p>
      </div>
    </Link>
  );
}

export default MenuCard;
