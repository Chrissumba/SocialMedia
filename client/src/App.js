import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftbar/LeftBar";
import RightBar from "./components/rightbar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";

function App() {
    const { darkMode } = useContext(DarkModeContext);

    const Layout = ({ children }) => {
        return ( <
            div className = { `theme-${darkMode ? "dark" : "light"}` } >
            <
            Navbar / >
            <
            div style = {
                { display: "flex" } } >
            <
            LeftBar / >
            <
            div style = {
                { flex: 6 } } > { children } <
            /div> <
            RightBar / >
            <
            /div> <
            /div>
        );
    };

    const router = createBrowserRouter([{
            path: "/",
            element: ( <
                Layout >
                <
                Home / >
                <
                /Layout>
            ),
        },
        {
            path: "/profile/:id",
            element: ( <
                Layout >
                <
                Profile / >
                <
                /Layout>
            ),
        },
    ]);

    return ( <
        div >
        <
        RouterProvider router = { router }
        /> <
        /div>
    );
}

export default App;