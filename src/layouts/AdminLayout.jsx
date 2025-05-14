import { Outlet } from "react-router-dom";
import SidebarComponent from "../components/SidebarComponent";

const AdminLayout = () => {
  return (
    <>
      <div className="d-flex">
        <SidebarComponent />
        <div
          className="flex-grow-1 p-4"
          style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default AdminLayout;
