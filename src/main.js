import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import ApiService from "./plugins/axios";
import VueApexCharts from "./plugins/apexCharts";
import AuthService from "@/services/authService.js";
import "@mdi/font/css/materialdesignicons.css";

const app = createApp(App);

app.use(vuetify);
app.use(router);
app.use(store);
app.use(VueApexCharts);

//app.component("ApexChart", VueApexCharts);

app.provide("auth", AuthService);
app.provide("api", ApiService);

app.config.productionTip = false;

app.mount("#app");
