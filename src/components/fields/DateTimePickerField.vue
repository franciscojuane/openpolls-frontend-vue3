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
                v-model="date"
                @input="
                  updateDateTime();
                  slideIfAppropiate();
                "
                landscape
              ></v-date-picker>
            </v-tabs-window-item>

            <v-tabs-window-item class="pt-4">
              <v-time-picker
                v-model="time"
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
import {
  defineProps,
  defineEmits,
  ref,
  shallowRef,
  computed,
  watch,
} from "vue";

let emit = defineEmits(["input"]);

const props = defineProps({
  value: String,
  slideOnDateSelection: {
    type: Boolean,
    default: true,
  },
});

let showDialog = ref(false);
let date = shallowRef(new Date());
let time = shallowRef(moment().format("HH:mm"));
let tabs = ref(0);

let formattedDateTime = computed(() => {
  if (!date.value || !time.value) return "";
  return moment(`${date.value}`).format("MM/DD/YYYY") + " " + time.value;
});

function clearSelection() {
  date.value = null;
  time.value = null;
  emit("input", null);
}

function updateDateTime() {
  if (date.value && time.value) {
    let dateTime = new Date(date.value);
    let [hours, minutes] = time.value.split(":").map((elem) => Number(elem));
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);

    emit("input", dateTime);
  }
}

function saveSelection() {
  showDialog.value = false;
  updateDateTime();
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
    console.log("newValue " + newValue);
    if (newValue) {
      const m = moment(newValue);
      date.value = m.toDate();
      time.value = m.format("HH:mm");
    }
  },
  { immediate: true }
);
</script>
