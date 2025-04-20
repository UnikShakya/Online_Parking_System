import React, { createContext, useState } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [username, setUsername] = useState(localStorage.getItem("username") || null);

    const url = "http://localhost:3000"; // Replace with your actual API URL

    return (
        <StoreContext.Provider value={{ token, setToken, username, setUsername, url }}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContext;
