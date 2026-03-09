export default async function handler(req, res) {

  // allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { e } = req.query;

  if (!e) {
    return res.status(400).json({
      error: "Missing parameter e"
    });
  }

  try {

    // build target path
    const endpoint = decodeURIComponent(e);

    // forward to same host path
    const targetUrl = `https://luminafix.vercel.app/${endpoint}`;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json"
      },
      body: req.method === "POST"
        ? JSON.stringify(req.body)
        : undefined
    });

    const data = await response.text();

    res.status(response.status).send(data);

  } catch (error) {

    res.status(500).json({
      error: "Proxy request failed",
      message: error.message
    });

  }
}