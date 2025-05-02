<template>
  <v-app>
    <v-container>
      <v-app-bar app color="secondary" dark>
        <v-toolbar dense color="secondary" class="elevation-12"
          ><v-toolbar-title
            @click="router.push({ name: 'pollList' })"
            style="cursor: pointer"
            class="text-start"
            >OpenPolls</v-toolbar-title
          >
          <v-spacer></v-spacer>
          {{ currentUser ? currentUser.firstName : "" }}
          {{ currentUser ? currentUser.lastName : "" }}
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn icon>
                <v-icon @click="() => logOut()" v-bind="props"
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

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { inject } from "vue";

const router = useRouter();
const auth = inject("auth");

function logOut() {
  auth.logout();
  router.push({ name: "loginView" });
}

let store = useStore();

let currentUser = store.getters.currentUser;
</script>
