import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;

function AdminLayout() {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = token;

    const checkAuth = async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        setIsAuthChecked(true);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`);
    } catch (err) {
      console.error(err);
    }
    document.cookie =
      "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  if (!isAuthChecked) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Verde Days 後台</span>
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/admin/products">
              產品管理
            </NavLink>
            <NavLink className="nav-link" to="/admin/orders">
              訂單管理
            </NavLink>
          </div>
          <NavLink className="btn btn-outline-secondary me-2" to="/">
            前往前台
          </NavLink>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            登出
          </button>
        </div>
      </nav>
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}

export default AdminLayout;
