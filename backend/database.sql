CREATE TABLE IF NOT EXISTS ai_call_metrics (
    id SERIAL PRIMARY KEY,
    month_name VARCHAR(255),
    clinic_name VARCHAR(255),
    user_request VARCHAR(255),
);
