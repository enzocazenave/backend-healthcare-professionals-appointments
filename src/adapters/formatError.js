const errors = {
  middlewareFieldValidator: {
    FULL_NAME_IS_REQUIRED: 'El nombre completo es obligatorio.',
    EMAIL_IS_REQUIRED: 'El email es obligatorio.',
    PASSWORD_IS_REQUIRED: 'La contraseña es obligatoria y debe tener al menos 6 caracteres.',
    ROLE_ID_IS_REQUIRED: 'El rol es obligatorio.',
    CODE_IS_REQUIRED: 'El código es obligatorio.',
    USER_ID_IS_REQUIRED: 'El id de usuario es obligatorio.',
    NAME_IS_REQUIRED: 'El nombre es obligatorio.',
    PLAN_IS_REQUIRED: 'El plan es obligatorio.',
    NUMBER_IS_REQUIRED: 'El código es obligatorio.',
    PHONE_NUMBER_IS_REQUIRED: 'El número de teléfono debe ser un string.',
    PROFESSIONAL_ID_IS_REQUIRED: 'El id del profesional es obligatorio.',
    PATIENT_ID_IS_REQUIRED: 'El id del paciente es obligatorio.',
    SPECIALTY_ID_IS_REQUIRED: 'El id de la especialidad es obligatorio.',
    DATE_IS_REQUIRED: 'La fecha es obligatoria.',
    START_TIME_IS_REQUIRED: 'La hora de inicio es obligatoria.',
    END_TIME_IS_REQUIRED: 'La hora de finalización es obligatoria.',
    START_DATE_IS_REQUIRED: 'La fecha de inicio es obligatoria.',
    END_DATE_IS_REQUIRED: 'La fecha de finalización es obligatoria.',
    APPOINTMENT_ID_IS_REQUIRED: 'El id del turno es obligatorio.',
    DAY_OF_WEEK_IS_REQUIRED: 'El día de la semana es obligatorio.',
    APPOINTMENT_DURATION_IS_REQUIRED: 'La duración del turno es obligatoria.',
    PROFESSIONAL_SCHEDULE_ID_IS_REQUIRED: 'El id de la programación del profesional es obligatorio.',
    REASON_IS_REQUIRED: 'La razón es obligatoria.',
    PROFESSIONAL_SCHEDULE_BLOCK_ID_IS_REQUIRED: 'El id de la programación de bloque del profesional es obligatorio.',
    PREPAID_ID_IS_REQUIRED: 'El id de la prepaga es obligatorio.',
    RECORD_IS_REQUIRED: 'El registro médico es obligatorio.',
    FILE_URL_IS_REQUIRED: 'La url del archivo es obligatoria.',
    MEDICAL_RECORD_ID_IS_REQUIRED: 'El id del registro médico es obligatorio.',
    NOTIFICATION_ID_IS_REQUIRED: 'El id de la notificación es obligatorio.',
    DNI_IS_REQUIRED: 'El DNI es obligatorio.'
  },
  middlewareTokenValidator: {
    TOKEN_NOT_FOUND: 'Acceso no autorizado, no se encontró el token.',
    TOKEN_NOT_VALID: 'Acceso no autorizado, el token no es válido.'
  },
  middlewareRoleValidator: {
    USER_DATA_NOT_FOUND: 'Acceso no autorizado, no se encontró la información del usuario.',
    USER_DOES_NOT_HAVE_ROLE: 'Acceso no autorizado, el usuario no tiene el rol necesario.'
  },
  authControllers: {
    REFRESH_TOKEN_IS_REQUIRED: 'Acceso no autorizado, no se encontró el token.'
  },
  authServices: {
    REFRESH_TOKEN_IS_INVALID: 'Acceso no autorizado, el token no es válido.',
    EMAIL_ALREADY_REGISTERED: 'El email ya está registrado.',
    INCORRECT_CREDENTIALS: 'Credenciales incorrectas.',
    EMAIL_NOT_FOUND: 'Ese email no está asociado a una cuenta.',
    CODE_NOT_FOUND: 'El código es incorrecto.',
    CODE_EXPIRED: 'El código ha expirado.'
  },
  userServices: {
    USER_NOT_FOUND: 'El usuario no existe.',
    PREPAID_ALREADY_EXISTS: 'Ya existe una prepaga asociada al usuario.',
    USER_ALREADY_AFFILIATED: 'El usuario ya está afiliado a la prepaga.',
    USER_NOT_AFFILIATED: 'El usuario no está afiliado a la prepaga.',
    PREPAID_NOT_FOUND: 'La prepaga no existe.'
  },
  appointmentServices: {
    PROFESSIONAL_NOT_FOUND: 'El profesional no existe.',
    PATIENT_NOT_FOUND: 'El paciente no existe.',
    SPECIALTY_NOT_FOUND: 'La especialidad no existe.',
    PROFESSIONAL_DOES_NOT_HAVE_SPECIALTY: 'El profesional no tiene esa especialidad.',
    TIME_SLOT_IS_RESERVED: 'El turno está reservado.',
    TIME_SLOT_IS_NOT_IN_PROFESSIONAL_SCHEDULE: 'El turno no está en el horario del profesional.',
    PROFESSIONAL_DOES_NOT_WORK_ON_THAT_DAY: 'El profesional no trabaja ese día.',
    USER_DOES_NOT_HAVE_PERMISSION: 'El usuario no tiene permiso para crear turnos.',
    APPOINTMENT_NOT_FOUND: 'El turno no existe.',
    APPOINTMENT_ALREADY_CANCELLED: 'El turno ya fue cancelado.',
    APPOINTMENT_ALREADY_COMPLETED: 'El turno ya fue completado.',
    APPOINTMENT_DURATION_IS_NOT_VALID: 'La duración del turno no es válida.'
  },
  specialtyServices: {
    SPECIALTY_NOT_FOUND: 'La especialidad no existe.',
    SPECIALTY_ALREADY_EXISTS: 'La especialidad ya existe.',
    SPECIALTY_DOES_NOT_HAVE_PROFESSIONAL: 'La especialidad no tiene profesionales asociados.',
    PROFESSIONAL_DOES_NOT_HAVE_SPECIALTY: 'El profesional no tiene esa especialidad.',
    PROFESSIONAL_NOT_FOUND: 'El profesional no existe.'
  },
  scheduleServices: {
    PROFESSIONAL_NOT_FOUND: 'El profesional no existe.',
    PROFESSIONAL_HAS_SCHEDULE_IN_THIS_HOUR_RANGE: 'El profesional ya tiene un horario en este rango de horas.',
    PROFESSIONAL_SCHEDULE_NOT_FOUND: 'El horario del profesional no existe.',
    PROFESSIONAL_SCHEDULE_BLOCK_NOT_FOUND: 'El bloqueo del horario del profesional no existe.',
  },
  prepaidServices: {
    PREPAID_ALREADY_EXISTS: 'Ya existe una prepaga asociada al usuario.',
    PREPAID_NOT_FOUND: 'La prepaga no existe.'
  },
  medicalRecordServices: {
    PATIENT_NOT_FOUND: 'El paciente no existe.',
    MEDICAL_RECORD_NOT_FOUND: 'El registro médico no existe.'
  },
  notificationServices: {
    NOTIFICATION_NOT_FOUND: 'La notificación no existe.'
  }
}

const formatError = (err = { layer: '', keys: [], key: '' }) => {
  const formattedErrors = [];

  if (err.layer === 'middlewareFieldValidator') {
    err.keys.forEach(item => {
      formattedErrors.push({
        field: item.field,
        message: errors[err.layer][item.key]
      })
    })

    return formattedErrors
  } else {
    return errors[err.layer][err.key]
  }
}

export default formatError;