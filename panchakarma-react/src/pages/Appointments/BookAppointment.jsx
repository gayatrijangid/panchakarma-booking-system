import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, MapPin, Phone, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: #007a5f;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  
  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.active ? '#007a5f' : props.completed ? '#28a745' : '#e0e0e0'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 1rem;
  }
  
  .step-title {
    color: ${props => props.active ? '#007a5f' : '#666'};
    font-weight: ${props => props.active ? 'bold' : 'normal'};
  }
  
  &:not(:last-child) {
    margin-right: 3rem;
    
    &::after {
      content: '';
      width: 50px;
      height: 2px;
      background: #e0e0e0;
      margin-left: 1rem;
    }
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const TherapyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TherapyCard = styled.div`
  border: 2px solid ${props => props.selected ? '#007a5f' : '#e0e0e0'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? 'rgba(0, 122, 95, 0.05)' : 'white'};
  
  &:hover {
    border-color: #007a5f;
    transform: translateY(-2px);
  }
  
  .therapy-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .therapy-description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .therapy-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .duration {
      color: #007a5f;
      font-weight: 500;
    }
    
    .price {
      color: #333;
      font-size: 1.1rem;
      font-weight: bold;
    }
  }
`;

const DateTimeSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #007a5f;
    }
  }
  
  textarea {
    height: 100px;
    resize: vertical;
  }
`;

const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
`;

const TimeSlot = styled.button`
  padding: 0.75rem;
  border: 2px solid ${props => props.selected ? '#007a5f' : '#e0e0e0'};
  border-radius: 8px;
  background: ${props => props.selected ? '#007a5f' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #007a5f;
    background: ${props => props.selected ? '#005a45' : 'rgba(0, 122, 95, 0.1)'};
  }
  
  &:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
    
    &:hover {
      border-color: #e0e0e0;
      background: #f5f5f5;
    }
  }
`;

const SummaryCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  border-left: 4px solid #007a5f;
  
  h3 {
    color: #007a5f;
    margin-bottom: 1rem;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    
    .label {
      color: #666;
    }
    
    .value {
      color: #333;
      font-weight: 500;
    }
  }
  
  .total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
    
    .value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #007a5f;
    }
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
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
  justify-content: space-between;
  margin-top: 2rem;
