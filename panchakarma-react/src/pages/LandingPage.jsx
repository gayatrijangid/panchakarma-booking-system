import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Heart, 
  Leaf, 
  Users, 
  Star, 
  ArrowRight, 
  Calendar,
  Shield,
  Award,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

// Styled Components
const LandingContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  
  .logo-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled(Link)`
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.variant === 'outline' ? 'white' : 'transparent'};
  background: ${props => props.variant === 'outline' ? 'transparent' : 'white'};
  color: ${props => props.variant === 'outline' ? 'white' : '#007a5f'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/api/placeholder/1200/800') center/cover;
    opacity: 0.1;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.1;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const HeroButton = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.primary ? `
    background: white;
    color: #007a5f;
    
    &:hover {
      background: #f8f9fa;
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  ` : `
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: white;
      color: #007a5f;
      transform: translateY(-3px);
    }
  `}
`;

const StatsSection = styled.section`
  background: white;
  padding: 4rem 0;
  margin-top: -2rem;
  position: relative;
  z-index: 10;
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: white;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #007a5f;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: #666;
    font-weight: 500;
  }
`;

const ServicesSection = styled.section`
  padding: 6rem 0;
  background: #f8f9fa;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;

  h2 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    font-size: 1.1rem;
    color: #666;
    line-height: 1.6;
  }
`;

const ServicesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  }

  .service-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    color: white;
  }

  h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .service-features {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #555;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;

      svg {
        color: #28a745;
      }
    }
  }
`;

const Footer = styled.footer`
  background: linear-gradient(135deg, #343a40 0%, #495057 100%);
  color: white;
  padding: 4rem 0 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #00b88a;
  }

  p, a {
    color: #adb5bd;
    line-height: 1.6;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: white;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #495057;
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  color: #adb5bd;
`;

// Component
const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: <Users size={24} />, number: '5000+', label: 'Happy Patients' },
    { icon: <Heart size={24} />, number: '50+', label: 'Therapies Available' },
    { icon: <Award size={24} />, number: '15+', label: 'Years Experience' },
    { icon: <Star size={24} />, number: '4.9', label: 'Customer Rating' }
  ];

  const services = [
    {
      icon: <Leaf size={24} />,
      title: 'Panchakarma Detox',
      description: 'Complete body detoxification through traditional Panchakarma methods including specialized therapies and herbal treatments.',
      features: ['14-day program', 'Personalized treatment', 'Expert supervision', 'Dietary guidance']
    },
    {
      icon: <Heart size={24} />,
      title: 'Wellness Therapies',
      description: 'Experience authentic Ayurvedic therapies designed to restore balance and promote natural healing.',
      features: ['Abhyanga massage', 'Shirodhara treatment', 'Steam therapy', 'Herbal medicines']
    },
    {
      icon: <Users size={24} />,
      title: 'Expert Consultation',
      description: 'Get personalized health advice from certified Ayurvedic doctors with years of experience.',
      features: ['Pulse diagnosis', 'Lifestyle guidance', 'Treatment planning', 'Follow-up support']
    }
  ];

  return (
    <LandingContainer>
      <Header>
        <Nav>
          <Logo>
            <div className="logo-icon">
              <Leaf size={24} />
            </div>
            <span>Niramay</span>
          </Logo>
          
          <NavLinks>
            <NavLink to="#services">Services</NavLink>
            <NavLink to="#about">About</NavLink>
            <NavLink to="#contact">Contact</NavLink>
          </NavLinks>

          <AuthButtons>
            <Button variant="outline" to="/login">Login</Button>
            <Button to="/signup">Sign Up</Button>
          </AuthButtons>
        </Nav>
      </Header>

      <HeroSection>
        <HeroContent>
          <h1>Your Journey to Wellness Begins Here 🌿</h1>
          <p>
            Experience authentic Panchakarma treatments and Ayurvedic therapies 
            designed to restore balance, detoxify your body, and rejuvenate your mind.
          </p>
          
          <HeroButtons>
            <HeroButton primary to="/signup">
              Start Your Journey
              <ArrowRight size={20} />
            </HeroButton>
            <HeroButton to="#services">
              Explore Therapies
            </HeroButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <StatsContainer>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </StatCard>
          ))}
        </StatsContainer>
      </StatsSection>

      <ServicesSection id="services">
        <SectionHeader>
          <h2>Our Therapeutic Services</h2>
          <p>
            Discover a comprehensive range of authentic Ayurvedic treatments 
            tailored to your unique health needs and wellness goals.
          </p>
        </SectionHeader>

        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <div className="service-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircle size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesSection>

      <Footer id="contact">
        <FooterContent>
          <FooterSection>
            <h3>Niramay Panchakarma</h3>
            <p>
              Authentic Ayurvedic healing center dedicated to your wellness journey 
              through traditional Panchakarma treatments and therapies.
            </p>
          </FooterSection>
          
          <FooterSection>
            <h3>Contact Info</h3>
            <div className="contact-item">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>info@niramay.com</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Mumbai, Maharashtra</span>
            </div>
          </FooterSection>
          
          <FooterSection>
            <h3>Quick Links</h3>
            <Link to="/therapies">Our Therapies</Link><br />
            <Link to="/signup">Book Appointment</Link><br />
            <Link to="/login">Patient Login</Link><br />
            <Link to="#about">About Us</Link>
          </FooterSection>
          
          <FooterSection>
            <h3>Business Hours</h3>
            <p>Monday - Saturday: 8:00 AM - 8:00 PM</p>
            <p>Sunday: 9:00 AM - 6:00 PM</p>
            <p>Emergency: 24/7 Support</p>
          </FooterSection>
        </FooterContent>
        
        <FooterBottom>
          <p>&copy; 2024 Niramay Panchakarma. All rights reserved. | Built with ❤️ for your wellness</p>
        </FooterBottom>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;