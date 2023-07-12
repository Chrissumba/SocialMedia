import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/authContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render( <
    React.StrictMode >
    <
    DarkModeContextProvider >
    <
    AuthContextProvider >

    <
    Provider store = { store } >

    <
    App / >

    <
    /Provider>

    <
    /AuthContextProvider> <
    /DarkModeContextProvider>

    <
    /React.StrictMode>
);