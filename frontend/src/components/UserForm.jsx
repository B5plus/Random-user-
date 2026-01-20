import { useState } from 'react';
import './UserForm.css';
import API_URL from '../config/api';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp_phone: '',
    department: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Player registered successfully! 🎉'
        });
        // Reset form
        setFormData({
          name: '',
          whatsapp_phone: '',
          department: ''
        });
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to register player'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please make sure the backend server is running.'
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-content">
          <h1 className="form-title">Player Registration</h1>
          <p className="form-subtitle">Join Our Team Today</p>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp_phone">
              WhatsApp Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="whatsapp_phone"
              name="whatsapp_phone"
              value={formData.whatsapp_phone}
              onChange={handleChange}
              placeholder="+1234567890"
              required
              disabled={loading}
            />
            <small className="form-hint">Include country code (e.g., +1 for US)</small>
          </div>

          <div className="form-group">
            <label htmlFor="department">
              Department <span className="required">*</span>
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter your department"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

