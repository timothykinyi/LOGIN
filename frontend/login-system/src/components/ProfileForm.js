import React, { useState } from 'react';
import './styles/ProfileForm.css';

const categories = [
  "Personal Information",
  "Education",
  "Health",
  "Work Experience",
  "Family",
  "Technology",
  "Hobbies",
  "Travel",
  "Financial Information",
  "Legal Information",
  "Digital Life",
  "Assets",
  "Social Connections",
  "Spiritual Life",
  "Volunteer Work",
  "Language Proficiency",
  "Skills & Talents",
  "Political Views",
  "Personal Goals",
  "Personality & Traits",
  "Pets",
  "Dietary Preferences",
  "Achievements",
  "Relationships",
  "Future Aspirations",
  "Charitable Giving",
  "Communication Preferences",
  "Media Preferences",
  "Environmental Preferences",
  // More sections can be added as needed
];

const CompleteProfile = () => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [profileData, setProfileData] = useState({});

  const handleInputChange = (category, field, value) => {
    setProfileData({
      ...profileData,
      [category]: { ...(profileData[category] || {}), [field]: value },
    });
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handlePrevCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const currentCategory = categories[currentCategoryIndex];

  return (
    <div className="complete-profile-container">
      <h2>{currentCategory}</h2>

      {/* Personal Information */}
      {currentCategory === "Personal Information" && (
        <>
          <label htmlFor="full-name">Full Name:</label>
          <input
            type="text"
            id="full-name"
            onChange={(e) => handleInputChange("Personal Information", "fullName", e.target.value)}
          />
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            onChange={(e) => handleInputChange("Personal Information", "dob", e.target.value)}
          />
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            onChange={(e) => handleInputChange("Personal Information", "gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <label htmlFor="nationality">Nationality:</label>
          <input
            type="text"
            id="nationality"
            onChange={(e) => handleInputChange("Personal Information", "nationality", e.target.value)}
          />
          <label htmlFor="marital-status">Marital Status:</label>
          <select
            id="marital-status"
            onChange={(e) => handleInputChange("Personal Information", "maritalStatus", e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
          <label htmlFor="phone-number">Phone Number:</label>
          <input
            type="tel"
            id="phone-number"
            onChange={(e) => handleInputChange("Personal Information", "phoneNumber", e.target.value)}
          />
        </>
      )}

      {/* Education */}
      {currentCategory === "Education" && (
        <>
          <label htmlFor="kindergarten-country">Kindergarten Country:</label>
          <select
            id="kindergarten-country"
            onChange={(e) => handleInputChange("Education", "kindergartenCountry", e.target.value)}
          >
            <option value="">Select Country</option>
            <option value="Kenya">Kenya</option>
            <option value="USA">USA</option>
            {/* Add more countries */}
          </select>
          <label htmlFor="kindergarten-name">Kindergarten Name:</label>
          <input
            type="text"
            id="kindergarten-name"
            onChange={(e) => handleInputChange("Education", "kindergartenName", e.target.value)}
          />
          <label htmlFor="high-school-country">High School Country:</label>
          <select
            id="high-school-country"
            onChange={(e) => handleInputChange("Education", "highSchoolCountry", e.target.value)}
          >
            <option value="">Select Country</option>
            <option value="Kenya">Kenya</option>
            <option value="USA">USA</option>
            {/* Add more countries */}
          </select>
          <label htmlFor="high-school-name">High School Name:</label>
          <input
            type="text"
            id="high-school-name"
            onChange={(e) => handleInputChange("Education", "highSchoolName", e.target.value)}
          />
          <label htmlFor="university-name">University Name:</label>
          <input
            type="text"
            id="university-name"
            onChange={(e) => handleInputChange("Education", "universityName", e.target.value)}
          />
          <label htmlFor="degree">Degree Obtained:</label>
          <input
            type="text"
            id="degree"
            onChange={(e) => handleInputChange("Education", "degree", e.target.value)}
          />
          <label htmlFor="graduation-year">Graduation Year:</label>
          <input
            type="number"
            id="graduation-year"
            onChange={(e) => handleInputChange("Education", "graduationYear", e.target.value)}
          />
        </>
      )}

      {/* Health */}
      {currentCategory === "Health" && (
        <>
          <label htmlFor="blood-type">Blood Type:</label>
          <select
            id="blood-type"
            onChange={(e) => handleInputChange("Health", "bloodType", e.target.value)}
          >
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <label htmlFor="medical-conditions">Chronic Conditions:</label>
          <input
            type="text"
            id="medical-conditions"
            onChange={(e) => handleInputChange("Health", "chronicConditions", e.target.value)}
          />
          <label htmlFor="allergies">Allergies:</label>
          <input
            type="text"
            id="allergies"
            onChange={(e) => handleInputChange("Health", "allergies", e.target.value)}
          />
          <label htmlFor="medications">Current Medications:</label>
          <input
            type="text"
            id="medications"
            onChange={(e) => handleInputChange("Health", "currentMedications", e.target.value)}
          />
          <label htmlFor="fitness-routine">Fitness Routine:</label>
          <textarea
            id="fitness-routine"
            onChange={(e) => handleInputChange("Health", "fitnessRoutine", e.target.value)}
          ></textarea>
          <label htmlFor="diet">Dietary Preferences:</label>
          <input
            type="text"
            id="diet"
            onChange={(e) => handleInputChange("Health", "dietaryPreferences", e.target.value)}
          />
        </>
      )}

      {/* Work Experience */}
      {currentCategory === "Work Experience" && (
        <>
          <label htmlFor="current-job">Current Job Title:</label>
          <input
            type="text"
            id="current-job"
            onChange={(e) => handleInputChange("Work Experience", "currentJobTitle", e.target.value)}
          />
          <label htmlFor="current-company">Current Company:</label>
          <input
            type="text"
            id="current-company"
            onChange={(e) => handleInputChange("Work Experience", "currentCompany", e.target.value)}
          />
          <label htmlFor="previous-job">Previous Job Title:</label>
          <input
            type="text"
            id="previous-job"
            onChange={(e) => handleInputChange("Work Experience", "previousJobTitle", e.target.value)}
          />
          <label htmlFor="previous-company">Previous Company:</label>
          <input
            type="text"
            id="previous-company"
            onChange={(e) => handleInputChange("Work Experience", "previousCompany", e.target.value)}
          />
          <label htmlFor="years-experience">Years of Experience:</label>
          <input
            type="number"
            id="years-experience"
            onChange={(e) => handleInputChange("Work Experience", "yearsExperience", e.target.value)}
          />
          <label htmlFor="skills">Key Skills:</label>
          <textarea
            id="skills"
            onChange={(e) => handleInputChange("Work Experience", "keySkills", e.target.value)}
          ></textarea>
        </>
      )}

      {/* Add more sections as needed... */}

{currentCategory === "Family" && (
  <>
    <h3>Family Information</h3>
    <label htmlFor="marital-status">Marital Status:</label>
    <select
      id="marital-status"
      onChange={(e) => handleInputChange("Family", "maritalStatus", e.target.value)}
    >
      <option value="">Select Marital Status</option>
      <option value="Single">Single</option>
      <option value="Married">Married</option>
      <option value="Divorced">Divorced</option>
      <option value="Widowed">Widowed</option>
    </select>
    <label htmlFor="spouse-name">Spouse Name (if applicable):</label>
    <input
      type="text"
      id="spouse-name"
      onChange={(e) => handleInputChange("Family", "spouseName", e.target.value)}
    />
    <label htmlFor="children">Children (names and ages):</label>
    <textarea
      id="children"
      onChange={(e) => handleInputChange("Family", "children", e.target.value)}
    ></textarea>
  </>
)}

{currentCategory === "Hobbies" && (
  <>
    <h3>Hobbies and Interests</h3>
    <label htmlFor="hobbies">List of Hobbies:</label>
    <textarea
      id="hobbies"
      onChange={(e) => handleInputChange("Hobbies", "hobbiesList", e.target.value)}
    ></textarea>
    <label htmlFor="favorite-sports">Favorite Sports:</label>
    <input
      type="text"
      id="favorite-sports"
      onChange={(e) => handleInputChange("Hobbies", "favoriteSports", e.target.value)}
    />
    <label htmlFor="preferred-music">Preferred Music Genres:</label>
    <input
      type="text"
      id="preferred-music"
      onChange={(e) => handleInputChange("Hobbies", "preferredMusic", e.target.value)}
    />
  </>
)}

{currentCategory === "Travel" && (
  <>
    <h3>Travel History</h3>
    <label htmlFor="countries-visited">Countries Visited:</label>
    <textarea
      id="countries-visited"
      onChange={(e) => handleInputChange("Travel", "countriesVisited", e.target.value)}
    ></textarea>
    <label htmlFor="favorite-destination">Favorite Travel Destination:</label>
    <input
      type="text"
      id="favorite-destination"
      onChange={(e) => handleInputChange("Travel", "favoriteDestination", e.target.value)}
    />
    <label htmlFor="travel-frequency">How often do you travel?</label>
    <select
      id="travel-frequency"
      onChange={(e) => handleInputChange("Travel", "travelFrequency", e.target.value)}
    >
      <option value="">Select Frequency</option>
      <option value="Once a year">Once a year</option>
      <option value="Twice a year">Twice a year</option>
      <option value="More than twice a year">More than twice a year</option>
    </select>
  </>
)}

{currentCategory === "Technology" && (
  <>
    <h3>Technology Usage</h3>
    <label htmlFor="devices-owned">Devices Owned (e.g., phone, laptop, tablet):</label>
    <textarea
      id="devices-owned"
      onChange={(e) => handleInputChange("Technology", "devicesOwned", e.target.value)}
    ></textarea>
    <label htmlFor="favorite-tech">Favorite Technology Brand:</label>
    <input
      type="text"
      id="favorite-tech"
      onChange={(e) => handleInputChange("Technology", "favoriteTechBrand", e.target.value)}
    />
    <label htmlFor="daily-tech-usage">Hours of Daily Tech Usage:</label>
    <input
      type="number"
      id="daily-tech-usage"
      onChange={(e) => handleInputChange("Technology", "dailyTechUsage", e.target.value)}
    />
  </>
)}
{/* Financial Information */}
{currentCategory === "Financial Information" && (
  <>
    <h3>Financial Information</h3>
    <label htmlFor="income">Annual Income:</label>
    <input
      type="number"
      id="income"
      onChange={(e) => handleInputChange("Financial Information", "annualIncome", e.target.value)}
    />
    <label htmlFor="savings">Savings:</label>
    <input
      type="number"
      id="savings"
      onChange={(e) => handleInputChange("Financial Information", "savings", e.target.value)}
    />
    <label htmlFor="investments">Investments:</label>
    <textarea
      id="investments"
      onChange={(e) => handleInputChange("Financial Information", "investments", e.target.value)}
    ></textarea>
  </>
)}

{/* Legal Information */}
{currentCategory === "Legal Information" && (
  <>
    <h3>Legal Information</h3>
    <label htmlFor="criminal-history">Criminal History:</label>
    <textarea
      id="criminal-history"
      onChange={(e) => handleInputChange("Legal Information", "criminalHistory", e.target.value)}
    ></textarea>
    <label htmlFor="legal-documents">Legal Documents (e.g., passport, ID):</label>
    <textarea
      id="legal-documents"
      onChange={(e) => handleInputChange("Legal Information", "legalDocuments", e.target.value)}
    ></textarea>
  </>
)}

{/* Digital Life */}
{currentCategory === "Digital Life" && (
  <>
    <h3>Digital Life</h3>
    <label htmlFor="social-media">Social Media Accounts:</label>
    <textarea
      id="social-media"
      onChange={(e) => handleInputChange("Digital Life", "socialMediaAccounts", e.target.value)}
    ></textarea>
    <label htmlFor="digital-footprint">Digital Footprint (e.g., blog, websites):</label>
    <textarea
      id="digital-footprint"
      onChange={(e) => handleInputChange("Digital Life", "digitalFootprint", e.target.value)}
    ></textarea>
  </>
)}

{/* Assets */}
{currentCategory === "Assets" && (
  <>
    <h3>Assets</h3>
    <label htmlFor="real-estate">Real Estate:</label>
    <textarea
      id="real-estate"
      onChange={(e) => handleInputChange("Assets", "realEstate", e.target.value)}
    ></textarea>
    <label htmlFor="vehicles">Vehicles:</label>
    <textarea
      id="vehicles"
      onChange={(e) => handleInputChange("Assets", "vehicles", e.target.value)}
    ></textarea>
  </>
)}

{/* Social Connections */}
{currentCategory === "Social Connections" && (
  <>
    <h3>Social Connections</h3>
    <label htmlFor="close-friends">Close Friends:</label>
    <textarea
      id="close-friends"
      onChange={(e) => handleInputChange("Social Connections", "closeFriends", e.target.value)}
    ></textarea>
    <label htmlFor="networks">Professional and Social Networks:</label>
    <textarea
      id="networks"
      onChange={(e) => handleInputChange("Social Connections", "networks", e.target.value)}
    ></textarea>
  </>
)}

{/* Spiritual Life */}
{currentCategory === "Spiritual Life" && (
  <>
    <h3>Spiritual Life</h3>
    <label htmlFor="religion">Religion:</label>
    <input
      type="text"
      id="religion"
      onChange={(e) => handleInputChange("Spiritual Life", "religion", e.target.value)}
    />
    <label htmlFor="beliefs">Beliefs and Practices:</label>
    <textarea
      id="beliefs"
      onChange={(e) => handleInputChange("Spiritual Life", "beliefs", e.target.value)}
    ></textarea>
  </>
)}

{/* Volunteer Work */}
{currentCategory === "Volunteer Work" && (
  <>
    <h3>Volunteer Work</h3>
    <label htmlFor="organizations">Organizations You've Volunteered With:</label>
    <textarea
      id="organizations"
      onChange={(e) => handleInputChange("Volunteer Work", "organizations", e.target.value)}
    ></textarea>
    <label htmlFor="hours-volunteered">Hours Volunteered:</label>
    <input
      type="number"
      id="hours-volunteered"
      onChange={(e) => handleInputChange("Volunteer Work", "hoursVolunteered", e.target.value)}
    />
  </>
)}

{/* Language Proficiency */}
{currentCategory === "Language Proficiency" && (
  <>
    <h3>Language Proficiency</h3>
    <label htmlFor="languages-spoken">Languages Spoken:</label>
    <textarea
      id="languages-spoken"
      onChange={(e) => handleInputChange("Language Proficiency", "languagesSpoken", e.target.value)}
    ></textarea>
    <label htmlFor="fluency">Fluency Level:</label>
    <select
      id="fluency"
      onChange={(e) => handleInputChange("Language Proficiency", "fluencyLevel", e.target.value)}
    >
      <option value="">Select Fluency Level</option>
      <option value="Basic">Basic</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Fluent">Fluent</option>
      <option value="Native">Native</option>
    </select>
  </>
)}

{/* Skills & Talents */}
{currentCategory === "Skills & Talents" && (
  <>
    <h3>Skills & Talents</h3>
    <label htmlFor="skills">List of Skills:</label>
    <textarea
      id="skills"
      onChange={(e) => handleInputChange("Skills & Talents", "skillsList", e.target.value)}
    ></textarea>
    <label htmlFor="talents">Talents:</label>
    <textarea
      id="talents"
      onChange={(e) => handleInputChange("Skills & Talents", "talents", e.target.value)}
    ></textarea>
  </>
)}

{/* Political Views */}
{currentCategory === "Political Views" && (
  <>
    <h3>Political Views</h3>
    <label htmlFor="political-affiliation">Political Affiliation:</label>
    <input
      type="text"
      id="political-affiliation"
      onChange={(e) => handleInputChange("Political Views", "politicalAffiliation", e.target.value)}
    />
    <label htmlFor="issues">Key Political Issues Important to You:</label>
    <textarea
      id="issues"
      onChange={(e) => handleInputChange("Political Views", "keyIssues", e.target.value)}
    ></textarea>
  </>
)}

{/* Personal Goals */}
{currentCategory === "Personal Goals" && (
  <>
    <h3>Personal Goals</h3>
    <label htmlFor="short-term-goals">Short-Term Goals:</label>
    <textarea
      id="short-term-goals"
      onChange={(e) => handleInputChange("Personal Goals", "shortTermGoals", e.target.value)}
    ></textarea>
    <label htmlFor="long-term-goals">Long-Term Goals:</label>
    <textarea
      id="long-term-goals"
      onChange={(e) => handleInputChange("Personal Goals", "longTermGoals", e.target.value)}
    ></textarea>
  </>
)}

{/* Personality & Traits */}
{currentCategory === "Personality & Traits" && (
  <>
    <h3>Personality & Traits</h3>
    <label htmlFor="personality-type">Personality Type (e.g., Myers-Briggs):</label>
    <input
      type="text"
      id="personality-type"
      onChange={(e) => handleInputChange("Personality & Traits", "personalityType", e.target.value)}
    />
    <label htmlFor="strengths">Personal Strengths:</label>
    <textarea
      id="strengths"
      onChange={(e) => handleInputChange("Personality & Traits", "strengths", e.target.value)}
    ></textarea>
    <label htmlFor="weaknesses">Personal Weaknesses:</label>
    <textarea
      id="weaknesses"
      onChange={(e) => handleInputChange("Personality & Traits", "weaknesses", e.target.value)}
    ></textarea>
  </>
)}

{/* Pets */}
{currentCategory === "Pets" && (
  <>
    <h3>Pets</h3>
    <label htmlFor="pet-type">Type of Pet:</label>
    <input
      type="text"
      id="pet-type"
      onChange={(e) => handleInputChange("Pets", "petType", e.target.value)}
    />
    <label htmlFor="pet-name">Pet Name:</label>
    <input
      type="text"
      id="pet-name"
      onChange={(e) => handleInputChange("Pets", "petName", e.target.value)}
    />
    <label htmlFor="pet-age">Pet Age:</label>
    <input
      type="number"
      id="pet-age"
      onChange={(e) => handleInputChange("Pets", "petAge", e.target.value)}
    />
  </>
)}
    {/* Dietary Preferences */}
    {currentCategory === "Dietary Preferences" && (
      <>
        <h3>Dietary Preferences</h3>
        <label htmlFor="diet-type">Diet Type (e.g., Vegetarian, Vegan, etc.):</label>
        <input
          type="text"
          id="diet-type"
          onChange={(e) => handleInputChange("Dietary Preferences", "dietType", e.target.value)}
        />
        <label htmlFor="food-allergies">Food Allergies:</label>
        <textarea
          id="food-allergies"
          onChange={(e) => handleInputChange("Dietary Preferences", "foodAllergies", e.target.value)}
        ></textarea>
        <label htmlFor="favorite-foods">Favorite Foods:</label>
        <textarea
          id="favorite-foods"
          onChange={(e) => handleInputChange("Dietary Preferences", "favoriteFoods", e.target.value)}
        ></textarea>
      </>
    )}

    {/* Achievements */}
    {currentCategory === "Achievements" && (
      <>
        <h3>Achievements</h3>
        <label htmlFor="personal-achievements">Personal Achievements:</label>
        <textarea
          id="personal-achievements"
          onChange={(e) => handleInputChange("Achievements", "personalAchievements", e.target.value)}
        ></textarea>
        <label htmlFor="professional-achievements">Professional Achievements:</label>
        <textarea
          id="professional-achievements"
          onChange={(e) => handleInputChange("Achievements", "professionalAchievements", e.target.value)}
        ></textarea>
      </>
    )}

    {/* Relationships */}
    {currentCategory === "Relationships" && (
      <>
        <h3>Relationships</h3>
        <label htmlFor="current-relationship-status">Current Relationship Status:</label>
        <select
          id="current-relationship-status"
          onChange={(e) => handleInputChange("Relationships", "relationshipStatus", e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="Single">Single</option>
          <option value="In a relationship">In a relationship</option>
          <option value="Engaged">Engaged</option>
          <option value="Married">Married</option>
        </select>
        <label htmlFor="past-relationships">Past Relationships:</label>
        <textarea
          id="past-relationships"
          onChange={(e) => handleInputChange("Relationships", "pastRelationships", e.target.value)}
        ></textarea>
      </>
    )}

    {/* Future Aspirations */}
    {currentCategory === "Future Aspirations" && (
      <>
        <h3>Future Aspirations</h3>
        <label htmlFor="career-goals">Career Goals:</label>
        <textarea
          id="career-goals"
          onChange={(e) => handleInputChange("Future Aspirations", "careerGoals", e.target.value)}
        ></textarea>
        <label htmlFor="life-goals">Life Goals:</label>
        <textarea
          id="life-goals"
          onChange={(e) => handleInputChange("Future Aspirations", "lifeGoals", e.target.value)}
        ></textarea>
      </>
    )}

    {/* Charitable Giving */}
    {currentCategory === "Charitable Giving" && (
      <>
        <h3>Charitable Giving</h3>
        <label htmlFor="charities-supported">Charities Supported:</label>
        <textarea
          id="charities-supported"
          onChange={(e) => handleInputChange("Charitable Giving", "charitiesSupported", e.target.value)}
        ></textarea>
        <label htmlFor="donation-amount">Annual Donation Amount:</label>
        <input
          type="number"
          id="donation-amount"
          onChange={(e) => handleInputChange("Charitable Giving", "donationAmount", e.target.value)}
        />
      </>
    )}

    {/* Communication Preferences */}
    {currentCategory === "Communication Preferences" && (
      <>
        <h3>Communication Preferences</h3>
        <label htmlFor="preferred-method">Preferred Method of Communication:</label>
        <select
          id="preferred-method"
          onChange={(e) => handleInputChange("Communication Preferences", "preferredMethod", e.target.value)}
        >
          <option value="">Select Method</option>
          <option value="Email">Email</option>
          <option value="Phone">Phone</option>
          <option value="Text">Text</option>
          <option value="In-Person">In-Person</option>
        </select>
        <label htmlFor="best-time">Best Time to Reach:</label>
        <input
          type="text"
          id="best-time"
          onChange={(e) => handleInputChange("Communication Preferences", "bestTime", e.target.value)}
        />
      </>
    )}

    {/* Media Preferences */}
    {currentCategory === "Media Preferences" && (
      <>
        <h3>Media Preferences</h3>
        <label htmlFor="favorite-books">Favorite Books:</label>
        <textarea
          id="favorite-books"
          onChange={(e) => handleInputChange("Media Preferences", "favoriteBooks", e.target.value)}
        ></textarea>
        <label htmlFor="favorite-movies">Favorite Movies:</label>
        <textarea
          id="favorite-movies"
          onChange={(e) => handleInputChange("Media Preferences", "favoriteMovies", e.target.value)}
        ></textarea>
        <label htmlFor="favorite-music">Favorite Music Genres:</label>
        <textarea
          id="favorite-music"
          onChange={(e) => handleInputChange("Media Preferences", "favoriteMusic", e.target.value)}
        ></textarea>
      </>
    )}

    {/* Environmental Preferences */}
    {currentCategory === "Environmental Preferences" && (
      <>
        <h3>Environmental Preferences</h3>
        <label htmlFor="carbon-footprint">Efforts to Reduce Carbon Footprint:</label>
        <textarea
          id="carbon-footprint"
          onChange={(e) => handleInputChange("Environmental Preferences", "carbonFootprintEfforts", e.target.value)}
        ></textarea>
        <label htmlFor="recycling">Recycling Habits:</label>
        <textarea
          id="recycling"
          onChange={(e) => handleInputChange("Environmental Preferences", "recyclingHabits", e.target.value)}
        ></textarea>
        <label htmlFor="sustainability">Sustainability Practices:</label>
        <textarea
          id="sustainability"
          onChange={(e) => handleInputChange("Environmental Preferences", "sustainabilityPractices", e.target.value)}
        ></textarea>
      </>
    )}



      <div className="navigation-buttons">
        <button onClick={handlePrevCategory} disabled={currentCategoryIndex === 0}>
          Previous
        </button>
        {currentCategoryIndex < categories.length - 1 ? (
          <button onClick={handleNextCategory}>Next</button>
        ) : (
          <button onClick={() => console.log("Profile Submitted: ", profileData)}>
            Submit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default CompleteProfile;
