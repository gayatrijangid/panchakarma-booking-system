import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Activity, Users, Heart, Shield, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_THERAPIES } from '../types';

const LandingContainer = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  
  img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 15px;
  }
  
  span {
    font-size: 28px;
    font-weight: bold;
    color: #007a5f;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover {
      color: #007a5f;
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  .btn {
    padding: 10px 20px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &.login {
      color: #007a5f;
      border: 2px solid #007a5f;
      
      &:hover {
        background: #007a5f;
        color: white;
      }
    }
    
    &.signup {
      background: linear-gradient(135deg, #00b88a, #009970);
      color: white;
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #009970, #007a5f);
        transform: translateY(-2px);
      }
    }
  }
`;

const HeroSection = styled.section`
  height: 100vh;
  background: url('https://static.vecteezy.com/system/resources/previews/031/282/047/non_2x/green-leaves-on-a-sunny-day-ai-generated-free-photo.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 70, 50, 0.6);
  }
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
  
  h1 {
    font-size: 4rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
  
  .cta-button {
    display: inline-block;
    padding: 15px 40px;
    background: linear-gradient(135deg, #00b88a, #009970);
    color: white;
    text-decoration: none;
    border-radius: 30px;
    font-size: 1.2rem;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #009970, #007a5f);
      transform: translateY(-3px);
    }
  }
`;

const AboutSection = styled.section`
  padding: 6rem 2rem;
  background: white;
  text-align: center;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h2 {
    font-size: 3rem;
    color: #007a5f;
    margin-bottom: 2rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.2rem;
    color: #666;
    max-width: 800px;
    margin: 0 auto 3rem;
    line-height: 1.8;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 20px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
  
  .icon {
    color: #007a5f;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    color: #666;
    margin: 0;
    font-size: 1rem;
  }
`;

const TherapiesSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
  
  h2 {
    font-size: 3rem;
    color: #007a5f;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  .subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const TherapyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const TherapyCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    color: #007a5f;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  p {
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .duration {
    color: #999;
    font-size: 0.9rem;
    font-style: italic;
  }
`;

const Footer = styled.footer`
  background: #007a5f;
  color: white;
  text-align: center;
  padding: 2rem;
  
  p {
    margin: 0;
    opacity: 0.8;
  }
`;

const features = [
  {
    icon: <Calendar size={40} />,
    title: 'Smart Scheduling',
    description: 'Automated therapy scheduling with intelligent conflict detection and calendar integration'
  },
  {
    icon: <Bell size={40} />,
    title: 'Smart Notifications',
    description: 'Automated reminders and precautions sent via in-app, email, and SMS channels'
  },
  {
    icon: <Activity size={40} />,
    title: 'Real-time Tracking',
    description: 'Monitor therapy progress with detailed sessions tracking and milestone achievements'
  },
  {
    icon: <Users size={40} />,
    title: 'Comprehensive Management',
    description: 'Separate dashboards for patients, doctors, and administrators with role-based features'
  },
  {
    icon: <Heart size={40} />,
    title: 'Traditional Authenticity',
    description: 'Authentic Ayurvedic practices combined with modern digital convenience'
  },
  {
    icon: <Shield size={40} />,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security for patient data with reliable backup systems'
  }
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <LandingContainer>
      <Navbar>
        <div className="container">
          <Logo>
            <img 
              src="https://www.slideteam.net/media/catalog/product/cache/1280x720/a/y/ayurvedic_diet_panchakarma_colored_icon_in_powerpoint_pptx_png_and_editable_eps_format_slide01.jpg" 
              alt="Niramay Logo" 
            />
            <span>Niramay</span>
          </Logo>
          
          <NavLinks>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#therapies">Therapies</a>
          </NavLinks>
          
          <AuthButtons>
            <Link to="/login" className="btn login">Login</Link>
            <Link to="/signup" className="btn signup">Get Started</Link>
          </AuthButtons>
        </div>
      </Navbar>

      <HeroSection>
        <HeroContent>
          <h1>Niramay</h1>
          <p>The Complete Panchakarma Therapy Management System</p>
          <Link to="/signup" className="cta-button">Start Your Journey</Link>
        </HeroContent>
      </HeroSection>

      <AboutSection id="about">
        <div className="container">
          <h2>About Niramay</h2>
          <p>
            Niramay bridges traditional Ayurvedic wisdom with modern digital convenience. 
            Our comprehensive platform simplifies therapy scheduling, patient tracking, and 
            wellness management for both patients and practitioners, making authentic 
            Panchakarma therapy accessible and efficient.
          </p>
          
          <FeaturesGrid id="features">
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <div className="icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </div>
      </AboutSection>

      <TherapiesSection id="therapies">
        <div className="container">
          <h2>Our Panchakarma Therapies</h2>
          <p className="subtitle">
            Panchakarma — "Five Actions" — is the essence of Ayurvedic purification and rejuvenation. 
            These therapies aim to cleanse toxins, balance energies, and restore holistic health.
          </p>
          
          <TherapyGrid>
            {DEFAULT_THERAPIES.map((therapy) => (
              <TherapyCard key={therapy.id}>
                <h3>{therapy.name}</h3>
                <p>{therapy.description}</p>
                <p className="duration">{therapy.duration} minutes</p>
              </TherapyCard>
            ))}
          </TherapyGrid>
        </div>
      </TherapiesSection>

      <Footer>
        <p>&copy; 2025 Niramay. All Rights Reserved.</p>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;