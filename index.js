const http = require('http');
const url = require('url');
const fs = require('fs/promises');
const path = require('path');
const port = 5000;

http
  .createServer(async function (req, res) {
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    if (parsedUrl.pathname.startsWith('/voc')) {
      parsedUrl.pathname = parsedUrl.pathname.slice(4);
    }
    let pathname = `./build${parsedUrl.pathname}`;
    // based on the URL path, extract the file extension. e.g. .js, .doc, ...
    console.log(pathname);
    const ext = path.parse(pathname).ext || '.html';
    // maps file extension to MIME typere
    const map = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword'
    };
    try {
      await fs.access(pathname);

      const stat = await fs.stat(pathname);
      if (stat.isDirectory()) pathname += '/index' + ext;

      const data = await fs.readFile(pathname);
      // if the file is found, set Content-type and send data
      res.setHeader('Content-type', map[ext] || 'text/plain');
      return res.end(data);
    } catch (error) {
      if (error.code === 'ENOENT' && error.syscall === 'access') {
        res.statusCode = 404;
        return res.end(`File ${pathname} not found!`);
      }
      res.statusCode = 500;
      return res.end(`Error getting the file: ${error}.`);
    }
  })
  .listen(parseInt(port));

console.log(`Server listening on port ${port}`);
