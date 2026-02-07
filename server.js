// server.js
// Vercel serverless compatible – NO Express, NO file system

// Temporary in-memory storage (RAM)
let logs = global.logs || [];
global.logs = logs;

export default function handler(req, res) {
  // clean URL (remove query string)
  const path = req.url.split("?")[0];
  const method = req.method;

  // ===============================
  // POST /log-location
  // ===============================
  if (method === "POST" && path === "/log-location") {
    const body = req.body || {};

    logs.push({
      time: new Date().toLocaleString(),
      ip:
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        "unknown",
      latitude: body.lat,
      longitude: body.lon
    });

    return res.status(200).json({ status: "logged" });
  }

  // ===============================
  // GET /get-logs
  // ===============================
  if (method === "GET" && path === "/get-logs") {
    return res.status(200).json(logs);
  }

  // ===============================
  // INVALID REQUEST
  // ===============================
  return res.status(404).json({
    error: "Invalid request"
  });
}
