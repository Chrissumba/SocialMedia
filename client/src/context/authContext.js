import axios from "axios";
import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // Set the initial value to null

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const login = async(inputs) => {
        const res = await axios.post("http://localhost:3000/login", inputs, {
            withCredentials: true,
        });

        setCurrentUser(res.data);
    };

    useEffect(() => {
        // When the component mounts, check if user data is available in localStorage
        const userData = JSON.parse(localStorage.getItem("userdata"));
        if (userData) {
            setCurrentUser(userData);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("userdata", JSON.stringify(currentUser));
    }, [currentUser]);

    // Memoize the value provided to AuthContext using useMemo
    const authContextValue = useMemo(() => ({ currentUser, login }), [
        currentUser,
        login,
    ]);

    return ( <
        AuthContext.Provider value = { authContextValue } > { children } <
        /AuthContext.Provider>
    );
};