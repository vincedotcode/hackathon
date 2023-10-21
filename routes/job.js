const express = require('express');
const { getJobListingsController, getBestRecruitForJob  } = require('../controller/jobs/job'); 
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JobListings
 *   description: Job Listings management
 */

/**
 * @swagger
 * /jobs/all:
 *   get:
 *     tags: [JobListings]
 *     description: Get all job listings from the specified URL
 *     responses:
 *       200:
 *         description: Returns a list of all job listings.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/all', getJobListingsController);

/**
 * @swagger
 * /jobs/best-recruit:
 *   post:
 *     tags: [JobListings]
 *     description: Get the best recruit for a specific job based on the provided job link.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobLink
 *             properties:
 *               jobLink:
 *                 type: string
 *                 description: The link to the specific job.
 *     responses:
 *       200:
 *         description: Returns the job details, top recruits, and the best recruit reasoning.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/best-recruit', getBestRecruitForJob);


module.exports = router;
