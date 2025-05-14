import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const FooterComponents = () => {
  return (
    <div className="footer">
      <Container>
        <Row className="d-flex justify-content-between">
          <Col lg="5">
            <h3>Panti Asuhan Masjid Gelora Indah</h3>
            <p className="desc">
              Panti asuhan yang berdedikasi untuk memberikan kasih sayang,
              pendidikan, dan masa depan yang lebih baik bagi anak-anak yatim
              piatu dan terlantar.
            </p>
            <div className="no">
              <Link className="text-decoration-none">
                <i className="fa-brands fa-whatsapp"></i>
                <p className="m-0">+62 896 1234 4321</p>
              </Link>
            </div>
            <div className="mail">
              <Link className="text-decoration-none">
                <i className="fa-regular fa-envelope"></i>
                <p className="m-0">Email : panti.gelora@gmail.com</p>
              </Link>
            </div>
          </Col>
          <Col className="d-flex flex-column col-lg-2 mt-lg-0 mt-5">
            <h5>Menu</h5>
            <Link to="/">Beranda</Link>
            <Link to="/program">Program</Link>
            <Link to="/tentang">Tentang Kami</Link>
            <Link to="/donasi">Donasi</Link>
            <Link to="/kontak">Kontak</Link>
          </Col>
          <Col lg="4" className="mt-lg-0 mt-5">
            <h5>Berlangganan Newsletter</h5>
            <div className="subsribe">
              <input type="text" placeholder="Masukkan email Anda" />
              <button className="btn">Berlangganan</button>
            </div>
            <div className="sosial mt-3">
              <i className="fa-brands fa-facebook"></i>
              <i className="fa-brands fa-instagram"></i>
              <i className="fa-brands fa-youtube"></i>
              <i className="fa-brands fa-tiktok"></i>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FooterComponents;
