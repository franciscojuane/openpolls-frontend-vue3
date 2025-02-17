<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-title>
            <v-toolbar flat color="white">
              <v-toolbar-title>Add new Poll</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn class="secondary"
                ><v-icon @click="save" :disabled="!valid"
                  >mdi-content-save</v-icon
                ></v-btn
              >
            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <PollEditScreen
              @valid="valid = $event"
              v-model="item"
            ></PollEditScreen>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PollEditScreen from "@/components/screens/PollEditScreen";
export default {
  name: "PollEdit",
  components: {
    PollEditScreen,
  },

  data: () => ({
    item: null,
    valid: false,
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
  methods: {
    save() {
      this.$api.post("/polls", this.item);
    },
  },
};
</script>
