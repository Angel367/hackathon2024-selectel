import { Link, Outlet } from "react-router-dom";
function Layout() {
  const user =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <div className="navbar">
        <Link to="/">
          <div className="drops">
            <img src="/drops.svg" />
          </div>
        </Link>
        {user && (
          <Link to={`/users/${user.user.username}`}>
            <img src="/user.svg" width={50} height={50} />
          </Link>
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default Layout;
