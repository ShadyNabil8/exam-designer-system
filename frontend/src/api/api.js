import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.defaults.withCredentials = true;
export default api;
