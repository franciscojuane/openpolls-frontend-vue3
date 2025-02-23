<template>
  <v-card v-if="question">
    <v-card-title>{{ question.text }}</v-card-title>
    <v-card-subtitle>{{ question.subtext }}</v-card-subtitle>
    <v-card-text>
      <v-container v-if="onlyOneOptionToSelect">
        <v-row
          ><span :style="valid ? 'color:black' : 'color: red'">{{
            selectMessage
          }}</span></v-row
        >
        <v-radio-group v-model="selectedOption">
          <v-radio
            v-for="option of question.options"
            :key="option"
            :label="option"
            :value="option"
          ></v-radio>
        </v-radio-group>
      </v-container>

      <v-container v-else>
        <v-row
          ><span :style="valid ? 'color:black' : 'color: red'">{{
            selectMessage
          }}</span></v-row
        >
        <v-container>
          <v-row v-for="option of question.options" :key="option">
            <v-checkbox :key="option" :value="option" v-model="selectedOptions">
              <template v-slot:label> {{ option }}</template>
            </v-checkbox>
          </v-row>
        </v-container>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    selectedOption: null,
    selectedOptions: [],
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
    valid: {
      immediate: true,
      handler(v) {
        console.log("valid" + v);
        this.$emit("valid", v);
      },
    },
  },
  computed: {
    valid() {
      if (this.onlyOneOptionToSelect) {
        return this.selectedOption != null;
      } else {
        return (
          this.selectedOptions.length >= this.question.minAmountOfSelections &&
          this.selectedOptions.length <= this.question.maxAmountOfSelections
        );
      }
    },
    selectMessage() {
      if (
        this.question.minAmountOfSelections ==
        this.question.maxAmountOfSelections
      ) {
        if (this.question.minAmountOfSelections == 1) {
          return "Select 1 option";
        } else {
          return "Select" + this.question.minAmountOfSelections + " options.";
        }
      } else {
        return (
          "Select between " +
          this.question.minAmountOfSelections +
          " and " +
          this.question.maxAmountOfSelections
        );
      }
    },
    onlyOneOptionToSelect() {
      return (
        this.question.minAmountOfSelections ==
          this.question.maxAmountOfSelections &&
        this.question.minAmountOfSelections == 1
      );
    },
    formattedAnswer() {
      if (this.onlyOneOptionToSelect) {
        if (this.selectedOption) {
          let x = [
            {
              answer: this.selectedOption,
              questionId: this.question.id,
            },
          ];
          return x;
        } else {
          return [];
        }
      } else {
        let answers = [];
        for (let selectedOption of this.selectedOptions) {
          answers.push({
            answer: selectedOption,
            questionId: this.question.id,
          });
        }
        return answers;
      }
    },
  },
};
</script>
