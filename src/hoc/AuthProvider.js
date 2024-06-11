import { useCallback, useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";

import httpClient from "@/httpClient";
import { useRouter } from "next/router";

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useState({
    isAuth: false,
    refreshToken: undefined,
    accessToken: undefined,
    roles: [],
  });

  const register = async (userData, successCb) => {};

  const login = async (email, password, cb) => {
    httpClient
      .post(`/auth/login`, { email, password })
      .then((res) => {
        setAuthData({
          isAuth: true,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          roles: res.data.roles,
        });
        localStorage.setItem("access-token", res.data.accessToken);
        localStorage.setItem("refresh-token", res.data.refreshToken);
        router.push({ pathname: "/dashboard" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = async (email, password) => {};

  const verifyAccount = useCallback(async (token) => {}, []);

  const refreshToken = () => {
    httpClient
      .post(`/auth/refresh-token`, { refreshToken: authData.refreshToken })
      .then((res) => {
        setAuthData({
          ...authData,
          isAuth: true,
          accessToken: res.data.accessToken,
        });
        localStorage.setItem("access-token", res.data.accessToken);
      })
      .catch((err) => {
        // hata kodu 401 ise...
        setAuthData({
          isAuth: false,
          refreshToken: undefined,
          accessToken: undefined,
        });
        localStorage.clear();
        router.replace({ pathname: "/login" });
      });
  };

  const checkAuth = () => {
    httpClient
      .get(`/auth/authorization`)
      .then((res) => {
        setAuthData({
          ...authData,
          isAuth: true,
          roles: res.data.roles,
        });
      })
      .catch((err) => {
        setAuthData({
          isAuth: false,
          refreshToken: undefined,
          accessToken: undefined,
        });
        localStorage.clear();
        router.replace({ pathname: "/login" });
      });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    const refreshToken = localStorage.getItem("refresh-token");
    if (accessToken && refreshToken) {
      setAuthData({
        isAuth: true,
        refreshToken,
        accessToken,
      });
      checkAuth();
    } else {
      setAuthData({
        isAuth: false,
        refreshToken: undefined,
        accessToken: undefined,
      });
      localStorage.clear();
      router.replace({ pathname: "/login" });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authData,
        login,
        logout,
        register,
        verifyAccount,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
