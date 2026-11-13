import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../services/product.service";
import type { IProduct } from "../types";
import { parseBody } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;
  const urlParams = url?.split("/");
  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

  if (url === "/products" && method === "GET") {
    const products = productService();
    try {
      sendResponse(
        res,
        true,
        200,
        "Products retrived successfully!!",
        products
      );
    } catch (error) {
      sendResponse(res, false, 500, "Internal server errors");
    }
  } else if (method === "GET" && id !== null) {
    try {
      const products = productService();
      const product = products.find((p: IProduct) => p.id === id);

      if (!product) {
        return sendResponse(res, false, 404, "Product not found");
      }

      sendResponse(res, true, 200, "Product retrived successfully!!", product);
    } catch (error) {
      sendResponse(res, false, 500, "Internal server errors");
    }
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
      })
    );
  } else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);
    const products = productService();

    const index = products.findIndex((p: IProduct) => p.id === id);
    // console.log(index);
    if (index < 0) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Product Not Found",
        })
      );
    }

    // console.log(products[index]);
    products[index] = { id: products[index].id, ...body };
    createProduct(products);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Products updated successfully!!",
      })
    );
  } else if (method === "DELETE" && id !== null) {
    const products = productService();

    const index = products.findIndex((p: IProduct) => p.id === id);
    products.splice(index, 1);
    createProduct(products);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Products deleted successfully!!",
      })
    );
  }
};

export default productController;
