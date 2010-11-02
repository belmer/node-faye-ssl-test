require.paths.unshift(__dirname + '/vendor')

var crypto =  require('crypto'),
      fs =    require("fs"),
      faye =  require('faye/faye-node'),
      http =  require("http");

var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certificate.pem').toString();

var credentials = crypto.createCredentials({key: privateKey, cert: certificate});

var handler = function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
};

var server = http.createServer();
server.setSecure(credentials);
server.addListener("request", handler);

var bayeux = new faye.NodeAdapter( { mount: '/faye' });

bayeux.getClient().subscribe('/ping', function(obj) {
  bayeux.getClient().publish('/pong', obj);
});

bayeux.attach(server);
server.listen(8000);


