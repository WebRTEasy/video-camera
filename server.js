const https = require('https');
const fs = require('fs');

const PORT = 8000;

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

https.createServer(options, (req, res) => {
  console.log(req.url);
  let fileName = req.url;

  if (req.url === '/')
    fileName = 'index.html';

  fs.readFile(fileName, (err, file) => {
    if (err || !file) {
      res.writeHead(404);
      res.end();
    } else {
      res.writeHead(200);
      res.end(file);
    }
  });
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
