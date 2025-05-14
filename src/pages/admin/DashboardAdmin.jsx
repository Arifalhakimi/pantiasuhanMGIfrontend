import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaUsers,
  FaDonate,
  FaEnvelope,
  FaChartBar,
  FaChartPie,
  FaUserPlus,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardAdmin = () => {
  // Data untuk grafik donasi per bulan
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    datasets: [
      {
        label: "Total Donasi",
        data: [12000000, 19000000, 15000000, 25000000, 22000000, 30000000],
        backgroundColor: "#44db15",
        borderRadius: 5,
      },
    ],
  };

  // Data untuk pie chart metode pembayaran
  const pieData = {
    labels: ["Transfer Bank", "E-Wallet", "Cash"],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: ["#44db15", "#3bc312", "#2a9d0e"],
        borderWidth: 0,
      },
    ],
  };

  // Data aktivitas terbaru
  const recentActivities = [
    {
      id: 1,
      type: "user",
      name: "Ahmad Rizki",
      time: "5 menit yang lalu",
      icon: <FaUserPlus className="text-success" />,
    },
    {
      id: 2,
      type: "donation",
      name: "Siti Nurhaliza",
      amount: "Rp 500.000",
      time: "15 menit yang lalu",
      icon: <FaMoneyBillWave className="text-success" />,
    },
    {
      id: 3,
      type: "message",
      name: "Budi Santoso",
      message: "Bagaimana cara melakukan donasi?",
      time: "30 menit yang lalu",
      icon: <FaEnvelope className="text-success" />,
    },
  ];

  return (
    <div className="dashboardadmin">
      <Container>
        <div className="dashboard-header">
          <h2>Dashboard Admin</h2>
          <p>Selamat datang di panel admin.</p>
        </div>

        {/* Statistik Overview */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-info">
                  <h3>Total User</h3>
                  <h2>1,234</h2>
                  <p className="text-success">
                    <span>+12%</span> dari bulan lalu
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <FaDonate />
                </div>
                <div className="stat-info">
                  <h3>Total Donasi</h3>
                  <h2>Rp 123.456.789</h2>
                  <p className="text-success">
                    <span>+8%</span> dari bulan lalu
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <FaEnvelope />
                </div>
                <div className="stat-info">
                  <h3>Pesan Baru</h3>
                  <h2>15</h2>
                  <p className="text-success">
                    <span>5</span> belum dibaca
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Grafik */}
        <Row className="g-4 mb-4">
          <Col lg={8}>
            <Card className="chart-card">
              <Card.Body>
                <h4>Donasi per Bulan</h4>
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return "Rp " + value.toLocaleString("id-ID");
                          },
                        },
                      },
                    },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="chart-card">
              <Card.Body>
                <h4>Metode Pembayaran</h4>
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Aktivitas Terbaru dan Pesan */}
        <Row className="g-4">
          <Col lg={8}>
            <Card className="activity-card">
              <Card.Body>
                <h4>Aktivitas Terbaru</h4>
                <div className="activity-list">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-content">
                        <h5>{activity.name}</h5>
                        {activity.type === "donation" && (
                          <p className="amount">{activity.amount}</p>
                        )}
                        {activity.type === "message" && (
                          <p className="message">{activity.message}</p>
                        )}
                        <span className="time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="message-card">
              <Card.Body>
                <h4>Pesan Terbaru</h4>
                <div className="message-list">
                  <div className="message-item">
                    <div className="message-header">
                      <h5>Budi Santoso</h5>
                      <span className="time">30 menit yang lalu</span>
                    </div>
                    <p>Bagaimana cara melakukan donasi?</p>
                  </div>
                  <div className="message-item">
                    <div className="message-header">
                      <h5>Ani Wijaya</h5>
                      <span className="time">1 jam yang lalu</span>
                    </div>
                    <p>Apakah bisa melakukan donasi secara berkala?</p>
                  </div>
                  <div className="message-item">
                    <div className="message-header">
                      <h5>Dewi Lestari</h5>
                      <span className="time">2 jam yang lalu</span>
                    </div>
                    <p>Kapan jadwal kunjungan panti asuhan?</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardAdmin;
