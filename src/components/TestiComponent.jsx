import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaQuoteLeft, FaUserCircle } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Pagination, EffectCoverflow, Autoplay } from "swiper/modules";

const TestiComponent = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("https://backend-pantiasuhan-bhhhgnhjhshxczhd.indonesiacentral-01.azurewebsites.net/api/donations");
        // Filter hanya donasi yang berhasil dan memiliki message
        const successfulDonations = response.data.filter(
          (donation) => donation.status === "success" && donation.message
        );
        setDonations(successfulDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return (
      <div className="testimonial">
        <Container>
          <Row>
            <Col>
              <h1 className="section-title">Testimoni Donatur</h1>
              <div className="title-underline"></div>
            </Col>
          </Row>
          <Row>
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Memuat testimoni...</p>
            </div>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="testimonial">
      <Container>
        <Row>
          <Col>
            <h1 className="section-title">Testimoni Donatur</h1>
            <div className="title-underline"></div>
          </Col>
        </Row>
        <Row>
          {donations.length > 0 ? (
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{
                clickable: true,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[EffectCoverflow, Pagination, Autoplay]}
              className="mySwiper"
            >
              {donations.map((donation) => (
                <SwiperSlide key={donation.id} className="swiper-slide">
                  <div className="testimonial-card">
                    <div className="quote-icon">
                      <FaQuoteLeft />
                    </div>
                    <div className="testimonial-content">
                      <div className="testimonial-header">
                        <div className="testimonial-avatar">
                          <FaUserCircle />
                        </div>
                        <div className="testimonial-info">
                          <h5>{donation.name}</h5>
                          <p className="donation-amount">
                            {donation.amount.toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="testimonial-message">
                        <p>{donation.message}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="no-testimonial">
              <p>Belum ada testimoni</p>
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default TestiComponent;
