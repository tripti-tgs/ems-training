import axios from "axios";
// import auth from "./authServices.js";
const baseURL = "http://localhost:4000";


// function getApi(url) {
//   let token = auth.getToken();
//   let item = JSON.parse(token);
//   return axios.get(baseURL + url, {
//     headers: { Authorization: "bearer " + item || "dummayvalue" },
//   });
// }

function get(url) {
  return axios.get(baseURL + url);
}
function post(url, obj) {
  return axios.post(baseURL + url, obj);
}
function put(url, obj) {
  
   return axios.put(baseURL + url, obj);
}
function deleteApi(url) {
  return axios.delete(baseURL + url);
}
export default {
  get,
//   getApi,
  post,
  deleteApi,
  put,
};