const Hapi = require("@hapi/hapi");
const routes = require("./lib/routes");
const secretKeys = require("./constants");

const server = new Hapi.server({
  port: secretKeys.port,
  host: "localhost",
});

server.route(routes);

server.start(console.log(`Server started ${server.info.uri}`));
