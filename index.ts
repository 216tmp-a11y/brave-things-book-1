import { Hono } from "hono";
import { createExampleRoute } from "./example";
import { createBookAccessRoute } from "./book-access";
import { createAuthRoute } from "./auth";
import { createAuthProductionRoute } from "./auth-production";
import { createAdminRoute } from "./admin";

export function setupRoutes(app: Hono) {
  // FIXED: Always use development auth route for consistent hash format
  // This ensures Marie and all users are created/verified with the same 64-character SHA-256 hash
  const authRoute = createAuthRoute();

  const routes = new Hono()
    .route("/example", createExampleRoute())
    .route("/book-access", createBookAccessRoute())
    .route("/auth", authRoute)
    .route("/admin", createAdminRoute());

  const entry = app.route("/api", routes);

  return entry;
}

export type AppType = ReturnType<typeof setupRoutes>;