<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-text
            ><v-data-table-server
              :items="items"
              :itemsLength="totalItems"
              :headers="headers"
              :loading="loading"
              :items-per-page="itemsPerPage"
              @update:options="loadData"
              :page="currentPage + 1"
              :mobile="smAndDown"
              hide-sort
            >
              <template v-slot:top>
                <v-toolbar
                  flat
                  color="white"
                  title="Polls"
                  density="compact"
                  class="text-start"
                >
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        class="secondary"
                        @click="$router.push({ name: 'pollAdd' })"
                        v-bind="props"
                        :disabled="!auth.hasPermission('POLL_CREATE')"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </template>
                    Add a new Poll
                  </v-tooltip>
                </v-toolbar>
              </template>
              <template v-slot:[`item.name`]="{ item }">
                <router-link
                  v-if="auth.hasPermission('POLL_UPDATE')"
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
                <v-tooltip location="top">
                  <template
                    v-slot:activator="{ props }"
                    v-if="auth.hasPermission('POLL_UPDATE')"
                  >
                    <v-icon
                      @click="
                        $router.push({
                          name: 'pollEdit',
                          params: { id: item.id },
                        })
                      "
                      v-bind="props"
                      >mdi-pencil</v-icon
                    >
                  </template>
                  Edit
                </v-tooltip>
                <v-tooltip
                  location="top"
                  v-if="auth.hasPermission('RESULTS_READ')"
                >
                  <template v-slot:activator="{ props }">
                    <v-icon
                      @click="
                        $router.push({
                          name: 'pollResults',
                          params: { id: item.id },
                        })
                      "
                      class="ml-1 mr-1"
                      v-bind="props"
                      >mdi-eye</v-icon
                    >
                  </template>
                  View Results
                </v-tooltip>
                <v-tooltip location="top">
                  <template
                    v-slot:activator="{ props }"
                    v-if="auth.hasPermission('POLL_DELETE')"
                  >
                    <v-icon
                      class="ml-1 mr-1"
                      @click="showDeleteDialog(item)"
                      v-bind="props"
                      >mdi-delete</v-icon
                    >
                  </template>
                  Delete
                </v-tooltip>
              </template>
            </v-data-table-server>
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

<script setup>
import moment from "moment";
import { inject, reactive, ref, onMounted } from "vue";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();

let items = reactive([]);
let totalItems = ref(0);
let itemsPerPage = ref(10);
let currentPage = ref(0);
let showDeleteDialogFlag = ref(false);
let itemSelectedForDeletion = ref(null);
let headers = reactive([
  { value: "name", title: "Poll Name", sortable: false },
  { value: "description", title: "Poll Description", sortable: false },
  { value: "amountOfQuestions", title: "Num. of Questions" },
  { value: "effectiveDate", title: "Effective Date" },
  { value: "expirationDate", title: "Expiration Date" },
  {
    value: "status",
    title: "Status",
    sortable: false,
    align: "center",
  },

  { value: "actions", title: "Actions", align: "right", sortable: false },
]);
let loading = ref(false);
let api = inject("api");
let auth = inject("auth");

onMounted(() => {
  loadData();
});

function loadData() {
  loading.value = true;
  return api
    .get("/polls?page=" + currentPage.value + "&size=" + itemsPerPage.value)
    .then(({ data }) => {
      items = data.content;
      totalItems.value = data.page.totalElements;
      currentPage.value = data.page.number;
      items.forEach((elem) => {
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
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}
function showDeleteDialog(item) {
  showDeleteDialogFlag.value = true;
  itemSelectedForDeletion = item;
}
function deleteSelectedItem() {
  return api.delete("/polls/" + itemSelectedForDeletion.id).catch((error) => {
    console.log(error);
  });
}
</script>
