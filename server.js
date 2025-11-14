require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

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
    console.log('✅ Connected to MongoDB successfully');

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const postSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  content: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}, {
  collection: 'posts'
});

const userSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }
}, {
  collection: 'users'
});

const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'An error occurred while fetching posts.' });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const { user_id, content } = req.body;
    
    if (!user_id || !content) {
      return res.status(400).json({ error: 'user_id and content are required.' });
    }

    const allPosts = await Post.find({}, '_id');
    let nextId = 1;
    
    if (allPosts.length > 0) {
      const maxId = allPosts.reduce((max, post) => (post._id > max ? post._id : max), 0);
      nextId = maxId + 1;
    }

    const newPost = new Post({ _id: nextId, user_id, content });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const postId = Number(id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID format. Must be a number.' });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'An error occurred while fetching the post.' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const postId = Number(id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID format. Must be a number.' });
    }

    const deletedPost = await Post.findOneAndDelete({ _id: postId });
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'An error occurred while deleting the post.' });
  }
});

app.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, likeCount } = req.body;

    const postId = Number(id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID format. Must be a number.' });
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { content, likeCount },
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'An error occurred while updating the post.' });
  }
});
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields (name, email, phone, password) are required.' });
    }

    const allUsers = await User.find({}, '_id');
    let nextId = 1;
    
    if (allUsers.length > 0) {
      const maxId = allUsers.reduce((max, user) => (user._id > max ? user._id : max), 0);
      nextId = maxId + 1;
    }

    const newUser = new User({ _id: nextId, name, email, phone, password });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const userId = Number(id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format. Must be a number.' });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = Number(id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format. Must be a number.' });
    }

    const deletedUser = await User.findOneAndDelete({ _id: userId });
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    const userId = Number(id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format. Must be a number.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { name, email, phone, password },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
});