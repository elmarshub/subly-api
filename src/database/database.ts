import mongoose from "mongoose";
import appConfig from "../config/app.config.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(appConfig.DB_URI);
    console.log(`MongoDB connected in ${appConfig.NODE_ENV} environment`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDatabase;
