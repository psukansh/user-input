const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;
const bodyparser = require("body-parser");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "/views")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "geeksforgeeks",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
// app.set('views', path.join(__dirname, 'views'));

//database connection
const mysql = require("mysql");
const { request } = require("http");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user-input",
});

connection.connect(function (err) {
  if (!err) console.log("Database connected");
});

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/submit", function (req, res) {
  var details = req.body;

  var sql = "INSERT INTO tbl_users SET ?";

  connection.query(sql, details, function (err, result) {
    if (err) throw err;
    console.log("data inserted successfully");
  });

  res.render("submit");
});

app.get("/users", (req, res) => {
  var sql2 = "SELECT * FROM tbl_users where Id=(SELECT LAST_INSERT_ID())";

  connection.query(sql2, function (err, rows, result) {
    if (err) throw err;
    res.render("users", { items: rows });
  });
});

app.listen(PORT, () => {
  console.log(`The website running on port ${PORT}`);
});
