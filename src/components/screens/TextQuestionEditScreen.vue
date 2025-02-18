<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-row cols="4">
            <v-text-field
              label="Text"
              v-model="internalQuestion.text"
            ></v-text-field>
          </v-row>
          <v-row
            ><v-text-field
              label="Subtext"
              v-model="internalQuestion.subText"
            ></v-text-field
          ></v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                type="number"
                label="Minimum length"
                v-model="internalQuestion.minLength"
                :max="internalQuestion.maxLength"
                min="1"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="number"
                max="10"
                :min="internalQuestion.minLength"
                label="Maximum length"
                v-model="internalQuestion.maxLength"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
export default {
  data: () => ({
    internalQuestion: {},
    newItem: "",
    items: [],
  }),
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.internalQuestion = v;
      },
    },
    internalQuestion: {
      deep: true,
      handler(v) {
        this.$emit("value", v);
        this.$emit("change");
      },
    },
  },
  methods: {
    addItem() {
      if (this.newItem.trim()) {
        this.internalQuestion.options.push(this.newItem.trim());
        this.newItem = "";
      }
    },
    removeItem(index) {
      this.internalQuestion.options.splice(index, 1);
    },
  },
};
</script>
