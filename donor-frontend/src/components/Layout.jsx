import { Link, Outlet } from "react-router-dom";
function Layout() {
  const user =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <main>
        <div className="navbar">
          <Link to="/">
            <div className="drops">
              <img src="/drops.svg" />
            </div>
          </Link>
        </div>
        <Outlet />
      </main>
      <div className="footer">
        {user && (
          <>
            <Link to={`/users/${user.user.username}/donations/create`}>
              <img src="/add_donation.svg" width={40} height={40} />
            </Link>
            <Link to={`/users/${user.user.username}`}>
              <img src="/user.svg" width={40} height={40} />
            </Link>
          </>
        )}
        <Link to="/menu">
          <img src="/menu.svg" width={40} height={40} />
        </Link>
      </div>
    </>
  );
}

export default Layout;
