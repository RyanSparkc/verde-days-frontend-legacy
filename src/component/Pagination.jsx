function Pagination({ pagination, changePage }) {
  const handleClick = (e, page) => {
    e.preventDefault();
    changePage(page);
  };

  return (
    <nav aria-label="產品分頁">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${!pagination.has_pre && "disabled"}`}>
          <a
            className="page-link"
            href="#"
            aria-label="上一頁"
            onClick={(e) => handleClick(e, pagination.current_page - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {Array.from({ length: pagination.total_pages }).map((_, index) => (
          <li
            key={index}
            className={`page-item ${
              pagination.current_page === index + 1 && "active"
            }`}
          >
            <a
              className="page-link"
              href="#"
              onClick={(e) => handleClick(e, index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}
        <li className={`page-item ${!pagination.has_next && "disabled"}`}>
          <a
            className="page-link"
            href="#"
            aria-label="下一頁"
            onClick={(e) => handleClick(e, pagination.current_page + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
