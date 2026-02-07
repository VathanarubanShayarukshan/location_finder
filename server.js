// server.js
// Save data ONLY inside this file (memory storage)

// ----------------------------
// Memory storage
// ----------------------------
let logs = [];

// ----------------------------
// Main handler
// ----------------------------
export default function handler(req, res) {

  const path = req.url.split("?")[0];
  const method = req.method;

  // ==========================
  // SAVE LOCATION
  // ==========================
  if (method === "POST" && path === "/log-location") {

    const body = req.body || {};

    const newLog = {
      time: new Date().toLocaleString(),
      ip:
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        "unknown",
      latitude: body.lat,
      longitude: body.lon
    };

    logs.push(newLog);

    return res.status(200).json({
      message: "Location saved",
      totalLogs: logs.length
    });
  }

  // ==========================
  // GET ALL SAVED DATA
  // ==========================
  if (method === "GET" && path === "/get-logs") {
    return res.status(200).json(logs);
  }

  // ==========================
  // CLEAR DATA (optional)
  // ==========================
  if (method === "DELETE" && path === "/clear-logs") {
    logs = [];
    return res.status(200).json({ message: "Logs cleared" });
  }

  // ==========================
  // DEFAULT ERROR
  // ==========================
  return res.status(404).json({
    error: "Route not found"
  });
}
