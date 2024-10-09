// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For password hashing
const cors = require('cors'); // For handling cross-origin requests
const app = express(); // Make sure this is defined at the top
const PORT = 5000;

// Middleware to parse JSON data and enable CORS
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/yourDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define a User model
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  selectedLanguages: { type: [String], default: [] }, // Add this line
  selectedArtists: { type: [String], default: [] } // Add this line
}));

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password and save the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Respond with a success message
    res.status(200).json({ message: "Signup successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during signup." });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    // Respond with a success message
    res.status(200).json({ message: "Login successful!", userId: user._id }); // Include userId in response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during login." });
  }

  res.status(200).json({
    message: 'Login successful!',
    userId: foundUser._id // or however you're storing user IDs
  });
});

// Store user selections route
app.post('/storeSelection', async (req, res) => {
  try {
    const { userId, selectedLanguages, selectedArtists } = req.body;

    // Update the user with their selected languages and artists
    await User.updateOne(
      { _id: userId }, // Find the user by their ID
      { $set: { selectedLanguages, selectedArtists } } // Update their selections
    );

    res.status(200).json({ message: "Selections saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while saving selections." });
  }

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
