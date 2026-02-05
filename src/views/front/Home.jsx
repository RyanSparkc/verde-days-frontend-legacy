import { Link } from "react-router";

function Home() {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="display-4 text-primary">
          Verde Days 綠日子
        </h1>
        <p className="lead text-muted mt-3">
          為生活注入一抹綠意，從一盆植物開始
        </p>
        <Link to="/products" className="btn btn-primary btn-lg mt-3">
          瀏覽商品
        </Link>
      </div>
    </div>
  );
}

export default Home;
