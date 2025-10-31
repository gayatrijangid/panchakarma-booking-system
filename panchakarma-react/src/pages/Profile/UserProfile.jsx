import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User, Phone, Mail, MapPin, Calendar, Camera, Save, Edit, Shield, MessageCircle, Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }
`;

const ProfileHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarSection = styled.div`
  position: relative;
  
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: bold;
    border: 4px solid rgba(255, 255, 255, 0.3);
  }
  
  .camera-button {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background: #007a5f;
    border: 3px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #005a45;
      transform: scale(1.1);
    }
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  
  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  .role {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    margin-bottom: 1rem;
  }
  
  .quick-info {
    display: flex;
    gap: 2rem;
    opacity: 0.9;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
`;

const TabsContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TabsList = styled.div`
  display: flex;
  background: #f8f9fa;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#007a5f' : '#666'};
  border-radius: 8px;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  input, textarea {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #007a5f;
    }
    
    &:disabled {
      background: #f8f9fa;
      color: #666;
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .hint {
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.25rem;
  }
`;

const WhatsAppSection = styled.div`
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  
  h3 {
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    margin: 0 0 1rem 0;
    opacity: 0.9;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .feature {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
`;

const SecuritySection = styled.div`
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 1rem;
    
    .security-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .icon {
        width: 40px;
        height: 40px;
        background: rgba(0, 122, 95, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #007a5f;
      }
      
      .details {
        h4 {
          margin: 0 0 0.25rem 0;
          color: #333;
        }
        
        p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.variant === 'outline' ? 'white' : '#007a5f'};
  color: ${props => props.variant === 'outline' ? '#007a5f' : 'white'};
  border: 2px solid #007a5f;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.variant === 'outline' ? '#007a5f' : '#005a45'};
    color: white;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    emergencyContact: ''
  });
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        emergencyContact: user.emergencyContact || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3002/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user);
        setEditing(false);
        toast.success('Profile updated successfully!');
        
        // Send WhatsApp notification if phone number was added/updated
        if (profile.phone && profile.phone !== user.phone) {
          await sendWhatsAppWelcome();
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsAppWelcome = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/whatsapp/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: profile.phone,
          message: `🌿 Welcome to Niramay Panchakarma, ${profile.name}! 

Your WhatsApp notifications are now active. You'll receive:
✅ Appointment confirmations
✅ Reminder notifications  
✅ Important updates
✅ Wellness tips

Thank you for choosing us for your wellness journey! 🙏`
        })
      });

      if (response.ok) {
        toast.success('WhatsApp notifications activated! Check your phone 📱');
      }
    } catch (error) {
      console.error('WhatsApp notification error:', error);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Not provided';
    return phone.startsWith('+') ? phone : `+91-${phone}`;
  };

  return (
    <Container>
      <ProfileHeader>
        <ProfileHeaderContent>
          <AvatarSection>
            <div className="avatar">
              {getInitials(user?.name)}
            </div>
            <div className="camera-button">
              <Camera size={16} />
            </div>
          </AvatarSection>
          
          <ProfileInfo>
            <h1>{user?.name || 'User'}</h1>
            <div className="role">
              {user?.role || 'Patient'} Account
            </div>
            <div className="quick-info">
              <div className="info-item">
                <Mail size={16} />
                {user?.email}
              </div>
              <div className="info-item">
                <Phone size={16} />
                {formatPhoneNumber(user?.phone)}
              </div>
              <div className="info-item">
                <Calendar size={16} />
                Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
              </div>
            </div>
          </ProfileInfo>
        </ProfileHeaderContent>
      </ProfileHeader>

      <TabsContainer>
        <TabsList>
          <Tab 
            active={activeTab === 'personal'} 
            onClick={() => setActiveTab('personal')}
          >
            <User size={16} />
            Personal Info
          </Tab>
          <Tab 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          >
            <MessageCircle size={16} />
            WhatsApp Settings
          </Tab>
          <Tab 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} />
            Security
          </Tab>
        </TabsList>

        <TabContent>
          {activeTab === 'personal' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Personal Information</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setEditing(!editing)}
                >
                  <Edit size={16} />
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <FormGrid>
                <FormGroup>
                  <label>
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editing}
                    placeholder="Enter your full name"
                  />
                </FormGroup>

                <FormGroup>
                  <label>
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editing}
                    placeholder="Enter your email"
                  />
                </FormGroup>

                <FormGroup>
                  <label>
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editing}
                    placeholder="Enter your phone number"
                  />
                  <div className="hint">
                    📱 Required for WhatsApp notifications and appointment reminders
                  </div>
                </FormGroup>

                <FormGroup>
                  <label>
                    <Calendar size={16} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!editing}
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>
                    <MapPin size={16} />
                    Address
                  </label>
                  <textarea
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!editing}
                    placeholder="Enter your complete address"
                  />
                </FormGroup>

                <FormGroup>
                  <label>
                    <Phone size={16} />
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={profile.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    disabled={!editing}
                    placeholder="Emergency contact number"
                  />
                </FormGroup>
              </FormGrid>

              {editing && (
                <ButtonGroup>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </ButtonGroup>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2>WhatsApp Notifications</h2>
              
              <WhatsAppSection>
                <h3>
                  <MessageCircle size={20} />
                  WhatsApp Integration Active
                </h3>
                <p>Stay updated with instant notifications on your WhatsApp!</p>
                
                <div className="features">
                  <div className="feature">
                    <CheckCircle size={16} />
                    Appointment confirmations
                  </div>
                  <div className="feature">
                    <Bell size={16} />
                    Reminder notifications
                  </div>
                  <div className="feature">
                    <Calendar size={16} />
                    Schedule updates
                  </div>
                  <div className="feature">
                    <User size={16} />
                    Doctor assignments
                  </div>
                </div>
              </WhatsAppSection>

              <FormGroup>
                <label>
                  <Phone size={16} />
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your WhatsApp number"
                />
                <div className="hint">
                  This number will receive appointment notifications and updates
                </div>
              </FormGroup>

              <ButtonGroup>
                <Button onClick={sendWhatsAppWelcome} disabled={!profile.phone}>
                  <MessageCircle size={16} />
                  Test WhatsApp Notification
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save size={16} />
                  Save Settings
                </Button>
              </ButtonGroup>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2>Security Settings</h2>
              
              <SecuritySection>
                <div className="security-item">
                  <div className="security-info">
                    <div className="icon">
                      <Shield size={20} />
                    </div>
                    <div className="details">
                      <h4>Password</h4>
                      <p>Last changed 30 days ago</p>
                    </div>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <div className="icon">
                      <Phone size={20} />
                    </div>
                    <div className="details">
                      <h4>Two-Factor Authentication</h4>
                      <p>Secure your account with SMS verification</p>
                    </div>
                  </div>
                  <Button variant="outline">Setup 2FA</Button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <div className="icon">
                      <Bell size={20} />
                    </div>
                    <div className="details">
                      <h4>Login Alerts</h4>
                      <p>Get notified of suspicious login attempts</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </SecuritySection>
            </div>
          )}
        </TabContent>
      </TabsContainer>
    </Container>
  );
};

export default UserProfile;