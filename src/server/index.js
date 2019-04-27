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
    console.log(req);
  }
}

const handler = {};

function createServer(options) {
  const server = new Server(options);
  return new Proxy(server, handler);
}

module.exports.createServer = createServer;
