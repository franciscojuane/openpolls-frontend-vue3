import { createVuetify } from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VTimePicker } from "vuetify/labs/VTimePicker";

export default new createVuetify({
  components: {
    ...components,
    VTimePicker,
  },
  directives,
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#7ac3d3",
        secondary: "#2c3e50",
        accent: "#4a4a4a",
        error: "#f08282",
        info: "#1b79A7",
        success: "#31b6ee",
        warning: "ffd200",
      },
      dark: {
        primary: "#31b6ee",
        secondary: "#ffffff",
        accent: "#31b6ee",
        error: "#f08282",
        info: "#1b79A7",
        success: "#7ac3d3",
        warning: "ffd200",
      },
    },
  },
});
