import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import pollStore from "./pollStore.js";
import userStore from "./userStore.js";
import ApiService from "../plugins/axios.js";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ["user"],
});

export default new Vuex.Store({
  modules: {
    user: userStore,
    poll: pollStore({ ApiService }),
  },
  plugins: [vuexLocal.plugin],
});
