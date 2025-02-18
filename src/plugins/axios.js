import Vue from "vue";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const ApiService = {
  get(resource, config) {
    this.setHeaders();
    return api.get(resource, config);
  },

  post(resource, payload, config) {
    this.setHeaders();
    return api.post(resource, payload, config);
  },

  patch(resource, payload, config) {
    this.setHeaders();
    return api.patch(resource, payload, config);
  },

  delete(resource) {
    this.setHeaders();
    return api.delete(resource);
  },

  setHeaders() {
    if (window.localStorage.getItem("token")) {
      api.defaults.headers.common["Authorization"] =
        "Bearer " + window.localStorage.getItem("token");
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  },
};

Vue.prototype.$api = ApiService;

export default ApiService;
