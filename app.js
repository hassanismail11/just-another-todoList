const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function getDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
}

mongoose.connect("mongodb://127.0.0.1:27017/" + "todolist");
const itemSchema = new mongoose.Schema({
  listName: String,
  name: String,
  date: String,
});

const Item = mongoose.model("Item", itemSchema);
function newItem(listName, item, date, checked, importance) {
  const newitem = new Item({
    listName: listName,
    name: item,
    date: date,
  });

  newitem.save();
  console.log("New Item Added");
}

app.get("/", function (req, res) {
  Item.find({ listName: "general" }).then((listItems) =>
    res.render("list", { listTitle: "General List", newListItems: listItems })
  );
});

app.post("/", function (req, res) {
  newItem("general", req.body.newItem, getDate());
  res.redirect("/");
});

app.get("/work", function (req, res) {
  Item.find({ listName: "work" }).then((listItems) =>
    res.render("list", { listTitle: "Work List", newListItems: listItems })
  );
});

app.post("/work", function (req, res) {
  newItem("work", req.body.newItem, getDate());
  res.redirect("/work");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
