import { Container, Row, Col, Form, Button } from "react-bootstrap";
import AboutImage from "../../assets/img/child2.png";
import { useState } from "react";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: false, message: "" });

    try {
      const response = await axios.post(
        "https://backend-pantiasuhan-bhhhgnhjhshxczhd.indonesiacentral-01.azurewebsites.net/api/pertanyaan",
        {
          name: formData.nama,
          email: formData.email,
          subjek: formData.subjek,
          message: formData.pesan,
        }
      );

      if (response.status === 200) {
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: "Pesan berhasil dikirim!",
        });
        // Reset form
        setFormData({
          nama: "",
          email: "",
          subjek: "",
          pesan: "",
        });
      }
    } catch (error) {
      console.error("Error mengirim pesan:", error.message);
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };

  return (
    <div className="Contact-page">
      <div className="Contact min-vh-100">
        <Container>
          <Row>
            <Col>
              <h1 className="fw-bold text-center mb-2">Hubungi Kami</h1>
              <p className="text-center mb-5">
                Jika ada kendala serta keperluan silahkan hubungi kami
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="contact-form-wrapper">
                {status.message && (
                  <div
                    className={`alert ${
                      status.success
                        ? "alert-success"
                        : status.error
                        ? "alert-danger"
                        : ""
                    } mb-4`}
                  >
                    {status.message}
                  </div>
                )}
                <Form onSubmit={handleSubmit}>
          <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Nama Lengkap</Form.Label>
                        <Form.Control
                          type="text"
                          name="nama"
                          value={formData.nama}
                          onChange={handleChange}
                          placeholder="Masukkan nama lengkap"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Masukkan email"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Subjek/Topik</Form.Label>
                    <Form.Control
                      type="text"
                      name="subjek"
                      value={formData.subjek}
                      onChange={handleChange}
                      placeholder="Masukkan subjek pesan"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Pesan</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="pesan"
                      value={formData.pesan}
                      onChange={handleChange}
                      placeholder="Tulis pesan Anda di sini..."
                      rows={5}
                      required
                    />
                  </Form.Group>
                  <div className="text-center">
                    <Button
                      variant="primary"
                      type="submit"
                      className="submit-btn"
                      disabled={status.loading}
                    >
                      {status.loading ? "Mengirim..." : "Kirim Pesan"}
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

export default ContactPage;
