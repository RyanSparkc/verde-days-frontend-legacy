import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import { createAsyncMessage } from "../slice/messageReducer";

const API_BASE = import.meta.env.VITE_API_BASE;

function Login() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 進入頁面時檢查是否已有有效 Token
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .post(`${API_BASE}/api/user/check`)
        .then(() => navigate("/admin"))
        .catch(() => {
          // Token 無效，留在登入頁
          delete axios.defaults.headers.common["Authorization"];
          document.cookie =
            "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        });
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, data);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired).toUTCString()}; path=/;`;
      axios.defaults.headers.common["Authorization"] = token;
      navigate("/admin");
    } catch (err) {
      dispatch(createAsyncMessage({
        success: false,
        message: "登入失敗：" + (err.response?.data?.message || err.message),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form className="form-signin" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                id="username"
                placeholder="name@example.com"
                {...register("username", {
                  required: "請輸入 Email 地址",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email 格式不正確",
                  },
                })}
                autoFocus
              />
              <label htmlFor="username">Email address</label>
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                id="password"
                placeholder="Password"
                {...register("password", {
                  required: "請輸入密碼",
                  minLength: {
                    value: 6,
                    message: "密碼長度至少需 6 碼",
                  },
                })}
              />
              <label htmlFor="password">Password</label>
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
            <button
              className="btn btn-lg btn-primary w-100 mt-3"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  登入中...
                </>
              ) : (
                "登入"
              )}
            </button>
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

export default Login;
