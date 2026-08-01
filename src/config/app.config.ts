import { config } from "dotenv";
import { getEnv } from "../common/utils/get-env.js";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const appConfig = () => {
  const NODE_ENV = getEnv("NODE_ENV", "development");
  const PORT = getEnv("PORT", "5000");
  const BASE_PATH = getEnv("BASE_PATH", "/api/v1");
  const DB_URI = getEnv("DB_URI");
  const SERVER_URL = getEnv("SERVER_URL", `http://localhost:${PORT}`);

  return {
    NODE_ENV,
    PORT,
    BASE_PATH,
    DB_URI,
    SERVER_URL,
    CLERK: {
      SECRET_KEY: getEnv("CLERK_SECRET_KEY"),
    },
    ARCJET: {
      KEY: getEnv("ARCJET_KEY"),
      ENV: getEnv("ARCJET_ENV", "development"),
    },
    QSTASH: {
      URL: getEnv("QSTASH_URL"),
      TOKEN: getEnv("QSTASH_TOKEN"),
    },
    EMAIL: {
      USER: getEnv("EMAIL_USER"),
      PASSWORD: getEnv("EMAIL_PASSWORD"),
    },
  };
};

export default appConfig();
