<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-text
            ><v-data-table
              :items="this.items"
              :headers="headers"
              :loading="loading"
            >
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
                        :disabled="!$auth.hasPermission('POLL_CREATE')"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </template>
                    Add a new Poll
                  </v-tooltip>
                </v-toolbar>
              </template>
              <template v-slot:[`item.name`]="{ item }">
                <router-link
                  v-if="$auth.hasPermission('POLL_UPDATE')"
                  :to="{ name: 'pollEdit', params: { id: item.id } }"
                  >{{ item.name }}</router-link
                >
                <span v-else>{{ item.name }}</span>
              </template>
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="item.effective ? 'green' : 'red'">{{
                  item.effective ? "Active" : "Inactive"
                }}</v-chip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                  <template
                    v-slot:activator="{ on, attrs }"
                    v-if="$auth.hasPermission('POLL_UPDATE')"
                  >
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
                <v-tooltip top v-if="$auth.hasPermission('RESULTS_READ')">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      @click="
                        $router.push({
                          name: 'pollResults',
                          params: { id: item.id },
                        })
                      "
                      class="ml-1 mr-1"
                      v-bind="attrs"
                      v-on="on"
                      >mdi-eye</v-icon
                    >
                  </template>
                  View Results
                </v-tooltip>
                <v-tooltip top>
                  <template
                    v-slot:activator="{ on, attrs }"
                    v-if="$auth.hasPermission('POLL_DELETE')"
                  >
                    <v-icon
                      class="ml-1 mr-1"
                      @click="showDeleteDialog(item)"
                      v-bind="attrs"
                      v-on="on"
                      >mdi-delete</v-icon
                    >
                  </template>
                  Delete
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showDeleteDialogFlag" max-width="500">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="secondary"
            @click="
              deleteSelectedItem().then(() => {
                showDeleteDialogFlag = false;
                loadData();
              })
            "
            >Accept</v-btn
          ><v-btn class="secondary" @click="showDeleteDialogFlag = false"
            >Cancel</v-btn
          ></v-card-actions
        >
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";

export default {
  data: () => ({
    items: [],
    showDeleteDialogFlag: false,
    itemSelectedForDeletion: null,
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
    loading: false,
  }),
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      return this.$api
        .get("/polls")
        .then(({ data }) => {
          this.items = data.content;
          this.items.forEach((elem) => {
            if (elem.effectiveDate) {
              elem.effectiveDate = moment(elem.effectiveDate).format(
                "MM-DD-YYYY HH:mm:ss"
              );
            } else {
              elem.effectiveDate = "";
            }
            if (elem.expirationDate) {
              elem.expirationDate = moment(elem.expirationDate).format(
                "MM-DD-YYYY HH:mm:ss"
              );
            } else {
              elem.expirationDate = "";
            }
          });
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showDeleteDialog(item) {
      this.showDeleteDialogFlag = true;
      this.itemSelectedForDeletion = item;
    },
    deleteSelectedItem() {
      return this.$api
        .delete("/polls/" + this.itemSelectedForDeletion.id)
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
