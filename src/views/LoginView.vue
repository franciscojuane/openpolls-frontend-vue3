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
                  ></v-text-field>
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
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-row justify="end">
                  <v-btn
                    class="primary"
                    :loading="loading"
                    @click="
                      () => {
                        login();
                      }
                    "
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

<script setup>
import { inject, defineOptions, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "LoginView",
});

let loading = ref(false);
let username = ref("admin@admin.com");
let password = ref("admin");
let error = ref(null);
let router = useRouter();
let auth = inject("auth");

function login() {
  console.log("login");
  loading.value = true;
  error.value = null;
  auth
    .login(username.value, password.value)
    .then(() => {
      router.push("pollList");
    })
    .catch((error) => {
      loading.value = false;
      error.value = error;
    });
}
onMounted(() => {
  window.localStorage.removeItem("token");
});
</script>
