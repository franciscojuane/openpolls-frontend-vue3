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

            <v-tab-item class="pt-4">
              <v-date-picker
                v-model="date"
                @input="
                  updateDateTime();
                  slideIfAppropiate();
                "
                landscape
              ></v-date-picker>
            </v-tab-item>

            <v-tab-item class="pt-4">
              <v-time-picker
                v-model="time"
                format="24hr"
                @input="updateDateTime"
                scrollable
                landscape
              ></v-time-picker>
            </v-tab-item>
          </v-tabs>
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

<script>
import moment from "moment";

export default {
  props: {
    value: String,
    slideOnDateSelection: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    showDialog: false,
    date: "",
    time: "",
    tabs: 0,
  }),

  computed: {
    formattedDateTime() {
      if (!this.date || !this.time) return "";
      return moment(`${this.date} ${this.time}`).format("MM/DD/YYYY HH:mm");
    },
  },

  methods: {
    clearSelection() {
      this.date = "";
      this.time = "";
      this.$emit("input", null);
    },

    updateDateTime() {
      if (this.date && this.time) {
        this.$emit("input", moment(`${this.date} ${this.time}`).toISOString());
      }
    },

    saveSelection() {
      this.showDialog = false;
      this.updateDateTime();
    },

    slideIfAppropiate() {
      if (this.slideOnDateSelection) {
        setTimeout(() => {
          this.tabs = 1;
        }, 600);
      }
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const m = moment(newVal);
          this.date = m.format("YYYY-MM-DD");
          this.time = m.format("HH:mm");
        }
      },
    },
  },
};
</script>
