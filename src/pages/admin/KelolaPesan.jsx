import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Button,
  Alert,
  InputGroup,
  Form,
  Modal,
  Card,
} from "react-bootstrap";
import { FaSearch, FaTimes, FaTrash, FaEye, FaEnvelope } from "react-icons/fa";
import "./KelolaPesan.css";

const KelolaPesan = () => {
  const [pesan, setPesan] = useState([]);
  const [filteredPesan, setFilteredPesan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [selectedPesan, setSelectedPesan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPesan();
  }, []);

  useEffect(() => {
    if (!Array.isArray(pesan)) {
      setFilteredPesan([]);
      return;
    }

    const filtered = pesan.filter((item) => {
      if (!item) return false;
      const searchLower = searchTerm.toLowerCase();
      const nama = (item.name || "").toLowerCase();
      const email = (item.email || "").toLowerCase();
      const pesanText = (item.message || "").toLowerCase();
      return (
        nama.includes(searchLower) ||
        email.includes(searchLower) ||
        pesanText.includes(searchLower)
      );
    });
    setFilteredPesan(filtered);
  }, [searchTerm, pesan]);

  const fetchPesan = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://backend-pantiasuhan-bhhhgnhjhshxczhd.indonesiacentral-01.azurewebsites.net/api/pertanyaan", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setPesan(data);
      setFilteredPesan(data);
    } catch (error) {
      console.error("Error fetching pesan:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setPesan([]);
        setFilteredPesan([]);
      } else {
        setError(error.response?.data?.error || "Gagal mengambil data pesan");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://backend-pantiasuhan-bhhhgnhjhshxczhd.indonesiacentral-01.azurewebsites.net/api/pertanyaan/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        alert("Pesan berhasil dihapus");
        fetchPesan();
      } catch (error) {
        console.error("Error deleting pesan:", error);
        setError(error.response?.data?.message || "Gagal menghapus pesan");
      }
    }
  };

  const handleViewPesan = (pesan) => {
    setSelectedPesan(pesan);
    setShowModal(true);
  };

  return (
    <div className="kelola-pesan-container">
      <Container fluid className="px-4 py-3">
        <Card className="shadow-sm border-0">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <FaEnvelope className="text-primary me-2" size={24} />
                <h2 className="mb-0">Kelola Pesan</h2>
              </div>
              <div className="search-container" style={{ width: "400px" }}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Cari pesan berdasarkan nama, email, atau isi pesan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                  {searchTerm && (
                    <Button
                      variant="light"
                      onClick={() => setSearchTerm("")}
                      className="border-start-0"
                    >
                      <FaTimes />
                    </Button>
                  )}
                </InputGroup>
              </div>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3">No</th>
                    <th className="py-3">Nama</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Tanggal</th>
                    <th className="py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredPesan) &&
                    filteredPesan.map((item, index) => (
                      <tr key={item.id}>
                        <td className="py-3">{index + 1}</td>
                        <td className="py-3">{item.name || "-"}</td>
                        <td className="py-3">{item.email || "-"}</td>
                        <td className="py-3">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </td>
                        <td className="py-3 text-center">
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2 action-button"
                            onClick={() => handleViewPesan(item)}
                          >
                            <FaEye className="me-1" />
                            Lihat
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="action-button"
                            onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash className="me-1" />
                            Hapus
                          </Button>
                        </td>
                      </tr>
                    ))}
                  {filteredPesan.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="empty-state">
                          <FaEnvelope size={48} className="text-muted mb-3" />
                          <p className="text-muted mb-0">
                            {searchTerm
                              ? "Tidak ada pesan yang ditemukan"
                              : "Belum ada data pesan"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="message-modal"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <FaEnvelope className="text-primary me-2" />
            Detail Pesan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedPesan && (
            <div className="message-details">
              <div className="message-header mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar-circle bg-primary text-white me-3">
                    {selectedPesan.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h5 className="mb-1">{selectedPesan.name}</h5>
                    <p className="text-muted mb-0">{selectedPesan.email}</p>
                  </div>
                </div>
                <div className="message-meta">
                  <p className="text-muted mb-2">
                    <small>
                      {selectedPesan.created_at
                        ? new Date(selectedPesan.created_at).toLocaleString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "-"}
                    </small>
                  </p>
                  {selectedPesan.subjek && (
                    <p className="mb-3">
                      <strong>Subjek:</strong> {selectedPesan.subjek}
                    </p>
                  )}
                </div>
              </div>
              <div className="message-content">
                <p className="mb-2">
                  <strong>Pesan:</strong>
                </p>
                <div className="message-text p-3 bg-light rounded">
                  {selectedPesan.message}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaPesan;
