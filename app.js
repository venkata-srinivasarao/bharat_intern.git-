const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/Post');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.render('index', { posts });
    } catch (error) {
        res.status(500).send(error.message);
    }
  });

  app.get('/posts/:id', async (req, res) => {
      try {
          const post = await Post.findById(req.params.id);
          res.render('post', { post });
      } catch (error) {
          res.status(500).send(error.message);
      }
  });
  
  app.get('/new', (req, res) => {
      res.render('new-post');
  });
  
  app.post('/posts', async (req, res) => {
      const { title, body } = req.body;
      const post = new Post({ title, body });
  
      try {
          await post.save();
          res.redirect('/');
      } catch (error) {
          res.status(400).send('Error creating post: ' + error.message);
      }
  });
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});  