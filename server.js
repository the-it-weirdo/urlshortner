require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const shortenedUrls = {};

const validateUrl = (url) => {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  return urlRegex.test(url);
}

// Basic Configuration
const port = process.env.PORT || 3001;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended:false})); // body parser middleware

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  if (!validateUrl(req.body.url)) {
    res.json({'error': 'invalid url'})
  } else {
    const shortUrl = shortenedUrls[req.body.url] || Object.keys(shortenedUrls).length + 1;
    shortenedUrls[shortUrl] = req.body.url;
    res.json({ original_url : req.body.url, short_url : shortUrl});
  }
});

app.get('/api/shorturl/:short_url', function(req, res) {
  res.writeHead(307,
    {Location: `${shortenedUrls[req.params.short_url]}`}
  );
  res.end();
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
