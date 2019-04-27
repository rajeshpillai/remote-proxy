const http = require("http");

const defaultOptions = {
  host: "127.0.0.1",
  port: 5555,
  includeStack: true
};

class Server {
  constructor(userOptions) {
    this.options = Object.assign({}, defaultOptions, userOptions || {});

    this.server = http.createServer(this.handleRequest.bind(this));
    this.server.listen(this.options.port, this.options.host, () => {
      console.log(
        `Server running on port ${this.options.host}:${this.options.port}`
      );
    });

    this.handlers = {};
  }

  handleRequest(req, res) {
    console.log(req.method);
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      console.log("END>>>");
      req.body = JSON.parse(body);
      console.log("DATA: ", req.body);

      res.end();
    });
  }

  registerHandler(name, handler) {
    this.handlers[name] = handler;
  }

  getHandler(name) {
    return this.handlers[name];
  }
}

const handler = {
  set(server, name, handlerFn) {
    server.registerHandler(name, handlerFn);
    return true;
  },

  get(server, name) {
    if (name === "closeserver") {
      return server.server.close.bind(server.server);
    }
    return server.getHandler(name);
  }
};

function createServer(options) {
  const server = new Server(options);
  return new Proxy(server, handler);
}

module.exports.createServer = createServer;
