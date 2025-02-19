<template>
  <v-container>
    <v-tabs v-model="resultsTabs">
      <v-tab>Graphics</v-tab>
      <v-tab>Individual</v-tab>

      <v-tab-item>Graphs</v-tab-item>
      <v-tab-item>
        <v-data-table> </v-data-table>
      </v-tab-item> </v-tabs
  ></v-container>
</template>
<script>
export default {
  data: () => ({
    headers: [],
  }),
};
</script>
