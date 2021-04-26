const path = require("path");

const alias = {
  "@": path.join(__dirname, "src"),
  "@js": path.join(__dirname, "src", "js"),
  "@css": path.join(__dirname, "src", "css"),
};

module.exports = alias;
