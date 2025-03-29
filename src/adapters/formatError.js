const errors = {
  middlewareFieldValidator: {
    FULL_NAME_IS_REQUIRED: 'El nombre completo es obligatorio.',
    EMAIL_IS_REQUIRED: 'El email es obligatorio.',
    PASSWORD_IS_REQUIRED: 'La contraseña es obligatoria y debe tener al menos 6 caracteres.',
    ROLE_ID_IS_REQUIRED: 'El rol es obligatorio.',
    CODE_IS_REQUIRED: 'El código es obligatorio.'
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
    INCORRECT_CREDENTIALS: 'Credenciales incorrectas.'
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