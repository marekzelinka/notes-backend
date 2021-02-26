const { NODE_ENV } = require("./config");

function logInfo(...params) {
  if (NODE_ENV === "test") {
    return;
  }
  console.log(...params);
}

function logError(...params) {
  console.error(...params);
}

module.exports = {
  logInfo,
  logError,
};
