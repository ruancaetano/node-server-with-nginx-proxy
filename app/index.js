const express = require("express");
const mysql = require("mysql");
const { promisify } = require('util')
const { faker } = require("@faker-js/faker");

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const port = 3000;
const config = {
  host: "node_app_db",
  user: "root",
  password: "root",
  database: "nodedb",
};

const connection = mysql.createConnection(config);

const promisifyedQuery = promisify(connection.query).bind(connection)

const insertPerson = async (name) => {
  const sqlQuery = `INSERT INTO people(name) values('${name}')`;
  await promisifyedQuery(sqlQuery)
};

const listPeople = async () => {
  const sqlQuery = "select * from people";
  const sqlQueryResult = await promisifyedQuery(sqlQuery)
  return sqlQueryResult
};


app.get("/", async (_, res) => {
  const generatedName = faker.name.fullName();
  await insertPerson(generatedName);
  const peopleList = await listPeople();

  return res.render('home', { lastInsertedName: generatedName, peopleList });
});

app.listen(port, async () => {
  console.log("Listeng port " + port);
  await connection.connect()
});

process.on("exit", async () => {
  await connection.end();
});

