const express = require("express");
const cors = require("cors");
const https=require('https')
const path = require("path");
const fs=require('fs')
const authMiddleware = require("./middleware/auth");
const jwtErrorHandler = require("./middleware/jwtErrorHandler");
const validateToken = require("./middleware/validateToken");

const app = express();
app.use(cors());

const PORT = 8080;

app.use(express.json());
app.use(express.static("public"));

app.use(
  "/upload",
  // authMiddleware,
  validateToken,
  jwtErrorHandler,
  express.static(path.join(__dirname, "upload"))
);



https.globalAgent.options.rejectUnauthorized = false; // alter: process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const keyFilePath = `${__dirname}/cert/server.key`;
const cerFilePath = `${__dirname}/cert/server.crt`;
const privateKey = fs.readFileSync(keyFilePath, 'utf8');
const certificate = fs.readFileSync(cerFilePath, 'utf8');
const certificates = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(certificates, app);
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

httpsServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ! - Https`);
});

// Error handling
httpsServer.on('error', (error) => {
  console.error('HTTPS server error:', error);
});