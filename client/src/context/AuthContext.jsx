import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {Loader} from '../components/Loader';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${apiUrl}/api/auth/checkLoggin`, {
          withCredentials: true,
        });
        if (res.data.loggedIn === false) {
          setCurrentUser(null);
        } else {
          setCurrentUser(res.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (inputs) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${apiUrl}/api/auth/login`, inputs, {
        withCredentials: true,
      });
      setCurrentUser(res.data);
      Cookies.set("access_token", res.data.token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
  
      await axios.post(`${apiUrl}/api/auth/logout`, {}, {
        withCredentials: true
      });
  
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Wait for the initial authentication check to complete before rendering the children
  if (isLoading) {
    return <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-auto "><Loader /></div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};