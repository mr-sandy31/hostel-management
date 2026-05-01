import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.21:8000",  // Backend dev server
});

export default API;
