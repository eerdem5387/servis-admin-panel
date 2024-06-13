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

export default httpClient;
