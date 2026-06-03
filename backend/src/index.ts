import { app } from "./app";
import { env } from "./config/env";

if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
  app.listen(env.PORT || 4000, () => {
    console.log(`🚀 Food API running on http://localhost:${env.PORT || 4000}`);
  });
}

export default app;
