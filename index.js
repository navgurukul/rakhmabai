const Hapi = require("@hapi/hapi");
const routes = require("./lib/routes");
const server = new Hapi.server({
  port: 8000,
  host: "localhost",
});

server.route(routes);

server.start(console.log(`Server started ${server.info.uri}`));
