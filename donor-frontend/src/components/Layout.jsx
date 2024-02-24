import { Link, Outlet } from "react-router-dom";
function Layout() {
  const user =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  return (
    <main>
      <div className="navbar">
        <Link to="/">
          <div className="drops">
            <img src="/drops.svg" />
          </div>
        </Link>
      </div>

      <Outlet />
      <div className="footer">
        {user && (
          <Link to={`/users/${user.user.username}`}>
            <img src="/user.svg" width={70} height={70} />
          </Link>
        )}
        <Link to="/menu">
          <img src="/menu.svg" width={60} height={60} />
        </Link>
      </div>
    </main>
  );
}

export default Layout;
