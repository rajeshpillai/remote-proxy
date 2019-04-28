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

  async handleRequest(req, res) {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      req.body = JSON.parse(body);
      console.log("DATA: ", req.body);

      let data = await this.handleRPCObject(req.body);
      console.log("RESULT: ", data);


      let clientResponse = this.createRPCObject(data, req.body.id);

      console.log("Formatted Data: ", clientResponse);
      console.log("JSON Data: ", JSON.stringify(clientResponse));

      try {
        res.end(JSON.stringify(clientResponse));
      } catch (e) {
        console.log("SERVER ERROR: ", e);
        throw e;
      }
    });
  }

  createRPCObject(data, reqID) {
    return { "jsonrpc": "2.0", "result": data.result, "id": reqID };
  }

  async handleRPCObject(rpcObject) {
    const { id, method } = rpcObject;

    console.log(`handling rpc ${method}`);

    // get the remote method
    const handler = this.handlers[method];

    if (typeof handler !== "function") {
      return Promise.reject("The handler is not a method");
    }

    return this.callHandler(handler, rpcObject.params)
      .then(result => ({
        id, result
      }));
  }

  callHandler(handler, parameters) {
    let params = parameters;
    if (!Array.isArray(params)) {
      params = [params];
    }
    try {
      const handlerResult = handler(...params);
      console.log("callHandler: ", handlerResult);
      return Promise.resolve(handlerResult);
    } catch (e) {
      return Promise.reject(e);
    }
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
