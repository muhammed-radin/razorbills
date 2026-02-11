var express = require('express');
var router = express.Router();
const { UserModel } = require('../models/schema/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST create a new user */
router.post('/', async function(req, res, next) {
  try {
    const { email, password, name, id, provider, profilePicture, role, phoneNumber, address } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const newUser = new UserModel({
      id: id || new Date().getTime().toString(),
      email: email,
      password: password,
      name: name,
      profilePicture: profilePicture || null,
      provider: provider || 'local',
      role: role || 'user',
      phoneNumber: phoneNumber || '',
      address: address || '',
    });

    await newUser.save();
    
    // Return user data without password
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    return res.status(201).json({ 
      message: 'User created successfully',
      user: userResponse
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
