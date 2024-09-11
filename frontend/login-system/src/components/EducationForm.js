import React, { useState } from 'react';
import './styles/EducationForm.css';

const EducationForm = () => {
  const [educationEntries, setEducationEntries] = useState([
    { id: 1, educationLevel: '', institutionName: '', degreeType: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', country: '', transferDetails: '' }
  ]);
  const [errors, setErrors] = useState({});

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setEducationEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, [name]: value } : entry
      )
    );
  };

  const handleAddEntry = () => {
    setEducationEntries([...educationEntries, { id: Date.now(), educationLevel: '', institutionName: '', degreeType: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', country: '', transferDetails: '' }]);
  };

  const handleRemoveEntry = (id) => {
    setEducationEntries(educationEntries.filter(entry => entry.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    educationEntries.forEach((entry) => {
      if (!entry.educationLevel) newErrors[`educationLevel${entry.id}`] = 'Education level is required';
      if (!entry.institutionName) newErrors[`institutionName${entry.id}`] = 'Institution name is required';
      if ((entry.educationLevel === 'Kindergarten' || entry.educationLevel === 'Primary School' || entry.educationLevel === 'Secondary School') && (entry.degreeType || entry.degree || entry.fieldOfStudy)) {
        newErrors[`degreeType${entry.id}`] = 'Degree fields should be empty for this education level';
      }
      if (entry.educationLevel !== 'Kindergarten' && entry.educationLevel !== 'Primary School' && entry.educationLevel !== 'Secondary School' && !entry.degreeType) newErrors[`degreeType${entry.id}`] = 'Degree type is required';
      if (entry.educationLevel !== 'Kindergarten' && entry.educationLevel !== 'Primary School' && entry.educationLevel !== 'Secondary School' && !entry.degree) newErrors[`degree${entry.id}`] = 'Degree is required';
      if (entry.educationLevel !== 'Kindergarten' && entry.educationLevel !== 'Primary School' && entry.educationLevel !== 'Secondary School' && !entry.fieldOfStudy) newErrors[`fieldOfStudy${entry.id}`] = 'Field of study is required';
      if (!entry.startDate) newErrors[`startDate${entry.id}`] = 'Start date is required';
      if (!entry.endDate) newErrors[`endDate${entry.id}`] = 'End date is required';
      if (!entry.country) newErrors[`country${entry.id}`] = 'Country is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Education data submitted:', educationEntries);
    }
  };

  return (
    <form className="education-form" onSubmit={handleSubmit}>
      <h2>Education Information</h2>

      {educationEntries.map((entry) => (
        <div key={entry.id} className="education-entry">
          <h3>Education Entry {educationEntries.indexOf(entry) + 1}</h3>

          <div className="form-group">
            <label>Education Level:</label>
            <select
              name="educationLevel"
              value={entry.educationLevel}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`educationLevel${entry.id}`] ? 'error' : ''}
              required
            >
              <option value="">Select Education Level</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="Primary School">Primary School</option>
              <option value="Secondary School">Secondary School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Other">Other</option>
            </select>
            {errors[`educationLevel${entry.id}`] && <small className="error-message">{errors[`educationLevel${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Institution Name:</label>
            <input
              type="text"
              name="institutionName"
              value={entry.institutionName}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`institutionName${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`institutionName${entry.id}`] && <small className="error-message">{errors[`institutionName${entry.id}`]}</small>}
          </div>

          {(entry.educationLevel === 'Undergraduate' || entry.educationLevel === 'Postgraduate' || entry.educationLevel === 'Other') && (
            <>
              <div className="form-group">
                <label>Degree Type:</label>
                <select
                  name="degreeType"
                  value={entry.degreeType}
                  onChange={(e) => handleChange(entry.id, e)}
                  className={errors[`degreeType${entry.id}`] ? 'error' : ''}
                  required
                >
                  <option value="">Select Degree Type</option>
                  <option value="Degree">Degree</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Other">Other</option>
                </select>
                {errors[`degreeType${entry.id}`] && <small className="error-message">{errors[`degreeType${entry.id}`]}</small>}
              </div>

              <div className="form-group">
                <label>Degree:</label>
                <input
                  type="text"
                  name="degree"
                  value={entry.degree}
                  onChange={(e) => handleChange(entry.id, e)}
                  className={errors[`degree${entry.id}`] ? 'error' : ''}
                  required
                />
                {errors[`degree${entry.id}`] && <small className="error-message">{errors[`degree${entry.id}`]}</small>}
              </div>

              <div className="form-group">
                <label>Field of Study:</label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={entry.fieldOfStudy}
                  onChange={(e) => handleChange(entry.id, e)}
                  className={errors[`fieldOfStudy${entry.id}`] ? 'error' : ''}
                  required
                />
                {errors[`fieldOfStudy${entry.id}`] && <small className="error-message">{errors[`fieldOfStudy${entry.id}`]}</small>}
              </div>
            </>
          )}

          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={entry.startDate}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`startDate${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`startDate${entry.id}`] && <small className="error-message">{errors[`startDate${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={entry.endDate}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`endDate${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`endDate${entry.id}`] && <small className="error-message">{errors[`endDate${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={entry.country}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`country${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`country${entry.id}`] && <small className="error-message">{errors[`country${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Transfer Details (if any):</label>
            <textarea
              name="transferDetails"
              value={entry.transferDetails}
              onChange={(e) => handleChange(entry.id, e)}
            />
          </div>

          <button type="button" onClick={() => handleRemoveEntry(entry.id)} className="remove-entry">
            Remove This Entry
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddEntry} className="add-entry">
        Add Another Education Entry
      </button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default EducationForm;
