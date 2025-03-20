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