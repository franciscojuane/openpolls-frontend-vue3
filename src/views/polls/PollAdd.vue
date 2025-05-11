<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-title>
            <v-toolbar
              flat
              color="white"
              title="Add new poll"
              density="compact"
              class="text-start"
            >
              <v-spacer></v-spacer>
              <v-btn @click="save" :disabled="!valid" class="secondary"
                ><v-icon>mdi-content-save</v-icon></v-btn
              >
            </v-toolbar>
          </v-card-title>
          <v-row justify="center" v-if="error">
            <v-col cols="11"
              ><v-alert type="warning">{{ error.message }}</v-alert></v-col
            >
          </v-row>
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

<script setup>
import PollEditScreen from "@/components/screens/PollEditScreen";
import { defineOptions, ref } from "vue";
import { useStore } from "vuex";

defineOptions({
  name: "PollAdd",
});

let item = null;
let valid = ref(false);
let error = null;

const showAlert = ref(false);
const alertType = ref("warning");
const alertMessage = ref("");
let loading = ref(false);
let store = useStore();

function save() {
  loading.value = true;
  store
    .dispatch("savePoll")
    .then(() => {
      loading.value = false;
      showAlert.value = true;
      alertType.value = "green";
      alertMessage.value = "Changes saved successfully.";
      setTimeout(() => {
        showAlert.value = false;
      }, 5000);
    })
    .catch((error) => {
      console.log(error);
      error = error?.response?.data;
      loading.value = false;
      showAlert.value = true;
      alertType.value = "warning";
      alertMessage.value = error?.message;
      console.log(error);
      setTimeout(() => {
        showAlert.value = false;
      }, 5000);
    });
}
</script>
