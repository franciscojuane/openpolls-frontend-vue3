<template>
  <div>
    <v-text-field
      @click="showDialog = true"
      prepend-icon="mdi-calendar"
      readonly
      :value="formattedDateTime"
      clearable
      @click:clear="clearSelection"
    ></v-text-field>

    <v-dialog v-model="showDialog" width="unset">
      <v-card>
        <v-card-text>
          <v-tabs centered v-model="tabs">
            <v-tab>
              <v-icon>mdi-calendar</v-icon>
            </v-tab>
            <v-tab>
              <v-icon>mdi-clock</v-icon>
            </v-tab>
          </v-tabs>
          <v-tabs-window v-model="tabs">
            <v-tabs-window-item class="pt-4">
              <v-date-picker
                v-model="dateTime"
                @input="
                  updateDateTime();
                  slideIfAppropiate();
                "
                landscape
              ></v-date-picker>
            </v-tabs-window-item>

            <v-tabs-window-item class="pt-4">
              <v-time-picker
                v-model="dateTime"
                format="24hr"
                @input="updateDateTime"
                scrollable
                landscape
              ></v-time-picker>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveSelection">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import moment from "moment";
import { defineProps, ref, shallowRef, computed, watch } from "vue";

const props = defineProps({
  value: String,
  slideOnDateSelection: {
    type: Boolean,
    default: true,
  },
});

let showDialog = ref(false);
let date = shallowRef(new Date());
let time = shallowRef(new Date());
let dateTime = shallowRef(new Date());
let tabs = ref(0);

let formattedDateTime = computed(() => {
  if (!date.value || !time.value) return "";
  return moment(`${date.value} ${time}`).format("MM/DD/YYYY HH:mm");
});

function clearSelection() {
  date.value = null;
  time.value = null;
  this.$emit("input", null);
}

function updateDateTime() {
  if (date.value && time.value) {
    this.$emit("input", moment(`${date} ${time}`).toISOString());
  }
}

function saveSelection() {
  this.showDialog.value = false;
  this.updateDateTime();
}

function slideIfAppropiate() {
  if (props.slideOnDateSelection) {
    setTimeout(() => {
      tabs = 1;
    }, 200);
  }
}

watch(
  props.value,
  (newValue) => {
    if (newValue) {
      const m = moment(newValue);
      date.value = m.format("YYYY-MM-DD");
      time.value = m.format("HH:mm");
    }
  },
  { immediate: true }
);
</script>