`;

const BookAppointment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [therapies, setTherapies] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    therapyId: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    phone: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchTherapies();
  }, []);

  const fetchTherapies = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/therapies');
      const data = await response.json();
      setTherapies(data.therapies || []);
    } catch (error) {
      console.error('Error fetching therapies:', error);
      toast.error('Failed to load therapies');
    }
  };

  const fetchAvailableSlots = async (date) => {
    if (!date) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3002/api/appointments/available-slots?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAvailableSlots(data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleTherapySelect = (therapyId) => {
    setFormData({ ...formData, therapyId });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData({ ...formData, preferredDate: date, preferredTime: '' });
    fetchAvailableSlots(date);
  };

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, preferredTime: time });
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.therapyId) {
      toast.error('Please select a therapy');
      return;
    }
    if (currentStep === 2 && (!formData.preferredDate || !formData.preferredTime)) {
      toast.error('Please select date and time');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3002/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Appointment booked successfully! 🎉');
        // Reset form or redirect
        setCurrentStep(4); // Success step
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const selectedTherapy = therapies.find(t => t.id === parseInt(formData.therapyId));
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Container>
      <Header>
        <h1>Book Your Therapy Session 🌿</h1>
        <p>Choose your preferred therapy and schedule your healing journey</p>
      </Header>

      <StepIndicator>
        <Step active={currentStep === 1} completed={currentStep > 1}>
          <div className="step-number">1</div>
          <div className="step-title">Select Therapy</div>
        </Step>
        <Step active={currentStep === 2} completed={currentStep > 2}>
          <div className="step-number">2</div>
          <div className="step-title">Choose Date & Time</div>
        </Step>
        <Step active={currentStep === 3} completed={currentStep > 3}>
          <div className="step-number">3</div>
          <div className="step-title">Confirm Details</div>
        </Step>
      </StepIndicator>

      {currentStep === 1 && (
        <FormSection>
          <h2>Select Your Therapy</h2>
          <TherapyGrid>
            {therapies.map(therapy => (
              <TherapyCard
                key={therapy.id}
                selected={formData.therapyId === therapy.id.toString()}
                onClick={() => handleTherapySelect(therapy.id.toString())}
              >
                <div className="therapy-name">{therapy.name}</div>
                <div className="therapy-description">{therapy.description}</div>
                <div className="therapy-details">
                  <div className="duration">⏱️ {therapy.duration}</div>
                  <div className="price">₹{therapy.price}</div>
                </div>
              </TherapyCard>
            ))}
          </TherapyGrid>
          
          <ButtonGroup>
            <div></div>
            <Button onClick={handleNext}>Next Step</Button>
          </ButtonGroup>
        </FormSection>
      )}

      {currentStep === 2 && (
        <FormSection>
          <h2>Select Date & Time</h2>
          <DateTimeSelector>
            <InputGroup>
              <label>Preferred Date</label>
              <input
                type="date"
                min={minDate}
                value={formData.preferredDate}
                onChange={handleDateChange}
              />
            </InputGroup>
            
            <InputGroup>
              <label>Available Time Slots</label>
              <TimeSlotGrid>
                {availableSlots.map(slot => (
                  <TimeSlot
                    key={slot}
                    selected={formData.preferredTime === slot}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    {slot}
                  </TimeSlot>
                ))}
              </TimeSlotGrid>
              {formData.preferredDate && availableSlots.length === 0 && (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  No slots available for this date. Please choose another date.
                </p>
              )}
            </InputGroup>
          </DateTimeSelector>

          <InputGroup>
            <label>Contact Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </InputGroup>

          <InputGroup>
            <label>Additional Notes (Optional)</label>
            <textarea
              placeholder="Any specific requirements or health conditions we should know about?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </InputGroup>
          
          <ButtonGroup>
            <Button variant="outline" onClick={handlePrevious}>Previous</Button>
            <Button onClick={handleNext}>Review Booking</Button>
          </ButtonGroup>
        </FormSection>
      )}

      {currentStep === 3 && (
        <FormSection>
          <h2>Confirm Your Booking</h2>
          <SummaryCard>
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <div className="label">Therapy:</div>
              <div className="value">{selectedTherapy?.name}</div>
            </div>
            <div className="summary-item">
              <div className="label">Date:</div>
              <div className="value">{formData.preferredDate}</div>
            </div>
            <div className="summary-item">
              <div className="label">Time:</div>
              <div className="value">{formData.preferredTime}</div>
            </div>
            <div className="summary-item">
              <div className="label">Duration:</div>
              <div className="value">{selectedTherapy?.duration}</div>
            </div>
            <div className="summary-item">
              <div className="label">Phone:</div>
              <div className="value">{formData.phone}</div>
            </div>
            {formData.notes && (
              <div className="summary-item">
                <div className="label">Notes:</div>
                <div className="value">{formData.notes}</div>
              </div>
            )}
            <div className="summary-item total">
              <div className="label">Total Amount:</div>
              <div className="value">₹{selectedTherapy?.price}</div>
            </div>
          </SummaryCard>
          
          <ButtonGroup>
            <Button variant="outline" onClick={handlePrevious}>Previous</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </ButtonGroup>
        </FormSection>
      )}

      {currentStep === 4 && (
        <FormSection style={{ textAlign: 'center' }}>
          <CheckCircle size={64} color="#28a745" style={{ margin: '0 auto 2rem' }} />
          <h2>Booking Confirmed! 🎉</h2>
          <p>Your therapy session has been successfully booked. You will receive a confirmation message on WhatsApp shortly.</p>
          <p>Our team will contact you 24 hours before your appointment to confirm the details.</p>
          
          <Button onClick={() => window.location.href = '/appointments'} style={{ marginTop: '2rem' }}>
            View My Appointments
          </Button>
        </FormSection>
      )}
    </Container>
  );
};

export default BookAppointment;