const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// 🔐 In-memory storage (RAM)
let locationLogs = [];

// receive location
app.post("/log-location", (req, res) => {
  const { lat, lon } = req.body;

  locationLogs.push({
    time: new Date().toLocaleString(),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    latitude: lat,
    longitude: lon
  });

  res.json({ status: "logged" });
});

// send logs to admin
app.get("/get-logs", (req, res) => {
  res.json(locationLogs);
});

// hosting compatible port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
