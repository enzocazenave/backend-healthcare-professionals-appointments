
# backend-healthcare-professionals-appointments
Este es el backend de un sistema de gestión de turnos médicos.
Está desarrollado con **Node.js**, **Express** y utiliza **SQL Server** como base de datos.

## Grupo 7 - Desarrollo de aplicaciones I
- Cazenave Enzo
- Nikolas Berntsen
- Ballesta Lucas
- Larre Santiago

## Pasos para levantar servidor de desarrollo

### Importante
Para evitar errores al ejecutar el servidor sin credenciales de Firebase, se recomienda comentar o desactivar el cron job presente en el archivo **index.js**, ya que este requiere acceso a Firebase para funcionar correctamente. 
```js
//import { checkNext24hAppointments } from './push-notifications/pushNotificator.js'

/*cron.schedule('*/30 * * * * *', async () => {
//  await checkNext24hAppointments()
//})
```

### 1. Instalar dependencias
```
npm install
```

### 2. Setear variables de entorno en archivo .env
```
PORT=3000

NODE_ENV=dev

DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=

SECRET_JWT_TOKEN_KEY=
SECRET_JWT_REFRESH_TOKEN_KEY=

SECRET_JWT_TOKEN_EXPIRATION=1h
SECRET_JWT_REFRESH_TOKEN_EXPIRATION=180d
SECRET_JWT_REFRESH_TOKEN_MAX_AGE=15552000000

EMAIL_USER=
EMAIL_PASSWORD=
```

### 3. Levantar servidor de desarrollo
```
npm run dev
```

Listo, ya debería estar corriendo el servidor de desarrollo bajo el puerto 3000