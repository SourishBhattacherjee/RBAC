const User = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');



const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields (username, email, password) are required' });
  }

  try {
    // Check if user already exists by email or username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      if (existingUser.username === username) {
        return res.status(409).json({ message: 'Username already taken' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user' // Default role if not provided
    });

    await newUser.save();

    // Return success response (excluding password hash)
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt.toString().split('T')[0]
    };

    res.status(201).json({
      message: `User registered successfully with username ${username}`,
      user: userResponse
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Both email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    // Always return the same message for invalid email/password (security best practice)
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    // Successful login - in a real app you'd generate a token here
    res.status(200).json({ 
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        // Include other non-sensitive user data as needed
      },
      // token: generateToken(user._id) // Typically you'd generate a JWT here
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "An error occurred during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {register,login};