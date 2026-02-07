// api/server.js
let logs = [];

// Read raw JSON body
async function readBody(req) {
  return new Promise(resolve => {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end", () => {
      try { resolve(JSON.parse(data || "{}")); } catch { resolve({}); }
    });
  });
}

export default async function handler(req, res) {
  const method = req.method;

  // --------------------------
  // POST /api/server
  // --------------------------
  if (method === "POST") {
    const body = await readBody(req);
    logs.push({
      time: new Date().toLocaleString(),
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown",
      latitude: body.lat || null,
      longitude: body.lon || null
    });
    return res.status(200).json({ status: "logged", count: logs.length });
  }

  // --------------------------
  // GET /api/server
  // --------------------------
  if (method === "GET") {
    return res.status(200).json(logs);
  }

  // --------------------------
  // Default
  // --------------------------
  return res.status(404).json({ error: "Invalid request" });
}
