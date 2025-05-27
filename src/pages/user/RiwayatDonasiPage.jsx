import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Alert, Spinner } from "react-bootstrap";

const RiwayatDonasiPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://backend-pantiasuhan-bhhhgnhjhshxczhd.indonesiacentral-01.azurewebsites.net/api/donations/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch (err) {
        setError("Gagal memuat riwayat donasi.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Container className="my-5">
      <h2 className="mb-4">Riwayat Donasi Anda</h2>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : history.length === 0 ? (
        <Alert variant="info">Belum ada riwayat donasi.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama</th>
              <th>Jumlah</th>
              <th>Metode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.created_at).toLocaleString("id-ID")}</td>
                <td>{item.name}</td>
                <td>
                  {item.amount.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
                <td>{item.payment_type || "-"}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RiwayatDonasiPage;
