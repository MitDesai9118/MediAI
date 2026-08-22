import axios from "axios";

const api = axios.create({
  baseURL: "https://mediai-w9np.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;