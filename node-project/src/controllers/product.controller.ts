import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../services/product.service";
import type { IProduct } from "../types";
import { parseBody } from "../utils/parseBody";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;
  const urlParams = url?.split("/");
  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

  if (url === "/products" && method === "GET") {
    const products = productService();

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Products retrived successfully!!",
        data: products,
      })
    );
  } else if (method === "GET" && id !== null) {
    const products = productService();
    const product = products.find((p: IProduct) => p.id === id);

    res.end(
      JSON.stringify({
        message: "Products retrived successfully!!",
        data: product,
      })
    );
  } else if (method === "POST" && url === "/products") {
    const body = await parseBody(req);
    const newProduct = { id: Date.now(), ...body };
    const products = productService();

    products.push(newProduct);
    createProduct(products);
    res.writeHead(201, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Products created successfully!!",
        // data: products,
      })
    );
  }
};

export default productController;
