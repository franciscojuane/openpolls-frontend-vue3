<template>
  <v-app>
    <v-container>
      <v-app-bar app color="secondary" dark>
        <v-toolbar-title>OpenPolls</v-toolbar-title>
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
export default {
  name: "MainLayout",
};
</script>
