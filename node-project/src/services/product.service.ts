import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { IProduct } from "../types";

const filePath = path.join(process.cwd(), "./src/database/db.json");
export const productService = () => {
  const result = readFileSync(filePath, "utf-8");
  return JSON.parse(result);
};

export const createProduct = (payload: IProduct) => {
  writeFileSync(filePath, JSON.stringify(payload));
};
