const registerUser = require('../../service/registerUser');
const loginUser = require('../../service/loginUser'); 

const registerUserController = async (req, res) => {
  try {
    const userData = req.body;
    const result = await registerUser(userData);

    if (result.status === 'success') {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};


const loginUserController = async (req, res) => {
  try {
    const userData = req.body;
    const result = await loginUser(userData);

    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

module.exports = {
  registerUserController,
  loginUserController, 
};
