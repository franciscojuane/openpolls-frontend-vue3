import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store({
  state: {
    currentUser: null,
  },
  getters: {},
  mutations: {
    setCurrentUser(state, payload) {
      state.currentUser = payload.user;
    },
    removeCurrentUser(state) {
      state.currentUser = null;
    },
  },
  actions: {},
  modules: {},
  plugins: [vuexLocal.plugin],
});
