<template>
  <v-card v-if="question">
    <v-card-title>{{ question.text }}</v-card-title>
    <v-card-subtitle>{{ question.subtext }}</v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-col cols="9">
            <v-form v-model="valid">
              <v-textarea
                :maxLength="question.maxLength"
                outlined
                :rules="[
                  (v) =>
                    (v &&
                      v.length >= question.minLength &&
                      v.length <= question.maxLength) ||
                    'The length should be between ' +
                      question.minLength +
                      ' and ' +
                      question.maxLength,
                ]"
                :hint="
                  'The length should be between ' +
                  question.minLength +
                  ' and ' +
                  question.maxLength
                "
                @change="emitValue($event)"
              >
              </v-textarea>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    textValue: null,
    valid: false,
  }),
  props: {
    question: Object,
  },
  watch: {
    question: {
      handler() {
        this.textValue = null;
      },
    },
    valid: {
      handler(v) {
        this.$emit("valid", v);
      },
    },
  },
  methods: {
    emitValue(value) {
      this.$emit("answer", {
        answer: value,
        questionId: this.question.id,
      });
    },
  },
};
</script>
