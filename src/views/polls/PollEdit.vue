<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="elevation-12">
          <v-card-title>
            <v-toolbar flat color="white">
              <v-toolbar-title
                ><v-toolbar
                  flat
                  color="white"
                  title="Edit Poll"
                  density="compact"
                  class="text-start"
                ></v-toolbar
              ></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    :loading="loading"
                    v-bind="props"
                    class="secondary mr-2"
                    @click="save"
                    :disabled="!valid || !auth.hasPermission('POLL_UPDATE')"
                    ><v-icon>mdi-content-save</v-icon></v-btn
                  >
                </template>
                Save
              </v-tooltip>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    @click="copyPollKeyToClipboard()"
                    :class="copyToClipboardClass"
                    v-bind="props"
                    ><v-icon :disabled="!valid">{{
                      copyToClipboardIcon
                    }}</v-icon></v-btn
                  >
                </template>
                Copy Poll URL to Clipboard
              </v-tooltip>
            </v-toolbar>
          </v-card-title>

          <v-card-text>
            <v-alert :type="alertType" v-if="showAlert">{{
              alertMessage
            }}</v-alert>
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
import { ref, onMounted, inject, defineOptions, reactive } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";

defineOptions({
  name: "PollEdit",
});

const auth = inject("auth");
const route = useRoute();
const store = useStore();

const item = reactive({});
const valid = ref(false);
const showAlert = ref(false);
const alertType = ref("warning");
const alertMessage = ref("");
const copyToClipboardClass = ref("secondary");
const copyToClipboardIcon = ref("mdi-share");
const loading = ref(false);

onMounted(() => {
  load();
  if (route.params.new) {
    alertType.value = "green";
    showAlert.value = true;
    alertMessage.value = "Poll created successfully";
    setTimeout(() => {
      showAlert.value = false;
    }, 5000);
  }
});

function load() {
  loading.value = true;
  store.dispatch("loadPoll", { pollId: route.params.id }).then(() => {
    loading.value = false;
  });
}
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
      loading.value = false;
      showAlert.value = true;
      alertType.value = "warning";
      alertMessage.value = error.message;
      console.log(error);
      setTimeout(() => {
        showAlert.value = false;
      }, 5000);
    });
}
function copyPollKeyToClipboard() {
  navigator.clipboard
    .writeText(
      process.env.VUE_APP_SITE_URL + "/pollAnswer/" + store.getters.poll.pollKey
    )
    .then(() => {
      copyToClipboardClass.value = "green";
      copyToClipboardIcon.value = "mdi-check";
      setTimeout(() => {
        copyToClipboardClass.value = "secondary";
        copyToClipboardIcon.value = "mdi-share";
      }, 1500);
    })
    .catch(function (err) {
      console.error("Error al copiar el texto: ", err);
    });
}

onBeforeRouteLeave((to, from, next) => {
  store.commit("clearPoll");
  next();
});
</script>
