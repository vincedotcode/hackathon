
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const textract = require('textract');
const { saveToDatabase } = require('../service/recruit');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

require('dotenv').config();

/**
 * @swagger
 * /upload/cv:
 *   post:
 *     summary: 'Upload a CV and convert it to text'
 *     tags:
 *       - CV Upload
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 'Successfully uploaded and converted the CV to text'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 mappedData:
 *                   type: string
 *       400:
 *         description: 'Unsupported file type'
 *       500:
 *         description: 'An error occurred while processing the file'
 */



router.post('/cv', upload.single('resume'), async (req, res) => {
    try {
        const file = req.file;
        let resumeText;
        if (file.mimetype === 'application/pdf') {
            resumeText = await pdfParse(file.buffer);
            resumeText = resumeText.text;
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword') {
            resumeText = await new Promise((resolve, reject) => {
                textract.fromBufferWithMime(file.mimetype, file.buffer, (error, text) => {
                    if (error) reject(error);
                    else resolve(text);
                });
            });
        } else {
            return res.status(400).json({ status: 'error', message: 'Unsupported file type' });
        }
        console.log(resumeText)
        const mappedData = await saveToDatabase(resumeText);
        console.log(mappedData)
        res.status(200).json({ status: 'success', mappedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'An error occurred while processing the file', error });
    }
});



module.exports = router;