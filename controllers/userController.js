const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};

exports.createUser = async (req, res) => {
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
};

exports.getUserById = async (req, res) => {
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
};

exports.deleteUser = async (req, res) => {
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
};

exports.updateUser = async (req, res) => {
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
};
