const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { SECRET } = require("../utils/config");

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }
  const userForToken = { username, id: user._id };
  const token = jwt.sign(userForToken, SECRET);
  res.json({ token, username, name: user.name });
});

module.exports = loginRouter;
