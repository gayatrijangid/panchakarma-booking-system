import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Leaf, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  color: white;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.1rem;

      .icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

const AuthBox = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  position: relative;

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  
  .logo-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: white;
  }
  
  span {
    font-size: 2rem;
    font-weight: bold;
    background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;

  .input-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    pointer-events: none;
  }

  .toggle-password {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #007a5f;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #007a5f;
    box-shadow: 0 0 0 4px rgba(0, 122, 95, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  border: none;
  border-radius: 15px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 122, 95, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ForgotPassword = styled(Link)`
  text-align: right;
  color: #007a5f;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: -0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e0e0e0;
  }

  span {
    color: #999;
    font-size: 0.9rem;
  }
`;

const AuthLink = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.95rem;
  margin-top: 1.5rem;
  
  a {
    color: #007a5f;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #fcc;
`;


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful! Welcome back 🌿');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AuthContainer>
      <LeftSection>
        <h1>Welcome to Niramay 🌿</h1>
        <p>
          Your trusted partner in Ayurvedic wellness and traditional Panchakarma treatments.
          Experience authentic healing therapies designed to restore balance and vitality.
        </p>
        <div className="features">
          <div className="feature-item">
            <div className="icon">✓</div>
            <span>Authentic Ayurvedic Treatments</span>
          </div>
          <div className="feature-item">
            <div className="icon">✓</div>
            <span>Expert Certified Doctors</span>
          </div>
          <div className="feature-item">
            <div className="icon">✓</div>
            <span>Personalized Wellness Plans</span>
          </div>
          <div className="feature-item">
            <div className="icon">✓</div>
            <span>WhatsApp Appointment Reminders</span>
          </div>
        </div>
      </LeftSection>

      <RightSection>
        <AuthBox>
          <Logo>
            <div className="logo-icon">
              <Leaf size={32} />
            </div>
            <span>Niramay</span>
          </Logo>
          
          <Title>Welcome Back</Title>
          <Subtitle>Login to continue your wellness journey</Subtitle>
          
          <Form onSubmit={handleSubmit}>
            {error && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {error}
              </ErrorMessage>
            )}

            <InputGroup>
              <Mail className="input-icon" size={20} />
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </InputGroup>
            
            <InputGroup>
              <Lock className="input-icon" size={20} />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </InputGroup>

            <ForgotPassword to="/forgot-password">
              Forgot Password?
            </ForgotPassword>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
              {!isLoading && <ArrowRight size={20} />}
            </Button>
          </Form>

          <AuthLink>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </AuthLink>
        </AuthBox>
      </RightSection>
    </AuthContainer>
  );
};

export default Login;