import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  Card,
  Badge,
  InputGroup,
  Button,
} from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaDownload, FaSearch } from "react-icons/fa";

const LaporanDonasi = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalDonation, setTotalDonation] = useState(0);
  const [todayDonation, setTodayDonation] = useState(0);
  const [weekDonation, setWeekDonation] = useState(0);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("https://backend-pantiasuhan-bhhhgnhjhshxczhd.indonesiacentral-01.azurewebsites.net/api/donations");
        console.log("Data donasi:", response.data);

        // Pastikan data yang diterima adalah array
        if (Array.isArray(response.data)) {
          setDonations(response.data);

          // Hitung total donasi yang berhasil
          const total = response.data
            .filter((donation) => donation.status === "success")
            .reduce((sum, donation) => {
              const amount = Number(donation.amount) || 0;
              return sum + amount;
            }, 0);

          // Hitung donasi hari ini
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayTotal = response.data
            .filter((donation) => {
              const donationDate = new Date(donation.created_at);
              return donation.status === "success" && donationDate >= today;
            })
            .reduce((sum, donation) => {
              const amount = Number(donation.amount) || 0;
              return sum + amount;
            }, 0);

          // Hitung donasi minggu ini
          const weekStart = new Date();
          weekStart.setDate(today.getDate() - today.getDay()); // Mulai dari hari Minggu
          weekStart.setHours(0, 0, 0, 0);
          const weekTotal = response.data
            .filter((donation) => {
              const donationDate = new Date(donation.created_at);
              return donation.status === "success" && donationDate >= weekStart;
            })
            .reduce((sum, donation) => {
              const amount = Number(donation.amount) || 0;
              return sum + amount;
            }, 0);

          console.log("Total donasi berhasil:", total);
          console.log("Total donasi hari ini:", todayTotal);
          console.log("Total donasi minggu ini:", weekTotal);

          setTotalDonation(total);
          setTodayDonation(todayTotal);
          setWeekDonation(weekTotal);
        } else {
          console.error("Data yang diterima bukan array:", response.data);
          setError("Format data tidak valid");
        }

        setError(null);
      } catch (error) {
        console.error("Error mengambil data donasi:", error);
        setError("Gagal mengambil data donasi");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    let variant = "secondary";
    let text = status;

    switch (status) {
      case "success":
        variant = "success";
        text = "Berhasil";
        break;
      case "pending":
        variant = "warning";
        text = "Menunggu";
        break;
      case "expired":
        variant = "danger";
        text = "Kadaluarsa";
        break;
      case "failed":
        variant = "danger";
        text = "Gagal";
        break;
      default:
        break;
    }

    return <Badge bg={variant}>{text}</Badge>;
  };

  // Filter data berdasarkan pencarian dan status
  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      donation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      donation.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus =
      statusFilter === "all" || donation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const downloadExcel = () => {
    // Filter donasi yang berhasil saja
    const successfulDonations = donations.filter(
      (donation) => donation.status === "success"
    );

    // Format data untuk Excel
    const excelData = successfulDonations.map((donation, index) => ({
      No: index + 1,
      "Order ID": donation.order_id,
      "Nama Donatur": donation.name,
      Email: donation.email,
      Nominal: donation.amount,
      "Metode Pembayaran": donation.payment_type || "Midtrans",
      Status: "Berhasil",
      Tanggal: formatDate(donation.created_at),
    }));

    // Buat worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Atur lebar kolom
    const wscols = [
      { wch: 5 }, // No
      { wch: 20 }, // Order ID
      { wch: 30 }, // Nama Donatur
      { wch: 30 }, // Email
      { wch: 15 }, // Nominal
      { wch: 20 }, // Metode Pembayaran
      { wch: 15 }, // Status
      { wch: 25 }, // Tanggal
    ];
    ws["!cols"] = wscols;

    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Donasi");

    // Generate nama file dengan tanggal
    const date = new Date().toLocaleDateString("id-ID").replace(/\//g, "-");
    const fileName = `Laporan_Donasi_${date}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Container className="laporandonasi">
      {/* Header Section */}
      <div className="header-section">
        <div>
          <h2>Laporan Donasi</h2>
          <p className="text-muted">Daftar donasi yang masuk ke sistem</p>
        </div>
        <Button
          variant="success"
          onClick={downloadExcel}
          disabled={
            loading ||
            donations.filter((d) => d.status === "success").length === 0
          }
        >
          <FaDownload className="me-2" />
          Download Excel
        </Button>
      </div>

      {/* Stat Cards */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={4}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Total Donasi Berhasil</Card.Title>
              <Card.Text className="display-6">
                {formatCurrency(totalDonation)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Donasi Minggu Ini</Card.Title>
              <Card.Text className="display-6">
                {formatCurrency(weekDonation)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Donasi Hari Ini</Card.Title>
              <Card.Text className="display-6">
                {formatCurrency(todayDonation)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <Row className="g-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Cari berdasarkan nama, email, atau order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="success">Berhasil</option>
              <option value="pending">Menunggu</option>
              <option value="expired">Kadaluarsa</option>
              <option value="failed">Gagal</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" />
          <p>Memuat data...</p>
        </div>
      ) : (
        <Card className="table-card">
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Nama Donatur</th>
                    <th>Email</th>
                    <th>Nominal</th>
                    <th>Metode Pembayaran</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.length > 0 ? (
                    filteredDonations.map((donation, index) => (
                      <tr key={donation.id}>
                        <td>{index + 1}</td>
                        <td>{donation.order_id}</td>
                        <td>{donation.name}</td>
                        <td>{donation.email}</td>
                        <td className="fw-bold">
                          {formatCurrency(donation.amount)}
                        </td>
                        <td>{donation.payment_type || "Midtrans"}</td>
                        <td>{getStatusBadge(donation.status)}</td>
                        <td>{formatDate(donation.created_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <p className="text-muted mb-0">Tidak ada data donasi</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default LaporanDonasi;
