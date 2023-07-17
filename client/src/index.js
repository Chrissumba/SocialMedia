import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/authContext";

ReactDOM.render( <
    DarkModeContextProvider >
    <
    AuthContextProvider >
    <
    Provider store = { store } >
    <
    App / >
    <
    /Provider> <
    /AuthContextProvider> <
    /DarkModeContextProvider>,
    document.getElementById("root")
);