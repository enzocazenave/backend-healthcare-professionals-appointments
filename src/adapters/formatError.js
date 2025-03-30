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
    CODE_IS_REQUIRED: 'El código es obligatorio.',
    PHONE_NUMBER_IS_REQUIRED: 'El número de teléfono debe ser un string.'
  },
  middlewareTokenValidator: {
    TOKEN_NOT_FOUND: 'Acceso no autorizado, no se encontró el token.',
    TOKEN_NOT_VALID: 'Acceso no autorizado, el token no es válido.'
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
    PREPAID_ALREADY_EXISTS: 'Ya existe una prepaga asociada al usuario.'
  }
}

const formatError = (err = { layer: '', keys: [], key: '' }) => {
  const formattedErrors = [];

  if (err.layer === 'middlewareFieldValidator') {
    err.keys.forEach(item => {
      console.log(item)
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