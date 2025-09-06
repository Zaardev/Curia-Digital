require("dotenv").config();

module.exports = function(eleventyConfig) {
  return {
    dir: { input: "src", output: "_site" }
  };
};
