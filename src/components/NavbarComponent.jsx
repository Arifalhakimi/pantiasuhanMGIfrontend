import { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Modal,
  Form,
  Alert,
  Dropdown,
} from "react-bootstrap";
import { navLinks } from "./../data/index";
import { NavLink, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import LogoNavbar from "../assets/img/navbar/logopantiasuhan.png";

// Konfigurasi axios default
const api = axios.create({
  baseURL: "https://backend-pantiasuhan-bhhhgnhjhshxczhd.indonesiacentral-01.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const NavbarComponent = () => {
  const [changeColor, setChangeColor] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    login: { email: "", password: "" },
    register: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    forgotPassword: {
      email: "",
      newPassword: "",
      confirmPassword: "",
      otp: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const changeBackgroundColor = () => {
      setChangeColor(window.scrollY > 10);
    };
    window.addEventListener("scroll", changeBackgroundColor);

    // Cek apakah user sudah login
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    }

    // Cek apakah ada token di URL (untuk callback Google)
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");
    if (googleToken) {
      localStorage.setItem("token", googleToken);
      fetchUserData(googleToken);
      // Hapus token dari URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => window.removeEventListener("scroll", changeBackgroundColor);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      setUserData(null);
    }
  };

  const handleInputChange = (formType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [formType]: { ...prev[formType], [field]: value },
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await api.post("/api/auth/login", formData.login);
      console.log("Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUserData(response.data.user);
        setShowLogin(false);
        setFormData((prev) => ({
          ...prev,
          login: { email: "", password: "" },
        }));

        // Redirect berdasarkan role
        if (response.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setLoginError("Token tidak diterima dari server");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setLoginError(error.response?.data?.message || "Login gagal");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");

    const { password, confirmPassword } = formData.register;
    if (password !== confirmPassword) {
      return setRegisterError("Password tidak cocok");
    }

    try {
      const registerData = {
        name: formData.register.name,
        email: formData.register.email,
        phone: formData.register.phone,
        password,
      };

      const response = await api.post("/api/auth/register", registerData);
      console.log("Register response:", response.data);

      setShowRegister(false);
      setShowLogin(true);
      setFormData((prev) => ({
        ...prev,
        register: {
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        },
      }));
    } catch (error) {
      console.error("Register error:", error.response?.data);
      setRegisterError(error.response?.data?.message || "Registrasi gagal");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://backend-pantiasuhan-bhhhgnhjhshxczhd.indonesiacentral-01.azurewebsites.net/api/auth/google";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/");
  };

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
    setLoginError("");
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setRegisterError("");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");

    const { email, newPassword, confirmPassword } = formData.forgotPassword;

    if (newPassword !== confirmPassword) {
      return setForgotPasswordError("Password baru tidak cocok");
    }

    try {
      if (!otpSent) {
        // Kirim OTP
        await api.post("/api/auth/forgot-password", { email });
        setOtpSent(true);
        setForgotPasswordError("");
      } else {
        // Verifikasi OTP dan ganti password
        await api.post("/api/auth/reset-password", {
          email,
          newPassword,
          otp: formData.forgotPassword.otp,
        });

        setShowForgotPassword(false);
        setShowLogin(true);
        setOtpSent(false);
        setFormData((prev) => ({
          ...prev,
          forgotPassword: {
            email: "",
            newPassword: "",
            confirmPassword: "",
            otp: "",
          },
        }));
      }
    } catch (error) {
      console.error("Forgot password error:", error.response?.data);
      setForgotPasswordError(
        error.response?.data?.message || "Terjadi kesalahan"
      );
    }
  };

  const openForgotPassword = () => {
    setShowLogin(false);
    setShowForgotPassword(true);
    setForgotPasswordError("");
    setOtpSent(false);
  };

  return (
    <>
      <Navbar expand="lg" className={changeColor ? "color-active" : ""}>
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="logo-navbar d-flex align-items-center"
          >
            <img className="logo" src={LogoNavbar} alt="logo" />
            <div className="name">
              <div>Panti Asuhan</div>
              <div>Masjid Gelora Indah</div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              {navLinks.map((link) => (
                <div className="nav-link" key={link.id}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    end
                  >
                    {link.text}
                  </NavLink>
                </div>
              ))}
            </Nav>

            {userData ? (
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  className="d-flex align-items-center gap-2"
                >
                  <i className="fas fa-user-circle"></i>
                  {userData.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => navigate("/riwayat")}
                    className="d-flex align-items-center gap-2"
                  >
                    <i className="fas fa-history"></i>
                    Riwayat Transaksi
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="d-flex align-items-center gap-2"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <div className="btn-navbar">
                  <div className="btn" onClick={openLogin}>
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Masuk
                  </div>
                </div>
                <div className="btn-navbar">
                  <div className="btn" onClick={openRegister}>
                    <i className="fas fa-user-plus me-2"></i>
                    Daftar
                  </div>
                </div>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <i className="fas fa-sign-in-alt me-2"></i>
            Login
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-envelope me-2"></i>
                Email
              </Form.Label>
              <Form.Control
                type="email"
                value={formData.login.email}
                onChange={(e) =>
                  handleInputChange("login", "email", e.target.value)
                }
                placeholder="Masukkan email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-lock me-2"></i>
                Kata Sandi
              </Form.Label>
              <Form.Control
                type="password"
                value={formData.login.password}
                onChange={(e) =>
                  handleInputChange("login", "password", e.target.value)
                }
                placeholder="Masukkan kata sandi"
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100 mb-3" variant="primary">
              <i className="fas fa-sign-in-alt me-2"></i>
              Login
            </Button>
            <div className="text-center mb-3">
              <span className="text-muted">atau</span>
            </div>
            <Button
              variant="outline-primary"
              className="w-100 mb-3"
              onClick={handleGoogleLogin}
            >
              <i className="fab fa-google me-2"></i>
              Login dengan Google
            </Button>
            <div className="text-center">
              <Button variant="link" onClick={openForgotPassword}>
                <i className="fas fa-key me-2"></i>
                Lupa Password?
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Register Modal */}
      <Modal
        show={showRegister}
        onHide={() => setShowRegister(false)}
        centered
        scrollable
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <i className="fas fa-user-plus me-2"></i>
            Register
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {registerError && <Alert variant="danger">{registerError}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-user me-2"></i>
                Nama Lengkap
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.register.name}
                onChange={(e) =>
                  handleInputChange("register", "name", e.target.value)
                }
                placeholder="Masukkan nama lengkap"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-envelope me-2"></i>
                Email
              </Form.Label>
              <Form.Control
                type="email"
                value={formData.register.email}
                onChange={(e) =>
                  handleInputChange("register", "email", e.target.value)
                }
                placeholder="Masukkan email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-phone me-2"></i>
                No Telepon
              </Form.Label>
              <Form.Control
                type="tel"
                value={formData.register.phone}
                onChange={(e) =>
                  handleInputChange("register", "phone", e.target.value)
                }
                placeholder="Masukkan nomor telepon"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-lock me-2"></i>
                Kata Sandi
              </Form.Label>
              <Form.Control
                type="password"
                value={formData.register.password}
                onChange={(e) =>
                  handleInputChange("register", "password", e.target.value)
                }
                placeholder="Masukkan kata sandi"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-lock me-2"></i>
                Konfirmasi Kata Sandi
              </Form.Label>
              <Form.Control
                type="password"
                value={formData.register.confirmPassword}
                onChange={(e) =>
                  handleInputChange(
                    "register",
                    "confirmPassword",
                    e.target.value
                  )
                }
                placeholder="Ulangi kata sandi"
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100" variant="success">
              <i className="fas fa-user-plus me-2"></i>
              Register
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <i className="fas fa-key me-2"></i>
            Lupa Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {forgotPasswordError && (
            <Alert variant="danger">{forgotPasswordError}</Alert>
          )}
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-envelope me-2"></i>
                Email
              </Form.Label>
              <Form.Control
                type="email"
                value={formData.forgotPassword.email}
                onChange={(e) =>
                  handleInputChange("forgotPassword", "email", e.target.value)
                }
                placeholder="Masukkan email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-lock me-2"></i>
                Password Baru
              </Form.Label>
              <Form.Control
                type="password"
                value={formData.forgotPassword.newPassword}
                onChange={(e) =>
                  handleInputChange(
                    "forgotPassword",
                    "newPassword",
                    e.target.value
                  )
                }
                placeholder="Masukkan password baru"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>
                <i className="fas fa-lock me-2"></i>
                Konfirmasi Password Baru
              </Form.Label>
              <Form.Control
                type="password"
                value={formData.forgotPassword.confirmPassword}
                onChange={(e) =>
                  handleInputChange(
                    "forgotPassword",
                    "confirmPassword",
                    e.target.value
                  )
                }
                placeholder="Konfirmasi password baru"
                required
              />
            </Form.Group>
            {otpSent && (
              <Form.Group className="mb-4">
                <Form.Label>
                  <i className="fas fa-shield-alt me-2"></i>
                  Kode OTP
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.forgotPassword.otp}
                  onChange={(e) =>
                    handleInputChange("forgotPassword", "otp", e.target.value)
                  }
                  placeholder="Masukkan kode OTP"
                  required
                />
              </Form.Group>
            )}
            <Button type="submit" className="w-100 mb-3" variant="primary">
              <i
                className={`fas ${otpSent ? "fa-key" : "fa-paper-plane"} me-2`}
              ></i>
              {otpSent ? "Ganti Password" : "Kirim Kode OTP"}
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowLogin(true);
                }}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Kembali ke Login
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavbarComponent;
