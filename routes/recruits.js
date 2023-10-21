const express = require('express');
const { getAllRecruitsController, getRecruitByIdController } = require('../controller/recruit/recruit');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recruits
 *   description: Recruits management
 */

/**
 * @swagger
 * /recruits/getAll:
 *   get:
 *     tags: [Recruits]
 *     description: Get all recruits
 *     responses:
 *       200:
 *         description: Returns a list of all recruits.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/getAll', getAllRecruitsController);

/**
 * @swagger
 * /recruits/id/{id}:
 *   get:
 *     tags: [Recruits]
 *     description: Get a recruit by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the recruit
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Returns the recruit with the specified ID.
 *       404:
 *         description: Recruit not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/id/:id', getRecruitByIdController);

module.exports = router;
