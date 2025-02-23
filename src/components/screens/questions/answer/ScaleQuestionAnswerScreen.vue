<template>
  <v-card v-if="question">
    <v-card-title>{{ question.text }}</v-card-title>
    <v-card-subtitle>{{ question.subtext }}</v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-col cols="9">
            <v-slider
              v-model="numericValue"
              :step="question.scale"
              :min="question.minValue"
              :max="question.maxValue"
              :tick-labels="ticksLabels"
              ticks="always"
              thumb-label="always"
              @change="emitValue($event)"
            ></v-slider>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    numericValue: null,
  }),
  props: {
    question: Object,
  },
  watch: {
    formattedAnswer: {
      deep: true,
      handler(v) {
        this.$emit("answer", v);
      },
    },
    question: {
      immediate: true,
      handler(v) {
        this.numericValue = v.minValue;
        this.emitValue(this.numericValue);
        this.$emit("valid", true);
      },
    },
  },
  computed: {
    ticksLabels() {
      let result = [];
      for (let i = this.question.minValue; i <= this.question.maxValue; i++) {
        result.push(i);
      }
      return result;
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
<style>
.v-slider__tick-label {
  font-size: 70%;
}
</style>
