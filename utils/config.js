require("dotenv").config();
const { Env } = require("@humanwhocodes/env");

const env = new Env();
const { PORT, MONGODB_URI } = env.required;

module.exports = { PORT, MONGODB_URI };
