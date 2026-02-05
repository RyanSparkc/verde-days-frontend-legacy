import { Link } from "react-router";

function NotFound() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="display-1 text-muted">404</h1>
      <p className="lead">找不到此頁面</p>
      <Link to="/" className="btn btn-outline-secondary">
        回到首頁
      </Link>
    </div>
  );
}

export default NotFound;
