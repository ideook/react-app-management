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

const fs = require("fs");
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);

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
const multer = require("multer");
const upload = multer({ dest: "./upload" });

sql.connect(config, function (err) {
  if (err) {
    return console.error("error : ", err);
  }
  console.log("MSSQL 연결 완료");
});

app.get("/api/customers", (req, res) => {
  var request = new sql.Request();
  q = "SELECT * FROM CUSTOMER WHERE isDeleted = 0";
  request.query(q, (err, rows, fields) => {
    res.send(rows.recordset);
  });
});

app.use("/image", express.static("./upload"));

app.post("/api/customers", upload.single("image"), (req, res) => {
  console.log(req.file);
  let image = "/image/" + req.file.filename;
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;
  //let params = [image, name, birthday, gender, job];

  // sql.input('image', sql.VarChar, image);
  // sql.input('name', sql.VarChar, name);
  // sql.input('birthday', sql.VarChar, birthday);
  // sql.input('gender', sql.VarChar, gender);
  // sql.input('job', sql.VarChar, job);

  var request = new sql.Request();
  q = `INSERT INTO CUSTOMER VALUES ('${image}', '${name}', '${birthday}', '${gender}', '${job}', GETDATE(), 0)`;
  request.query(q, (err, rows, fields) => {
    res.send(rows.recordset);
  });
});

app.post("/api/customers/:id", upload.single("image"), (req, res) => {
  let image = "/image/" + req.file.filename;
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;

  var request = new sql.Request();
  q = `UPDATE CUSTOMER SET [image] = '${image}', NAME = '${name}', birthday = '${birthday}', gender = '${gender}', job = '${job}' WHERE id = ${req.params.id}`;
  request.query(q, (err, rows, fields) => {
    res.send(rows.recordset);
  });
});

app.delete("/api/customers/delete/:id", (req, res) => {
  var request = new sql.Request();
  //console.log(req.params.id);
  q = `UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ${req.params.id}`;
  //console.log(q);
  request.query(q, (err, rows, fields) => {
    res.send(rows.recordset);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
