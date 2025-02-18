<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="6">
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
                label="Minimum amount of selections"
                v-model="internalQuestion.minAmountOfSelections"
                :max="internalQuestion.maxAmountOfSelections"
                min="1"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="number"
                max="10"
                :min="internalQuestion.minAmountOfSelections"
                label="Maximum amount of selections"
                v-model="internalQuestion.maxAmountOfSelections"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6"
          ><v-row>
            <v-col cols="1"></v-col>
            <v-col cols="11"
              ><v-text-field
                v-model="newItem"
                label="Add Element"
                append-outer-icon="mdi-plus"
                @click:append-outer="addItem"
                @keydown.enter="addItem"
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="11">
              <v-chip
                v-for="(item, index) in internalQuestion.options"
                :key="index"
                class="ma-2"
                close
                @click:close="removeItem(index)"
              >
                {{ item }}
              </v-chip>

              <v-alert
                v-if="internalQuestion.options.length === 0"
                type="info"
                class="mt-4"
              >
                No elements in the list
              </v-alert>
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
