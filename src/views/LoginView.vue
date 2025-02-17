<template>
  <div class="home">
    <v-container>
      <v-row v-if="error">
        <v-col cols="4"></v-col>
        <v-col cols="4">
          <v-alert type="error" closable>Access Denied</v-alert></v-col
        >
        <v-col cols="4"></v-col>
      </v-row>

      <v-row>
        <v-col cols="4"></v-col>
        <v-col cols="4"
          ><v-card class="elevation-12"
            ><v-card-title>Login</v-card-title>
            <v-card-text>
              <v-row justify="center">
                <v-col cols="10">
                  <v-text-field
                    label="Username"
                    required
                    v-model="username"
                    prepend-icon="mdi-account"
                    >Username</v-text-field
                  >
                </v-col>
              </v-row>
              <v-row justify="center" class="mt-n2">
                <v-col cols="10">
                  <v-text-field
                    label="Password"
                    required
                    v-model="password"
                    prepend-icon="mdi-key"
                    type="password"
                    >Password</v-text-field
                  >
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-row justify="end">
                  <v-btn class="primary" :loading="loading" @click="login()"
                    >Login</v-btn
                  >
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card></v-col
        >
        <v-col cols="4"></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  components: {},
  data: () => ({
    loading: false,
    username: "admin@admin.com",
    password: "admin",
    error: null,
  }),
  methods: {
    login() {
      this.loading = true;
      this.error = null;
      this.$api
        .post("/auth/login", {
          username: this.username,
          password: this.password,
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
        })
        .then(({ data }) => {
          window.localStorage.setItem("token", data.token);
          this.$router.push("pollList");
        });
    },
  },
  mounted() {
    window.localStorage.removeItem("token");
  },
};
</script>
