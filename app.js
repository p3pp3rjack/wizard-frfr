const express = require("express");
const morgan = require("morgan");
const html = require("html-template-tag");
const postBank = require("./postBank");
const PORT = 1337;
const app = express();
const timeAgo = require('node-time-ago');


app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'))

app.get("/", ( req, res ) =>{

  const posts = postBank.list();

  res.send(  
          `<!DOCTYPE html>
          <html>
          <head>
            <title>Wizard News</title>
            <link rel="stylesheet" href="/style.css" />
          </head>
          <body>
            <div class="news-list">
              <header><img src="/logo.png"/>Wizard News</header>
              ${posts.map(post => html `
                <div class='news-item'>
                  <p>
                    <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
                    <small>(by ${post.name})</small>
                  </p>
                  <small class="news-info">
                    ${post.upvotes} upvotes | ${timeAgo(post.date)}
                  </small>
                </div>`
              ).join('')}
            </div>
          </body>
        </html>`);
});

app.get('/posts/:id', ( req, res ) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
      res.status(404)
    const htmlMessage = 
    html `<!DOCTYPE html>
          <html>
          <head>
            <title>Wizard News</title>
            <link rel="stylesheet" href="/style.css" />
          </head>
          <body>
            <header><img src="/logo.png"/>Wizard News</header>
            <div class="not-found">
              <p>Accio Post! 🧙‍♀️ ... Post Doesn't Exist</p>
              <img src="/Draco_404.webp" />
            </div>
          </body>
          </html>`;
    res.send(htmlMessage)
  } else { res.send( 
    html `<!DOCTYPE html>
          <html>
          <head>
            <title>Wizard News</title>
            <link rel="stylesheet" href="/style.css" />
          </head>
          <body>
            <div class="news-list">
              <header><img src="/logo.png"/>Wizard News</header>
                <div class='news-item'>
                  <p><b>${post.title}</b> <small> (by ${post.name})</small></p>
                  <p>${post.content}</p>
                </div>
            </div>
          </body>
          </html>`);
}});

app.get("*", ( req, res, next ) => {

    res.status(404)
    const htmlMessage = html `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
        <img src="https://media1.giphy.com/media/l0HlAIIwxcTSuibDi/giphy.gif?cid=ecf05e47qqd2to96puo6hto303u2q9fdbzhvxmhk2ecf1sm4&rid=giphy.gif&ct=g" />
      </div>
    </body>
    </html>`;
    res.send(htmlMessage)

})