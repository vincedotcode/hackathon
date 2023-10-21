const jwt = require('jsonwebtoken');
const User = require('../model/user'); 
const bcrypt = require('bcryptjs');
const loginUser = async (userData) => {
  try {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return { status: 'error', message: 'Invalid email or password' };
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(userData.password, user.password);
    if (!validPassword) {
      return { status: 'error', message: 'Invalid email or password' };
    }

    const token = jwt.sign({ user }, '3242332', { expiresIn: '1h' });

    return { status: 'success', message: 'Logged in successfully', token };
  } catch (error) {
    return { status: 'error', message: 'An error occurred while logging in', error };
  }
};

module.exports = loginUser;
