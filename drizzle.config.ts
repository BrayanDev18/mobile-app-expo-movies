import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/expo-sqlite/db/schema.ts",
  out: "./src/expo-sqlite/drizzle",
  dialect: "sqlite",
  driver: "expo",
});
