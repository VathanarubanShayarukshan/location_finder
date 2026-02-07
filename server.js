// server.js
// Vercel serverless – memory only storage
let logs = [];

// helper: read request body manually
async function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

export default async function handler(req, res) {
  const path = req.url.split("?")[0];
  const method = req.method;

  // ===============================
  // POST /log-location
  // ===============================
  if (method === "POST" && path === "/log-location") {
    const body = await readBody(req);

    logs.push({
      time: new Date().toLocaleString(),
      ip:
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        "unknown",
      latitude: body.lat || null,
      longitude: body.lon || null
    });

    return res.status(200).json({
      status: "logged",
      count: logs.length
    });
  }

  // ===============================
  // GET /get-logs
  // ===============================
  if (method === "GET" && path === "/get-logs") {
    return res.status(200).json(logs);
  }

  // ===============================
  // DEFAULT
  // ===============================
  res.status(404).json({ error: "Invalid route" });
}
