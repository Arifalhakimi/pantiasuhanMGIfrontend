import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaTimes, FaTrash } from "react-icons/fa";

const KelolaUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users berdasarkan search term
    const filtered = users.filter((user) => {
      if (!user) return false;

      const searchLower = searchTerm.toLowerCase();
      const name = (user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const phone = (user.phone || "").toLowerCase();

      return (
        name.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower)
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUsers([]);
        setFilteredUsers([]);
      } else {
        setError(error.response?.data?.error || "Gagal mengambil data user");
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        alert("User berhasil dihapus");
        fetchUsers(); // Refresh data
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error.response?.data?.message || "Gagal menghapus user");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isFirstUser) {
        alert(
          "Registrasi berhasil! Silakan cek email Anda untuk verifikasi. Setelah verifikasi, Anda dapat login sebagai admin."
        );
        navigate("/login");
      } else {
        setShowModal(false);
        fetchUsers();
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "user",
        });
        alert("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Gagal mendaftarkan user");
      }
    }
  };

  return (
    <Container className="datauser">
      {/* Header Section */}
      <div className="header-section">
        <h2>Kelola User</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Tambah User
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search Section */}
      <div className="search-section">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Cari user berdasarkan nama, email, atau nomor telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              <FaTimes />
            </Button>
          )}
        </InputGroup>
      </div>

      {/* Table Section */}
      <div className="table-card">
        <Table hover>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>No. Telepon</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name || "-"}</td>
                <td>{user.email || "-"}</td>
                <td>{user.phone || "-"}</td>
                <td>
                  <span
                    className={`badge bg-${
                      user.role === "admin" ? "success" : "primary"
                    }`}
                  >
                    {user.role || "-"}
                  </span>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <FaTrash className="me-1" />
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <p className="text-muted mb-0">
                    {searchTerm
                      ? "Tidak ada user yang ditemukan"
                      : "Belum ada data user"}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>No. Telepon</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Daftarkan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default KelolaUser;
