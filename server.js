require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const postController = require('./controllers/postController');
const userController = require('./controllers/userController');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Error: MONGO_URI is not defined in your .env file.');
  process.exit(1); 
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB successfully');

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/posts', postController.getAllPosts);
app.post('/posts', postController.createPost);
app.get('/posts/:id', postController.getPostById);
app.delete('/posts/:id', postController.deletePost);
app.put('/posts/:id', postController.updatePost);
app.post('/posts/:id/like', postController.likePost);

app.get('/users', userController.getAllUsers);
app.post('/users', userController.createUser);
app.get('/users/:id', userController.getUserById);
app.delete('/users/:id', userController.deleteUser);
app.put('/users/:id', userController.updateUser);
app.get('/users/:id/posts', userController.getPostsByUserId);