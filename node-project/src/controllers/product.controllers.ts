import type { IncomingMessage, ServerResponse } from "http";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(404, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify({ message: "This is products route" }));
};

export default productController;
