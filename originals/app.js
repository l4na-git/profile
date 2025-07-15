const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'layouts'));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  const homePath = path.join(__dirname, 'pages', 'home.ejs');
  
  fs.readFile(homePath, 'utf8', (err, homeContent) => {
    if (err) return res.status(500).send(err.message);
    
    res.render('layout', {
      content: homeContent,
      isHome: true
    });
  });
});

app.get('/about', (req, res) => {
  const aboutPath = path.join(__dirname, 'pages', 'about.ejs');
  
  fs.readFile(aboutPath, 'utf8', (err, aboutContent) => {
    if (err) return res.status(500).send(err.message);
    
    res.render('layout', {
      content: aboutContent,
      isHome: false
    });
  });
});

app.get('/product', (req, res) => {
  const aboutPath = path.join(__dirname, 'pages', 'product.ejs');
  
  fs.readFile(aboutPath, 'utf8', (err, aboutContent) => {
    if (err) return res.status(500).send(err.message);
    
    res.render('layout', {
      content: aboutContent,
      isHome: false
    });
  });
});

app.listen(3000, () => console.log('http://localhost:3000'));
