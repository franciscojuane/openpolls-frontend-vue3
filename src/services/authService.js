import ApiService from "@/plugins/axios.js";
import store from "@/store";

const AuthService = {
  login(username, password) {
    return ApiService.post("/auth/login", {
      username: username,
      password: password,
    }).then(({ data }) => {
      window.localStorage.setItem("token", data.token);
      return ApiService.get("/users/getCurrentUser").then(({ data }) => {
        store.commit("setCurrentUser", { user: data });
      });
    });
  },
  logout() {
    window.localStorage.removeItem("token");
    store.commit("removeCurrentUser");
  },
  hasRole(role) {
    let user = store.getters.currentUser;
    return user.roles.find((elem) => elem.name == role) != null;
  },
  getUser() {
    let user = store.getters.currentUser;
    return user;
  },
  hasPermission(permission) {
    let user = store.getters.currentUser;
    for (let role of user.roles) {
      for (let rolePermission of role.permissions) {
        if (rolePermission.name == permission) {
          return true;
        }
      }
    }
    return false;
  },
};

export default AuthService;
