

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});