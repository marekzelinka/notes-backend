require("dotenv").config();
const { Env } = require("@humanwhocodes/env");

const env = new Env();
let { PORT, MONGODB_URI, NODE_ENV } = env.required;
if (NODE_ENV === "test") {
  let { TEST_MONGODB_URI } = env.required;
  MONGODB_URI = TEST_MONGODB_URI;
}

module.exports = { PORT, MONGODB_URI, NODE_ENV };
