import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Filter, Heart, Clock, DollarSign, Star, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 0;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  .filter-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 1rem;
    align-items: center;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #007a5f;
    }
  }
  
  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #007a5f;
  }
`;

const TherapyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const TherapyCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const TherapyImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
  
  .category-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .price-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #007a5f;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const TherapyContent = styled.div`
  padding: 1.5rem;
`;

const TherapyTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
`;

const TherapyDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const TherapyMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.85rem;
  
  svg {
    color: #007a5f;
  }
`;

const BenefitsList = styled.div`
  margin-bottom: 1.5rem;
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .benefits {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .benefit {
    background: rgba(0, 122, 95, 0.1);
    color: #007a5f;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  background: #007a5f;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #005a45;
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    opacity: 0.3;
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  p {
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f0f0f0;
    border-top: 3px solid #007a5f;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TherapiesList = () => {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTherapies();
    fetchCategories();
  }, [categoryFilter]);

  const fetchTherapies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`http://localhost:3002/api/therapies?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setTherapies(data.therapies || []);
      } else {
        toast.error('Failed to fetch therapies');
      }
    } catch (error) {
      console.error('Error fetching therapies:', error);
      toast.error('Failed to fetch therapies');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/therapies/categories/list');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = () => {
    fetchTherapies();
  };

  const handleBookNow = (therapyId) => {
    window.location.href = `/book-appointment?therapy=${therapyId}`;
  };

  const filteredTherapies = therapies.filter(therapy =>
    therapy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    therapy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h1>Ayurvedic Therapies 🌿</h1>
        <p>Discover traditional healing therapies for your wellness journey</p>
      </Header>

      <FilterSection>
        <div className="filter-row">
          <SearchInput>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search therapies by name or benefits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </SearchInput>
          
          <FilterSelect 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.name} value={category.name}>
                {category.name} ({category.count})
              </option>
            ))}
          </FilterSelect>
          
          <button 
            onClick={handleSearch}
            style={{
              padding: '0.75rem 1rem',
              background: '#007a5f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </div>
      </FilterSection>

      {loading ? (
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      ) : filteredTherapies.length === 0 ? (
        <EmptyState>
          <Heart className="empty-icon" />
          <h3>No therapies found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </EmptyState>
      ) : (
        <TherapyGrid>
          {filteredTherapies.map(therapy => (
            <TherapyCard key={therapy.id}>
              <TherapyImage image={therapy.image}>
                <div className="category-badge">{therapy.category}</div>
                <div className="price-badge">₹{therapy.price}</div>
              </TherapyImage>
              
              <TherapyContent>
                <TherapyTitle>{therapy.name}</TherapyTitle>
                <TherapyDescription>{therapy.description}</TherapyDescription>
                
                <TherapyMeta>
                  <MetaItem>
                    <Clock size={14} />
                    {therapy.duration}
                  </MetaItem>
                  <MetaItem>
                    <Star size={14} />
                    4.8 (124 reviews)
                  </MetaItem>
                </TherapyMeta>

                <BenefitsList>
                  <h4>Key Benefits:</h4>
                  <div className="benefits">
                    {therapy.benefits?.slice(0, 4).map((benefit, index) => (
                      <span key={index} className="benefit">{benefit}</span>
                    ))}
                  </div>
                </BenefitsList>

                <ActionButton onClick={() => handleBookNow(therapy.id)}>
                  <Calendar size={16} />
                  Book Appointment
                  <ArrowRight size={16} />
                </ActionButton>
              </TherapyContent>
            </TherapyCard>
          ))}
        </TherapyGrid>
      )}
    </Container>
  );
};

export default TherapiesList;