import type { IncomingMessage, ServerResponse } from "http";
import { productService } from "../services/product.service";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  if (url === "/products" && method === "GET") {
    const products = productService();

    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: "Products retrived successfully!!",
        data: products,
      })
    );
  }
};

export default productController;
