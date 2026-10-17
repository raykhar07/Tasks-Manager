import app from "./app.js";
import { connectDB } from "./db.js";
import { config } from "./config.js";

try {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`>>> Server running on port ${config.PORT}`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
  process.exit(1);
}