USE master;
GO;

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'HealthcareProfessionalsAppointments')
BEGIN
  DROP DATABASE HealthcareProfessionalsAppointments;
END;
GO;

CREATE DATABASE HealthcareProfessionalsAppointments;
GO;

USE HealthcareProfessionalsAppointments;
GO;

CREATE TABLE roles (
  id INT IDENTITY,
  name VARCHAR(15) NOT NULL,

  PRIMARY KEY (id)
);

INSERT INTO roles (name) VALUES ('PATIENT');
INSERT INTO roles (name) VALUES ('PROFESSIONAL');

CREATE TABLE prepaid (
  id INT IDENTITY,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL,
  code VARCHAR(255) NOT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE users (
  id INT IDENTITY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  status BIT DEFAULT 1 CHECK (status IN (0, 1)),
  prepaid_id INT DEFAULT NULL,
  role_id INT NOT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (prepaid_id) REFERENCES prepaid(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE specialties (
  id INT IDENTITY,
  name VARCHAR(255) NOT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE professional_specialties (
  professional_id INT NOT NULL,
  specialty_id INT NOT NULL,

  PRIMARY KEY (professional_id, specialty_id),
  FOREIGN KEY (professional_id) REFERENCES users(id),
  FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

CREATE TABLE professional_schedules (
  id INT IDENTITY,
  professional_id INT NOT NULL,
  day_of_week VARCHAR(20) CHECK (day_of_week IN ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  appointment_duration INT NOT NULL CHECK (appointment_duration > 0),

  PRIMARY KEY (id),
  FOREIGN KEY (professional_id) REFERENCES users(id)
);

CREATE TABLE professional_schedule_blocks (
  id INT IDENTITY,
  professional_id INT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason VARCHAR(255) NOT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (professional_id) REFERENCES users(id)
);

CREATE TABLE appointments (
  id INT IDENTITY,
  professional_id INT NOT NULL,
  patient_id INT NOT NULL,
  specialty_id INT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) CHECK (status IN ('Scheduled', 'Cancelled', 'Completed')) NOT NULL,
  notes VARCHAR(MAX) DEFAULT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (professional_id) REFERENCES users(id),
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

CREATE TABLE notifications (
  id INT IDENTITY,
  user_id INT NOT NULL,
  message VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  read BIT DEFAULT 0 CHECK (read IN (0, 1)),

  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
)