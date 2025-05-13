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
              <v-btn
                v-if="showSaveIcon"
                @click="save"
                :disabled="!valid"
                class="secondary"
                ><v-icon>mdi-content-save</v-icon></v-btn
              >
            </v-toolbar>
          </v-card-title>
          <v-row justify="center">
            <v-col cols="11">
              <v-alert :type="alertType" v-if="showAlert">{{
                alertMessage
              }}</v-alert></v-col
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
import { useRouter } from "vue-router";

defineOptions({
  name: "PollAdd",
});

let item = null;
let valid = ref(false);
let showSaveIcon = ref(true);

const showAlert = ref(false);
const alertType = ref("warning");
const alertMessage = ref("");
let loading = ref(false);
const store = useStore();
const router = useRouter();

function save() {
  loading.value = true;
  store
    .dispatch("savePoll")
    .then(() => {
      showSaveIcon.value = false;
      loading.value = false;
      showAlert.value = true;
      alertType.value = "green";
      alertMessage.value = "Changes saved successfully.";

      setTimeout(() => {
        showAlert.value = false;
        let newPoll = store.getters.poll;
        router.push({ name: "pollEdit", params: { id: newPoll.id } });
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
      showAlert.value = true;
      alertType.value = "warning";
      alertMessage.value = err?.message;
      setTimeout(() => {
        showAlert.value = false;
      }, 5000);
    });
}
</script>
