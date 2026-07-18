import axios from "axios";

const API = axios.create({
  baseURL: "https://wanderconnect.onrender.com/api",
});

export default API;