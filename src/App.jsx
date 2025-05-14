import { Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponents";
import SidebarComponent from "./components/DasboardMitraComponent"; // Import SidebarComponent
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/user/HomePage";
import FaqPage from "./pages/user/FaqPage";
import Contact from "./pages/user/Contact";
import InformasiComponent from "./components/InformasiComponent";
// import DashboarMitra from "./pages/Mitra/DashboarMitra"
// import DataPesananPage from "./pages/Mitra/DataPesananPage";
// import RiwayatPage from "./pages/Mitra/RiwayatPage";
// import JenisLayananPage from "./pages/Mitra/JenisLayananPage";
// import PemesananPage from "./pages/PemesananPage";
// import ProfileUserPage from "./pages/ProfileUserPage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
import DonasiPage from "./pages/user/DonasiPage";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DataDonasiAdmin from "./pages/admin/LaporanDonasi";
import DataUser from "./pages/admin/KelolaUser";
import KelolaPesan from "./pages/admin/KelolaPesan";
import TerimaKasihPage from "./pages/user/TerimakasihPage";
import RiwayatDonasiPage from "./pages/user/RiwayatDonasiPage";
import LoginSuccess from "./pages/LoginSuccess";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="/informasi" element={<InformasiComponent />} />
          {/* <Route path="/pemesanan" element={<PemesananPage />} /> */}
          {/* <Route path="/profile" element={<ProfileUserPage />} /> */}
          {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/donasi" element={<DonasiPage />} />
          <Route path="/terimakasih" element={<TerimaKasihPage />} />
          <Route path="/riwayat" element={<RiwayatDonasiPage />} />
          <Route path="/login-success" element={<LoginSuccess />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/datadonasi"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DataDonasiAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/data-user"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DataUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/data-pesan"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <KelolaPesan />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
