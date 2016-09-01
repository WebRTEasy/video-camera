# video-camera

Setting up HTTPS server (with Hapi):

1. Create tls object:
```javascript
const tls = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}
```
2. Include a tls property in the server.connection that points to this object.
3. Run these four commands in the terminal to create your certificate and key:
openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
4. When you run your HTTPS server you'll need to set NODE_TLS_REJECT_UNAUTHORIZED=0 as an
environment variable.
