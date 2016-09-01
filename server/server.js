const hapi = require('hapi');
const plugins = require('./plugins/index');
const routes = require('./routes/index');
const fs = require('fs');

const server = new hapi.Server();

const tls = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}

server.connection({
  port: process.env.PORT || 4000,
  host: 'localhost',
  tls: tls
});

server.register(plugins, (err) => {
  if (err) throw err;
  server.route(routes);
});

server.start(() => {
  console.log(`Server is currently running on: ${server.info.uri}`);
});
