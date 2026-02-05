import { Outlet, NavLink } from "react-router";

function FrontendLayout() {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-primary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <NavLink className="navbar-brand text-white fw-bold" to="/">
            Verde Days 綠日子
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/">
                  首頁
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/products">
                  商品列表
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/cart">
                  購物車
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="mt-5 py-3 text-center text-muted">
        <p>&copy; 2024~∞ Verde Days 綠日子</p>
      </footer>
    </>
  );
}

export default FrontendLayout;
