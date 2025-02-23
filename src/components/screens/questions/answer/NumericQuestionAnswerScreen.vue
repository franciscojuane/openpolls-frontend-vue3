<template>
  <v-card v-if="question">
    <v-card-title>{{ question.text }}</v-card-title>
    <v-card-subtitle>{{ question.subtext }}</v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-col cols="3">
            <v-form v-model="valid">
              <v-text-field
                @change="
                  validateNumber($event);
                  emitValue();
                "
                @keypress="onlyNumbers($event)"
                v-model="numericValue"
                class="text-right"
                :rules="[
                  (v) =>
                    (v >= question.minValue && v <= question.maxValue) ||
                    'The value should be between ' +
                      question.minValue +
                      ' and ' +
                      question.maxValue,
                ]"
              ></v-text-field></v-form
          ></v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    numericValue: null,
    valid: false,
  }),
  props: {
    question: Object,
  },
  watch: {
    question: {
      handler() {
        this.numericValue = null;
      },
    },
    valid: {
      handler(v) {
        this.$emit("valid", v);
      },
    },
  },
  methods: {
    validateNumber(value) {
      this.numericValue = value.replace(/[^0-9]/g, "");
    },
    onlyNumbers() {
      if (event.key < "0" || event.key > "9") {
        event.preventDefault();
      }
    },
    emitValue() {
      this.$emit("answer", {
        answer: this.numericValue,
        questionId: this.question.id,
      });
    },
  },
};
</script>
<style scoped>
.text-right >>> input {
  text-align: right;
}
</style>
