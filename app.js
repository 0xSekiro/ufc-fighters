const fs = require("fs");
const data = JSON.parse(fs.readFileSync(`${__dirname}/fighters.json`, "utf-8"));
const express = require("express");
const app = express();

const fightersController = require("./controllers/fightersController");

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/doc.html`);
});

app.get("/fighters", (req, res) => {
  res.status(200).json({
    fighters: data,
  });
});
app.get("/fighters/champions", fightersController.getChampoins(data));
app.get("/fighters/:name", fightersController.getFighter(data));

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Page not found",
    test: `${fs.readdirSync(`${__dirname}`)}`,
  });
});

app.listen(3000, (req, res) => {
  console.log("Start listening on port 3000... ");
});
