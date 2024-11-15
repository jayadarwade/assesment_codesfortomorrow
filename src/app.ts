import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { getLocalIp, getLocaleMessages } from "./helpers/helper.js";
import UserRoute from "./routes/user.routes.js";
import { loggerMiddleware } from "./middleware/loggerMiddleware.js";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./helpers/socket.js";

dotenv.config();

const app = express();
const server = createServer(app); // Create the HTTP server
const port = process.env.PORT || 3000;

declare global {
  var __basedir: string;
  var locals: Record<string, string>;
}

// Set the base directory
global.__basedir = __dirname + "/";
global.locals = getLocaleMessages();

// Initialize Socket.IO
initializeSocket(server);

const startServer = async () => {
  const app = new App().app;
  app.listen(port, () => {
    console.log(`Express is listening at ${getLocalIp()}`);
  });
};

class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.plugins();
    this.routes();
  }

  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(loggerMiddleware);
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Authorization", "token");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,GET");
        return res.status(200).json({});
      }
      next();
    });
  }

  protected routes(): void {
    this.app.route("/").get((req: Request, res: Response) => {
      res.send("WELCOME VRI/OPI Backend");
    });
    this.app.use("/user", UserRoute);
  }
}

// Start the server
startServer();
