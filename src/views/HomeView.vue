<template>
  <div class="home">
    <v-container>
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
                  <v-btn class="primary">Login</v-btn>
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
  name: "HomeView",
  components: {},
};
</script>
