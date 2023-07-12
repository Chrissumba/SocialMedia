import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./features/auth/authSlice";
import { selectDarkMode } from "./features/darkMode/darkModeSlice";

function App() {
    const currentUser = useSelector(selectCurrentUser);
    const darkMode = useSelector(selectDarkMode);

    const Layout = () => {
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
                { flex: 6 } } >
            <
            Outlet / >
            <
            /div> <
            RightBar / >
            <
            /div> <
            /div>
        );
    };

    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to = "/login" / > ;
        }

        return children;
    };

    const router = createBrowserRouter([{
            path: "/",
            element: ( <
                ProtectedRoute >
                <
                Layout / >
                <
                /ProtectedRoute>
            ),
            children: [{
                    path: "/",
                    element: < Home / > ,
                },
                {
                    path: "/profile/:id",
                    element: < Profile / > ,
                },
            ],
        },
        {
            path: "/login",
            element: < Login / > ,
        },
        {
            path: "/register",
            element: < Register / > ,
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


// import React from "react";
// import Home from "./pages/home/Home";
// import {
//     createBrowserRouter,
//     Route,
//     createRoutesFromElements,
//     RouterProvider,
// } from "react-router-dom";

// // create Router,route
// const myRouter = createBrowserRouter(
//     createRoutesFromElements(
//        < Route >

//        <Route path = "/"
//         element = { < Home / > }
//         />  
//         </Route>
//     )
// );
// const App = () => {
//     return <RouterProvider router = { myRouter }
//     />;
// };

// export default App;