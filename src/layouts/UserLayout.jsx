import { Outlet } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import FooterComponents from "../components/FooterComponents";

const UserLayout = () => {
    return (
        <>
            <NavbarComponent />
            <main>
                <Outlet/>
            </main>
            <FooterComponents/>
        </>
);
};
export default UserLayout;

