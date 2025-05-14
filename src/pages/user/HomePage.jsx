import { Container, Row, Col, Card } from "react-bootstrap";
import HeroImage from "../../assets/img/bgheading4.jpg";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// faqcompinent
import AboutComponent from "../../components/AboutComponent";
import { useNavigate } from "react-router-dom";
import TestiComponent from "../../components/TestiComponent";
import { useState } from "react";

const HomePage = () => {
  let navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);

  const programs = [
    {
      id: 1,
      title: "Biaya Asrama & Masjid",
      icon: "bi bi-building",
      description:
        "Program ini mencakup biaya operasional asrama dan masjid, termasuk pemeliharaan fasilitas, listrik, air, dan kebutuhan sehari-hari penghuni asrama.",
      target: 50000000,
      current: 25000000,
    },
    {
      id: 2,
      title: "Biaya Pendidikan",
      icon: "bi bi-book",
      description:
        "Program ini ditujukan untuk membiayai pendidikan anak-anak asuh, termasuk biaya sekolah, buku, seragam, dan kebutuhan pendidikan lainnya.",
      target: 75000000,
      current: 35000000,
    },
    {
      id: 3,
      title: "Biaya Makan",
      icon: "bi bi-cup-hot",
      description:
        "Program ini untuk memastikan anak-anak asuh mendapatkan nutrisi yang cukup dengan menyediakan makanan bergizi setiap hari.",
      target: 30000000,
      current: 15000000,
    },
    {
      id: 4,
      title: "Biaya Kegiatan Lainnya",
      icon: "bi bi-people",
      description:
        "Program ini mendukung berbagai kegiatan tambahan seperti ekstrakurikuler, pelatihan keterampilan, dan kegiatan sosial lainnya.",
      target: 25000000,
      current: 10000000,
    },
  ];


  return (
    <div className="homepage ">
      <header className=" d-flex align-items-center overflow-hidden">
        <Container>
          <Row className="header-box d-flex align-items-center pt-lg-5">
            <Col lg="6">
              <div className="text-container">
                <h3 className="mb-1 animate__animated animate__fadeInUp animate__delay-1s mt-1">
                  Panti Asuhan Anak Yatim Piatu & Terlantar
                </h3>
                <h1 className="mb-1 animate__animated animate__fadeInUp animate__delay-1s mt-1">
                  Masjid Gelora Indah
                </h1>
                <h4 className="mb-4 animate__animated animate__fadeInUp animate__delay-1s mt-1">
                  Panti asuhan Kabupaten Banyumas terbuka terhadap bantuan
                  donatur dan sumbangan warga. Segera kunjungi panti asuhan
                  Masjid Gelora Indah jika Anda hendak menyalurkan bantuan atau
                  sumbangan.
                </h4>
                <button
                  className="btn btn-outline-light btn-lg rounded-5 me-2 animate__animated animate__backInUp animate__delay-1s w-25 fw-bold"
                  onClick={() => navigate("/donasi")}
                >
                  Donasi
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      <div className="program w-100 min-vh-50">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center fw-bold">Program</h1>
              <p className="text-center">Mau Beramal Apa Hari Ini?</p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            {programs.map((program) => (
              <Col key={program.id} md={6} lg={3} className="mb-4">
                <Card
                  className={`program-card h-100 ${
                    selectedProgram === program.id ? "selected" : ""
                  }`}
                  onClick={() =>
                    setSelectedProgram(
                      selectedProgram === program.id ? null : program.id
                    )
                  }
                >
                  <Card.Body className="text-center">
                    <i className={`${program.icon} program-icon`}></i>
                    <h4 className="mt-3">{program.title}</h4>
                    {selectedProgram === program.id && (
                      <div className="program-details mt-3">
                        <p>{program.description}</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      <div className="home-page-component">
        <AboutComponent />
        <TestiComponent />
      </div>
    </div>
  );
};

export default HomePage;
