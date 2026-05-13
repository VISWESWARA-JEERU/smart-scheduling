CREATE TABLE IF NOT EXISTS ai_call_metrics (
    id SERIAL PRIMARY KEY,
    call_id INT,
    patient_name VARCHAR(100),
    doctor_name VARCHAR(100),
    department VARCHAR(100),
    call_status VARCHAR(50),
    call_duration INT,
    appointment_date DATE,
    city VARCHAR(100),
    bill_amount INT
);