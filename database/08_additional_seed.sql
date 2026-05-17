-- 1. SLAUGHTER HOUSES
INSERT INTO SLAUGHTER_HOUSE (name, city_id, location) VALUES 
('Al Noor Slaughter House (Karachi)', 1, 'Korangi Industrial Area 2'),
('Sunnah Slaughter Center (Lahore)', 2, 'Ravi Road'),
('Madina Qurbani Facility (Islamabad)', 3, 'I-9 Sector');

-- 2. BUTCHERS (Crews)
-- Assuming Haji Rafiq (id=1) is in House 1
-- Sajid Qasai (id=2) is in House 2
INSERT INTO BUTCHER (name, contact, house_id) VALUES 
('Usman Butchers', '0300-1234567', 1),
('Al-Madina Slaughter', '0311-1234567', 3),
('Qurbani Experts', '0321-1234567', 4),
('Sunnah Slaughter', '0333-1234567', 5);
