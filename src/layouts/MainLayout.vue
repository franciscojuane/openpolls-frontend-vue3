<template>
  <v-app>
    <v-container>
      <v-app-bar app color="secondary" dark>
        <v-toolbar dense color="secondary" class="elevation-12"
          ><v-toolbar-title
            @click="$router.push({ name: 'pollList' })"
            style="cursor: pointer"
            >OpenPolls</v-toolbar-title
          >
          <v-spacer></v-spacer>
          {{ currentUser ? currentUser.firstName : "" }}
          {{ currentUser ? currentUser.lastName : "" }}
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon>
                <v-icon @click="logOut" v-on="on" v-bind="attrs"
                  >mdi-account-arrow-right</v-icon
                >
              </v-btn>
            </template>
            Sign out
          </v-tooltip>
        </v-toolbar>
      </v-app-bar>

      <v-main>
        <router-view></router-view>
      </v-main>

      <v-footer app color="secondary" dark>
        <span class="white--text">Francisco Juane</span>
      </v-footer>
    </v-container>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MainLayout",
  methods: {
    logOut() {
      this.$auth.logout();
      this.$router.push({ name: "loginView" });
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>
