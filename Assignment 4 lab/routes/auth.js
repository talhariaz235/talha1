const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Model/user");
router.get("/logout", async (req, res) => {
  req.session.user = null;
  console.log("session clear");
  return res.redirect("/login.ejs");
});
router.get("/login", (req, res) => {
  res.render("/api/auth/login");
});
router.post("/login", async (req, res) => {

    console.log("REquest find",req.body)
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.session.flash = { type: "danger", message: "User Not Present" };
    req.flash("danger", "User with this email not present");
    return res.redirect("/login.ejs");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    req.flash("success", "Logged in Successfully");
    return res.redirect("/");
  } else {
    req.flash("danger", "Invalid Password");
    return res.redirect("/login.ejs");
  }
});
router.get("/register", (req, res) => {
  res.render("auth/register");
});
router.post("/register", async (req, res) => {
//   await User.deleteMany({});
console.log("REquest find",req.body)
  let user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  res.redirect("/login.ejs");
});
module.exports = router;
