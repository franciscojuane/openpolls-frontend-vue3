let state = () => {
  return {
    currentUser: null,
  };
};

let getters = {
  currentUser(state) {
    return state.currentUser;
  },
};
let mutations = {
  setCurrentUser(state, payload) {
    state.currentUser = payload.user;
  },
  removeCurrentUser(state) {
    state.currentUser = null;
  },
};

let actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
