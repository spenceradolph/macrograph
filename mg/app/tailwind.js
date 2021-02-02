const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
        teal: colors.teal,
      },
    },
  },
  variants: {
    fill: ["hover"],
  },
};
