import axios, { axiosPrivate } from "../../axios/axiosPrivate";

const AuthService = {
  register: async (userData) => {
    return await axios.post("/api/auth/register", userData);
  },

  login: async (email, password) => {
    const response = await axios.post("/api/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user)); 
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },

  verifyEmail: async (token) => {
    return await axios.get(`/api/auth/verify-email?token=${token}`);
  },
};

export default AuthService;
