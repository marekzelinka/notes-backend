function logInfo(...params) {
  console.log(...params);
}

function logError(...params) {
  console.error(...params);
}

module.exports = {
  logInfo,
  logError,
};
