import axios from "axios";
import getConfig from "next/config";

const httpClient = axios.create({
  baseURL: "https://rest-j2kjfrifbq-ez.a.run.app/",
});

httpClient.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("access-token");
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

httpClient.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    httpClient
      .post("/auth/refresh-token", {
        refreshToken: localStorage.getItem("refresh-token"),
      })
      .then((res) => {
        localStorage.setItem("access-token", res.data.accessToken);
      })
      .catch((err) => {
        localStorage.clear();
      });
  }
});

export default httpClient;
