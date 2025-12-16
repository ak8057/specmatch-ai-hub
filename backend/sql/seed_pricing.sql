-- Seed Pricing Data
CREATE TABLE IF NOT EXISTS pricing (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    base_cost DECIMAL(10, 2) NOT NULL,
    testing_cost DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD'
);

INSERT INTO pricing (sku, base_cost, testing_cost) VALUES
('PUMP-2000-X', 1450.00, 150.00),
('PUMP-2000-Y-ECO', 1600.00, 200.00),
('VALVE-ISO-9001', 450.00, 50.00),
('GEN-X-100', 5000.00, 500.00)
ON CONFLICT (sku) DO NOTHING;
