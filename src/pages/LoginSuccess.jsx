import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Simpan token ke localStorage
      localStorage.setItem("token", token);

      // Redirect ke halaman utama
      navigate("/");
    } else {
      // Jika tidak ada token, redirect ke halaman login
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Memproses login...</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;
