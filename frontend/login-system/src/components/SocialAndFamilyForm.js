import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SocialAndFamilyForm.css';

const SocialAndFamilyForm = () => {
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');
  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token)
      {
        navigate('/');
        return;
      }
    },[navigate]);

  const [maritalStatus, setMaritalStatus] = useState('');
  const [familyMembers, setFamilyMembers] = useState([
    { id: Date.now(), name: '', relationship: '' }
  ]);
  const [dependents, setDependents] = useState([
    { id: Date.now(), name: '', relationship: '' }
  ]);
  const [socialAffiliations, setSocialAffiliations] = useState([
    { id: Date.now(), organization: '', role: '' }
  ]);
  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState('');

  const handleMaritalStatusChange = (e) => {
    setMaritalStatus(e.target.value);
  };

  const handleFamilyMemberChange = (id, e) => {
    const { name, value } = e.target;
    setFamilyMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id ? { ...member, [name]: value } : member
      )
    );
  };

  const handleAddFamilyMember = () => {
    setFamilyMembers([...familyMembers, { id: Date.now(), name: '', relationship: '' }]);
  };

  const handleRemoveFamilyMember = (id) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const handleDependentChange = (id, e) => {
    const { name, value } = e.target;
    setDependents(prevDependents =>
      prevDependents.map(dependent =>
        dependent.id === id ? { ...dependent, [name]: value } : dependent
      )
    );
  };

  const handleAddDependent = () => {
    setDependents([...dependents, { id: Date.now(), name: '', relationship: '' }]);
  };

  const handleRemoveDependent = (id) => {
    setDependents(dependents.filter(dependent => dependent.id !== id));
  };

  const handleSocialAffiliationChange = (id, e) => {
    const { name, value } = e.target;
    setSocialAffiliations(prevAffiliations =>
      prevAffiliations.map(affiliation =>
        affiliation.id === id ? { ...affiliation, [name]: value } : affiliation
      )
    );
  };

  const handleAddSocialAffiliation = () => {
    setSocialAffiliations([...socialAffiliations, { id: Date.now(), organization: '', role: '' }]);
  };

  const handleRemoveSocialAffiliation = (id) => {
    setSocialAffiliations(socialAffiliations.filter(affiliation => affiliation.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    familyMembers.forEach(member => {
      if (!member.name) newErrors[`familyName${member.id}`] = 'Name is required';
      if (!member.relationship) newErrors[`familyRelationship${member.id}`] = 'Relationship is required';
    });
    dependents.forEach(dependent => {
      if (!dependent.name) newErrors[`dependentName${dependent.id}`] = 'Name is required';
      if (!dependent.relationship) newErrors[`dependentRelationship${dependent.id}`] = 'Relationship is required';
    });
    socialAffiliations.forEach(affiliation => {
      if (!affiliation.organization) newErrors[`organization${affiliation.id}`] = 'Organization is required';
      if (!affiliation.role) newErrors[`role${affiliation.id}`] = 'Role is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = {
        eID: eID,
        maritalStatus,
        familyMembers,
        dependents,
        socialAffiliations,
      };

      try {
        const response = await axios.post('https://login-9ebe.onrender.com/api/social-family', formData); // Replace with your backend URL
        setResponseMessage(response.data.message);
      } catch (error) {
        setResponseMessage('Error submitting the form');
      }
    }
  };

  return (
    <form className="social-family-form" onSubmit={handleSubmit}>
      <h2>Social and Family Information</h2>

      <div className="form-group">
        <label>Marital Status:</label>
        <select
          value={maritalStatus}
          onChange={handleMaritalStatusChange}
          className={errors.maritalStatus ? 'error' : ''}
          required
        >
          <option value="">Select Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
        {errors.maritalStatus && <small className="error-message">{errors.maritalStatus}</small>}
      </div>

      <div className="family-members">
        <h3>Family Members</h3>
        {familyMembers.map(member => (
          <div key={member.id} className="family-member-entry">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={member.name}
                onChange={(e) => handleFamilyMemberChange(member.id, e)}
                className={errors[`familyName${member.id}`] ? 'error' : ''}
                required
              />
              {errors[`familyName${member.id}`] && <small className="error-message">{errors[`familyName${member.id}`]}</small>}
            </div>

            <div className="form-group">
              <label>Relationship:</label>
              <select
                name="relationship"
                value={member.relationship}
                onChange={(e) => handleFamilyMemberChange(member.id, e)}
                className={errors[`familyRelationship${member.id}`] ? 'error' : ''}
                required
              >
                <option value="">Select Relationship</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Spouse">Spouse</option>
                <option value="Other">Other</option>
              </select>
              {errors[`familyRelationship${member.id}`] && <small className="error-message">{errors[`familyRelationship${member.id}`]}</small>}
            </div>

            <div className="button-group">
              <button type="button" onClick={() => handleRemoveFamilyMember(member.id)} className="sign-in-btn">
                Remove This Member
              </button>
            </div>

          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={handleAddFamilyMember}className="sign-in-btn">
            Add Another Family Member
          </button>
        </div>

      </div>

      <div className="dependents">
        <h3>Dependents</h3>
        {dependents.map(dependent => (
          <div key={dependent.id} className="dependent-entry">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={dependent.name}
                onChange={(e) => handleDependentChange(dependent.id, e)}
                className={errors[`dependentName${dependent.id}`] ? 'error' : ''}
                required
              />
              {errors[`dependentName${dependent.id}`] && <small className="error-message">{errors[`dependentName${dependent.id}`]}</small>}
            </div>

            <div className="form-group">
              <label>Relationship:</label>
              <select
                name="relationship"
                value={dependent.relationship}
                onChange={(e) => handleDependentChange(dependent.id, e)}
                className={errors[`dependentRelationship${dependent.id}`] ? 'error' : ''}
                required
              >
                <option value="">Select Relationship</option>
                <option value="Child">Child</option>
                <option value="Spouse">Spouse</option>
                <option value="Other">Other</option>
              </select>
              {errors[`dependentRelationship${dependent.id}`] && <small className="error-message">{errors[`dependentRelationship${dependent.id}`]}</small>}
            </div>

            <div className="button-group">
              <button type="button" onClick={() => handleRemoveDependent(dependent.id)} className="sign-in-btn">
                Remove This Dependent
              </button>
            </div>

          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={handleAddDependent} className="sign-in-btn">
            Add Another Dependent
          </button>
        </div>

      </div>

      <div className="social-affiliations">
        <h3>Social Affiliations</h3>
        {socialAffiliations.map(affiliation => (
          <div key={affiliation.id} className="social-affiliation-entry">
            <div className="form-group">
              <label>Organization:</label>
              <input
                type="text"
                name="organization"
                value={affiliation.organization}
                onChange={(e) => handleSocialAffiliationChange(affiliation.id, e)}
                className={errors[`organization${affiliation.id}`] ? 'error' : ''}
                required
              />
              {errors[`organization${affiliation.id}`] && <small className="error-message">{errors[`organization${affiliation.id}`]}</small>}
            </div>

            <div className="form-group">
              <label>Role:</label>
              <input
                type="text"
                name="role"
                value={affiliation.role}
                onChange={(e) => handleSocialAffiliationChange(affiliation.id, e)}
                className={errors[`role${affiliation.id}`] ? 'error' : ''}
                required
              />
              {errors[`role${affiliation.id}`] && <small className="error-message">{errors[`role${affiliation.id}`]}</small>}
            </div>
            <div className="button-group">
              <button type="button" onClick={() => handleRemoveSocialAffiliation(affiliation.id)} className="sign-in-btn">
                Remove This Affiliation
              </button>
            </div>

          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={handleAddSocialAffiliation} className="sign-in-btn">
            Add Another Social Affiliation
          </button>
        </div>

      </div>
      <div className="button-group">
        <button type="submit" className="sign-in-btn">Submit</button>
      </div>

      {responseMessage && <p className="response-message">{responseMessage}</p>}
      
    </form>

  );
};

export default SocialAndFamilyForm;
