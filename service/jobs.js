const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai').default;
require('dotenv').config();
const Recruit = require('../model/Recruit');
const openai = new OpenAI({ api_key: process.env.OPENAI_API_KEY });


const scrapeJobs = async (url) => {
    console.log(url);
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const jobs = [];
        const container = $('.mx-auto.text-lg.block-max-w--lg');
        const jobListContainer = container.find('#jobs_list_container');
        jobListContainer.find('li.w-full').each((index, element) => {
            const jobLink = $(element).find('a').attr('href');
            const title = $(element).find('span.text-block-base-link').text().trim();
            const department = $(element).find('div.text-md > span:nth-child(1)').text().trim();
            const location = $(element).find('div.text-md > span:nth-child(3)').text().trim();
            const remoteStatus = $(element).find('span.inline-flex').text().trim();

            jobs.push({
                title,
                department,
                location,
                remoteStatus,
                jobLink
            });
        });

        return jobs;

    } catch (error) {
        console.error('Error scraping website:', error);
        throw error;
    }
};


const scrapeJobDetails = async (jobLink) => {
    try {
        const { data } = await axios.get(jobLink);
        const $ = cheerio.load(data);

        const content = $('.company-links').text().trim();
        return { content };

    } catch (error) {
        console.error('Error scraping job details:', error);
        throw error;
    }
};

const fetchRecruitsFromDB = async () => {
    return await Recruit.find();
};

const computeScore = (jobDetails, keywords) => {
    let score = 0;

    if (!keywords || !Array.isArray(keywords)) {
        console.error('Keywords not provided or not an array:', keywords);
        return score; 
    }

    keywords.forEach(keyword => {
        if (jobDetails.content.includes(keyword)) {
            score++;
        }
    });

    return score;
};

const findTopRecruits = async (jobDetails) => {
    const recruits = await fetchRecruitsFromDB();
    const scoredRecruits = recruits.map(recruit => {
        const score = computeScore(jobDetails, recruit.keywords);
        return { ...recruit, score };
    });

    const topRecruit = scoredRecruits.sort((a, b) => b.score - a.score)[0];
    return topRecruit;
};

const getBestApplicant = async (jobDetails, topRecruit) => {
    const message = {
        role: 'user',
        content: `Job details: ${jobDetails.content}. Applicant: ${topRecruit.name} with skills: ${(topRecruit.keywords || []).join(', ') }`
    };

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [message]
    });

    return response.choices[0].message.content.trim();
};



module.exports = {
    scrapeJobs,
    scrapeJobDetails,
    findTopRecruits,
    getBestApplicant,
};