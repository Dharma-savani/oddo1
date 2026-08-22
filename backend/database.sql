-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS globetrotter;
USE globetrotter;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Cities Table (Lookup / Searchable cities)
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT
) ENGINE=InnoDB;

-- 4. Stops Table (Cities within a Trip)
CREATE TABLE IF NOT EXISTS stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    city_id INT NOT NULL,
    arrival_date DATE,
    departure_date DATE,
    stop_order INT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Activities Table (Within a specific Stop)
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stop_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    category VARCHAR(50),
    description TEXT,
    activity_time TIME,
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    limit_amount DECIMAL(10, 2) NOT NULL,
    actual_spent DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================================
-- Dummy Seed Data
-- =========================================================================

-- Seed Cities for CitySearch features
INSERT INTO cities (name, country, description) VALUES
('Paris', 'France', 'The city of light, romance, and delicious pastries.'),
('Tokyo', 'Japan', 'A bustling metropolis blending ultra-modern tech with historic temples.'),
('New York', 'USA', 'The city that never sleeps, famous for Broadway, Central Park, and skyline views.'),
('Rome', 'Italy', 'Capital city filled with nearly 3,000 years of globally influential art, architecture and culture.'),
('London', 'UK', 'A diverse and historic city spanning from Roman times to the modern day.'),
('Barcelona', 'Spain', 'Famous for its outstanding Gaudi architecture, vibrant beach life, and tapas.'),
('Cairo', 'Egypt', 'Home to the iconic Giza Pyramids and Sphinx, and the ancient Nile river.'),
('Sydney', 'Australia', 'Famed for its Opera House, beautiful Harbour Bridge, and sandy beaches.'),
('Mumbai', 'India', 'The heart of Bollywood, historic architecture, and incredible street food.'),
('Dubai', 'UAE', 'Known for luxury shopping, ultramodern architecture and a lively nightlife scene.');
