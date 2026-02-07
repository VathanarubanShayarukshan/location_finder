const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const LOG_FILE = "logs.json";

// first time empty file
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, "[]");
}

// receive location from v.html
app.post("/log-location", (req, res) => {
  const data = req.body;

  const logs = JSON.parse(fs.readFileSync(LOG_FILE));
  logs.push({
    time: new Date().toISOString(),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    latitude: data.lat,
    longitude: data.lon
  });

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  res.json({ status: "logged" });
});

// send logs to admin.html
app.get("/get-logs", (req, res) => {
  const logs = JSON.parse(fs.readFileSync(LOG_FILE));
  res.json(logs);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
