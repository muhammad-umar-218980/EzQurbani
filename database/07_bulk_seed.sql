-- Step 7 — Bulk Database Seeding for EzQurbani
-- This script safely generates 5,200 animals for testing scale, along with their health records and hissa shares.

DO $$
BEGIN
    RAISE NOTICE 'Starting bulk insert of animals...';
END $$;

-- 1. Bulk create 2000 Bakras (Category 1)
-- Random weight between 30kg - 50kg, Random price between 50,000 - 90,000
INSERT INTO ANIMAL (category_id, vendor_id, tag_no, weight, price, status)
SELECT 1, 1, 'BAK-BULK-' || g, floor(random() * (50-30+1) + 30), floor(random() * (90000-50000+1) + 50000), 'available'
FROM generate_series(1, 2000) g;

-- 2. Bulk create 1500 Dumbas (Category 3)
-- Random weight between 25kg - 45kg, Random price between 40,000 - 80,000
INSERT INTO ANIMAL (category_id, vendor_id, tag_no, weight, price, status)
SELECT 3, 3, 'DUM-BULK-' || g, floor(random() * (45-25+1) + 25), floor(random() * (80000-40000+1) + 40000), 'available'
FROM generate_series(1, 1500) g;

-- 3. Bulk create 1000 Cows (Category 2)
-- Random weight between 200kg - 350kg, Random price between 150,000 - 250,000
INSERT INTO ANIMAL (category_id, vendor_id, tag_no, weight, price, status)
SELECT 2, 2, 'COW-BULK-' || g, floor(random() * (350-200+1) + 200), floor(random() * (250000-150000+1) + 150000), 'available'
FROM generate_series(1, 1000) g;

-- 4. Bulk create 700 Camels (Category 4)
-- Random weight between 300kg - 500kg, Random price between 300,000 - 500,000
INSERT INTO ANIMAL (category_id, vendor_id, tag_no, weight, price, status)
SELECT 4, 1, 'CAM-BULK-' || g, floor(random() * (500-300+1) + 300), floor(random() * (450000-300000+1) + 300000), 'available'
FROM generate_series(1, 700) g;

-- 5. Auto-Generate Health Records for all new animals
INSERT INTO ANIMAL_HEALTH_RECORD (animal_id, health_status)
SELECT animal_id, 'Healthy - Cleared for Qurbani (Bulk)'
FROM ANIMAL
WHERE animal_id NOT IN (SELECT animal_id FROM ANIMAL_HEALTH_RECORD);

-- 6. Auto-Generate the 7 Hissas for every new Cow and Camel
-- Uses CROSS JOIN to instantly make 7 rows (shares) per large animal
INSERT INTO HISSA (animal_id, hissa_no, price, status)
SELECT a.animal_id, h.hissa_no, ROUND(a.price / 7, 2), 'available'
FROM ANIMAL a
CROSS JOIN generate_series(1, 7) h(hissa_no)
WHERE a.category_id IN (2, 4)
  AND a.animal_id NOT IN (SELECT DISTINCT animal_id FROM HISSA);

DO $$
BEGIN
    RAISE NOTICE 'Bulk insert complete!';
END $$;
