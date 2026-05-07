import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { setupVite } from "./vite";
import webhookRouter from "../webhooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.set('trust proxy', 1);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Forçar HTTPS em produção
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect(`https://${req.get("host")}${req.url}`);
      }
      next();
    });
  }

  // 1º — PRIMEIRO: arquivos estáticos (apenas em produção)
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, 'public');
    app.use(express.static(distPath));
  }

  // 2º — DEPOIS: rotas de API e Auth
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use("/api/webhooks/tiktok", webhookRouter);
  
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // 3º — POR ÚLTIMO: fallback SPA ou Vite Dev Server
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api') && !req.path.startsWith('/assets')) {
        const distPath = path.join(__dirname, 'public');
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
