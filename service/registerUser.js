const bcrypt = require('bcryptjs');
const User = require('../model/user'); 

const registerUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return { status: 'error', message: 'Email already exists' };
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    const savedUser = await user.save();
    return { status: 'success', message: 'User registered successfully', data: savedUser };
  } catch (error) {
    return { status: 'error', message: 'An error occurred while registering the user', error };
  }
};

module.exports = registerUser;
