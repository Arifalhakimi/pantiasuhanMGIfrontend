import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ImageDetail from "../../assets/img/imageDetail.png";
import { donasi_donatur } from "../../data/index";
import {
  FaHeart,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
} from "react-icons/fa";


const DonasiPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      setName(response.data.name);
      setOriginalName(response.data.name);
      setEmail(response.data.email);
      setPhone(response.data.phone);
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      setUserData(null);
      setIsLoggedIn(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    const amount = selectedAmount || parseInt(customAmount);

    if (!amount || amount < 10000) {
      alert("Nominal donasi minimal Rp 10.000");
      return;
    }

    if (!isLoggedIn && (!name || !email || !phone)) {
      alert("Harap isi semua data yang diperlukan.");
      return;
    }

    if (!isLoggedIn && !email.includes("@")) {
      alert("Format email tidak valid");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        "http://localhost:5000/api/donations/donate",
        {
          user_id: userData?.id || null,
          name: isAnonymous ? "Hamba Allah" : name,
          email,
          phone,
          amount,
          message,
        },
        { headers }
      );

      if (response.data.redirect_url) {
        localStorage.setItem(
          "lastDonation",
          JSON.stringify({
            order_id: response.data.order_id,
            amount,
            name: isAnonymous ? "Hamba Allah" : name,
            email,
            phone,
            message,
          })
        );
        window.location.href = response.data.redirect_url;
      } else {
        throw new Error("Gagal mendapatkan halaman pembayaran");
      }
    } catch (error) {
      console.error("Error saat donasi:", error);
      alert(
        error.response?.data?.error || "Terjadi kesalahan saat memproses donasi"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="donasiPage">
      <div className="donasi min-vh-100">
        <Container>
          <Row className="image">
            <div className="image-donasi text-center mb-4">
              <img src={ImageDetail} alt="Donasi" className="donasi-image" />
            </div>
          </Row>

          <Row className="nominal">
            <div className="text-center mb-4">
              <h1 className="donasi-title">Donasi</h1>
              
            </div>
            <Col>
              <div className="donasi-form-container">
                <div className="mb-4">
                  <h4 className="form-title">
                    <FaHeart className="text-danger me-2" />
                    Masukkan Nominal Donasi
                  </h4>
                </div>

                <div className="nominal-donasi d-flex flex-wrap gap-2 mb-4">
                  {donasi_donatur.map((donasi) => (
                    <Button
                      key={donasi.id}
                      variant={
                        selectedAmount === donasi.jumlah
                          ? "success"
                          : "outline-success"
                      }
                      className="donasi-amount-btn"
                      onClick={() => {
                        setSelectedAmount(donasi.jumlah);
                        setCustomAmount(donasi.jumlah.toString());
                      }}
                    >
                      {donasi.jumlah.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </Button>
                  ))}
                </div>

                <Form onSubmit={handleDonate} className="donasi-form">
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">
                      Jumlah Lainnya
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Contoh: 50000"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(parseInt(e.target.value) || 0);
                      }}
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Sembunyikan nama (donasi sebagai Hamba Allah)"
                      checked={isAnonymous}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsAnonymous(checked);
                        if (checked) {
                          setOriginalName(name);
                          setName("Hamba Allah");
                        } else {
                          setName(originalName);
                        }
                      }}
                      className="custom-checkbox"
                    />
                  </Form.Group>

                  <div className="donor-info">
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label">
                        <FaUser className="me-2" />
                        Nama Lengkap
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Masukkan nama"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isAnonymous}
                        className="form-control-custom"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="form-label">
                        <FaEnvelope className="me-2" />
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Masukkan email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control-custom"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="form-label">
                        <FaPhone className="me-2" />
                        No. Telepon
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Masukkan nomor telepon"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-control-custom"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="form-label">
                        <FaComment className="me-2" />
                        Pesan (Opsional)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Tulis pesan atau doa untuk anak-anak panti asuhan"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-control-custom"
                      />
                    </Form.Group>
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="donate-btn"
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Memproses...
                        </>
                      ) : (
                        "Lanjutkan Pembayaran"
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DonasiPage;
