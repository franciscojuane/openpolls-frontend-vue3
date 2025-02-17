<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-title>Polls</v-card-title>
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PollEdit",
  data: () => ({
    items: [],
    headers: [
      { value: "name", text: "Poll Name", sortable: false },
      { value: "description", text: "Poll Description", sortable: false },
      {
        value: "status",
        text: "Status",
        sortable: false,
        align: "center",
      },
      { value: "actions", text: "Actions", align: "right", sortable: false },
    ],
  }),
  mounted() {
    this.$api.get("/polls").then(({ data }) => {
      this.items = data.content;
    });
  },
};
</script>
