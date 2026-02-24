import express from "express";
import { createServer as createViteServer } from "vite";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_X4QQ16hZWc+4UxA9VoKHSDQnVWQ=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_GP/x9PU165IF2BXrFch+IrfbNsw=",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/10minuteservicealpha"
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ImageKit Authentication Endpoint
  app.get("/api/auth", (req, res) => {
    try {
      console.log("Auth endpoint hit");
      const result = imagekit.getAuthenticationParameters();
      console.log("Auth params generated:", result);
      res.send(result);
    } catch (error) {
      console.error("Auth generation error:", error);
      res.status(500).json({ error: "Failed to generate auth params" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
