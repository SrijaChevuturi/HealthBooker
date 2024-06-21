import axios from "axios";

// Check if localStorage is available and get the token
const getToken = () => {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("token");
  }
  return "";
};

// Create Axios instance with token
const axiosWithToken = axios.create();

// Add a request interceptor to include the token in headers
axiosWithToken.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor to handle token expiration
axiosWithToken.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration logic here, e.g., redirect to login
      console.error("Token expired or unauthorized, redirecting to login.");
      // Example: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosWithToken;
