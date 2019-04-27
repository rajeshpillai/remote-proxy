const server = require('../src').createServer();

server.add = (arg1, arg2) => {
    return arg1 + arg2;
};

