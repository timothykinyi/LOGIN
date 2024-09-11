import React, { useState } from 'react';
import './styles/EmploymentForm.css';

const EmploymentForm = () => {
  const [jobEntries, setJobEntries] = useState([
    { id: Date.now(), jobTitle: '', employer: '', jobCategory: '', startDate: '', endDate: '', skills: '' }
  ]);
  const [errors, setErrors] = useState({});

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setJobEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, [name]: value } : entry
      )
    );
  };

  const handleAddEntry = () => {
    setJobEntries([...jobEntries, { id: Date.now(), jobTitle: '', employer: '', jobCategory: '', startDate: '', endDate: '', skills: '' }]);
  };

  const handleRemoveEntry = (id) => {
    setJobEntries(jobEntries.filter(entry => entry.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    jobEntries.forEach(entry => {
      if (!entry.jobTitle) newErrors[`jobTitle${entry.id}`] = 'Job title is required';
      if (!entry.employer) newErrors[`employer${entry.id}`] = 'Employer is required';
      if (!entry.jobCategory) newErrors[`jobCategory${entry.id}`] = 'Job category is required';
      if (!entry.startDate) newErrors[`startDate${entry.id}`] = 'Start date is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedEntries = jobEntries.map(entry => ({
        ...entry,
        endDate: entry.endDate || 'Continuing' // Marking end date as "Continuing" if empty
      }));
      console.log('Employment data submitted:', updatedEntries);
    }
  };

  return (
    <form className="employment-form" onSubmit={handleSubmit}>
      <h2>Employment History</h2>

      {jobEntries.map((entry) => (
        <div key={entry.id} className="job-entry">
          <h3>Job Entry {jobEntries.indexOf(entry) + 1}</h3>

          <div className="form-group">
            <label>Job Title:</label>
            <input
              type="text"
              name="jobTitle"
              value={entry.jobTitle}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`jobTitle${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`jobTitle${entry.id}`] && <small className="error-message">{errors[`jobTitle${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Employer:</label>
            <input
              type="text"
              name="employer"
              value={entry.employer}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`employer${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`employer${entry.id}`] && <small className="error-message">{errors[`employer${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Job Category:</label>
            <select
              name="jobCategory"
              value={entry.jobCategory}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`jobCategory${entry.id}`] ? 'error' : ''}
              required
            >
              <option value="">Select Job Category</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
              <option value="Other">Other</option>
            </select>
            {errors[`jobCategory${entry.id}`] && <small className="error-message">{errors[`jobCategory${entry.id}`]}</small>}
          </div>

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
            />
          </div>

          <div className="form-group">
            <label>Skills Acquired:</label>
            <input
              type="text"
              name="skills"
              value={entry.skills}
              onChange={(e) => handleChange(entry.id, e)}
            />
          </div>

          <button type="button" onClick={() => handleRemoveEntry(entry.id)} className="remove-entry">
            Remove This Entry
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddEntry} className="add-entry">
        Add Another Job Entry
      </button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default EmploymentForm;