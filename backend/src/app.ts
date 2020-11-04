import http from "http";
import express from "express";
import errorHandler from "errorhandler";
import socketIo from "socket.io";

(async () => {
  try {
    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    /**
     * set port
     */
    app.set("port", process.env.PORT || 5555);

    /**
     * Error Handler. Provides full stack
     */
    if (process.env.NODE_ENV === "development") {
      app.use(errorHandler());
    }

    /**
     * add additional endpoints
     */
    app.get("/", (req, res) => {
      res.send("Don't Explode Backend is running!");
    });

    io.on("connection", (socket) => {
      console.log("a user connected");

      socket.emit("FromAPI", "Hello World!");
    });

    /**
     * Start Express server.
     */
    server.listen(app.get("port"), () => {
      const port = app.get("port");
      const mode = app.get("env");

      // eslint-disable-next-line no-console
      console.log("\n");
      // eslint-disable-next-line no-console
      console.log(
        `🚀  App is running at http://localhost:${port} in ${mode} mode`,
      );
      // eslint-disable-next-line no-console
      console.log("    Press CTRL-C to stop\n");
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Something went wrong...", error);
  }
})();
