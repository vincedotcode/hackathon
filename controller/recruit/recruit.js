const { getAllRecruits, getRecruitById } = require('../../service/recruit');


const getAllRecruitsController = async (req, res) => {
  try {
    const recruits = await getAllRecruits();
    return res.status(200).json({ status: 'success', data: recruits });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

const getRecruitByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const recruit = await getRecruitById(id);

    if (recruit) {
      return res.status(200).json({ status: 'success', data: recruit });
    } else {
      return res.status(404).json({ status: 'error', message: 'Recruit not found' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllRecruitsController,
  getRecruitByIdController,
};
