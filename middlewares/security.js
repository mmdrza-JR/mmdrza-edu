import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cors from "cors";

export const securityLayers = (app) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "https://mmdrza.genesis.app",
  ];

  app.use(cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("🚫 Origin Not Allowed by CORS"));
    },
    credentials: true,
  }));

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(mongoSanitize());
  app.use(xss());
  app.disable("x-powered-by");
};
