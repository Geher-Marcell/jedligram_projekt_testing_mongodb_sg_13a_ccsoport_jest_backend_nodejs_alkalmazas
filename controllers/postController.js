const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'An error occurred while fetching posts.' });
  }
};

exports.createPost = async (req, res) => {
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
};

exports.getPostById = async (req, res) => {
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
};

exports.deletePost = async (req, res) => {
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
};

exports.updatePost = async (req, res) => {
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
};
