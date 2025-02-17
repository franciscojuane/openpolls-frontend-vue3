<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-text
            ><v-data-table :items="this.items" :headers="headers">
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Polls</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="secondary"
                        @click="$router.push({ name: 'pollAdd' })"
                        v-bind="attrs"
                        v-on="on"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </template>
                    Add a new Poll
                  </v-tooltip>
                </v-toolbar>
              </template>
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="item.effective ? 'green' : 'red'">{{
                  item.effective ? "Active" : "Inactive"
                }}</v-chip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      @click="
                        $router.push({
                          name: 'pollEdit',
                          params: { id: item.id },
                        })
                      "
                      v-bind="attrs"
                      v-on="on"
                      >mdi-pencil</v-icon
                    >
                  </template>
                  Edit
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="ml-2 mr-2"
                      @click="item"
                      v-bind="attrs"
                      v-on="on"
                      >mdi-eye</v-icon
                    >
                  </template>
                  View Results
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    items: [],
    headers: [
      { value: "name", text: "Poll Name", sortable: false },
      { value: "description", text: "Poll Description", sortable: false },
      { value: "amountOfQuestions", text: "Num. of Questions" },
      { value: "effectiveDate", text: "Effective Date" },
      { value: "expirationDate", text: "Expiration Date" },
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
