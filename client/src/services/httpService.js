import axios from "axios";

let axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const token =
       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJ1c2VybmFtZSI6Im5pa2VUcmkwMSIsImVtYWlsIjoidHJpcHRpMTIzNDY3ODk4QGdtYWlsLmNvbSIsImlhdCI6MTcxNTA4MDMxM30.cXQgCBjYSlceLFcFPs_VEVhCcJ7-ou_c4TMnZ4F36lY";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
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

// Functions for HTTP methods
const get = async (url) => {
  const response = await axiosInstance.get(url);
  return response;
};

const post = async (url, data) => {
  console.log("data", data);
  const response = await axiosInstance.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const put = async (url, data) => {
  const response = await axiosInstance.put(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
});
  return response;
};

const deleteApi = async (url) => {
  const response = await axiosInstance.delete(url);
  return response;
};

export default {
  get,
  post,
  put,
  deleteApi,
};
