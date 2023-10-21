const { scrapeJobs, 
    scrapeJobDetails,
    findTopRecruits,
    getBestApplicant } = require('../../service/jobs');


const JOBS_URL = 'https://careers.sdworx.com/jobs?department=IT+%26+Technology&country=Mauritius&query=&utm_source=discord&utm_medium=careerchannel&utm_campaign=di-mu-en-b-ao-conversions-fsd-sparkathon-careerchannel-23hr004-rcrt';

const getJobListingsController = async (req, res) => {
    try {
        const jobListings = await scrapeJobs(JOBS_URL);
        console.log(jobListings)
        return res.status(200).json({ status: 'success', data: jobListings });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};



const getBestRecruitForJob = async (req, res) => {
    try {
        const jobLink = req.body.jobLink;
        const jobDetails = await scrapeJobDetails(jobLink);
        const topRecruits = await findTopRecruits(jobDetails);
        const bestRecruitReasoning = await getBestApplicant(jobDetails, topRecruits);

        return res.status(200).json({
            jobDetails,
            topRecruits,
            bestRecruitReasoning
        });
    } catch (error) {
        console.error("Error getting the best recruit for the job:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




module.exports = {
    getJobListingsController,
    getBestRecruitForJob
    
};

