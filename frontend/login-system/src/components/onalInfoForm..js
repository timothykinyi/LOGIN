import React, { useState } from "react";

const PersonalInfoForm = () => {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    gender: "",
    dob: "",
    nationality: "",
    idType: "",  // Could be Passport, National ID, etc.
    idNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleNationalityChange = (e) => {
    const nationality = e.target.value;
    setPersonalInfo({ ...personalInfo, nationality });
    // Dynamically set ID type based on nationality
    if (nationality === "Kenyan") {
      setPersonalInfo({ ...personalInfo, idType: "National ID" });
    } else {
      setPersonalInfo({ ...personalInfo, idType: "Passport" });
    }
  };

  return (
    <section>
      <h2>Personal Information</h2>

      {/* Full Name */}
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={personalInfo.fullName}
        onChange={handleInputChange}
      />

      {/* Gender */}
      <select
        name="gender"
        value={personalInfo.gender}
        onChange={handleInputChange}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      {/* Date of Birth */}
      <input
        type="date"
        name="dob"
        value={personalInfo.dob}
        onChange={handleInputChange}
      />

      {/* Nationality */}
      <select
        name="nationality"
        value={personalInfo.nationality}
        onChange={handleNationalityChange}
      >
        <option value="">Select Nationality</option>
        <option value="Kenyan">Kenyan</option>
        <option value="American">American</option>
        <option value="Other">Other</option>
      </select>

      {/* ID Type and ID Number */}
      {personalInfo.nationality && (
        <>
          <input
            type="text"
            placeholder={personalInfo.idType}
            name="idNumber"
            value={personalInfo.idNumber}
            onChange={handleInputChange}
          />
        </>
      )}

      <button onClick={() => console.log(personalInfo)}>Submit</button>
    </section>
  );
};

export default PersonalInfoForm;
