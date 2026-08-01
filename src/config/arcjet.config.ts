import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import appConfig from "./app.config.js";

const aj = arcjet({
  key: appConfig.ARCJET.KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "DRY_RUN",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "DRY_RUN",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export default aj;
