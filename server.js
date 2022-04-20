const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const fs = require("fs");
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);

//app.get("/api/customers", (req, res) => {
//  res.json({ message: "Welcome to /api/customers" });
//});

const config = {
  server: conf.host,
  port: conf.port,
  database: conf.database,
  user: conf.user,
  password: conf.password,
  encrypt: false,
};

console.log(config);

const sql = require("mssql");

sql.connect(config, function (err) {
  if (err) {
    return console.error("error : ", err);
  }
  console.log("MSSQL 연결 완료");
});

app.get("/api/customers", (req, res) => {
  var request = new sql.Request();
  q = "SELECT * FROM CUSTOMER;";
  request.query(q, (err, rows, fields) => {
    res.send(rows.recordset);
  });
});
