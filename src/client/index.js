const http = require("http");

const defaultOptions = {
  host: "127.0.0.1",
  port: 5555,
  path: "/",
  connectTimeout: 0,
  responseTimeout: 0
};

class Client {
  constructor(userOptions) {
    this.options = Object.assign({}, defaultOptions, userOptions || {});
    this.options.headers = Object.assign(
      { "Content-Type": "application/json" },
      this.options.headers || {}
    );
    this.options.method = "POST";
    if (this.options.timeout != null) {
      this.options.responseTimeout = this.options.timeout;
    }
    this.options.timeout =
      this.options.connectTimeout || this.options.timeout || undefined;
  }

  send(name, params) {
    console.log(name, params);
    
  }
}

const handler = {
  get(client, name) {
    return (...args) => client.send(name, args);
  }
};

function createClient(options) {
  const client = new Client(options);
  return new Proxy(client, handler);
}

module.exports.createClient = createClient;
