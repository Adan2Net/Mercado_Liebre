const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
var mysql = require("mysql");
require("dotenv").config(); //1.2k (gzipped: 704);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
//const methodOverride = require('method-override');

app.set("view engine", "ejs");
//app.use(methodOverride('_method'));

app.listen(process.env.PORT || 3030, () => {
  console.log("Servidor funcionando puerto 3030");
});

//creando conexion a base de datos
var con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mysql_mercado_liebre",
  port: 33060,
});
//todo: hacer conexiones de pull a la base de datos, traer
let list = [];

app.get("/", (req, res) => {
  res.render(__dirname + "/views/home.ejs");
});

app.get("/register", (req, res) => {
  res.render(__dirname + "/views/usuarios/register.ejs");
});

app.post("/register", (req, res) => {
  let { username, email, password } = req.body;
  let hashedPassword = "";
  bcryptjs.hash(password, 8, function (err, hash) {
    if (err) {
      console.log("Error");
      return;
    }
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
      var sql = `INSERT INTO users (name, email, password) VALUES ('${username}', '${email}', '${hash}')`;
      con.query(sql, function (err, result) {
        if (err) {
          res.statusCode = 504;
          console.log(err);
          res.send("error");
        } else {
          console.log("1 record inserted");
          res.statusCode = 201;
          res.send("esta registrado");
        }
      });
    });
  });
});

app.get("/login", (req, res) => {
  res.render(__dirname + "/views/usuarios/login.ejs");
});

app.get("/api", validateToken, (req, res) => {
  res.json({
    username: req.user,
    comentarios: [
      {
        id: 0,
        text: "Este es mi primer comentario",
        username: "Adan",
      },
      {
        id: 0,
        text: "SOy el tutor de Adan",
        username: "Nigi",
      },
    ],
  });
});

app.post("/auth",(req, res) => {
  const { username, password } = req.body;
  //consultar y verificar usuarios existente
  const user = { username: username, password: password };

  con.connect(function (err) {
    if (err) throw err;
    con.query(`SELECT password FROM users WHERE name = '${username}'`, function (err, result, fields) {
      if (err) throw err;
      console.log(err);
      console.log(result);
      let savedHash = result[0].password;
      console.log(savedHash);
      let comparationStatus = bcryptjs.compareSync(password.toString(), savedHash);
      console.log(comparationStatus);
    });
  });
  con.end; 

  if (JSON.stringify(list[0]) === JSON.stringify(user)) {
    const accessToken = generateAccesToken(user);

    res.header("authorization", accessToken).json({
      message: "El usuario esta autenticado",
      token: accessToken,
    });
  }

  res.send("El usuario no existe");
});

function validateToken(req, res, next) {
  const accessToken = req.get("authorization");
  if (!accessToken) res.send("Access denied");

  jwt.verify(accessToken, process.env.SECRET, (err, user) => {
    if (err) {
      res.send("Acces denied, token expired or incorrect");
    } else {
      req.user = user;
      next();
    }
  });
}

function generateAccesToken(user) {
  return jwt.sign(user, process.env.SECRET, { expiresIn: "5m" });
}

//todo: Ejecutar un insert a la base de datos desde nodejs con sentencia mysql,
// TODO: leer usuarios de base de datos y hacer el proceso de authentication con usuarios en la base de datos
//todo: encriptar contraseña antes de guardar y proceso de auth comparar con la contraseña de base de datos.
