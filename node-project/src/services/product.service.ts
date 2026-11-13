import { readFileSync } from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "./src/database/db.json");
export const productService = () => {
  const result = readFileSync(filePath, "utf-8");
  return JSON.parse(result);
};
