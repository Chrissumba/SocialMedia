import React, { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async(inputs) => {
        // Simulate login logic
        setCurrentUser(inputs);
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    const authContextValue = useMemo(() => ({ currentUser, login }), [
        currentUser,
    ]);

    return ( <
        AuthContext.Provider value = { authContextValue } > { children } <
        /AuthContext.Provider>
    );
};