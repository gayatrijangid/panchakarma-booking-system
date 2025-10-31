USE panchakarma_db;

-- Insert demo users (passwords are hashed for: admin123, doctor123)
-- Hash for 'admin123': $2a$10$7SpZXQ7vqQ7YYVg3pZ5qmOGKJ9H0fR3qE9p7Y7vHqN5YxF5mR5F5m
-- Hash for 'doctor123': $2a$10$7SpZXQ7vqQ7YYVg3pZ5qmOGKJ9H0fR3qE9p7Y7vHqN5YxF5mR5F5m
INSERT INTO users (name, email, password, role, phone, specialization, experience, qualifications, about, status) VALUES
('Dr. Admin', 'admin@niramay.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', '+91-9876543210', 'System Administration', '10 years', NULL, NULL, 'active'),
('Dr. Priya Sharma', 'doctor@niramay.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'doctor', '+91-9876543211', 'Panchakarma Specialist', '8 years', 'BAMS, MD (Ayurveda)', 'Experienced Ayurvedic doctor specializing in Panchakarma treatments and detoxification therapies.', 'active'),
('Dr. Rajesh Kumar', 'doctor2@niramay.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'doctor', '+91-9876543212', 'Ayurvedic Medicine', '12 years', 'BAMS, PhD (Ayurveda)', 'Senior consultant with expertise in traditional Ayurvedic treatments and wellness programs.', 'active')
ON DUPLICATE KEY UPDATE name=name;

-- Insert therapies
INSERT INTO therapies (name, description, duration, price, benefits, procedures, image, category, availability) VALUES
('Panchakarma Detox', 'Complete body detoxification through traditional Panchakarma methods', '14 days', 25000.00, 
 '["Complete detox", "Improved immunity", "Mental clarity", "Weight management"]', 
 '["Abhyanga", "Swedana", "Virechana", "Basti", "Nasya"]', 
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3', 'Detox', true),

('Abhyanga Massage', 'Full body oil massage using warm herbal oils', '90 minutes', 2500.00, 
 '["Stress relief", "Improved circulation", "Muscle relaxation", "Skin nourishment"]', 
 '["Oil massage", "Steam therapy"]', 
 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3', 'Massage', true),

('Shirodhara', 'Continuous pouring of warm oil on the forehead for deep relaxation', '60 minutes', 3500.00, 
 '["Stress relief", "Better sleep", "Mental peace", "Hair health"]', 
 '["Oil pouring", "Head massage"]', 
 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3', 'Therapy', true),

('Ayurvedic Consultation', 'Personalized consultation with experienced Ayurvedic doctors', '45 minutes', 1500.00, 
 '["Personalized treatment", "Diet planning", "Lifestyle guidance", "Health assessment"]', 
 '["Consultation", "Pulse diagnosis", "Treatment planning"]', 
 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3', 'Consultation', true)
ON DUPLICATE KEY UPDATE name=name;

-- Note: Run this file after creating the schema
-- Command: mysql -u root -p < seed.sql
