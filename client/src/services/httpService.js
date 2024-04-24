import axios from "axios";

const baseURL = "http://localhost:4000";

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
        alert('Internal Server Error: Please try again later.');
      } else if (status === 401) {
        alert('Unauthorized: Please login to continue.');
      } else {
        alert(`Error ${status}: ${data.message}`);
      }
    } else if (error.request) {
      alert('Network Error: Please check your internet connection.');
    } else {
      alert('Error: Something went wrong. Please try again.');
    }
    return Promise.reject(error);
  }
);

const get = async (url) => {
    const response = await httpService.get(url);
    return response.data;
};

const post = async (url, obj) => {
    const response = await httpService.post(url, obj);
    return response.data;
};

const put = async (url, obj) => {
    const response = await httpService.put(url, obj);
    return response.data;
};

const deleteApi = async (url) => {
    const response = await httpService.delete(url);
    return response.data;
};

export default {
  get,
  post,
  deleteApi,
  put,
};
