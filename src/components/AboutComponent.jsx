import { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ImageAbout from "../assets/img/frame28.png";
import {
  FaPrayingHands,
  FaBookOpen,
  FaHandHoldingHeart,
  FaMosque,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const AboutComponent = () => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  const features = [
    {
      icon: <FaPrayingHands className="feature-icon" />,
      title: "Pendidikan Agama",
      count: "100%",
      description:
        "Pendidikan agama Islam yang berkualitas untuk membentuk akhlak mulia",
    },
    {
      icon: <FaBookOpen className="feature-icon" />,
      title: "Pendidikan Formal",
      count: "SD-SMA",
      description: "Pendidikan formal dari tingkat SD hingga SMA",
    },
    {
      icon: <FaHandHoldingHeart className="feature-icon" />,
      title: "Kegiatan Sosial",
      count: "Rutin",
      description: "Kegiatan sosial dan pengabdian masyarakat",
    },
    {
      icon: <FaMosque className="feature-icon" />,
      title: "Fasilitas",
      count: "Lengkap",
      description: "Asrama, Masjid, dan fasilitas pendidikan yang memadai",
    },
  ];

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Telepon",
      info: "+62 812-3456-7890",
      link: "tel:+6281234567890",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      info: "info@pantiasuhanmgi.com",
      link: "mailto:info@pantiasuhanmgi.com",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Alamat",
      info: "Jl. Masjid Gelora Indah No. 123, Banyumas",
      link: "https://goo.gl/maps/your-location",
    },
    {
      icon: <FaClock />,
      title: "Jam Operasional",
      info: "Senin - Minggu: 08:00 - 17:00",
      link: null,
    },
  ];

  return (
    <div className="about-component">
      <Container>
        <Row>
          <Col>
            <h1 className="section-title">Tentang Kami</h1>
            <div className="title-underline"></div>
          </Col>
        </Row>

        <Row className="my-5">
          <Col lg={4} className="image-about">
            <div className="image-wrapper">
              <img
                src={ImageAbout}
                alt="About"
                className="img-fluid"
                data-aos="fade-up"
                data-aos-duration="1000"
              />
            </div>
          </Col>
          <Col lg={8} className="text-about">
            <h1 className="judul-text fw-bold">
              Panti Asuhan Masjid Gelora Indah
            </h1>
            <p
              className={`about-text ${showFullText ? "full-text" : ""}`}
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              Merupakan panti asuhan yang berada di Kabupaten Banyumas. Panti
              asuhan ini merawat dan mendidik anak-anak yatim piatu serta
              anak-anak terlantar. Panti Asuhan Anak Yatim Piatu & Terlantar
              Masjid Gelora Indah memenuhi kebutuhan anak-anak yang dirawatnya
              mulai dari makanan hingga sekolahnya.
              {showFullText && (
                <span className="additional-text">
                  Kami berkomitmen untuk memberikan pendidikan yang berkualitas,
                  lingkungan yang aman dan nyaman, serta bimbingan moral dan
                  spiritual yang baik bagi setiap anak asuh. Dengan dukungan
                  dari para donatur dan masyarakat, kami terus berupaya untuk
                  meningkatkan kualitas hidup anak-anak asuh kami.
                </span>
              )}
            </p>
            <button
              className="btn btn-primary read-more-btn"
              onClick={toggleFullText}
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              {showFullText ? "Tutup" : "Baca Selengkapnya"}
            </button>
          </Col>
        </Row>

        <Row className="features-section">
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card
                className="feature-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Card.Body className="text-center">
                  <div className="feature-icon-wrapper">{feature.icon}</div>
                  <h3 className="feature-count">{feature.count}</h3>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="contact-section mt-5">
          <Col>
            <h2 className="section-subtitle">Informasi Kontak</h2>
            <div className="title-underline"></div>
          </Col>
        </Row>

        <Row className="contact-info-section">
          {contactInfo.map((contact, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card
                className="contact-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Card.Body className="text-center">
                  <div className="contact-icon-wrapper">{contact.icon}</div>
                  <h4 className="contact-title">{contact.title}</h4>
                  {contact.link ? (
                    <a href={contact.link} className="contact-info">
                      {contact.info}
                    </a>
                  ) : (
                    <p className="contact-info">{contact.info}</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="map-section mt-5">
          <Col>
            <h2 className="section-subtitle">Lokasi Kami</h2>
            <div className="title-underline"></div>
            <div className="map-container" data-aos="fade-up">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4072493153!2d109.24862667411452!3d-7.420100773083594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655f3f582a217f%3A0xdc6ad0db78e7f6d3!2sPanti%20Asuhan%20Anak%20Yatim%20Piatu%20%26%20Terlantar%20Masjid%20Gelora%20Indah!5e0!3m2!1sid!2sid!4v1746982924480!5m2!1sid!2sid"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Panti Asuhan Masjid Gelora Indah"
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutComponent;
