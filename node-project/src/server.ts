import { createServer, IncomingMessage, Server, ServerResponse } from "http";

const server: Server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    // console.log(res);
    // console.log(req.url);

    const url = req.url;
    const method = req.method;

    if (url === "/" && method === "GET") {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "This is root route" })); // server chunk by chunk response patay. tcp shudu string bujte pare
    } else if (url?.startsWith("/products")) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "This is products route" }));
    } else {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "This route is not defined" }));
    }
  }
);

server.listen(5000, () => {
  console.log("Server is running!!");
});
