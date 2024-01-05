import express from "express";
import { ServerRoutes } from "./routes";

interface Options {
  port: number;
  public_path: string;
}

export class Server {

  public readonly app = express();
  private readonly port: number;
  private readonly public_path: string;

  constructor(options: Options) {
    this.port = options.port;
    this.public_path = options.public_path;
  }

  async start() {

    // middlewares
    this.app.use(express.json());

    // public folder
    this.app.use(express.static(this.public_path));

    // routes
    this.app.use(ServerRoutes.routes);

    // run server
    this.app.listen(this.port, () => {
      console.log("server is running...");
    });

  }

}
