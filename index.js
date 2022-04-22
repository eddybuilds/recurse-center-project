import { createServer } from 'http';
import { parse } from 'url';

let ht = new Map();

createServer(function (req, res) {

  // Handle errors! Don't let the server die.
  req.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  })
  res.on('error', (err) => {
    console.error(err);
  })

  // set endpoint
  if (req.url.startsWith('/set')) {
    try {
      const queryObject = parse(req.url, true).query;
      const searchParams = new URLSearchParams(queryObject);
  
      for (const [key, value] of searchParams.entries()) {
        ht.set(key, value);
      }
  
      res.writeHead(200, { 'Content-Type': 'application/json' }); 
      res.write(JSON.stringify({ statusCode: 200 }));  
      res.end();
    }
    catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end();
    }
  }

  // get endpoint
  else if (req.url.startsWith('/get')) { 
    try {
      const queryObject = parse(req.url, true).query;
      const searchParams = new URLSearchParams(queryObject);

      let keys = []
      let result = null;

      for(var key of searchParams.values()) {
        keys.push(key);
      }

      for(var key of keys) {
        if (ht.has(key)) {
          result = ht.get(key);
        }
        else {
          result = "Unknown!";
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' }); 
      res.write(JSON.stringify({ message: result }));  
      res.end();
    }
    catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end();
    }
  }

  // 404 the rest
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' }); 
    res.write(JSON.stringify({ message: "Error! Unknown request!" }));
    res.end();
  }
}).listen(4000);

console.log('Server running on port 4000')