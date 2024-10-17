const User = require('../models/User'); // Assuming your combined User model is in models/User.js
const SocialFamily = require('../models/SocialFamily');
const PersonalInfo = require('../models/PersonalInfo');
const HealthData = require('../models/HealthData');
const Financial = require('../models/Financial');
const Employment = require('../models/Employment');
const Education = require('../models/Education');
const Contact = require('../models/Contact');

// Migration function to transfer data from old models to new User model
async function migrateData() {
  try {
    // Get all users from the old models
    const socialFamilies = await SocialFamily.find({});
    const personalInfos = await PersonalInfo.find({});
    const healthDatas = await HealthData.find({});
    const financials = await Financial.find({});
    const employments = await Employment.find({});
    const educations = await Education.find({});
    const contacts = await Contact.find({});

    // Loop through each data set and find or create a corresponding User entry
    for (let personalInfo of personalInfos) {
      // Try to find an existing user by eID, or create a new one if none exists
      let user = await User.findOne({ eID: personalInfo.eID });
      if (!user) {
        user = new User({
          fullName: `${personalInfo.firstName} ${personalInfo.lastName}`,
          eID: personalInfo.eID,
          gender: personalInfo.gender,
          dateOfBirth: personalInfo.dateOfBirth,
          category: 'individual', // Or whatever category applies
        });
      }

      // Update user's personal info
      user.personalInfo = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        dateOfBirth: personalInfo.dateOfBirth,
        gender: personalInfo.gender,
        maritalStatus: personalInfo.maritalStatus,
        nationality: personalInfo.nationality,
        streetAddress1: personalInfo.streetAddress1,
        streetAddress2: personalInfo.streetAddress2,
        city: personalInfo.city,
        state: personalInfo.state,
        postalCode: personalInfo.postalCode,
        country: personalInfo.country,
      };

      // Update user's social family info if exists
      const socialFamily = socialFamilies.find(sf => sf.eID === personalInfo.eID);
      if (socialFamily) {
        user.socialFamily = {
          maritalStatus: socialFamily.maritalStatus,
          familyMembers: socialFamily.familyMembers,
          dependents: socialFamily.dependents,
          socialAffiliations: socialFamily.socialAffiliations,
        };
      }

      // Update user's health data if exists
      const healthData = healthDatas.find(hd => hd.eID === personalInfo.eID);
      if (healthData) {
        user.healthData = {
          bloodType: healthData.bloodType,
          allergies: healthData.allergies,
          medicalHistory: healthData.medicalHistory,
          insuranceProvider: healthData.insuranceProvider,
          policyNumber: healthData.policyNumber,
          coverageDetails: healthData.coverageDetails,
          conditions: healthData.conditions,
          disabilities: healthData.disabilities,
          additionalInfo: healthData.additionalInfo,
        };
      }

      // Update user's financial info if exists
      const financial = financials.find(fin => fin.eID === personalInfo.eID);
      if (financial) {
        user.financial = {
          bankAccountNumber: financial.bankAccountNumber,
          bankName: financial.bankName,
          income: financial.income,
          creditScore: financial.creditScore,
          taxId: financial.taxId,
          mobileNumber: financial.mobileNumber,
        };
      }

      // Update user's employment info if exists
      const employment = employments.find(emp => emp.eID === personalInfo.eID);
      if (employment) {
        user.employment = {
          jobTitle: employment.jobTitle,
          employer: employment.employer,
          jobCategory: employment.jobCategory,
          startDate: employment.startDate,
          endDate: employment.endDate,
          skills: employment.skills,
        };
      }

      // Update user's education info if exists
      const education = educations.find(edu => edu.eID === personalInfo.eID);
      if (education) {
        user.education = {
          educationLevel: education.educationLevel,
          institutionName: education.institutionName,
          degreeType: education.degreeType,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy,
          startDate: education.startDate,
          endDate: education.endDate,
          country: education.country,
          transferDetails: education.transferDetails,
        };
      }

      // Update user's contact info if exists
      const contact = contacts.find(cont => cont.eID === personalInfo.eID);
      if (contact) {
        user.contact = {
          phoneNumbers: contact.phoneNumbers,
          emails: contact.emails,
          emergencyContacts: contact.emergencyContacts,
          socialMedia: contact.socialMedia,
          address: contact.address,
        };
      }

      // Save the updated user
      await user.save();
    }

    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Error during data migration:', error);
  }
}

migrateData();
