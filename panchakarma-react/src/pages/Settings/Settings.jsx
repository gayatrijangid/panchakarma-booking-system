import React, { useState } from 'react';
import styled from 'styled-components';
import { Settings as SettingsIcon, User, Bell, Lock, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    color: #007a5f;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const SettingsCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  
  h2 {
    color: #333;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #007a5f;
    }
  }
  
  .help-text {
    font-size: 0.85rem;
    color: #666;
    margin-top: 0.25rem;
  }
`;

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  cursor: pointer;
  
  .toggle-info {
    .toggle-label {
      font-weight: 500;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .toggle-description {
      font-size: 0.85rem;
      color: #666;
    }
  }
  
  .toggle-control {
    position: relative;
    width: 50px;
    height: 26px;
    background: #e0e0e0;
    border-radius: 13px;
    transition: background 0.3s ease;
    
    &.active {
      background: #007a5f;
    }
    
    .toggle-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 22px;
      height: 22px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
      
      &.active {
        transform: translateX(24px);
      }
    }
  }
  
  input {
    display: none;
  }
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  background: ${props => props.variant === 'outline' ? 'white' : '#007a5f'};
  color: ${props => props.variant === 'outline' ? '#007a5f' : 'white'};
  border: 2px solid #007a5f;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.variant === 'outline' ? '#007a5f' : '#005a45'};
    color: white;
  }
`;

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    newsletterSubscription: false,
    language: 'en',
    timezone: 'Asia/Kolkata'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // Save settings logic
    toast.success('Settings saved successfully!');
  };

  return (
    <Container>
      <Header>
        <h1>
          <SettingsIcon size={32} />
          Settings
        </h1>
        <p>Manage your account preferences and notification settings</p>
      </Header>

      <SettingsCard>
        <h2>
          <Bell size={24} />
          Notifications
        </h2>
        
        <ToggleSwitch>
          <div className="toggle-info">
            <div className="toggle-label">Email Notifications</div>
            <div className="toggle-description">Receive email updates about your appointments</div>
          </div>
          <div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            <div className={`toggle-control ${settings.emailNotifications ? 'active' : ''}`}>
              <div className={`toggle-thumb ${settings.emailNotifications ? 'active' : ''}`} />
            </div>
          </div>
        </ToggleSwitch>

        <ToggleSwitch>
          <div className="toggle-info">
            <div className="toggle-label">SMS Notifications</div>
            <div className="toggle-description">Get SMS reminders for upcoming appointments</div>
          </div>
          <div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={() => handleToggle('smsNotifications')}
            />
            <div className={`toggle-control ${settings.smsNotifications ? 'active' : ''}`}>
              <div className={`toggle-thumb ${settings.smsNotifications ? 'active' : ''}`} />
            </div>
          </div>
        </ToggleSwitch>

        <ToggleSwitch>
          <div className="toggle-info">
            <div className="toggle-label">Appointment Reminders</div>
            <div className="toggle-description">Get reminded 24 hours before your appointment</div>
          </div>
          <div>
            <input
              type="checkbox"
              checked={settings.appointmentReminders}
              onChange={() => handleToggle('appointmentReminders')}
            />
            <div className={`toggle-control ${settings.appointmentReminders ? 'active' : ''}`}>
              <div className={`toggle-thumb ${settings.appointmentReminders ? 'active' : ''}`} />
            </div>
          </div>
        </ToggleSwitch>

        <ToggleSwitch>
          <div className="toggle-info">
            <div className="toggle-label">Newsletter</div>
            <div className="toggle-description">Stay updated with health tips and wellness news</div>
          </div>
          <div>
            <input
              type="checkbox"
              checked={settings.newsletterSubscription}
              onChange={() => handleToggle('newsletterSubscription')}
            />
            <div className={`toggle-control ${settings.newsletterSubscription ? 'active' : ''}`}>
              <div className={`toggle-thumb ${settings.newsletterSubscription ? 'active' : ''}`} />
            </div>
          </div>
        </ToggleSwitch>
      </SettingsCard>

      <SettingsCard>
        <h2>
          <Globe size={24} />
          Preferences
        </h2>
        
        <FormGroup>
          <label>Language</label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
          </select>
          <div className="help-text">Used for scheduling appointments</div>
        </FormGroup>
      </SettingsCard>

      <SettingsCard>
        <h2>
          <Lock size={24} />
          Security
        </h2>
        
        <FormGroup>
          <label>Current Password</label>
          <input type="password" placeholder="Enter current password" />
        </FormGroup>

        <FormGroup>
          <label>New Password</label>
          <input type="password" placeholder="Enter new password" />
        </FormGroup>

        <FormGroup>
          <label>Confirm New Password</label>
          <input type="password" placeholder="Confirm new password" />
        </FormGroup>

        <Button variant="outline">Update Password</Button>
      </SettingsCard>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Container>
  );
};

export default Settings;
