import axios from "axios";

const API = axios.create({
  baseURL: "https://hostel-management-1-l04q.onrender.com",  // Backend dev server
});

export default API;
