import axios from "axios";

const baseURL = "http://localhost:5000";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJ1c2VybmFtZSI6Im5pa2VUcmkwMSIsImVtYWlsIjoidHJpcHRpMTIzNDY3ODk4QGdtYWlsLmNvbSIsImlhdCI6MTcxNDcxNTcxMX0.L4lZH3nQEbSsukG1yVWgRa0y18A1qWNECibG-2GlW98";

const httpService = axios.create({
  baseURL: baseURL,
});

httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 500) {
        alert("Internal Server Error: Please try again later.");
      } else if (status === 401) {
        alert("Unauthorized: Please login to continue.");
      } else {
        alert(`Error ${status}: ${data.message}`);
      }
    } else if (error.request) {
      alert("Network Error: Please check your internet connection.");
    } else {
      alert("Error: Something went wrong. Please try again.");
    }
    return Promise.reject(error);
  }
);
let header = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};
const get = async (url) => {
  const response = await httpService.get(url, header);
  return response.data;
};

const post = async (url, obj) => {
  const response = await httpService.post(url, obj, header);
  return response.data;
};

const put = async (url, obj) => {
  const response = await httpService.put(url, obj, header);
  return response.data;
};

const deleteApi = async (url) => {
  const response = await httpService.delete(url, header);
  return response.data;
};

export default {
  get,
  post,
  deleteApi,
  put,
};
