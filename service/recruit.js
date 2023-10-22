
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai').default;
require('dotenv').config();
const Recruit = require('../model/recruit');
const openai = new OpenAI({ api_key: process.env.OPENAI_API_KEY });



const mapResultToProperData = async (cvData) => {
  try {
    const messages = [
      { role: 'user', content: cvData },
      { role: 'system', content: 'Map the data properly and return it to me for each section including details, skills, hobbies, work experiences and others.' }
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });
    console.log(response.choices[0].message);
    const analysisResult = response.choices[0].message;

    return analysisResult;
  } catch (error) {
    console.error('Error analyzing user query:', error);
    throw new Error('Error analyzing user query: ' + error.message);
  }
};

function parseEducationString(educationStr) {
  const match = educationStr.match(/- (.+) \(([^,]+), (\d{4})\)/);
  if (match) {
      return {
          degree: match[1].trim(),
          school: match[2].trim(),
          year: parseInt(match[3], 10)
      };
  }
  return null;
}


const mapToSchema = (data) => {
  if (!data.content) {
      console.error('No content provided');
      return;
  }

  const lines = data.content.split('\n').map(line => line.trim()).filter(line => line);

  if (!lines || !lines.length) {
      console.error('No lines found in the content');
      return;
  }

  let fullName, email, address, phone, professionalSummary, workExperiences = [], educations = [], skills = [], hobbies = [];

  for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("Name:")) fullName = lines[i].replace("Name:", "").trim();
      if (lines[i].startsWith("Email:")) email = lines[i].split(":")[1].trim();
      if (lines[i].startsWith("Address:")) address = lines[i].split(":")[1].trim();
      if (lines[i].startsWith("Phone:")) phone = lines[i].split(":")[1].trim();
      if (lines[i].startsWith("Work Experience:")) {
          i++;
          while (lines[i] && !lines[i].startsWith("Education:") && !lines[i].startsWith("Skills:") && !lines[i].startsWith("Interests:")) {
              const jobTitleAndCompany = lines[i].split('-')[0].trim();
              const responsibilities = [];
              i++;
              while (lines[i] && lines[i].startsWith('-')) {
                  responsibilities.push(lines[i].slice(1).trim());
                  i++;
              }
              workExperiences.push({
                  title: jobTitleAndCompany,
                  responsibilities: responsibilities
              });
          }
          i--;
      }
      if (lines[i].startsWith("Education:")) {
        i++;
        const educations = [];
        while (lines[i] && !lines[i].startsWith("Skills:") && !lines[i].startsWith("Interests:")) {
            const parsedEducation = parseEducationString(lines[i]);
            if (parsedEducation) {
                educations.push(parsedEducation);
            }
            i++;
        }
        i--;
    }
      if (lines[i].startsWith("Skills:")) {
          i++;
          while (lines[i] && !lines[i].startsWith("Interests:")) {
              skills.push(lines[i]);
              i++;
          }
          i--;
      }
      if (lines[i].startsWith("Interests:")) {
          i++;
          while (lines[i] && !lines[i].startsWith("Portfolio:")) {
              hobbies.push(lines[i].slice(1).trim());
              i++;
          }
          i--;
      }
  }

  return {
      fullName,
      contact: {
          email,
          address,
          phone
      },
      workHistory: workExperiences,
      education: educations,
      skills,
      hobbies,
      status: 'Pending'
  };
};






const getAllRecruits = async () => {
  try {
    const recruits = await Recruit.find({});
    return recruits;
  } catch (err) {
    console.error('Error fetching all recruits:', err);
    throw err;
  }
};

const getRecruitById = async (id) => {
  try {
    const recruit = await Recruit.findById(id);
    if (!recruit) {
      console.log('Recruit not found');
      return null;
    }
    return recruit;
  } catch (err) {
    console.error('Error fetching recruit by ID:', err);
    throw err;
  }
};


const saveToDatabase = async (cvData) => {
  try {
    const analysisResult = await mapResultToProperData(cvData);
    const mappedData = mapToSchema(analysisResult);
    if (!mappedData) throw new Error("Mapped data is null or undefined");
    const recruitInstance = new Recruit(mappedData);
    await recruitInstance.save();
    console.log('Data saved successfully!');
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};


module.exports = {
  saveToDatabase,
  mapToSchema,
  getAllRecruits,
  getRecruitById,
};


