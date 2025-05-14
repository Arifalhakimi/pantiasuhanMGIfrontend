import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Memverifikasi email Anda...");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          setStatus("error");
          setMessage("Token verifikasi tidak ditemukan");
          return;
        }

        // Jika sudah terverifikasi, langsung redirect
        if (isVerified) {
          return;
        }

        await axios.get(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        setStatus("success");
        setIsVerified(true);
        setMessage(
          "Email berhasil diverifikasi! Anda akan diarahkan ke halaman utama..."
        );

        // Redirect ke halaman utama setelah 3 detik
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        // Jika error adalah "Token verifikasi tidak valid", kemungkinan email sudah terverifikasi
        if (
          error.response?.status === 400 &&
          error.response?.data?.error === "Token verifikasi tidak valid"
        ) {
          setStatus("success");
          setIsVerified(true);
          setMessage(
            "Email Anda sudah terverifikasi sebelumnya. Anda akan diarahkan ke halaman utama..."
          );

          // Redirect ke halaman utama setelah 3 detik
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            error.response?.data?.message ||
              "Terjadi kesalahan saat verifikasi email"
          );
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate, isVerified]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifikasi Email
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div
              className={`p-4 rounded-md ${
                status === "verifying"
                  ? "bg-blue-50 text-blue-700"
                  : status === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
